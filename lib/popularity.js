// Reads the build-time view snapshot (see scripts/generateViews.js) and ranks
// content by it. Import this only from getStaticProps - the snapshot is a build
// artefact, not something to ship to the browser.
import views from "../json/views.json";

// How many items a "Most viewed" listing shows. Enough to be worth a visit,
// short enough that the page needs no pagination of its own.
export const POPULAR_LIMIT = 12;

export function viewCount(type, slug) {
  return views.counts[`${type}/${slug}`] || 0;
}

/**
 * Most viewed first. Ties - including the all-zero case on a site whose
 * snapshot is empty - keep the order they came in with, which is the caller's
 * date ordering.
 */
export function rankByViews(items, type, limit = POPULAR_LIMIT) {
  return items
    .map((item, index) => ({ item, index, count: viewCount(type, item.slug) }))
    .sort((a, b) => b.count - a.count || a.index - b.index)
    .slice(0, limit)
    .map(({ item, count }) => ({ ...item, views: count }));
}

export const snapshotGeneratedAt = views.generatedAt || null;
