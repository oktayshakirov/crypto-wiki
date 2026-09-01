import useScrollSpy from "@hooks/useScrollSpy";

// Below this an outline is more noise than navigation, so we render nothing
// and the sidebar/summary collapses on its own.
const MIN_HEADINGS = 3;

/**
 * The article outline, in two shapes:
 *   variant="sidebar" - the sticky desktop rail, with scroll-spy highlighting
 *   variant="inline"  - a collapsed <details> for phones, where there is no rail
 *
 * Both read the same `toc` prop built at build time in getStaticProps, so the
 * links are in the HTML for crawlers rather than appearing after hydration.
 */
const TableOfContents = ({ toc, variant = "sidebar" }) => {
  // Chapter-level nav on desktop: H2+H3 both regularly push a post's outline
  // past a single viewport (worst case 25 headings), and the sidebar has
  // nowhere to grow without either an internal scroll or making readers hunt
  // for the tail near the end of the article - both tried, both bad. Mobile's
  // tap-open accordion isn't height-constrained, so it keeps full detail.
  // Computed before the hook call below since scroll-spy needs to track the
  // same entries the nav actually lists - highlighting an H3 that isn't shown
  // would leave the visible H2 above it looking inactive while reading it.
  const entries =
    variant === "sidebar" ? (toc || []).filter((h) => h.level === 2) : toc;

  // Hooks run unconditionally; the early return happens after.
  const activeId = useScrollSpy(variant === "sidebar" ? entries : null);

  if (!entries || entries.length < MIN_HEADINGS) return null;

  const list = (
    <ul className="space-y-1 text-sm">
      {entries.map((heading) => {
        const isActive = variant === "sidebar" && activeId === heading.id;
        return (
          <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              className={`block border-l-2 py-1 pl-3 transition-colors hover:text-primary ${
                isActive
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-text opacity-80 hover:opacity-100"
              }`}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "inline") {
    return (
      <details className="card mb-8 text-left xl:hidden">
        <summary className="cursor-pointer list-none font-bold">
          <span className="mr-2 text-primary">&#9662;</span>
          On this page
        </summary>
        <nav className="mt-3" aria-label="Article sections">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="Article sections">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide opacity-70">
        On this page
      </h2>
      {list}
    </nav>
  );
};

export default TableOfContents;
