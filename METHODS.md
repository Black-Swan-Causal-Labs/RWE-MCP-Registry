# RWE MCP Registry — Search and Indexing Methods

**Protocol version:** 0.4-draft
**Last updated:** 2026-07-11
**Status:** Living document; revise before each search wave and record material changes.

## Purpose

Identify publicly discoverable MCP servers, connectors, agent skills, libraries, plugins, and agents that directly support, or provide necessary enabling infrastructure for, real-world evidence (RWE), health economics and outcomes research (HEOR), epidemiology, public health, evidence synthesis, and adjacent workflows.

The search is designed for high recall during discovery. Relevance, provenance, maintenance, and fitness-for-purpose are assessed during screening; appearance in a search result is not evidence of validation.

## Discovery sources

1. **Official MCP Registry:** complete paginated harvest of `GET /v0.1/servers`, retaining version, publication, and status metadata.
2. **GitHub repository search:** names, descriptions, topics, and indexed README text.
3. **GitHub code search:** implementation signals and skills embedded in larger repositories.
4. **Curated registries and catalogues:** PulseMCP, Smithery, Glama, mcp.so, awesome lists, and domain-specific skill collections.
5. **Citation chaining:** related repositories, organization accounts, dependencies, companion servers, forks, and references discovered from screened candidates.

Each run records the source, exact query or retrieval method, retrieval date, result count, and candidate disposition.

## Discovery model

Searches pair at least one **technology signal** with at least one **RWE or health-workflow signal**. Exception: the complete Official MCP Registry harvest is screened locally without a technology-term restriction because MCP status is inherent in the source.

### Technology signals

- MCP
- Model Context Protocol
- MCP server
- MCP tool
- MCP connector
- connector
- FastMCP
- `@modelcontextprotocol/sdk`
- `mcp.server`
- `server.json`
- `mcp.json`
- `SKILL.md`
- Claude skill
- agent skill
- plugin
- agent
- tool server

## Controlled vocabulary

Terms are searched as acronyms, expanded forms, singular/plural forms, and predictable punctuation or capitalization variants where applicable.

### Core RWE, HEOR, effectiveness, and epidemiology

- real-world evidence; RWE; real-world data; RWD
- health economics and outcomes research; HEOR; health economics; outcomes research
- comparative effectiveness; effectiveness; treatment effectiveness; vaccine effectiveness
- cost effectiveness; cost-effectiveness; cost utility; cost-utility; economic evaluation
- budget impact; quality-adjusted life year; QALY; DALY; utility; patient-reported outcome; PRO
- pharmacoepidemiology; epidemiology; population health; public health
- burden of disease; natural history; incidence; prevalence; surveillance
- benefit-risk; safety; effectiveness research; healthcare utilization; resource utilization

### Safety and pharmacovigilance

- pharmacovigilance; drug safety; adverse event; adverse drug reaction; safety signal; signal detection
- FAERS; FDA Adverse Event Reporting System; FAERs
- VAERS; Vaccine Adverse Event Reporting System; VAERs
- EudraVigilance; VigiBase; WHO-UMC; ICSR; E2B; MedDRA
- disproportionality; PRR; ROR; EBGM; information component
- post-marketing; post-authorization safety study; PASS

### Regulatory and product data

- FDA; openFDA; EMA; MHRA; PMDA; Health Canada; TGA
- ICH; CIOMS; regulatory intelligence; regulatory science
- label; labeling; package insert; drug approval; biologic; medical device
- recall; 510(k); orphan designation; EPAR; REMS

### Healthcare and public-health data

- electronic health record; EHR; EMR; claims; insurance claims; administrative data
- registry data; patient registry; pharmacy; dispensing; prescription; laboratory
- mortality; death certificate; vital statistics; birth; hospitalization; encounter
- wearable; patient-generated data; social determinants of health; SDOH
- CDC WONDER; NHANES; BRFSS; NVSS; NCHS; SEER; WHO; GBD
- disease surveillance; outbreak; biosurveillance; wastewater surveillance; vaccine coverage

### Data models, standards, and terminology

- OMOP; OHDSI; common data model; CDM; FHIR; HL7
- CDISC; SDTM; ADaM
- SNOMED; ICD-9; ICD-10; RxNorm; LOINC; CPT; NDC; UMLS
- terminology mapping; phenotype; phenotyping; cohort definition

### Tokenization, linkage, interoperability, and engineering

