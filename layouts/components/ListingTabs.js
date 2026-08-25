import Link from "next/link";

// Sort orders as separate static routes rather than one route with a query
// parameter, so each ordering stays static and keeps its own URL.
//
// The first tab is whatever order the section itself is stored in:
// posts are chronological, but exchanges and OG's are hand-ordered by
// influence via the `order` frontmatter field, so there it is "Featured" and
// a separate "Latest" tab re-sorts the same set by date.
const ListingTabs = ({
  basePath,
  active,
  defaultLabel = "Latest",
  hasLatest = false,
}) => {
  const tabs = [
    { key: "default", label: defaultLabel, href: basePath },
    ...(hasLatest
      ? [{ key: "latest", label: "Latest", href: `${basePath}/latest` }]
      : []),
    { key: "popular", label: "Most popular", href: `${basePath}/popular` },
  ];

  return (
    <div className="listing-tabs" role="navigation" aria-label="Sort order">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className="listing-tabs__tab"
          aria-current={active === tab.key ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
};

export default ListingTabs;
