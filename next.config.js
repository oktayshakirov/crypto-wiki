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