- tokenization; privacy-preserving tokenization; patient token
- record linkage; data linkage; probabilistic linkage; deterministic linkage
- privacy-preserving record linkage; PPRL; patient matching; entity resolution
- deduplication; interoperability; ETL; data harmonization; data integration
- common data model mapping; identity resolution; crosswalk

### Study design, causal inference, g-methods, confounding, and bias

- study design; observational study; cohort study; case-control; cross-sectional
- causal inference; causal effect; potential outcomes; counterfactual
- target trial; target trial emulation; estimand; causal contrast
- g-methods; g-formula; parametric g-formula; g-computation; g-estimation
- marginal structural model; MSM; inverse probability weighting; IPTW; IPW
- longitudinal treatment; time-varying treatment; time-varying confounding
- confounding; unmeasured confounding; residual confounding; confounding by indication
- propensity score; matching; stratification; weighting; standardization
- difference-in-differences; interrupted time series; regression discontinuity
- instrumental variable; synthetic control; negative control
- quantitative bias analysis; probabilistic bias analysis; sensitivity analysis
- selection bias; information bias; measurement error; misclassification
- immortal time bias; prevalent-user bias; depletion of susceptibles; collider bias
- DAG; directed acyclic graph; adjustment set; backdoor criterion
- self-controlled case series; SCCS; case-crossover; new-user design; active comparator

### Evidence generation and synthesis

- clinical trial; ClinicalTrials.gov; literature search; PubMed
- systematic review; scoping review; meta-analysis; evidence synthesis; PRISMA
- citation verification; evidence grading; protocol; SAP; statistical analysis plan
- Table 1; survival analysis; time-to-event; reporting guideline

### Disease, population, treatment, and exposure domains

- disease; chronic disease; infectious disease; communicable disease
- autoimmune; immune-mediated; cardiovascular; oncology; cancer; diabetes; metabolic
- respiratory; neurologic; psychiatric; renal; hepatic; rare disease
- maternal; pediatric; geriatric; pregnancy
- vaccine; vaccination; immunization; treatment; therapy; medication; drug
- device; biologic; diagnostic; exposure; intervention

Broad terms such as `disease`, `treatment`, `FDA`, `connector`, `bias`, or `safety` are not sufficient alone. They must be paired with a technology signal or a stronger RWE concept during GitHub and catalogue searches.

## Query construction

Queries are run as a reproducible matrix rather than one large Boolean expression:

`technology signal × controlled-vocabulary concept block`

Examples:

- `"Model Context Protocol" FAERS`
- `FastMCP VAERS`
- `"MCP connector" "health economics"`
- `"MCP server" "record linkage"`
- `"modelcontextprotocol/sdk" tokenization`
- `filename:SKILL.md "g-formula"`
- `filename:SKILL.md pharmacoepidemiology`

## Positive controls

Known projects that the strategy must recover are retained as positive controls. PopHIVE is the initial positive control. Failure to recover a control triggers synonym, source, or query-logic review before screening begins.

## Screening decisions

- Include — direct RWE
- Include — enabling infrastructure
- Adjacent — manual review
- Exclude — generic health
- Exclude — no MCP, connector, or skill implementation
- Duplicate
- Unavailable
- Flagged

## Inclusion criteria

A candidate is eligible when it implements or packages an MCP server, connector, agent skill, library with an agent-facing interface, plugin, or orchestrated agent workflow; supports an identifiable RWE/HEOR/public-health lifecycle activity or necessary enabling capability; has a public canonical source or official registry record; and provides enough evidence to describe its function.

## Exclusion criteria

Exclude or quarantine generic healthcare assistants without evidence-generation relevance; projects that merely mention MCP; nonfunctional demonstrations; duplicate packages or mirrors; generated bulk repositories with implausible claims; and projects connected only by a broad disease or treatment term.

## Minimum metadata

- discovery source and exact query
- discovery and verification dates
- canonical name, repository, and URL
- Official MCP Registry name, version, and status when available
- kind, transport, package, and license
- RWE lifecycle stage and domain
- disease, population, exposure, and geographic/regulatory scope
- upstream data sources
- last release and repository push
- inclusion decision, rationale, review status, caveat, and duplicate relationship

## Metadata verification pass — 2026-07-10

Every catalogue URL was queried through the public GitHub repository API. The pass recorded canonical repository identity, availability or archive status, last push, stars, forks, open issues, default branch, and the SPDX license identifier exposed in GitHub metadata. Fifty-eight repositories returned public metadata; one (`sine-ai/drug-safety-mcp`) returned HTTP 404 and is marked unavailable.

