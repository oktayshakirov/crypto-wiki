import config from "@config/config.json";

const { base_url } = config.site;

/**
 * Canonical URL for one page of a paginated listing.
 *
 * Page 1 canonicalises to the bare listing URL, because /posts and
 * /posts/page/1 are the same page under two URLs. Every deeper page is
 * self-canonical: pointing page 2 at page 1 is a canonical to different
 * content, which Google treats as a hint it can ignore, and it discounts the
 * links to the items that only appear on that page.
 */
export const paginatedCanonical = (basePath, currentPage) =>
  currentPage > 1
    ? `${base_url}${basePath}/page/${currentPage}`
    : `${base_url}${basePath}`;

/**
 * Titles and descriptions for one page of a paginated listing.
 *
 * Every page of a sequence otherwise ships the same title and description,
 * which reads as a set of duplicates. The page number disambiguates them
 * without inventing copy per page. It goes in ahead of the site name rather
 * than after it, so the brand stays at the end where every other title on the
 * site keeps it.
 */
const BRAND_SUFFIX = /\s*[-|]\s*Crypto Wiki\s*$/;

export const paginatedTitle = (title, currentPage) => {
  if (currentPage <= 1) return title;

  const brand = title.match(BRAND_SUFFIX);
  return brand
    ? `${title.slice(0, brand.index)} - Page ${currentPage}${brand[0]}`
    : `${title} - Page ${currentPage}`;
};

export const paginatedDescription = (description, currentPage) =>
  currentPage > 1 ? `${description} (Page ${currentPage})` : description;

/**
 * Robots directive for a listing that re-sorts a set the site already
 * publishes in full elsewhere (the "most popular" tabs).
 *
 * Page 1 of such a listing is a genuine curated top list and stays indexable.
 * Its deeper pages are the same items as the main archive in a different
 * order and carry nothing unique, so they are kept out of the index while
 * staying crawlable, so the links on them are still followed through to the
 * articles.
 */
export const sortedListingRobots = (currentPage) =>
  currentPage > 1 ? "noindex,follow" : undefined;
