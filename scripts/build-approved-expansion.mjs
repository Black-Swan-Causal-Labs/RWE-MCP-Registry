import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sweep = JSON.parse(await fs.readFile(path.join(root, "outputs", "2026-08-11-release-sweep", "release-sweep.json"), "utf8"));
const token = process.env.GH_TOKEN;
const headers = { Accept: "application/vnd.github+json", "User-Agent": "Black-Swan-Causal-Labs-RWE-Registry", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

const templates = {
  "Regulatory & Product Data": {
    tags: ["Regulatory data", "Product evidence", "Source verification"],
    workflowFit: ["Product and identifier resolution", "Regulatory context", "Evidence-source triangulation"],
    capabilities: ["Search or resolve documented regulatory records", "Return structured product or submission metadata", "Support traceable links back to public source data"],
    limitation: "Regulatory records answer different questions from comparative-effectiveness studies and can change over time. Coverage, field semantics, refresh cadence, and every decision-relevant result must be checked against the authoritative source.",
  },
  "Causal Inference & Analytics": {
    tags: ["Causal methods", "Study design", "Sensitivity analysis"],
    workflowFit: ["Study-design review", "Effect-estimation planning", "Bias and sensitivity analysis"],
    capabilities: ["Expose documented causal or statistical methods", "Structure analysis inputs and method selection", "Return method-oriented diagnostics or review outputs"],
    limitation: "A tool interface cannot establish identification. Study design, estimand, assumptions, estimator choice, diagnostics, and numerical behavior require qualified review against the data-generating process and known analyses.",
  },
  "Clinical Data & Interoperability": {
    tags: ["FHIR / clinical data", "Interoperability", "Governed access"],
    workflowFit: ["Clinical-source inspection", "Interoperability prototyping", "Cohort and data-availability assessment"],
    capabilities: ["Expose documented clinical-data or interoperability operations", "Support structured resource search or retrieval", "Provide machine-readable outputs for downstream workflows"],
    limitation: "Clinical systems can contain PHI and may expose write operations. Production use requires explicit authorization, least privilege, audit logging, retention controls, source-system validation, and organization-specific governance.",
  },
  "Public Health & Epidemiology": {
    tags: ["Public health", "Population data", "Surveillance"],
    workflowFit: ["Population-health surveillance", "Burden and trend description", "External context for RWE studies"],
    capabilities: ["Search documented public-health datasets", "Retrieve population-level measures or records", "Support stratified descriptive queries across available dimensions"],
    limitation: "Survey design, reporting delay, suppression, revisions, changing definitions, geographic comparability, and ecological inference can affect interpretation. Results require dataset-specific denominator and provenance checks.",
  },
  "OMOP & terminology": {
    tags: ["Terminology", "Code lookup", "Normalization"],
    workflowFit: ["Concept-set development", "Code validation", "Data harmonization"],
    capabilities: ["Search documented clinical codes or terminology sources", "Validate or retrieve concept metadata", "Support code normalization and mapping workflows"],
    limitation: "Automated code lookup or mapping can omit descendants, include inappropriate concepts, or obscure local meaning. Vocabulary versions, licensing, hierarchy behavior, and study-specific concept sets require expert adjudication.",
  },
  "Trials & Study Design": {
    tags: ["Clinical trials", "Study design", "Protocol evidence"],
    workflowFit: ["Trial landscape review", "Protocol and design support", "External evidence context"],
    capabilities: ["Search or structure documented trial information", "Retrieve study records or design inputs", "Support protocol-oriented comparison and evidence review"],
    limitation: "Trial records and automated design outputs may be incomplete, outdated, selectively reported, or method-dependent. Protocol decisions, eligibility judgments, and calculations require primary-record and statistical review.",
  },
  "Literature & Evidence Synthesis": {
    tags: ["Literature search", "Evidence retrieval", "Citation workflows"],
    workflowFit: ["Literature discovery", "Evidence scoping", "Citation and source retrieval"],
    capabilities: ["Search one or more documented scholarly sources", "Retrieve publication metadata or accessible content", "Support citation chaining, screening, or evidence organization"],
    limitation: "Provider coverage, indexing delay, query translation, deduplication, full-text rights, and citation accuracy vary. Reproducible reviews still require logged searches, dates, screening decisions, evidence grading, and primary-source verification.",
  },
  "Biomedical & RWE Infrastructure": {
    tags: ["Biomedical data", "Research infrastructure", "Identifier resolution"],
    workflowFit: ["Biomedical evidence enrichment", "Identifier and dataset discovery", "Translational context for RWE"],
    capabilities: ["Search documented biomedical sources", "Retrieve structured identifiers or research records", "Support cross-source evidence enrichment"],
    limitation: "Biomedical or translational evidence does not by itself establish clinical effectiveness or causal validity. Source versions, identifiers, coverage, licensing, and cross-database consistency require verification.",
  },
  "Pharmacovigilance & safety": {
    tags: ["Drug safety", "Adverse events", "Signal review"],
    workflowFit: ["Safety-case research", "Signal triage", "Product-event characterization"],
    capabilities: ["Search documented safety or adverse-event sources", "Retrieve product-event records or summaries", "Support exploratory signal and regulatory-context review"],
    limitation: "Spontaneous reports generally lack reliable denominators and cannot establish incidence or causality. Duplicates, missingness, stimulated reporting, coding choices, and derived signal statistics require pharmacovigilance review.",
  },
};

const overrides = {
  "https://github.com/Black-Swan-Causal-Labs/openfda-mcp": {
    name: "openFDA Regulatory Metadata", summary: "Purpose-built openFDA server for reproducible resolution of FDA drug, biologic, and device application identifiers to regulatory metadata.",
    tags: ["openFDA", "Application resolution", "CDER / CBER / CDRH"],
    workflowFit: ["RWE case-roster construction", "Product and submission resolution", "Reproducible regulatory provenance"],
    capabilities: ["Resolve brand or generic drug names to NDA, BLA, or ANDA applications", "Resolve device submissions through product code to class and medical specialty", "Search labels and run an explicitly experimental RWE-signal candidate sweep"],
    limitation: "The RWE signal sweep is unvalidated and produces candidates for human review, not findings. HDE class III is a documented regulatory inference because openFDA lacks HDE records; API availability, rate limits, source updates, and every roster decision still require verification.",
  },
  "https://github.com/Black-Swan-Causal-Labs/robins-i-mcp": {
    name: "ROBINS-I V2 MCP", summary: "Structured ROBINS-I V2 risk-of-bias assessment for one result from a non-randomized cohort study, with domain-level judgments and evidence traceability.",
    tags: ["ROBINS-I V2", "Risk of bias", "Non-randomized studies"],
    workflowFit: ["Critical appraisal", "Evidence-synthesis quality assessment", "Audit-ready bias documentation"],
    capabilities: ["Guide assessments through the seven ROBINS-I V2 bias domains", "Capture result-specific signaling answers, evidence, and rationale", "Produce structured domain judgments and an overall risk-of-bias record"],
    limitation: "ROBINS-I judgments depend on a correctly specified result, target trial, confounding context, evidence base, and expert interpretation. Structured prompts do not make the assessment objective or validate the underlying study.",
  },
};

function coordinates(url) { const match = url.match(/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?$/i); return match ? `${match[1]}/${match[2]}` : null; }
async function readme(url) {
  const repo = coordinates(url); if (!repo) return { ok: false };
  const response = await fetch(`https://api.github.com/repos/${repo}/readme`, { headers, signal: AbortSignal.timeout(20000) });
  if (!response.ok) return { ok: false, status: response.status };
  const meta = await response.json();
  const raw = meta.download_url ? await (await fetch(meta.download_url, { headers: { "User-Agent": headers["User-Agent"] } })).text() : "";
  return { ok: true, url: meta.html_url, text: raw };
}

const cards = [];
for (const item of sweep.shortlist) {
  const docs = await readme(item.canonicalUrl);
  const template = templates[item.category] ?? templates["Biomedical & RWE Infrastructure"];
  const special = overrides[item.canonicalUrl] ?? {};
  const readmeText = docs.text ?? "";
  const toolMatches = [...readmeText.matchAll(/^#{2,4}\s+(.{3,80})$/gm)].map((m) => m[1].replace(/[*_`]/g, "").trim()).filter((x) => /tool|search|lookup|query|data|trial|fhir|fda|code|literature|method|workflow/i.test(x)).slice(0, 3);
  const capabilities = special.capabilities ?? (toolMatches.length >= 2 ? toolMatches.map((x) => `Documented ${x.toLowerCase()} capability`) : template.capabilities);
  cards.push({
    name: special.name ?? item.name, kind: item.kind ?? "MCP server", category: item.category,
    summary: special.summary ?? item.repositoryDescription ?? item.description,
    tags: special.tags ?? template.tags, added: "Aug 11, 2026", checked: "Aug 11, 2026",
    status: docs.ok ? "Static documentation and registry metadata reviewed" : "Registry metadata reviewed · documentation caveat",
    runtime: "Not independently runtime tested by registry", repository: coordinates(item.canonicalUrl) ?? item.canonicalUrl,
    website: item.officialName ? "Official MCP Registry" : "GitHub", packages: item.officialVersion ? `${item.officialName} ${item.officialVersion}` : "Source repository",
    workflowFit: special.workflowFit ?? template.workflowFit, capabilities,
    limitation: special.limitation ?? template.limitation,
    favorite: Boolean(item.favorite), url: item.canonicalUrl,
  });
}

await fs.writeFile(path.join(root, "data", "approved-expansion.json"), `${JSON.stringify(cards, null, 2)}\n`);
console.log(JSON.stringify({ cards: cards.length, readmesReviewed: cards.filter((card) => card.status.startsWith("Static documentation")).length, favorites: cards.filter((card) => card.favorite).map((card) => card.name) }));
