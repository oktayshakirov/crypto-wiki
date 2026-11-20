/** @type {import('next').NextConfig} */
const nextConfig = {
  // The whole site is prerendered (every getStaticPaths uses fallback: false),
  // so it ships as plain files in out/ and Cloudflare serves them as static
  // assets - free and unmetered, unlike Vercel's ISR reads. The only dynamic
  // endpoint (the view counter) lives in worker/index.js.
  //
  // Static export ignores redirects() and headers(), so they live in
  // public/_redirects and public/_headers. Add new 301s there.
  output: "export",
  reactStrictMode: true,
  images: {
    // No image optimizer at request time. The loader points next/image at
    // WebP variants that scripts/finalizeExport.js renders once per build into
    // out/_img/. Every width listed here gets a variant for every source
    // image. The content column tops out around 800px; five device steps up
    // to a retina desktop hero is enough. imageSizes is Next's default list,
    // spelled out because finalizeExport reads it.
    loader: "custom",
    loaderFile: "./lib/imageLoader.js",
    deviceSizes: [400, 640, 828, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = nextConfig;