The complete Official MCP Registry v0.1 snapshot was harvested on the same date. An Official Registry match was assigned only when a registry record contained an exact normalized GitHub repository URL. Two catalogue entries met that rule: `OMOPHub/omophub-mcp` and `ahmedEid1/thoth`.

“Metadata verified” is not a runtime, security, privacy, clinical, methodological, or regulatory verdict. No repository was cloned, installed, imported, built, executed, or connected to data. MCP conformance, declared tools, transports, dependency safety, credential handling, output validity, and malicious behavior were not tested.

## Search Wave 2 — expanded discovery and RWE capability framing

Search Wave 2 broadened discovery beyond GitHub and the Official MCP Registry. It added MCP Market, the Mastra MCP Registry Registry, indexed GitHub results, curated MCP lists, the Smithery Registry API, and Docker's public MCP registry as discovery surfaces.

The wave produced an intermediate discovery workbook rather than an immediate website update. New records remain candidates until screening and verification are complete; they are not automatically accepted catalogue entries. The combined structured-search workbook contains 182 unique records: 58 available entries retained from the first wave, 123 new candidates, and one unavailable prior entry. First-stage manual relevance screening of the 123 new candidates was completed on 2026-07-11: 91 were provisionally included and 32 were excluded. The 91 provisional inclusions still require canonical identity, implementation, documentation, component-attribution, and duplicate checks before publication.

### Structured-source ingestion

- **Official MCP Registry:** complete paginated snapshot harvested and screened locally; latest versions used for discovery.
- **Smithery:** the documented `GET /servers` API was accessible anonymously during this session. All reported pages were retrieved for 27 predefined RWE queries, producing 51 deduplicated description matches before cross-source deduplication.
- **Docker MCP Registry:** the complete public `docker/mcp-registry` repository was screened locally. One server contained a direct RWE/health-data description match.
- **PulseMCP:** a compatible Sub-Registry API was confirmed, but harvesting was not performed because `X-API-Key` and `X-Tenant-ID` credentials are required.
- **MCP.so:** no supported directory-wide API was confirmed. The guessed `/api/servers` route returned HTTP 404; the registry API described on an MCP.so listing referred to an MCP Registry implementation, not clearly to MCP.so's own directory data.
- **MCP Market and remaining directories:** targeted indexed-page discovery was used where no supported bulk interface was confirmed. These sources are not yet exhaustively screened.

### Candidate disposition boundary

Discovery and inclusion are now explicitly separated. A new listing is recorded as `Candidate — manual RWE review` until its canonical identity, implementation evidence, relevance, duplication status, and limitations are assessed. Directory descriptions may be promotional, overbroad, stale, or unrelated to a canonical source; matching an RWE term is therefore insufficient for website inclusion.

### RWE Capability Records

Search Wave 2 introduced a provisional RWE Capability Card schema. Each card may record:

- intended capability and packaging type;
- RWE lifecycle role and methodological role;
- upstream data sources, standards, inputs, and outputs;
- potential research questions the capability could support;
- appropriate role in a workflow and activities it cannot perform independently;
- data, methodological, privacy, and governance limitations;
- authentication, transport, and read/write scope;
- evidence level, runtime-test state, security-review state, and RWE subject-matter review state.

Potential research questions may be retained as internal editorial annotations, but they are not part of the selected public card design. When recorded, they are applicability examples rather than claims that a server or skill independently answers them. They require review alongside data availability, study design, identification assumptions, source-system semantics, and human oversight requirements.

### Website card presentation

Catalogue cards use a three-column, compact, expandable pattern rather than a separate detail page or a visual flip effect. The layout reduces to two columns on intermediate screens and one column on phones. The collapsed card supports rapid scanning and contains only the name, packaging kind, RWE category, one-sentence RWE summary, no more than three capability tags, date added, date last checked, metadata-review status, and runtime-test status. Selecting the card expands it in place using a visible button that also works with keyboard and touch input.

The expanded area remains deliberately brief. The selected design shows **RWE workflow fit** as a small set of labels, **documented capabilities** as a short list, one concise limitation, and operational source fields such as status, repository, website, and packages. Potential research questions are intentionally omitted from the public card because they can imply that a capability has been validated to answer a research question, require substantial interpretive maintenance, and are difficult to attribute correctly for heterogeneous collections. Detailed screening rationale, full provenance notes, reviewer identity, discovery queries, duplicate logic, research-question annotations, and technical audit fields remain in the underlying registry dataset rather than the public card.

