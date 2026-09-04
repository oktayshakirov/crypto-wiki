import useScrollSpy from "@hooks/useScrollSpy";
import { FaListUl, FaChevronDown } from "react-icons/fa";

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
  // Hooks run unconditionally; the early return happens after.
  const activeId = useScrollSpy(variant === "sidebar" ? toc : null);

  if (!toc || toc.length < MIN_HEADINGS) return null;

  const list = (
    <ul className="space-y-1 text-sm">
      {toc.map((heading) => {
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
      <details className="group mb-8 text-left xl:hidden">
        <summary className="flex min-h-[44px] w-full cursor-pointer list-none items-center justify-between gap-2 rounded-lg border border-white/10 bg-theme-light px-3 py-2 text-dark transition hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          <span className="flex items-center gap-2">
            <FaListUl className="text-sm" />
            On this page
          </span>
          <FaChevronDown className="shrink-0 text-xs opacity-70 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <nav className="mt-3 px-1" aria-label="Article sections">
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
