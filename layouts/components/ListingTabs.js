import Link from "next/link";

// "Latest" is the paginated, date-ordered listing; "Most viewed" is a single
// ranked page. Kept as two routes rather than one route with a sort parameter
// so both stay static and keep their own URLs.
const ListingTabs = ({ basePath, active }) => (
  <div className="listing-tabs" role="navigation" aria-label="Sort order">
    <Link
      href={basePath}
      className="listing-tabs__tab"
      aria-current={active === "latest" ? "page" : undefined}
    >
      Latest
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
