// Blocks until production is serving the content in this checkout.
//
// Pushing to main starts a Vercel build, and the build finishes some time
// before the production alias is promoted to it. Announcing a post in that gap
// is what used to send push notifications pointing at a 404.
//
// public/content-index.json ships inside the deployment, so the live copy is a
// direct statement of which commit production is currently serving. Once it
// lists everything this checkout has, the deploy carrying it is live.
const path = require("path");
const { SITE_URL, collectContent } = require("../lib/contentIndex");

// Generous enough for a slow build plus alias promotion; the job fails loudly
// rather than silently syncing against a stale deployment.
const TIMEOUT_MS = 10 * 60 * 1000;
const POLL_INTERVAL_MS = 15 * 1000;

const key = (item) => `${item.type}/${item.slug}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLiveKeys() {
  // Cache-bust so a CDN edge cannot hand back the previous deployment's copy.
  const response = await fetch(`${SITE_URL}/content-index.json?t=${Date.now()}`, {
    redirect: "follow",
    headers: { "Cache-Control": "no-cache" },
  });

  if (!response.ok) {
    throw new Error(`content-index.json returned HTTP ${response.status}`);
  }

  const body = await response.json();
  if (!Array.isArray(body.items)) {
    throw new Error("content-index.json has no items array");
  }

  return new Set(body.items.map(key));
}

async function main() {
  const expected = collectContent(path.join(__dirname, "..")).map(key);
  const deadline = Date.now() + TIMEOUT_MS;

  console.log(`Waiting for ${expected.length} item(s) to be live on ${SITE_URL}`);

  while (Date.now() < deadline) {
    try {
      const live = await fetchLiveKeys();
      const missing = expected.filter((item) => !live.has(item));

      if (missing.length === 0) {
        console.log("Production is serving this commit's content.");
        return;
      }

      console.log(
        `Not live yet - waiting on ${missing.length}: ${missing.slice(0, 3).join(", ")}`
      );
    } catch (error) {
      console.log(`${error.message} - retrying`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  console.error(
    "Timed out waiting for the deployment. Nothing was synced, so no notification was sent; re-run this job once the deploy is live."
  );
  process.exit(1);
}

main();
