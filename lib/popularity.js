// Reads the build-time view snapshot (see scripts/generateViews.js) and ranks
// content by it. Import this only from getStaticProps - the snapshot is a build
// artefact, not something to ship to the browser.
import views from "../json/views.json";

export function viewCount(type, slug) {
  return views.counts[`${type}/${slug}`] || 0;
}

/**
 * Every item, most viewed first. Ties - including the all-zero case on a site
 * whose snapshot is empty - keep the order they came in with, which is the
 * caller's date ordering. Paginating is the caller's job, same as the
 * date-ordered listings.
 */
export function rankByViews(items, type) {
  return items
    .map((item, index) => ({ item, index, count: viewCount(type, item.slug) }))
    .sort((a, b) => b.count - a.count || a.index - b.index)
    .map(({ item, count }) => ({ ...item, views: count }));
}

export const snapshotGeneratedAt = views.generatedAt || null;
