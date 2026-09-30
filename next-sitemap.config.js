const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Per-URL lastmod, read from each page's own frontmatter.
//
// next-sitemap's autoLastmod stamps every URL with the build clock, which tells
// Google that all 200+ pages changed the moment the site deployed. That is a
// freshness claim the content does not support, and a sitemap that makes it for
// every URL is one Google learns to discount. So `updated` (falling back to
// `date`) is the only honest source: a page's lastmod moves when the page does.
//
// Listing pages have no frontmatter of their own, so they inherit the newest
// lastmod of the entries they list - which is exactly when their content last
// changed.
const CONTENT_TYPES = {
  posts: "posts",
  exchanges: "exchanges",
  "crypto-ogs": "crypto-ogs",
};

const contentLastmod = new Map();
const newestByType = new Map();

const toISO = (value) => {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

for (const [dir, urlSegment] of Object.entries(CONTENT_TYPES)) {
  const absolute = path.join(__dirname, "content", dir);
  if (!fs.existsSync(absolute)) continue;

  for (const file of fs.readdirSync(absolute)) {
    // `_index.mdx` carries the listing page's copy, not a page of its own.
    if (!file.endsWith(".mdx") || file.startsWith("_")) continue;

    const { data } = matter(fs.readFileSync(path.join(absolute, file), "utf8"));
    const stamp = toISO(data.updated) || toISO(data.date);
    if (!stamp) continue;

    const slug = file.replace(/\.mdx$/, "");
    contentLastmod.set(`/${urlSegment}/${slug}`, stamp);

    const newest = newestByType.get(urlSegment);
    if (!newest || stamp > newest) newestByType.set(urlSegment, stamp);
  }
}

// Static pages (about, faq, terms, ...) live at the content root.
const rootContent = path.join(__dirname, "content");
if (fs.existsSync(rootContent)) {
  for (const file of fs.readdirSync(rootContent)) {
    if (!file.endsWith(".mdx") || file.startsWith("_")) continue;
    const { data } = matter(fs.readFileSync(path.join(rootContent, file), "utf8"));
    const stamp = toISO(data.updated) || toISO(data.date);
    if (stamp) contentLastmod.set(`/${file.replace(/\.mdx$/, "")}`, stamp);
  }
}

// Videos are registered in json/videos.json rather than as MDX.
let newestVideo = null;
try {
  const registry = JSON.parse(
    fs.readFileSync(path.join(__dirname, "json/videos.json"), "utf8")
  );
  const videos = Array.isArray(registry) ? registry : registry.videos || [];
  for (const video of videos) {
    const stamp = toISO(video.updated) || toISO(video.uploadDate);
    if (!stamp) continue;
    contentLastmod.set(`/videos/${video.slug}`, stamp);
    if (!newestVideo || stamp > newestVideo) newestVideo = stamp;
  }
} catch {
  // A missing or malformed registry must not fail the sitemap build.
}
if (newestVideo) newestByType.set("videos", newestVideo);

const newestOverall = [...newestByType.values()].sort().pop() || null;

// A listing or taxonomy URL is only as fresh as the newest thing it lists.
const listingLastmod = (urlPath) => {
  const [, head] = urlPath.split("/");
  // Only the hubs that actually list entries inherit a date. A taxonomy page
  // whose type we do not track gets nothing rather than a borrowed date.
  if (urlPath === "/") return newestOverall;
  return newestByType.get(head) || null;
};

// Pages with no date of their own - the static MDX pages, the hand-written
// tool pages - return undefined, which omits lastmod for that URL. An absent
// lastmod reads as "unknown", which is true; borrowing the newest date on the
// site would be the same false freshness claim as stamping the build clock.
const lastmodFor = (urlPath) =>
  contentLastmod.get(urlPath) || listingLastmod(urlPath) || undefined;

module.exports = {
  siteUrl: "https://www.thecrypto.wiki",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  // lastmod comes from each page's frontmatter via lastmodFor(), not the
  // build clock. See the top of this file.
  autoLastmod: false,
  exclude: [],

  transform: async (config, path) => {
    if (
      path.match(/\/page\/\d+/) ||
      path.startsWith("/search") ||
      // Embeddable widget renderings are noindex and canonical to the real
      // tool pages, so they must not be submitted in the sitemap.
      path.startsWith("/embed") ||
      // The Impressum carries the operator's postal address. It stays linked
      // and crawlable as § 5 DDG requires, but is noindex and not submitted.
      path === "/impressum"
    ) {
      return null;
    }

    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/") {
      priority = 1.0;
      changefreq = "daily";
    } else if (/^\/tools(\/.+)?$/.test(path)) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (/^\/videos(\/.+)?$/.test(path)) {
      // The only pages here whose main content is video, so they are the ones
      // worth submitting eagerly. Without this branch /videos/<slug> falls
      // through to the config default rather than the single-segment rule.
      priority = 0.8;
      changefreq = "weekly";
    } else if (/^\/(exchanges|crypto-ogs)(\/.+)?$/.test(path)) {
      priority = 0.9;
      changefreq = "weekly";
      if (path.includes("/page/1")) {
        path = path.replace("/page/1", "");
      }
    } else if (path.startsWith("/posts")) {
      priority = 0.95;
      changefreq = "weekly";
      if (path.includes("/page/1")) {
        path = path.replace("/page/1", "");
      }
    } else if (/^\/categories(\/.+)?$/.test(path)) {
      priority = 0.7;
      changefreq = "weekly";
    } else if (/^\/[a-zA-Z0-9-]+$/.test(path)) {
      priority = 0.8;
      changefreq = "weekly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: lastmodFor(path),
      alternateRefs: [],
    };
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search/"],
      },
    ],
  },
};
