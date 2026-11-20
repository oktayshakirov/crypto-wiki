// The only code that runs per request on thecrypto.wiki. Everything else is a
// static file from out/, served by Cloudflare without invoking this Worker
// (see run_worker_first in wrangler.jsonc).
//
//   /api/views/:type/:slug   GET the count / POST to add a view (Firestore)
//   /any/path/               trailing slash -> /any/path (308)
//
// The view counter talks to Firestore's REST API with the same service
// account the build uses. firebase-admin does not run on Workers, so the
// OAuth token is minted here (RS256 JWT via WebCrypto) and cached per isolate.
import contentIndex from "../public/content-index.json";

const FIRESTORE = "https://firestore.googleapis.com/v1";
const VIEWS_CACHE_SECONDS = 60;

// Only content the site actually publishes can be counted: an unknown key can
// only ever answer 0, and accepting any key would let a caller grow the views
// collection without bound. The counter's type is the content-index type
// (posts, exchanges, crypto-ogs).
const publishedKeys = new Set(
  contentIndex.items.map((item) => `${item.type}/${item.slug}`)
);

function isPublished(type, slug) {
  return publishedKeys.has(`${type}/${slug}`);
}

// Per-isolate write limit, as on Vercel: a ceiling per instance rather than a
// global one, enough to stop a naive loop from burning Firestore writes.
const WINDOW_MS = 60_000;
const MAX_WRITES_PER_WINDOW = 30;
const hits = new Map();

function isRateLimited(key, now = Date.now()) {
  if (hits.size > 5000) {
    for (const [k, entry] of hits) if (now >= entry.resetAt) hits.delete(k);
  }
  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_WRITES_PER_WINDOW;
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

// --- Google OAuth for the service account --------------------------------

let cachedToken = null; // { value, expiresAt }

function base64url(input) {
  const bytes =
    typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const b of new Uint8Array(bytes)) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function pemToDer(pem) {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(body);
  const der = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) der[i] = binary.charCodeAt(i);
  return der.buffer;
}

async function getAccessToken(env) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: env.FIREBASE_CLIENT_EMAIL,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(env.FIREBASE_PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${claims}`)
  );

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${base64url(signature)}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`token exchange failed: HTTP ${response.status}`);
  }
  const { access_token, expires_in } = await response.json();
  cachedToken = { value: access_token, expiresAt: now + expires_in };
  return access_token;
}

// --- Firestore ------------------------------------------------------------

function docName(env, viewKey) {
  return `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/views/${viewKey}`;
}

function toNumber(value) {
  if (!value) return 0;
  return Number(value.integerValue ?? value.doubleValue ?? 0);
}

async function readCount(env, viewKey) {
  const token = await getAccessToken(env);
  const response = await fetch(`${FIRESTORE}/${docName(env, viewKey)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return 0;
  if (!response.ok) throw new Error(`Firestore get: HTTP ${response.status}`);
  const doc = await response.json();
  return toNumber(doc.fields?.count);
}

// One commit both increments and returns the new count (the transform
// result), so a view costs one write and no read. Same document shape the
// firebase-admin version wrote: count, type, slug, lastUpdated.
async function incrementCount(env, viewKey, type, slug) {
  const token = await getAccessToken(env);
  const response = await fetch(
    `${FIRESTORE}/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents:commit`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        writes: [
          {
            update: {
              name: docName(env, viewKey),
              fields: {
                type: { stringValue: type },
                slug: { stringValue: slug },
              },
            },
            updateMask: { fieldPaths: ["type", "slug"] },
            updateTransforms: [
              { fieldPath: "count", increment: { integerValue: "1" } },
              { fieldPath: "lastUpdated", setToServerValue: "REQUEST_TIME" },
            ],
          },
        ],
      }),
    }
  );
  if (!response.ok)
    throw new Error(`Firestore commit: HTTP ${response.status}`);
  const result = await response.json();
  return toNumber(result.writeResults?.[0]?.transformResults?.[0]);
}

async function handleViews(request, env, ctx, type, slug) {
  if (!isPublished(type, slug)) {
    return json({ error: "Unknown content" }, 404);
  }
  const viewKey = `${type}_${slug}`;

  if (request.method === "GET") {
    // Served from Cloudflare's cache for a minute at a time: read volume
    // scales with traffic, and a count up to a minute stale looks the same.
    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).toString(), {
      method: "GET",
    });
    const hit = await cache.match(cacheKey);
    if (hit) return hit;

    const views = await readCount(env, viewKey);
    const response = json({ views }, 200, {
      "Cache-Control": `public, max-age=0, s-maxage=${VIEWS_CACHE_SECONDS}`,
    });
    ctx.waitUntil(
      cache.put(
        cacheKey,
        json({ views }, 200, {
          "Cache-Control": `public, max-age=${VIEWS_CACHE_SECONDS}`,
        })
      )
    );
    return response;
  }

  if (request.method === "POST") {
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) return json({ error: "Too many requests" }, 429);
    const views = await incrementCount(env, viewKey, type, slug);
    return json({ views }, 200, { "Cache-Control": "no-store" });
  }

  return json({ error: "Method not allowed" }, 405, { Allow: "GET, POST" });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Canonical URLs have no trailing slash. A permanent 308, like Vercel,
    // rather than the assets layer's temporary 307.
    if (pathname.length > 1 && pathname.endsWith("/")) {
      return Response.redirect(
        `${url.origin}${pathname.replace(/\/+$/, "")}${url.search}`,
        308
      );
    }

    try {
      const views = pathname.match(/^\/api\/views\/([^/]+)\/([^/]+)\/?$/);
      if (views) {
        return await handleViews(
          request,
          env,
          ctx,
          decodeURIComponent(views[1]),
          decodeURIComponent(views[2])
        );
      }
    } catch (error) {
      console.error("api error:", error);
      return json({ error: "Internal server error" }, 500);
    }

    if (pathname.startsWith("/api/")) {
      return json({ error: "Not found" }, 404);
    }
    return env.ASSETS.fetch(request);
  },
};
