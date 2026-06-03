const SHARE_DOCS = [
  {
    title: "Code Change Workflow",
    status: "public",
    accent: "purple",
    blurb:
      "The AI coding workflow I use: define behavior, test first when practical, verify, review, then ship.",
    links: [
      {
        label: "open presentation ↗",
        href: "/ai-workflows/code-change-workflow-presentation.html",
      },
      {
        label: "github markdown ↗",
        href: "https://github.com/viviannnl/personal-web/blob/redesign/vivos-ui-refresh/docs/ai-workflows/code-change-workflow.md",
      },
    ],
  },
];

export default function ShareDocsApp() {
  return (
    <div className="share-docs">
      <p className="share-docs-intro">
        AI workflow notes and artifacts I’m making shareable for people who ask
        how I actually ship with agents.
      </p>

      <div className="share-doc-list">
        {SHARE_DOCS.map((doc) => (
          <article key={doc.title} className={`share-doc acc-${doc.accent}`}>
            <div className="share-doc-top">
              <h3>{doc.title}</h3>
              <span className="tag live mono">{doc.status}</span>
            </div>
            <p>{doc.blurb}</p>
            <div className="share-doc-links">
              {doc.links.map((link) => (
                <a
                  key={link.href}
                  className="lnk mono"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
