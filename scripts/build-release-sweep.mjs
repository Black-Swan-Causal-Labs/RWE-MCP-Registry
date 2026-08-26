import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const automationRoot = "/Users/jddmacbook/Documents/RWE-MCP-Registry-Automation";
const reviewDate = process.env.REVIEW_DATE ?? new Intl.DateTimeFormat("en-CA", {
  timeZone: process.env.REVIEW_TIME_ZONE ?? "America/Los_Angeles",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const priorReviewDate = process.env.PRIOR_REVIEW_DATE ?? "2026-08-11";
const outputDir = path.join(root, "outputs", `${reviewDate}-release-sweep`);
const githubToken = process.env.GH_TOKEN;
const githubHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "Black-Swan-Causal-Labs-RWE-Registry",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
};

const source = await fs.readFile(path.join(root, "app", "registry-explorer.tsx"), "utf8");
const arrayText = source.match(/const originalCards = (\[[\s\S]*?\n\]);\n\nconst prototypeCards/)?.[1];
if (!arrayText) throw new Error("Could not locate originalCards");
const originalCards = Function(`"use strict"; return (${arrayText});`)();
const expansionCards = JSON.parse(await fs.readFile(path.join(root, "data", "approved-expansion.json"), "utf8"));
const published = [...originalCards, ...expansionCards];
const publishedRepos = new Set(published.map((card) => card.url.toLowerCase().replace(/\/$/, "")));

function repoCoordinates(url) {
  const match = String(url ?? "").match(/^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/?#].*)?$/i);
  return match ? `${match[1]}/${match[2]}` : null;
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function githubMetadata(card) {
  const coordinates = repoCoordinates(card.url);
  if (!coordinates) return { name: card.name, url: card.url, status: "non_github", changes: [] };
  try {
    const repo = await fetchJson(`https://api.github.com/repos/${coordinates}`, githubHeaders);
    const changes = [];
    const priorPackage = card.packages ?? "";
    if (repo.archived) changes.push("Repository archived");
    if (repo.disabled) changes.push("Repository disabled");
    if (repo.pushed_at?.slice(0, 10) > priorReviewDate) changes.push("Repository activity since last website review");
    return {
      name: card.name, url: card.url, category: card.category, favorite: Boolean(card.favorite),
      status: repo.archived ? "archived" : "available", pushedAt: repo.pushed_at?.slice(0, 10) ?? null,
      updatedAt: repo.updated_at?.slice(0, 10) ?? null, stars: repo.stargazers_count, forks: repo.forks_count,
      license: repo.license?.spdx_id && repo.license.spdx_id !== "NOASSERTION" ? repo.license.spdx_id : "Not declared",
      defaultBranch: repo.default_branch, priorPackage, changes,
    };
  } catch (error) {
    return { name: card.name, url: card.url, category: card.category, status: "check_failed", error: error.message, changes: ["Manual source check required"] };
  }
}

const currentSweep = [];
let cursor = 0;
const workers = Array.from({ length: 8 }, async () => {
  while (cursor < published.length) {
    const index = cursor++;
    currentSweep[index] = await githubMetadata(published[index]);
  }
});
await Promise.all(workers);

const official = [];
let nextCursor = null;
do {
  const url = new URL("https://registry.modelcontextprotocol.io/v0/servers");
  url.searchParams.set("limit", "100");
  if (nextCursor) url.searchParams.set("cursor", nextCursor);
  const page = await fetchJson(url, { "User-Agent": githubHeaders["User-Agent"] });
  official.push(...(page.servers ?? []));
  nextCursor = page.metadata?.nextCursor ?? null;
} while (nextCursor);

const ledger = JSON.parse(await fs.readFile(path.join(automationRoot, "data", "ledger.json"), "utf8"));
const observations = JSON.parse(await fs.readFile(path.join(automationRoot, "data", "observations.json"), "utf8"));
const observationById = new Map(observations.observations.map((item) => [item.record_id, item]));
const officialByRepo = new Map();
for (const item of official) {
  const repo = item.server?.repository?.url?.toLowerCase().replace(/\/$/, "");
  if (repo && item._meta?.["io.modelcontextprotocol.registry/official"]?.isLatest) officialByRepo.set(repo, item);
}

for (const item of currentSweep) {
  const officialItem = officialByRepo.get(item.url?.toLowerCase().replace(/\/$/, ""));
  item.officialRegistryName = officialItem?.server?.name ?? null;
  item.officialRegistryVersion = officialItem?.server?.version ?? null;
  const displayedVersion = item.priorPackage?.match(/(?:^|\s)(\d+\.\d+\.\d+(?:[-+][\w.-]+)?)$/)?.[1] ?? null;
  item.displayedVersion = displayedVersion;
  if (displayedVersion && item.officialRegistryVersion && displayedVersion !== item.officialRegistryVersion) {
    item.changes.push(`Displayed version ${displayedVersion} differs from official registry ${item.officialRegistryVersion}`);
  }
}

const direct = /real[- ]world evidence|\brwe\b|health economics|\bheor\b|pharmacoepidemi|faers|vaers|pharmacovigil|adverse event|signal detection|mortality|vital statistics|public health surveillance|epidemiolog|causal inference|target trial|propensity score|treatment effect|survival analysis|cohort study|observational study/i;
const enabling = /\bfhir\b|\behr\b|electronic health record|\bomop\b|\bohdsi\b|\bcdisc\b|meddra|snomed|rxnorm|loinc|icd-10|clinicaltrials|clinical trial|pubmed|cochrane|literature|evidence synthesis|drug label|openfda|fda recall|regulatory metadata|record linkage|data linkage|cohort definition|claims data|healthlake|healthomics|biomedical/i;
const unrelated = /banking|bankreg|crypto|trading|marketing|advertising|restaurant|game|real estate|email automation|resume|hiring|eu ai act|sfc regulatory|sebi|rbi circular|pension|space regulatory|fcc filing|plant genomic|causal memory|emotional state|package.*dead|practice management|billing|scheduling|pain medicine|prior.auth|appeals/i;

function categoryFor(text) {
  if (/faers|vaers|pharmacovigil|adverse event|drug safety/i.test(text)) return "Pharmacovigilance & safety";
  if (/fhir|ehr|clinical data|patient record/i.test(text)) return "Clinical Data & Interoperability";
  if (/omop|ohdsi|terminolog|snomed|rxnorm|loinc|meddra/i.test(text)) return "OMOP & terminology";
  if (/openfda|fda|regulatory metadata|drug label|device submission/i.test(text)) return "Regulatory & Product Data";
  if (/causal|treatment effect|propensity|target trial|survival|biostat/i.test(text)) return "Causal Inference & Analytics";
  if (/clinical trial|clinicaltrials/i.test(text)) return "Trials & Study Design";
  if (/pubmed|literature|evidence synthesis|cochrane/i.test(text)) return "Literature & Evidence Synthesis";
  if (/public health|mortality|epidemiolog|cdc/i.test(text)) return "Public Health & Epidemiology";
  if (/regulatory|device/i.test(text)) return "Regulatory & Product Data";
  return "Biomedical & RWE Infrastructure";
}

const candidateMap = new Map();
function addCandidate(candidate) {
  const key = candidate.canonicalUrl?.toLowerCase().replace(/\/$/, "") || `name:${candidate.name.toLowerCase()}`;
  if (publishedRepos.has(key)) return;
  const prior = candidateMap.get(key);
  if (!prior || candidate.score > prior.score) candidateMap.set(key, { ...prior, ...candidate, sources: [...new Set([...(prior?.sources ?? []), ...(candidate.sources ?? [])])] });
}

for (const record of ledger.records) {
  const observation = observationById.get(record.id);
  const text = `${record.name} ${record.metadata?.category ?? ""} ${record.metadata?.notes ?? ""} ${record.metadata?.official_registry_name ?? ""}`;
  if (unrelated.test(text) || (!direct.test(text) && !enabling.test(text))) continue;
  if (!record.canonical_url || !["available", "archived"].includes(observation?.status)) continue;
  const officialItem = officialByRepo.get(record.canonical_url.toLowerCase().replace(/\/$/, ""));
  const officialMeta = officialItem?._meta?.["io.modelcontextprotocol.registry/official"];
  const description = officialItem?.server?.description ?? record.metadata?.notes ?? "";
  let score = direct.test(`${text} ${description}`) ? 60 : 35;
  if (officialItem) score += 20;
  if (observation.status === "available") score += 10;
  if (observation.metadata?.pushed_at >= "2026-01-01") score += 8;
  if (record.canonical_url.includes("Black-Swan-Causal-Labs/openfda-mcp")) score = 200;
  addCandidate({ id: record.id, name: officialItem?.server?.title || record.name, canonicalUrl: record.canonical_url,
    kind: record.metadata?.kind ?? "MCP server", category: categoryFor(`${text} ${description}`), description,
    publisher: record.metadata?.publisher ?? "Not assessed", officialName: officialItem?.server?.name ?? record.metadata?.official_registry_name ?? null,
    officialVersion: officialItem?.server?.version ?? null, officialStatus: officialMeta?.status ?? null,
    availability: observation.status, pushedAt: observation.metadata?.pushed_at ?? null, stars: observation.metadata?.stars ?? null,
    license: observation.metadata?.license ?? "Not assessed", score, sources: ["Private known-inventory ledger", ...(officialItem ? ["Official MCP Registry"] : [])],
    reviewReason: direct.test(`${text} ${description}`) ? "Direct RWE or evidence-generation relevance" : "Enabling health-data or evidence workflow capability",
    favorite: record.canonical_url.includes("Black-Swan-Causal-Labs/openfda-mcp") });
}

for (const item of official) {
  const server = item.server ?? {};
  const meta = item._meta?.["io.modelcontextprotocol.registry/official"];
  if (!meta?.isLatest) continue;
  const text = `${server.name ?? ""} ${server.title ?? ""} ${server.description ?? ""}`;
  if (unrelated.test(text) || (!direct.test(text) && !enabling.test(text))) continue;
  const canonicalUrl = server.repository?.url ?? "";
  if (!canonicalUrl) continue;
  let score = direct.test(text) ? 65 : 40;
  if (meta.publishedAt?.slice(0, 10) >= "2026-07-23") score += 15;
  if (canonicalUrl.includes("Black-Swan-Causal-Labs/openfda-mcp")) score = 200;
  addCandidate({ name: server.title || server.name, canonicalUrl, kind: "MCP server", category: categoryFor(text), description: server.description ?? "",
    publisher: server.name?.split("/")[0] ?? "Not assessed", officialName: server.name, officialVersion: server.version, officialStatus: meta.status,
    availability: meta.status === "active" ? "registry_active" : meta.status, pushedAt: null, stars: null, license: "Not assessed", score,
    sources: ["Official MCP Registry"], reviewReason: direct.test(text) ? "Direct RWE or evidence-generation relevance" : "Enabling health-data or evidence workflow capability",
    favorite: canonicalUrl.includes("Black-Swan-Causal-Labs/openfda-mcp") });
}

const candidates = [...candidateMap.values()].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
const shortlist = candidates.slice(0, 40).map((item, index) => ({
  rank: index + 1,
  ...item,
  proposedDisposition: "Proposed — requires final human approval",
}));

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "release-sweep.json"), `${JSON.stringify({
  generatedAt: new Date().toISOString(), publishedCount: published.length, officialRegistryRecords: official.length,
  currentSweep, knownInventoryCount: ledger.records.length, candidateCount: candidates.length, candidates, shortlist,
}, null, 2)}\n`);
console.log(JSON.stringify({ published: published.length, currentChanges: currentSweep.filter((item) => item.changes.length).length, official: official.length, candidates: candidates.length, shortlist: shortlist.length, outputDir }, null, 2));
