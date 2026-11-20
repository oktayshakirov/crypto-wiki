// next/image loader for the static export.
//
// Points each requested width at a WebP variant that scripts/finalizeExport.js
// renders at build time: /images/posts/x.jpg at 640px ->
// /_img/images/posts/x-640.webp. The variant names must match
// imageVariantPath() in that script.
//
// Left untouched: remote images, SVGs, and static imports (/_next/static/...),
// which are already fingerprinted files. In development there are no
// variants, so the original file is served.
const SITE = "https://www.thecrypto.wiki";
const RASTER = /\.(jpe?g|png|webp)$/i;

export default function imageLoader({ src, width }) {
  const path = src.startsWith(SITE + "/") ? src.slice(SITE.length) : src;

  if (
    !path.startsWith("/") ||
    path.startsWith("/_next/") ||
    !RASTER.test(path)
  ) {
    return src;
  }

  if (process.env.NODE_ENV !== "production") {
    return `${path}?w=${width}`;
  }

  return `/_img${path.replace(RASTER, "")}-${width}.webp`;
}
