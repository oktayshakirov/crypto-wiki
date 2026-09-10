/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thecrypto.wiki",
      },
    ],
    // Each entry multiplies the optimized variants Vercel generates per source
    // image (billed as "Image Optimization - Transformations", a cap shared
    // with tinnitushelp.me on the same Vercel team). The content column tops
    // out around 800px; five steps up to a retina desktop hero is enough,
    // versus Next's eight defaults.
    deviceSizes: [400, 640, 828, 1200, 1920],
    formats: ["image/webp"],
    // Source images under /images/* are immutable, so there is no reason to
    // let optimized variants fall out of cache and be regenerated.
    minimumCacheTTL: 2678400, // 31 days
  },
  // Shrinking a feed's page size retires its highest pagination pages. Those
  // URLs are indexed, so they 301 to the feed's first page instead of turning
  // into the sort of 404 Ahrefs flags. Revisit whenever a page size changes.
  async redirects() {
    const retired = [
      ["/crypto-ogs", [6]],
      ["/crypto-ogs/latest", [6]],
      ["/crypto-ogs/popular", [6]],
      ["/videos", [2]],
    ];
    return retired.flatMap(([base, pages]) =>
      pages.map((page) => ({
        source: `${base}/page/${page}`,
        destination: base,
        permanent: true,
      }))
    );
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap/sitemap-index.xml",
      },
    ];
  },
};

module.exports = nextConfig;
