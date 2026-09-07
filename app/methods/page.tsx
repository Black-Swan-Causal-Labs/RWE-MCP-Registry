import type { Metadata } from "next";
import { methodGroups } from "../../data/methods";

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
      <div className="eyebrow"><span>Methods appendix</span><span>Protocol v0.5-draft</span></div>
      <h1>How we search<br /><i>the landscape.</i></h1>
      <div className="methods-intro"><p>A living search protocol and a record of completed discovery and review work for real-world evidence tooling.</p><p>Updated September 7, 2026 · 177 catalogue entries · Bounded discovery and source review; exhaustive stopping criteria not met.</p></div>
    </section>

    <section className="protocol" id="protocol">
      <div className="section-heading"><div><span className="kicker">Search architecture</span><h2>Recall first.<br />Judgment second.</h2></div><p>Discovery pairs technology signals with health-workflow concepts. An Official MCP Registry harvest adds a separate discovery route. Pagination completeness does not establish exhaustive relevance screening or coverage of unregistered projects.</p></div>
      <div className="protocol-grid">
        <Protocol number="01" title="Harvest" text="Record the sources, query limits, retrieval times and pages obtained. Distinguish a complete paginated harvest from bounded search results." />
        <Protocol number="02" title="Discover" text="Use the vocabulary to construct source-specific queries. Report the queries actually run; the full vocabulary matrix is a protocol target." />
        <Protocol number="03" title="Screen" text="Classify each candidate as direct RWE, enabling infrastructure, adjacent, excluded, duplicate, unavailable, or flagged." />
        <Protocol number="04" title="Verify" text="Inspect canonical sources, documentation and selected implementation evidence. Record limitations and distinguish static review from runtime testing." />
      </div>
      <div className="positive-control"><span>Planned positive control</span><strong>PopHIVE</strong><p>The protocol names PopHIVE as a known relevant project for testing discovery recall. A query-level recovery check was not documented for the September pass, so this control is not claimed as passed.</p></div>
      <aside className="coverage-boundary" id="coverage">
        <div><span className="kicker">Coverage boundary</span><h2>What the index cannot see.</h2></div>
        <div><p><strong>The registry represents publicly discoverable evidence, not the complete universe of RWE tooling.</strong></p><p>Private GitHub repositories, enterprise source-control systems, internal MCP servers, unpublished skills, access-controlled packages, and public projects with insufficient searchable metadata are outside the observable search frame.</p><p>Accordingly, a null result means that no qualifying project was found in the named public sources using the documented strategy as of the index date. It must not be interpreted as proof that no such capability exists.</p></div>
      </aside>
      <aside className="verification-protocol" id="verification">
        <div><span className="kicker">Metadata verification</span><h2>What was checked.<br />What was not.</h2></div>
        <div>
          <p><strong>The September 6–7 pass expanded the catalogue from 130 to 177 entries.</strong> Two Black Swan WebMCP studios were added after documentation, tool-definition and official-listing review. A separate set of 59 candidates received static editorial review: 45 were included, 7 held and 7 excluded. Those 59 are a selected review pool, not the total remaining discovery backlog.</p>
          <p>On September 7, all 177 published source URLs were checked for availability and canonical redirects; all resolved. For GitHub sources, archive status was also recorded. This availability pass did not repeat every earlier capability review.</p>
          <dl><div><dt>177</dt><dd>published capability cards</dd></div><div><dt>59</dt><dd>candidates in the latest review pool</dd></div><div><dt>45</dt><dd>included from that pool</dd></div><div><dt>0</dt><dd>candidate projects runtime-tested in this pass</dd></div></dl>
          <p><strong>Static review is source evidence, not validation.</strong> Review examined repository metadata, documentation and selected source or tool-definition files. The hosted NexVigilant service was reviewed from documentation only. Candidate projects were not installed or executed, and MCP conformance, security, privacy, clinical performance and causal validity were not independently tested. Building this registry website is a separate activity.</p>
          <p>Official Registry attribution requires a matching canonical source and component identity; a similar name or a listing for another component in the same repository is insufficient. The two WebMCP cards retain their exact registry identifiers and versions. Inclusion in this catalogue does not imply every entry has an Official Registry listing.</p>
          <h3>What the dates and markers mean</h3>
          <p><strong>Added</strong> records catalogue inclusion. <strong>Checked</strong> records the latest source-availability check. <strong>Capability review</strong>, shown in expanded cards, records the separate documentation or implementation review. The workbook retains those capability-review dates; an availability check does not renew them. The September availability-check timestamps are stored in UTC.</p>
          <p>The gold ★ identifies a Black Swan Causal Labs product. It is an ownership marker, not an independent quality score, recommendation or validation tier. Other records describe their evidence state in the Status and Runtime fields.</p>
        </div>
      </aside>
    </section>

    <section className="decision-rules" id="latest-pass">
      <div><span className="kicker">Completed September search</span><h2>Sources and limits.</h2></div>
      <div>
        <h3>Official MCP Registry</h3><p>Retrieved 282 pages containing 28,167 unique latest-version records through the v0.1 API with version=latest. The live catalogue can change during pagination; this was not a transactionally frozen snapshot. Records were screened locally for discovery signals, not all individually reviewed for inclusion.</p>
        <h3>GitHub and other directories</h3><p>GitHub retrieval used 20 queries, capped at the first 30 results per query sorted by update time. No exhaustive repository or code search was completed. Smithery retrieval paginated 27 queries and returned 1,686 unique listings; 70 broad matches remained discovery observations requiring source resolution, not 70 approved projects.</p>
        <p>The Docker MCP Registry checkout contained 496 files and one server.yaml vocabulary match. Two curated awesome-MCP lists and targeted web/Glama searches supported discovery and citation chaining. PulseMCP and MCP.so were not completely harvested, and other commercial directories were not exhaustively covered.</p>
        <h3>Audit record</h3><p>Query logs, source snapshots and candidate dispositions were retained for the editorial audit. Public cards and the workbook provide included-source references; unpublished candidate records remain outside the public catalogue. Counts from different sources overlap and must not be added as unique projects.</p>
        <p><a href="https://github.com/Black-Swan-Causal-Labs/RWE-MCP-Registry/blob/main/public-data/search-log-2026-09-07.json">View the Official Registry harvest and GitHub query log ↗</a></p>
      </div>
    </section>

    <section className="vocabulary" id="vocabulary">
      <div className="section-heading"><div><span className="kicker">Controlled vocabulary</span><h2>The terms we use<br />to find the work.</h2></div><p>The vocabulary guides query construction using acronyms, expanded forms, plurals and predictable variants; not every combination was run in the latest pass. Broad words such as “disease,” “connector,” “FDA,” or “bias” must be paired with a stronger technology or RWE signal.</p></div>
      <div className="term-groups">{methodGroups.map((group, index) => <article className="term-group" key={group.title}><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><b>{group.terms.length} terms</b></div><ul>{group.terms.map((term) => <li key={term}>{term}</li>)}</ul></article>)}</div>
    </section>

    <section className="decision-rules">
      <div><span className="kicker">Decision rules</span><h2>Indexed does not mean validated.</h2></div>
      <div><h3>Eligible</h3><p>A public MCP server, connector, agent skill, library with an agent-facing interface, plugin, or orchestrated agent workflow that supports an identifiable RWE, HEOR, epidemiology, public-health, evidence-synthesis, or enabling activity.</p><h3>Not eligible</h3><p>Generic health assistants, incidental MCP mentions, nonfunctional demonstrations, duplicates, implausible bulk projects, or projects connected only by a broad disease or treatment word.</p><h3>Deduplication and holds</h3><p>Compare canonical URLs, redirects, packages, component scope and documented differences. A fork or aggregation is not automatically a new capability. Unresolved identity, mock services or material documentation conflicts may be held for further review.</p><h3>Target stopping rule — not met in this pass</h3><p>An exhaustive wave would require all predefined source/query combinations, complete planned screening, two successive synonym and citation-chaining rounds with no new eligible projects, and a disposition for every discovered candidate. The September pass did not meet these criteria; completing the selected 59-candidate review does not close the wider backlog.</p><h3>Maintenance target</h3><p>Weekly discovery and monthly catalogue audits are intended cadences, not evidence that a run occurred. Recorded check and review dates document completed work. New discoveries require editorial review before publication.</p></div>
    </section>

    <footer><p>© 2026 Black Swan Causal Labs</p><p><a href={`${basePath}/`}>← Return to the registry</a></p></footer>
  </main>;
}

function Protocol({ number, title, text }: { number: string; title: string; text: string }) {
  return <article><b>{number}</b><h3>{title}</h3><p>{text}</p></article>;
}
