# RWE MCP Registry

A source-reviewed catalogue of MCP servers, skills, libraries, and agents for real-world evidence workflows, maintained by [Black Swan Causal Labs](https://blackswancausallabs.com).

The public registry is available at [black-swan-causal-labs.github.io/RWE-MCP-Registry](https://black-swan-causal-labs.github.io/RWE-MCP-Registry/) with weekly discovery and monthly catalogue audits as maintenance targets. Recorded check and review dates identify work actually completed.

## Public dataset

The [`public-data`](public-data) directory contains the reviewed capability workbook and dated coverage reports:

- [`rwe-mcp-verified-capability-cards.xlsx`](public-data/rwe-mcp-verified-capability-cards.xlsx) — the full reviewed registry, with stable IDs, scoped capabilities, limitations and primary sources. The historical RWE-0115 record is retained as a hold and excluded from active website cards. This expands the previously published 177-record workbook.
- [`reviewed-search-completion-2026-09-07.json`](data/reviewed-search-completion-2026-09-07.json) — new capability cards from the September continuation. The active total is the 176 retained historical cards plus the count in [`search-completion-count.json`](data/search-completion-count.json).
- [`search-coverage-2026-09-07.md`](public-data/search-coverage-2026-09-07.md) and its [structured audit](public-data/search-coverage-2026-09-07.json) — searches, review outcomes, amendments and stopping-rule status.
- [`search-log-2026-09-07.json`](public-data/search-log-2026-09-07.json) — the earlier bounded pass, retained as historical evidence.

Inclusion records static documentation or selected source-component review. It does not establish installation, runtime, security, privacy, clinical or methodological validation. Collections are scoped to reviewed components; an included component does not approve its held or excluded siblings.

## Search coverage and remaining work

The earlier September pass reached 177 published cards: two WebMCP additions and a selected review pool of 59 candidates, comprising 45 included, 7 held and 7 excluded. That batch did not meet the original stopping rule.

The continuation uses a revised source-specific plan with explicit scope amendments. Eighteen expansion rounds are closed; rounds 17 and 18 found no new qualifying project or component, meeting the revised stopping criterion on September 8, 2026. The original broad Cartesian query matrix remains incomplete. GitHub repository partition searches retain the September 7, 2026 corpus cutoff; later run dates do not extend that lane’s boundary. The dated coverage report records completed searches, primary reviews, alternative-term and project-link rounds, and whether two successive rounds found no new qualifying material. Such a process result is bounded by the named sources and search strategy; it cannot guarantee an exhaustive inventory of a changing public ecosystem.

Public audit files contain sanitized counts, queries, dispositions and source references. Raw retrieved source bodies and private working files are not republished.

## Dates, markers and methods

- **Added** is the original catalogue inclusion date.
- **Checked** is the latest stated source check. Earlier availability-only checks are retained in [`data/source-checks.json`](data/source-checks.json); the historical 177-URL pass resolved all sources but did not repeat every capability review.
- **Capability review**, shown in expanded cards, is the separate static documentation or implementation review date retained in the workbook. Availability checks do not renew it.
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

## Suggest an addition

Use the [Black Swan Causal Labs contact form](https://blackswancausallabs.com/#contact) to suggest a public project for review.

© 2026 Black Swan Causal Labs
