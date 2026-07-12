# RWE MCP Registry

A source-reviewed catalogue of MCP servers, skills, libraries, and agents for real-world evidence workflows, maintained by [Black Swan Causal Labs](https://blackswancausallabs.com).

The public registry is available at [rwe-mcp-registry.smokeyultimatum.chatgpt.site](https://rwe-mcp-registry.smokeyultimatum.chatgpt.site) and is updated weekly.

## Public dataset

The [`public-data`](public-data) directory contains the external-facing workbook of reviewed RWE capability cards:

- [`rwe-mcp-verified-capability-cards.xlsx`](public-data/rwe-mcp-verified-capability-cards.xlsx) — batches 1–3, covering selected study-design, evidence-synthesis, OMOP/OHDSI, pharmacovigilance, public-health, and RWE records.

The workbook includes identity and static documentation review only. Inclusion does not mean that a project has passed installation, runtime, security, privacy, clinical, or methodological validation.

Internal candidate catalogues, screening logs, duplicate reviews, and working files are intentionally excluded from the public dataset.

## License

This repository uses separate licenses for software and research content:

- Website source code is licensed under the [MIT License](LICENSE).
- The registry dataset, public workbook, and original editorial content are licensed under [CC BY 4.0](LICENSE-DATA.md).

Suggested dataset attribution: “RWE MCP Registry, Black Swan Causal Labs, 2026. Licensed under CC BY 4.0.” Third-party names, trademarks, source descriptions, and linked materials remain subject to their respective owners' rights.

## Website

The website source is in [`app`](app), with registry content and interactions in [`app/registry-explorer.tsx`](app/registry-explorer.tsx) and the review protocol in [`app/methods/page.tsx`](app/methods/page.tsx).

To run it locally:

```bash
npm install
npm run dev
```

To verify a production build:

```bash
npm run build
```

## Suggest an addition

Use the [Black Swan Causal Labs contact form](https://blackswancausallabs.com/#contact) to suggest a public project for review.

© 2026 Black Swan Causal Labs
