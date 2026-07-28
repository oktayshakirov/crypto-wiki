// Single definition of what content this site publishes, where each section
// lives on disk, which Firestore collection it feeds, and the URL its pages are
// served from.
//
// Three consumers share it, and they must never disagree:
//   - scripts/generateContentIndex.js -> public/content-index.json, the feed the
//     apps poll to discover new content
//   - scripts/syncContent.js          -> writes those entries into Firestore
//   - the URL a push notification links to (mirrored in each app's
//     functions/src/index.ts)
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const SITE_URL = "https://www.thecrypto.wiki";

const SECTIONS = [
  { dir: "content/posts", collection: "posts", urlPath: "/posts" },
  { dir: "content/exchanges", collection: "exchanges", urlPath: "/exchanges" },
  {
    dir: "content/crypto-ogs",
    collection: "crypto-ogs",
    urlPath: "/crypto-ogs",
  },
];

function parsePublishedAt(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Reads one section's published content.
 *
 * `root` is the repository root, so this works both from a script run at the
 * repo root and from a build step.
 */
function readSection(root, section) {
  const directory = path.join(root, section.dir);

  if (!fs.existsSync(directory)) {
    console.warn(`Skipping missing directory ${directory}`);
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((file) => /\.mdx?$/.test(file))
    // Section index files such as _index.mdx are not real content.
    .filter((file) => !file.startsWith("_"))
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(directory, file), "utf8")
      );

      if (!data || !data.title) {
        console.warn(`No title found in ${file}`);
        return null;
      }

      if (data.draft === true) {
        return null;
      }

      // contentParser lets frontmatter override the URL, so mirror that here.
      const slug = data.url
        ? data.url.replace(/^\//, "")
        : file.replace(/\.mdx?$/, "");
      const publishedAt = parsePublishedAt(data.date);

      return {
        type: section.collection,
        slug,
        title: data.title,
        url: `${SITE_URL}${section.urlPath}/${slug}`,
        date: publishedAt ? publishedAt.toISOString() : null,
      };
    })
    .filter(Boolean);
}

/** Every published item across every section. */
function collectContent(root) {
  return SECTIONS.flatMap((section) => readSection(root, section));
}

module.exports = { SITE_URL, SECTIONS, collectContent, parsePublishedAt };
