import Link from "next/link";

// Two routes rather than one route with a sort parameter, so both orderings
// stay static and keep their own URLs.
//
// defaultLabel names whatever the section's own order is: posts are
// chronological, but exchanges and OG's are hand-ordered by influence via the
// `order` frontmatter field, and calling that "Latest" would be a lie.
const ListingTabs = ({ basePath, active, defaultLabel = "Latest" }) => (
  <div className="listing-tabs" role="navigation" aria-label="Sort order">
    <Link
      href={basePath}
      className="listing-tabs__tab"
      aria-current={active === "latest" ? "page" : undefined}
    >
      {defaultLabel}
    </Link>
    <Link
      href={`${basePath}/popular`}
      className="listing-tabs__tab"
      aria-current={active === "popular" ? "page" : undefined}
    >
      Most viewed
    </Link>
  </div>
);

export default ListingTabs;