Public claims about workflow fit and documented capabilities must be traceable to reviewed public documentation. Workflow-fit labels are editorial translations of documented capabilities and must not imply runtime validation or fitness for a specific study. Unsupported speculative applications are not published. Internal research-question annotations, when retained, must include a source link and attribution note.

Packaging type determines the unit of attribution:

- An MCP server card describes documented server tools, resources, prompts, packages, and data access.
- An individual skill card describes the documented workflow of that skill.
- A skill collection card describes the collection at collection level. It must not attribute the capability of one constituent package or skill to the entire collection.
- For a skill collection, RWE-relevant packages or skills may be indexed as component records when their capabilities materially differ and the additional granularity improves discovery.

For example, `GPTomics/bioSkills` is a broad bioinformatics skill collection. Potential RWE questions about survival analysis, missing-data sensitivity, effect measures, or trial design derive from its `clinical-biostatistics` package and must be attributed to that package or its individual skills—not to the collection as a whole. The collection card may state that it contains RWE-relevant components and link users to those components.

### Catalogue dates and freshness

The underlying registry records distinct maintenance dates:

- `date_discovered`: first observed during a documented search.
- `date_added`: approved for inclusion in the public catalogue.
- `date_metadata_checked`: most recent review of repository, listing, package, and documentation metadata.
- `date_runtime_validated`: most recent isolated functional test, when performed.
- `date_status_changed`: most recent change in availability or catalogue disposition.

Only date added and date last checked are required on the public card. A runtime-validation date is displayed only when runtime validation has actually occurred. Absence of a runtime date must not be interpreted as failure.

Freshness labels are derived from `date_metadata_checked`: **Current** for 0–35 days, **Review due** for 36–60 days, and **Overdue** after 60 days. **Unavailable** is a separate source-resolution state rather than a freshness category.

### Discovery and audit cadence

A weekly discovery run searches the documented public sources for new MCP servers, skills, connectors, collections, packages, and materially changed listings. New discoveries enter a review queue, are deduplicated against canonical URLs and known aliases, and are not automatically published.

A monthly catalogue audit reviews the entire published catalogue for repository and listing availability, redirects, archive status, package or implementation removal, material documentation changes, and freshness. The audit updates `date_metadata_checked`; unavailable or materially changed records are flagged for human review rather than silently deleted. Runtime and security testing remain separate activities and are not implied by the monthly metadata audit.

Publication and RWE interpretation remain human-reviewed. Automated discovery or metadata checks may identify changes, but they do not independently approve entries, generate final research-question claims, or establish methodological, security, privacy, clinical, or regulatory fitness.

### Evidence ladder

Future assessment should record specific evidence states rather than using a single ambiguous validation label:

1. Directory listing found
2. Canonical repository or publisher resolved
3. Public repository metadata checked
4. MCP or skill implementation confirmed
5. Static documentation or implementation reviewed
6. Installation reproduced in an isolated environment
7. MCP handshake completed
8. Tools, resources, prompts, or skill workflow enumerated
9. Read-only task tested
10. Output compared with the authoritative source
11. Security review completed
12. RWE use case evaluated by an appropriate subject-matter reviewer

The current work is primarily at levels 1–3. No candidate received runtime, security, clinical, methodological, or regulatory validation during Search Wave 2.

## Stopping rule

A search wave is complete when all predefined queries have been run across applicable sources; the complete Official MCP Registry snapshot has been screened; two successive synonym-expansion and citation-chaining rounds produce no new eligible projects; every candidate has a recorded disposition; and known gaps are preserved as explicit null findings.

## Known limitations

- **Public-discovery boundary:** the index cannot observe private GitHub repositories, enterprise source-control systems, internal MCP deployments, unpublished skills, access-controlled packages, or public projects that are not sufficiently indexed or documented. Absence from the registry means “not found in the searched public sources as of the index date,” not “does not exist.”
- Registry and repository metadata can be incomplete, promotional, or stale.
- Official MCP Registry data is in preview and may change or reset.
- Code search coverage depends on authentication, indexing, and repository visibility.
- Tiering is an editorial assessment based on public metadata unless code execution or review is explicitly recorded.
- Inclusion in the index is not security, privacy, clinical, methodological, or regulatory validation.
- Search Wave 2 deliberately favored recall. First-stage screening excluded 32 of the 123 new candidates; the 91 provisional inclusions still require verification and may be reclassified when canonical identity, implementation, duplication, or documentation cannot be confirmed.
- Smithery results are based on registry descriptions and require canonical-repository resolution and implementation confirmation.
- PulseMCP remains credential-blocked, and several Mastra-listed directories remain inventoried but not exhaustively screened.
