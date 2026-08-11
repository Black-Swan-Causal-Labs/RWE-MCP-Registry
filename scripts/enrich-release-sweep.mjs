import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "outputs", "2026-08-11-release-sweep", "release-sweep.json");
const data = JSON.parse(await fs.readFile(file, "utf8"));
const token = process.env.GH_TOKEN;
const headers = { Accept: "application/vnd.github+json", "User-Agent": "Black-Swan-Causal-Labs-RWE-Registry", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
const replacements = new Map([
  ["https://github.com/brunoescalhao/hypokrates", "https://github.com/pipeworx-io/mcp-ebi-ols"],
  ["https://github.com/niteowlpt/pharma-signal-api", "https://github.com/pipeworx-io/mcp-monarch-initiative"],
  ["https://github.com/taru0208/openfda-mcp-server", "https://github.com/pipeworx-io/mcp-ncbi-eutils"],
]);
const candidateByUrl = new Map(data.candidates.map((item) => [item.canonicalUrl.toLowerCase(), item]));

function coordinates(url) {
  const match = String(url).match(/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?$/i);
  return match ? `${match[1]}/${match[2]}` : null;
}

let next = 0;
const enriched = new Array(data.shortlist.length);
const workers = Array.from({ length: 8 }, async () => {
  while (next < data.shortlist.length) {
    const index = next++;
    let item = data.shortlist[index];
    const replacementUrl = replacements.get(item.canonicalUrl.toLowerCase());
    if (replacementUrl) {
      const replacement = candidateByUrl.get(replacementUrl);
      if (!replacement) throw new Error(`Replacement candidate not found: ${replacementUrl}`);
      item = { rank: item.rank, ...replacement, proposedDisposition: "Proposed — requires final human approval" };
    }
    const repo = coordinates(item.canonicalUrl);
    if (!repo) { enriched[index] = item; continue; }
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, { headers, signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const metadata = await response.json();
      enriched[index] = { ...item, favorite: item.canonicalUrl.toLowerCase().includes("github.com/black-swan-causal-labs/"), availability: metadata.archived ? "archived" : "available", pushedAt: metadata.pushed_at?.slice(0, 10) ?? null,
        stars: metadata.stargazers_count, forks: metadata.forks_count, license: metadata.license?.spdx_id && metadata.license.spdx_id !== "NOASSERTION" ? metadata.license.spdx_id : "Not declared",
        archived: metadata.archived, defaultBranch: metadata.default_branch, repositoryDescription: metadata.description ?? item.description };
    } catch (error) {
      enriched[index] = { ...item, availability: "check_failed", repositoryCheckError: error.message };
    }
  }
});
await Promise.all(workers);
data.shortlist = enriched;
await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ enriched: enriched.length, failed: enriched.filter((item) => item.availability === "check_failed").length }));
