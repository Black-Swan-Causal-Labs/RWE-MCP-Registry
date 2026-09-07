# RWE MCP Registry

A source-reviewed catalogue of MCP servers, skills, libraries, and agents for real-world evidence workflows, maintained by [Black Swan Causal Labs](https://blackswancausallabs.com).

The public registry is available at [black-swan-causal-labs.github.io/RWE-MCP-Registry](https://black-swan-causal-labs.github.io/RWE-MCP-Registry/) with weekly discovery and monthly catalogue audits as maintenance targets. Recorded check and review dates identify work actually completed.

## Public dataset

The [`public-data`](public-data) directory contains the reviewed capability workbook and a public discovery log:

- [`rwe-mcp-verified-capability-cards.xlsx`](public-data/rwe-mcp-verified-capability-cards.xlsx) — 177 reviewed capability cards covering study design, evidence synthesis, clinical interoperability, OMOP/terminology, pharmacovigilance, regulatory data, public health, and RWE infrastructure. The September 6, 2026 additions include DAG Studio WebMCP and Study Design Diagram Studio WebMCP, both listed in the official MCP Registry. The September 7 expansion adds 45 source-reviewed capabilities across clinical data, evidence retrieval, analytics, terminology, safety and research workflows; skills and agent integrations are labeled separately from standalone MCP servers.

- [`search-log-2026-09-07.json`](public-data/search-log-2026-09-07.json) — Official MCP Registry harvest totals and the 20 GitHub queries actually run, including retrieval caps and result counts. Source counts overlap and are not a unique candidate total.

The workbook records identity and static documentation or selected implementation review, with the scope stated per entry. Inclusion does not mean that a project has passed installation, runtime, security, privacy, clinical, or methodological validation.

The September review pool contained 59 candidates: 45 were included, 7 held and 7 excluded. The two WebMCP studios were separate additions. This bounded search did **not** meet the protocol’s exhaustive stopping criteria; the selected review pool is not the entire remaining backlog.

Unpublished candidate identities, detailed screening decisions, duplicate reviews and working files remain outside the public dataset. The aggregate discovery log above is public.

## Dates, markers and methods

- **Added** is the original catalogue inclusion date.
- **Checked** is the latest source-availability check, recorded in [`data/source-checks.json`](data/source-checks.json) using UTC timestamps. All 177 source URLs resolved in the September 7, 2026 pass.
- **Capability review**, shown in expanded cards, is the separate static documentation or implementation review date retained in the workbook. Availability checks do not renew it.
- A **gold ★** identifies a Black Swan Causal Labs product; it is not an independent quality or validation rating.

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

## Suggest an addition

Use the [Black Swan Causal Labs contact form](https://blackswancausallabs.com/#contact) to suggest a public project for review.

© 2026 Black Swan Causal Labs
