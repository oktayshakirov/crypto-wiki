// Last build step: turns `next build`'s out/ into what Cloudflare serves.
//
//  1. Copies the sitemaps and robots.txt that next-sitemap / fix-robots just
//     rewrote in public/ (next build copied public/ into out/ before they
//     ran, so out/ still holds the previous copies).
//  2. Renders the WebP variants lib/imageLoader.js points next/image at: one
//     per source image per configured width, under out/_img/. Results are
//     cached by content hash in .image-cache/ so rebuilds only render new or
//     changed images.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const nextConfig = require("../next.config.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "out");
const PUBLIC = path.join(ROOT, "public");
const CACHE = path.join(ROOT, ".image-cache");
const RASTER = /\.(jpe?g|png|webp)$/i;
const WIDTHS = [
  ...new Set([
    ...nextConfig.images.imageSizes,
    ...nextConfig.images.deviceSizes,
  ]),
].sort((a, b) => a - b);
const WEBP_QUALITY = 75;
const CONCURRENCY = 8;

function imageVariantPath(sourcePath, width) {
  // Must match lib/imageLoader.js.
  return `/_img${sourcePath.replace(RASTER, "")}-${width}.webp`;
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

async function mapLimit(items, limit, fn) {
  let next = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

function copySitemapsAndRobots() {
  const files = fs
    .readdirSync(PUBLIC)
    .filter((f) => /^sitemap.*\.xml$/.test(f) || f === "robots.txt");
  for (const file of ["sitemap.xml", "robots.txt"]) {
    if (!files.includes(file)) throw new Error(`public/${file} is missing`);
  }
  for (const file of files) {
    fs.copyFileSync(path.join(PUBLIC, file), path.join(OUT, file));
  }
  return files;
}

async function renderVariants() {
  // Every raster file in the export except Next's own fingerprinted assets.
  const sources = walk(OUT)
    .filter((file) => RASTER.test(file))
    .map((file) => "/" + path.relative(OUT, file).split(path.sep).join("/"))
    .filter((p) => !p.startsWith("/_next/") && !p.startsWith("/_img/"));

  let rendered = 0;
  await mapLimit(sources, CONCURRENCY, async (sourcePath) => {
    const input = fs.readFileSync(path.join(OUT, sourcePath));
    const hash = crypto.createHash("sha1").update(input).digest("hex");

    for (const width of WIDTHS) {
      const cached = path.join(CACHE, `${hash}-${width}.webp`);
      if (!fs.existsSync(cached)) {
        const tmp = `${cached}.${process.pid}.tmp`;
        await sharp(input, { failOn: "none" })
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: WEBP_QUALITY })
          .toFile(tmp);
        fs.renameSync(tmp, cached);
        rendered += 1;
      }
      const target = path.join(OUT, imageVariantPath(sourcePath, width));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(cached, target);
    }
  });

  console.log(
    `finalizeExport: ${sources.length} images x ${WIDTHS.length} widths ` +
      `(${rendered} rendered, the rest from .image-cache)`
  );
}

async function main() {
  if (!fs.existsSync(path.join(OUT, "index.html"))) {
    throw new Error("out/index.html is missing - run next build first");
  }
  fs.mkdirSync(CACHE, { recursive: true });
  const copied = copySitemapsAndRobots();
  console.log(`finalizeExport: copied ${copied.join(", ")}`);
  await renderVariants();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
