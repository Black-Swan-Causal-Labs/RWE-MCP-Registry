# Black Swan Causal Labs report template

The registry's downloadable PDFs share the template in `scripts/build_reports.py`.

- US Letter; 48-point side margins and generous running-header/footer clearance.
- Black Swan Causal Labs text wordmark, cream header, teal rules and section headings.
- Serif report titles, 10-point sans-serif body, consistent paragraph spacing, widow/orphan control.
- Clickable references, repeated table headers, document title and author metadata, page numbers.
- Source prose remains in `public-data/*.md`; PDFs are generated beside it and mirrored into `public/public-data` for both deployments.

To regenerate the two reports, run `python3 scripts/build_reports.py` in an environment with ReportLab installed. To add a report, call `build` with its source filename stem, display title and dated subtitle. Inspect every rendered page before publication. Preserve historical search boundaries and distinguish historical card totals from current relevance decisions.
