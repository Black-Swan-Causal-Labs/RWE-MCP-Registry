import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | RWE MCP Registry",
  description: "Answers about the RWE MCP Registry, its review process, evidence boundaries, updates, and reuse.",
};

const faqGroups = [
  {
    label: "About the registry",
    title: "What this index is—and is not.",
    items: [
      {
        question: "What is the RWE MCP Registry?",
        answer: "A source-reviewed catalogue of MCP servers, skills, libraries, and agents that may support real-world evidence workflows. It adds an RWE interpretation layer to public project information: workflow fit, documented capabilities, limitations, operational scope, and evidence state.",
      },
      {
        question: "Who maintains the registry?",
        answer: "Black Swan Causal Labs maintains the registry as an independent, living research resource. Editorial judgments are based on publicly available sources and are revised when the underlying evidence changes.",
      },
      {
        question: "What qualifies for inclusion?",
        answer: "A public MCP server, connector, agent skill, library with an agent-facing interface, plugin, or orchestrated agent workflow must support an identifiable RWE, HEOR, epidemiology, public-health, evidence-synthesis, or necessary enabling activity. It must also have enough public evidence to describe its identity and function responsibly.",
      },
      {
        question: "Why might a known project be absent?",
        answer: "The registry can observe only publicly discoverable work. Private repositories, internal enterprise systems, unpublished tools, access-controlled packages, and public projects with insufficient searchable metadata may not be found. Absence means “not found in the searched public sources,” not “does not exist.”",
      },
    ],
  },
  {
    label: "Review and evidence",
    title: "How to interpret a record.",
    items: [
      {
        question: "Does inclusion mean a project is validated or safe?",
        answer: "No. Inclusion is not a security, privacy, clinical, methodological, regulatory, or quality certification. A project may be relevant to an RWE workflow and still require substantial technical, governance, and subject-matter review before use.",
      },
      {
        question: "What does “statically reviewed” mean?",
        answer: "Public repository files, documentation, manifests, packages, or listings were examined without running the project. Static review can confirm documented implementation and scope, but it cannot establish that installation succeeds, tools behave as claimed, outputs are correct, or sensitive data are protected.",
      },
      {
        question: "Have the listed projects been installed or runtime-tested?",
        answer: "No candidate projects were installed, invoked or runtime-tested in this continuation. Cards record identity, metadata, documentation or selected implementation review. Any earlier runtime evidence must be stated explicitly in its record; inclusion does not establish that a tool works correctly.",
      },
      {
        question: "What do the card dates and gold stars mean?",
        answer: "Added is the original catalogue inclusion date. Checked records the latest stated source check: historical cards may show an availability check, while continuation cards record completion of editorial source review and reconciliation. Expanded cards separately show the capability-review date. An availability check does not renew that review or validate tool behavior. A gold star identifies a Black Swan Causal Labs product, not an independent quality or validation rating.",
      },
      {
        question: "How should workflow-fit labels be interpreted?",
        answer: "Workflow-fit labels are concise editorial translations of documented capabilities. They identify a plausible role in an RWE process; they do not establish fitness for a particular study, dataset, decision, or regulatory use.",
      },
      {
        question: "How are skill collections handled?",
        answer: "Collection-level claims remain at collection level. A capability belonging to one constituent package or skill is attributed to that component, not to the entire collection. Components may receive separate records when the additional detail materially improves discovery.",
      },
    ],
  },
  {
    label: "Maintenance and participation",
    title: "How the registry stays current.",
    items: [
      {
        question: "How often is the registry updated?",
        answer: "Public-source discovery and surveillance are designed to run weekly. New or materially changed projects enter a private review queue. Approved records are added to the website and public workbook in reviewed batches rather than being published automatically.",
      },
      {
        question: "How are new projects discovered?",
        answer: "The protocol combines structured registries, GitHub repository and code searches, curated catalogues, predefined RWE terminology and links from discovered projects. The September continuation expanded the search under a revised source-specific plan. Ranked directory searches, unavailable sources and the original uncompleted broad query matrix remain coverage limits. The Methods page and coverage report distinguish completed searches, automated screening and individual source reviews.",
      },
      {
        question: "How are duplicates, renamed projects, and unavailable sources handled?",
        answer: "Canonical repositories, packages, aliases, redirects, and cross-listings are compared before a record is treated as new. Missing projects remain in the history as unavailable rather than being silently deleted, and reappearing projects are flagged for review.",
      },
      {
        question: "Can I suggest a project or correction?",
        answer: "Yes. Submit the canonical public source and a short explanation of its RWE relevance through the Black Swan Causal Labs contact form. Suggestions enter the same review process as discovered candidates and are not guaranteed inclusion.",
        link: "https://blackswancausallabs.com/#contact",
        linkLabel: "Suggest an addition or correction ↗",
      },
      {
        question: "Can I reuse the registry data?",
        answer: "Yes. The public dataset and original editorial content are licensed under Creative Commons Attribution 4.0. Website source code is licensed under MIT. Third-party names, trademarks, source descriptions, and linked materials remain subject to their respective owners’ rights.",
        link: "https://github.com/Black-Swan-Causal-Labs/RWE-MCP-Registry",
        linkLabel: "View the public repository ↗",
      },
    ],
  },
];

export default function FAQPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return <main className="faq-page">
    <header className="site-header">
      <a className="brand" href="https://blackswancausallabs.com"><span>BLACK SWAN <b>CAUSAL LABS</b></span></a>
      <nav aria-label="Primary navigation"><a href={`${basePath}/`}>Registry</a><a href={`${basePath}/methods/`}>Methods</a><a href={`${basePath}/faq/`}>FAQ</a></nav>
    </header>

    <section className="faq-hero">
      <h1>Frequently Asked<br /><i>Questions</i></h1>
    </section>

    <section className="faq-content">
      {faqGroups.map((group, groupIndex) => <section className="faq-group" key={group.label}>
        <div className="faq-group-heading"><span>{String(groupIndex + 1).padStart(2, "0")}</span><div><b>{group.label}</b><h2>{group.title}</h2></div></div>
        <div className="faq-list">
          {group.items.map((item) => <details key={item.question}>
            <summary><span>{item.question}</span><b aria-hidden="true">+</b></summary>
            <div className="faq-answer"><p>{item.answer}</p>{item.link && <a href={item.link}>{item.linkLabel}</a>}</div>
          </details>)}
        </div>
      </section>)}
    </section>

    <aside className="faq-contact"><h2>Still have a question?</h2><a href="https://blackswancausallabs.com/#contact">Contact Black Swan Causal Labs ↗</a></aside>
    <footer><p>© 2026 Black Swan Causal Labs</p><p><a href={`${basePath}/`}>← Return to the registry</a></p></footer>
  </main>;
}
