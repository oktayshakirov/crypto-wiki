// Guards the view-count write endpoint.
//
// Two problems it solves. Any (type, slug) pair used to reach Firestore, so a
// caller could invent keys and grow the views collection without bound. And
// nothing capped how fast one caller could increment, so a loop against the
// endpoint burned write quota freely.
import contentIndex from "../public/content-index.json";

// Built once per warm lambda from the same index the apps poll, so it stays in
// step with what the site actually publishes - drafts and _index files are
// already excluded there.
const publishedKeys = new Set(
  contentIndex.items.map((item) => `${item.type}/${item.slug}`)
);

const WINDOW_MS = 60_000;
const MAX_WRITES_PER_WINDOW = 30;
// Prune only when the map has grown, rather than on a timer, so an idle
// instance does nothing.
const PRUNE_THRESHOLD = 5000;

const hits = new Map();

export function isPublished(type, slug) {
  return publishedKeys.has(`${type}/${slug}`);
}

export function clientKey(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

/**
 * Per-instance counter. Serverless spreads traffic over several instances, so
 * this is a ceiling per instance rather than a global one - enough to stop a
 * naive loop without standing up a shared store for it.
 */
export function isRateLimited(key, now = Date.now()) {
  if (hits.size > PRUNE_THRESHOLD) {
    for (const [existing, entry] of hits) {
      if (now >= entry.resetAt) hits.delete(existing);
    }
  }

  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_WRITES_PER_WINDOW;
}

export const limits = { WINDOW_MS, MAX_WRITES_PER_WINDOW };
