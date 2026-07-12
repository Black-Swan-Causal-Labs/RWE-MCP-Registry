import type { Metadata } from "next";
import { methodGroups } from "../../data/methods";

export const metadata: Metadata = {
  title: "Search Methods | RWE MCP Registry",
  description: "The living search protocol and controlled vocabulary used to build the RWE MCP Registry.",
};

export default function MethodsPage() {
  return <main className="methods-page">
    <header className="site-header">
      <a className="brand" href="https://blackswancausallabs.com"><span>BLACK SWAN <b>CAUSAL LABS</b></span></a>
      <nav aria-label="Primary navigation"><a href="/">Registry</a><a href="#protocol">Protocol</a><a href="#vocabulary">Search terms</a></nav>
    </header>

    <section className="methods-hero">
      <div className="eyebrow"><span>Methods appendix</span><span>Protocol v0.2-draft</span></div>
      <h1>How we search<br /><i>the landscape.</i></h1>
      <div className="methods-intro"><p>A living, reproducible protocol for finding MCP servers, connectors, skills, libraries, and agents relevant to real-world evidence.</p><p>Last updated July 10, 2026 · Metadata verification snapshot completed.</p></div>
    </section>

    <section className="protocol" id="protocol">
      <div className="section-heading"><div><span className="kicker">Search architecture</span><h2>Recall first.<br />Judgment second.</h2></div><p>Discovery pairs a technology signal with a health-workflow concept. The complete Official MCP Registry is also harvested and screened locally, so projects do not need to use our terminology to be found.</p></div>
      <div className="protocol-grid">
        <Protocol number="01" title="Harvest" text="Retrieve the complete Official MCP Registry and search GitHub repositories, code, curated catalogues, and citation chains." />
        <Protocol number="02" title="Discover" text="Run a reproducible matrix of technology signals against controlled RWE, HEOR, public-health, method, data, disease, and exposure terms." />
        <Protocol number="03" title="Screen" text="Classify each candidate as direct RWE, enabling infrastructure, adjacent, excluded, duplicate, unavailable, or flagged." />
        <Protocol number="04" title="Verify" text="Record the canonical source, implementation evidence, maintenance signal, provenance, limitations, and exact discovery path." />
      </div>
      <div className="positive-control"><span>Positive control 01</span><strong>PopHIVE</strong><p>If a search wave cannot recover a known relevant project, screening stops and the discovery logic is revised.</p></div>
      <aside className="coverage-boundary" id="coverage">
        <div><span className="kicker">Coverage boundary</span><h2>What the index cannot see.</h2></div>
        <div><p><strong>The registry represents publicly discoverable evidence, not the complete universe of RWE tooling.</strong></p><p>Private GitHub repositories, enterprise source-control systems, internal MCP servers, unpublished skills, access-controlled packages, and public projects with insufficient searchable metadata are outside the observable search frame.</p><p>Accordingly, a null result means that no qualifying project was found in the named public sources using the documented strategy as of the index date. It must not be interpreted as proof that no such capability exists.</p></div>
      </aside>
      <aside className="verification-protocol" id="verification">
        <div><span className="kicker">Metadata verification</span><h2>What was checked.<br />What was not.</h2></div>
        <div>
          <p><strong>On July 10, 2026, every catalogue URL was checked against the public GitHub repository API.</strong> The pass recorded canonical identity, availability or archive status, last push, stars, forks, open issues, default branch, and the license identifier exposed in repository metadata.</p>
          <p>The complete Official MCP Registry v0.1 snapshot was also harvested. A listing is credited only when an exact GitHub repository URL appears in the registry record; name similarity alone is not sufficient.</p>
          <dl><div><dt>58</dt><dd>public repositories verified</dd></div><div><dt>1</dt><dd>repository unavailable (HTTP 404)</dd></div><div><dt>2</dt><dd>exact Official Registry matches</dd></div><div><dt>0</dt><dd>repositories executed</dd></div></dl>
          <p><strong>A “Repository checked” label is deliberately narrow.</strong> It records factual public metadata. The separate editorial classifications—Provenanced, Active, Unreviewed, and Flagged—summarize visible provenance and maintenance signals. Neither establishes that a project implements MCP correctly, installs successfully, is free of malicious behavior, protects sensitive data, exposes the claimed tools, or produces valid clinical or causal results.</p>
        </div>
      </aside>
    </section>

    <section className="vocabulary" id="vocabulary">
      <div className="section-heading"><div><span className="kicker">Controlled vocabulary</span><h2>The terms we use<br />to find the work.</h2></div><p>Terms are searched as acronyms, expanded forms, plurals, and predictable variants. Broad words such as “disease,” “connector,” “FDA,” or “bias” must be paired with a stronger technology or RWE signal.</p></div>
      <div className="term-groups">{methodGroups.map((group, index) => <article className="term-group" key={group.title}><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><b>{group.terms.length} terms</b></div><ul>{group.terms.map((term) => <li key={term}>{term}</li>)}</ul></article>)}</div>
    </section>

    <section className="decision-rules">
      <div><span className="kicker">Decision rules</span><h2>Indexed does not mean validated.</h2></div>
      <div><h3>Eligible</h3><p>A public MCP server, connector, agent skill, library with an agent-facing interface, plugin, or orchestrated agent workflow that supports an identifiable RWE, HEOR, epidemiology, public-health, evidence-synthesis, or enabling activity.</p><h3>Not eligible</h3><p>Generic health assistants, incidental MCP mentions, nonfunctional demonstrations, duplicates, implausible bulk projects, or projects connected only by a broad disease or treatment word.</p><h3>Stopping rule</h3><p>Every predefined query is run, the Official MCP Registry is fully screened, two synonym and citation-chaining rounds produce no new eligible projects, and every candidate has a recorded disposition.</p></div>
    </section>

    <footer><p>© 2026 Black Swan Causal Labs</p><p><a href="/">← Return to the registry</a></p></footer>
  </main>;
}

function Protocol({ number, title, text }: { number: string; title: string; text: string }) {
  return <article><b>{number}</b><h3>{title}</h3><p>{text}</p></article>;
}
