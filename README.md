# RWE MCP Registry

A source-reviewed catalogue of MCP servers, skills, libraries, and agents for real-world evidence workflows, maintained by [Black Swan Causal Labs](https://blackswancausallabs.com).

The public registry is available at [black-swan-causal-labs.github.io/RWE-MCP-Registry](https://black-swan-causal-labs.github.io/RWE-MCP-Registry/) with weekly discovery and monthly catalogue audits as maintenance targets. Recorded check and review dates identify work actually completed.

## Browse the catalogue

The website shows **4,218 core capability records** as of the September 8, 2026 relevance audit. Search by source, method or workflow, then combine the **Resource type** and **RWE category** filters. Resource types include MCP servers and components, skills and collections, agents and workflows, research tools and libraries, benchmarks, and other interfaces. Hybrid entries appear under each applicable type; these groups are not mutually exclusive counts of unique servers.

Expand a card to see documented capabilities, workflow fit, limitations, review dates and source links. The **2,008 archived records**, **one borderline record**, and **one historical hold** remain in the workbook rather than the website catalogue.

## Public dataset

The repository contains the reviewed capability workbook, dated reports and supporting data. The Methods page offers Black Swan Causal Labs-branded PDFs for reading and downloading:

- [`rwe-mcp-verified-capability-cards.xlsx`](public-data/rwe-mcp-verified-capability-cards.xlsx) — the catalogue and discovery archive on separate sheets, with a small borderline-review sheet, stable IDs, scoped capabilities, limitations and primary sources. The historical RWE-0115 record is retained as a hold and excluded from active website cards. This expands the previously published 177-record workbook.
- [`reviewed-search-completion-2026-09-07.json`](data/reviewed-search-completion-2026-09-07.json) — new capability cards from the September continuation. Every card now carries a relevance decision. Current core, archive and borderline counts are in [`relevance-summary.json`](data/relevance-summary.json); the expansion count is a historical data-loading denominator, not the core total.
- [Relevance audit (PDF)](public-data/relevance-audit-2026-09-08.pdf) — core inclusion rules, review limitations and borderline questions. The [Markdown source](public-data/relevance-audit-2026-09-08.md) and [structured decisions](public-data/relevance-audit-2026-09-08.json) remain available for maintenance and analysis.
- [Search coverage report (PDF)](public-data/search-coverage-2026-09-07.pdf) — the complete historical campaign, review outcomes, amendments and stopping-rule status. Its [Markdown source](public-data/search-coverage-2026-09-07.md) and [structured audit](public-data/search-coverage-2026-09-07.json) retain the underlying record.
- [`search-log-2026-09-07.json`](public-data/search-log-2026-09-07.json) — the earlier bounded pass, retained as historical evidence.

Inclusion records static documentation or selected source-component review. It does not establish installation, runtime, security, privacy, clinical or methodological validation. Collections are scoped to reviewed components; an included component does not approve its held or excluded siblings.

## Relevance review

The [September 8 relevance audit](public-data/relevance-audit-2026-09-08.pdf) reassesses all 6,227 previously active capability records and separates Core, Archive and Borderline. It is an individual review of recorded capabilities and limitations, with selected source follow-ups identified in the audit, not a repeated primary-source audit of every project. The website shows only Core; archive and borderline records remain in the Excel workbook. The total counts records across servers, skills, components and workflows, not unique MCP servers. All 6,228 workbook IDs, including the historical hold, remain available.

## Search coverage and remaining work

The earlier September pass reached 177 published cards: two WebMCP additions and a selected review pool of 59 candidates, comprising 45 included, 7 held and 7 excluded. That batch did not meet the original stopping rule.

The continuation uses a revised source-specific plan with explicit scope amendments. Eighteen expansion rounds are closed; rounds 17 and 18 found no new qualifying project or component, meeting the revised stopping criterion on September 8, 2026 under the broader inclusion boundary then in use. That historical result does not establish search saturation under the narrower relevance boundary introduced afterward. The original broad Cartesian query matrix remains incomplete. GitHub repository partition searches retain the September 7, 2026 corpus cutoff; later run dates do not extend that lane’s boundary. The dated coverage report records completed searches, primary reviews, alternative-term and project-link rounds, and whether two successive rounds found no new qualifying material. Such a process result is bounded by the named sources and search strategy; it cannot guarantee an exhaustive inventory of a changing public ecosystem.

Public audit files contain sanitized counts, queries, dispositions and source references. Raw retrieved source bodies and private working files are not republished.

## Dates, markers and methods

- **Added** is the original catalogue inclusion date.
- **Checked** is the latest stated source check. Earlier availability-only checks are retained in [`data/source-checks.json`](data/source-checks.json); the historical 177-URL pass resolved all sources but did not repeat every capability review.
- **Capability review**, shown in expanded cards, is the separate static documentation or implementation review date retained in the workbook. Availability checks do not renew it.
- **Relevance review** records the separate scope decision; it does not renew the source or capability review.
- A **gold ★** identifies a Black Swan Causal Labs product; it is not an independent quality or validation rating.

For the continuation campaign begun September 7, 2026, new-card and specifically updated component check dates mark final editorial reconciliation. Individual source retrieval timestamps remain in the retained audit; unchanged historical cards keep their earlier dates.

See the [live Methods page](https://black-swan-causal-labs.github.io/RWE-MCP-Registry/methods/) and [companion protocol](METHODS.md) for completed coverage, search limits, review rules and planned procedures.

## License

This repository uses separate licenses for software and research content:

- Website source code is licensed under the [MIT License](LICENSE).
- The registry dataset, public workbook, and original editorial content are licensed under [CC BY 4.0](LICENSE-DATA.md).

Suggested dataset attribution: “RWE MCP Registry, Black Swan Causal Labs, 2026. Licensed under CC BY 4.0.” Third-party names, trademarks, source descriptions, and linked materials remain subject to their respective owners' rights.

## Website

The website source is in [`app`](app), with registry content and interactions in [`app/registry-explorer.tsx`](app/registry-explorer.tsx) and the review protocol in [`app/methods/page.tsx`](app/methods/page.tsx).

Use Node.js 22.13 or later. To run it locally:

```bash
npm ci
npm run dev
```

To verify the Sites/vinext production build:

```bash
npm run build
```

To verify the public GitHub Pages static build (the deployment workflow runs this build on pushes to `main`):

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/RWE-MCP-Registry npx next build
```

## Branded report template

Both downloadable reports use the shared [Black Swan report template](docs/report-template.md): the existing wordmark, cream and teal styling, consistent headings, clickable references and page numbering. The [report builder](scripts/build_reports.py) reads the retained Markdown sources and writes matching PDFs to `public-data` and `public/public-data`.

To regenerate the reports in a Python environment with ReportLab installed:

```bash
python3 scripts/build_reports.py
```

Review the rendered PDF pages before publication. Preserve the distinction between historical discovery totals and current relevance decisions when updating report content.

## Suggest an addition

Use the [Black Swan Causal Labs contact form](https://blackswancausallabs.com/#contact) to suggest a public project for review.

© 2026 Black Swan Causal Labs
