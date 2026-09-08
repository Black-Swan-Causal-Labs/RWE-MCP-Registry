import type { Metadata } from "next";
import { methodGroups } from "../../data/methods";
import completionCount from "../../data/search-completion-count.json";
import relevanceSummary from "../../data/relevance-summary.json";

export const metadata: Metadata = {
  title: "Search Methods | RWE MCP Registry",
  description: "The living search protocol and controlled vocabulary used to build the RWE MCP Registry.",
};

export default function MethodsPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return <main className="methods-page">
    <header className="site-header">
      <a className="brand" href="https://blackswancausallabs.com"><span>BLACK SWAN <b>CAUSAL LABS</b></span></a>
      <nav aria-label="Primary navigation"><a href={`${basePath}/`}>Registry</a><a href={`${basePath}/methods/`}>Methods</a><a href={`${basePath}/faq/`}>FAQ</a></nav>
    </header>

    <section className="methods-hero">
      <div className="eyebrow"><span>Methods appendix</span><span>September continuation</span></div>
      <h1>How we search<br /><i>the landscape.</i></h1>
      <div className="methods-intro"><p>A living search protocol and a record of completed discovery and review work for real-world evidence tooling.</p><p>Updated {completionCount.asOf} · {relevanceSummary.counts.Core.toLocaleString()} core cards · Static source review with documented coverage limits.</p></div>
    </section>

    <section className="decision-rules" id="relevance">
      <div><span className="kicker">Relevance correction</span><h2>A focused core.<br />Discoveries preserved.</h2></div>
      <div><p>The September expansion published 6,227 cards using an overly broad interpretation of enabling infrastructure. A later relevance audit separates the core catalogue from adjacent discoveries and unresolved component questions. All existing IDs and source records are preserved.</p>
      <p><strong>Core:</strong> a documented health-research role or a specific statistical or evidence-synthesis function. Examples include clinical/claims data, OMOP, causal inference, survival analysis, health economics, surveillance, scholarly retrieval and structured evidence review.</p>
      <p><strong>Discovery archive:</strong> tools whose connection depends on a possible downstream health application, including generic earthquake/climate feeds, broad public-data portals, molecular discovery and general scientific productivity. Environmental tools need an explicit health-exposure or epidemiologic scope to qualify for the core.</p>
      <p><strong>Borderline:</strong> a concrete unresolved component or scope question. These entries remain outside the core until resolved.</p>
      <p>The relevance audit evaluates the recorded capabilities and limitations, with source follow-up where identified. It is not a new primary-source inspection of every project. Each card records its decision rationale and review basis. Earlier source-review dates and caveats are retained.</p>
      <p>{relevanceSummary.counts.Core.toLocaleString()} core · {relevanceSummary.counts.Archive.toLocaleString()} archived · {relevanceSummary.counts.Borderline.toLocaleString()} borderline. One earlier source-quality hold remains separately recorded.</p>
      <p><a href={`${basePath}/public-data/relevance-audit-2026-09-08.md`}>Read the relevance audit and borderline themes ↗</a> · <a href={`${basePath}/public-data/relevance-audit-2026-09-08.json`}>Download every relevance decision ↗</a></p></div>
    </section>

    <section className="protocol" id="protocol">
      <div className="section-heading"><div><span className="kicker">Search architecture</span><h2>Recall first.<br />Judgment second.</h2></div><p>Discovery pairs technology signals with health-workflow concepts. An Official MCP Registry harvest adds a separate discovery route. Pagination completeness does not establish exhaustive relevance screening or coverage of unregistered projects.</p></div>
      <div className="protocol-grid">
        <Protocol number="01" title="Harvest" text="Record the sources, query limits, retrieval times and pages obtained. Distinguish a complete paginated harvest from bounded search results." />
        <Protocol number="02" title="Discover" text="Use the vocabulary to construct source-specific queries. Report the queries actually run; the full vocabulary matrix is a protocol target." />
        <Protocol number="03" title="Screen" text="Classify each candidate as direct RWE, enabling infrastructure, adjacent, excluded, duplicate, unavailable, or flagged." />
        <Protocol number="04" title="Verify" text="Inspect canonical sources, documentation and selected implementation evidence. Record limitations and distinguish static review from runtime testing." />
      </div>
      <div className="positive-control"><span>Planned positive control</span><strong>PopHIVE</strong><p>The PopHIVE MCP wrapper was recovered in a recorded four-query expansion batch. This demonstrates batch-level wrapper recovery; it does not establish which individual query recovered it or a formal pass of the original project-level control.</p></div>
      <aside className="coverage-boundary" id="coverage">
        <div><span className="kicker">Coverage boundary</span><h2>What the index cannot see.</h2></div>
        <div><p><strong>The registry represents publicly discoverable evidence, not the complete universe of RWE tooling.</strong></p><p>Private GitHub repositories, enterprise source-control systems, internal MCP servers, unpublished skills, access-controlled packages, and public projects with insufficient searchable metadata are outside the observable search frame.</p><p>Accordingly, a null result means that no qualifying project was found in the named public sources using the documented strategy as of the index date. It must not be interpreted as proof that no such capability exists.</p></div>
      </aside>
      <aside className="verification-protocol" id="verification">
        <div><span className="kicker">Metadata verification</span><h2>What was checked.<br />What was not.</h2></div>
        <div>
          <p><strong>The earlier September 6–7 pass expanded the catalogue from 130 to 177 entries.</strong> Two Black Swan WebMCP studios were added after documentation, tool-definition and official-listing review. A separate set of 59 candidates received static editorial review: 45 were included, 7 held and 7 excluded. Those 59 are a selected review pool, not the total remaining discovery backlog.</p>
          <p>On September 7, all 177 published source URLs were checked for availability and canonical redirects; all resolved. For GitHub sources, archive status was also recorded. This availability pass did not repeat every earlier capability review.</p>
          <dl><div><dt>{relevanceSummary.counts.Core.toLocaleString()}</dt><dd>core catalogue cards after relevance screening</dd></div><div><dt>{relevanceSummary.counts.Archive.toLocaleString()}</dt><dd>adjacent discoveries preserved in the archive</dd></div><div><dt>{relevanceSummary.counts.Borderline.toLocaleString()}</dt><dd>borderline entries outside the core catalogue</dd></div><div><dt>0</dt><dd>candidate projects runtime-tested</dd></div></dl>
          <p><strong>Static review is source evidence, not validation.</strong> Review examined repository metadata, documentation and selected source or tool-definition files. The hosted NexVigilant service was reviewed from documentation only. Candidate projects were not installed or executed, and MCP conformance, security, privacy, clinical performance and causal validity were not independently tested. Building this registry website is a separate activity.</p>
          <p>Official Registry attribution requires a matching canonical source and component identity; a similar name or a listing for another component in the same repository is insufficient. The two WebMCP cards retain their exact registry identifiers and versions. Inclusion in this catalogue does not imply every entry has an Official Registry listing.</p>
          <h3>What the dates and markers mean</h3>
          <p><strong>Added</strong> records catalogue inclusion. <strong>Checked</strong> records the latest stated check: older cards may carry an availability check, while continuation cards record completion of their editorial source review and reconciliation. <strong>Capability review</strong>, shown in expanded cards, records the separate documentation or implementation review. The workbook retains those capability-review dates; an availability check does not renew them. The September availability-check timestamps are stored in UTC.</p>
          <p>The continuation campaign began September 7, 2026. Its new-card and specifically updated component check dates mark final editorial reconciliation; individual source retrieval times remain in the retained audit. Historical dates remain attached to their original checks.</p>
          <p>The gold ★ identifies a Black Swan Causal Labs product. It is an ownership marker, not an independent quality score, recommendation or validation tier. Other records describe their evidence state in the Status and Runtime fields.</p>
        </div>
      </aside>
    </section>

    <section className="decision-rules" id="corrections">
      <div><span className="kicker">Published-entry correction</span><h2>Clinical Trials AI MCP.</h2></div>
      <div><p>RWE-0115 is held following a September 7 static implementation review. Its trial search, details, comparison and endpoint tools use a hardcoded simulated database. The endpoint function also infers randomization from the number of arms, which does not establish random allocation.</p><p>This component is a reference-data demonstration, not a live clinical-trial registry evidence source. Its historical ID and inclusion record remain in the workbook, with the corrected status. The other entries retain their own stated review boundaries.</p><p><a href="https://github.com/CSOAI-ORG/clinical-trials-ai-mcp/blob/093c257877004e91b8aed3f85ae49e7e4ad9c120/server.py">Read the reviewed implementation ↗</a></p></div>
    </section>

    <section className="decision-rules" id="latest-pass">
      <div><span className="kicker">Search coverage and remaining work</span><h2>Sources and limits.</h2></div>
      <div>
        <h3>Revised search plan</h3><p>The continuation completed a revised source-specific plan. It did not complete the original broad matrix of every technology term, workflow term and source. Prospective amendments clarified homonyms and narrowed unfinished repository searches to name, description and topics; completed broad searches and partial observations remain in the audit history. This change reduces coverage of projects discoverable only through README text.</p>
        <p>GitHub repository partition searches retained a corpus cutoff of 7 September 2026. Later run dates do not extend that lane’s repository creation-date boundary; other source lanes retain their separately recorded search rules and dates. Later Official Registry and Docker phrase screens reuse retained source bytes rather than new live inventories. Their retrieval/version dates and unavailable-source limits are recorded in the coverage report.</p>
        <h3>Sources before expansion rounds</h3><p>GitHub repository discovery recorded 277 revised queries, 700 result pages and 51,103 overlapping observations. Sixteen code searches recorded 53,965 observations; their retained sharded logs do not support an independent page-by-page completeness check. Smithery recorded 214 paginated vocabulary queries, 389 pages and 4,925 unique listings. Another 48 indexed searches covered Glama, PulseMCP and MCP.so; these were ranked search results, not complete directory harvests.</p>
        <p>The Official MCP Registry harvest recorded 28,167 latest-version records across 282 pages. Live pagination is not a transactionally frozen inventory, and automated metadata screening is not individual source review. The initial Docker checkout record counted 496 files; a later retained snapshot screen counted 569 tracked files using a different method. Neither number is a server count.</p>
        <h3>Expansion rounds and review</h3><p>All 18 expansion rounds and their promoted source reviews and meaningful project links are closed. The final fixed plan used 640 fresh queries per round: 240 GitHub repository, 80 GitHub code, 80 Smithery and 240 indexed-directory queries, plus 80 phrase checks against retained Official Registry and Docker snapshots. Rounds 17 and 18 each found no new qualifying project or component after canonical reconciliation. The historical report separates 6,521 reconciled project/component units from the then-published 6,227 cards. The subsequent relevance audit determines the current core catalogue; those earlier counts are not current inclusion counts.</p>
        <p>Search observations, primary-source reviews, canonical projects, components and public cards have different denominators. Automated scope screens, exact-copy reconciliation and individual source inspections are labeled separately. Approval of a component does not approve every sibling in its repository or collection.</p>
        <h3>Download the registry</h3><p><a href={`${basePath}/public-data/rwe-mcp-verified-capability-cards.xlsx`}>Core, archive and borderline workbook ↗</a> · <a href={`${basePath}/data/reviewed-search-completion-2026-09-07.json`}>Expansion records with relevance decisions as JSON ↗</a></p>
        <h3>Audit record</h3><p>Historical errors, interruptions and incomplete attempts remain recorded. Successful revised searches do not retrospectively complete the original expressions. The public audit contains sanitized queries, dispositions and source references; retained raw source bodies are not republished.</p>
        <p><a href={`${basePath}/public-data/search-coverage-2026-09-07.md`}>Read the search coverage report ↗</a> · <a href={`${basePath}/public-data/search-coverage-2026-09-07.json`}>Download the coverage audit ↗</a></p>
      </div>
    </section>

    <section className="vocabulary" id="vocabulary">
      <div className="section-heading"><div><span className="kicker">Controlled vocabulary</span><h2>The terms we use<br />to find the work.</h2></div><p>The vocabulary guides query construction using acronyms, expanded forms, plurals and predictable variants; not every combination was run in the latest pass. Broad words such as “disease,” “connector,” “FDA,” or “bias” must be paired with a stronger technology or RWE signal.</p></div>
      <div className="term-groups">{methodGroups.map((group, index) => <article className="term-group" key={group.title}><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><b>{group.terms.length} terms</b></div><ul>{group.terms.map((term) => <li key={term}>{term}</li>)}</ul></article>)}</div>
    </section>

    <section className="decision-rules">
      <div><span className="kicker">Decision rules</span><h2>Indexed does not mean validated.</h2></div>
      <div><h3>Eligible</h3><p>A public MCP server, connector, agent skill, library with an agent-facing interface, plugin, or orchestrated agent workflow that supports an identifiable RWE, HEOR, epidemiology, public-health, evidence-synthesis, or necessary enabling method. A merely conceivable downstream health application is insufficient for core inclusion.</p><h3>Not eligible</h3><p>Generic health assistants, incidental MCP mentions, nonfunctional demonstrations, duplicates, implausible bulk projects, or projects connected only by a broad disease or treatment word.</p><h3>Deduplication and holds</h3><p>Compare canonical URLs, redirects, packages, component scope and documented differences. A fork or aggregation is not automatically a new capability. Unresolved identity, mock services or material documentation conflicts may be held for further review.</p><h3>Search stopping rule</h3><p>Rounds 17 and 18 completed the fixed queries, terminal-page checks and meaningful source-link followups, with no new qualifying project or component in either round. The revised discovery stopping criterion was met on September 8, 2026 under the broader inclusion rules used at that time. The later relevance audit does not claim a new search or a new stopping result under its stricter boundary. This is a bounded search-process result under the recorded corpus cutoff, source access and revised query plan. It neither completes the original unamended Cartesian matrix nor establishes an exhaustive inventory of the changing public ecosystem.</p><h3>Maintenance target</h3><p>Weekly discovery and monthly catalogue audits are intended cadences, not evidence that a run occurred. Recorded check and review dates document completed work. New discoveries require editorial review before publication.</p></div>
    </section>

    <footer><p>© 2026 Black Swan Causal Labs</p><p><a href={`${basePath}/`}>← Return to the registry</a></p></footer>
  </main>;
}

function Protocol({ number, title, text }: { number: string; title: string; text: string }) {
  return <article><b>{number}</b><h3>{title}</h3><p>{text}</p></article>;
}
