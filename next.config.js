/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thecrypto.wiki",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*).(png|jpg|jpeg|svg|js|css|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
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
