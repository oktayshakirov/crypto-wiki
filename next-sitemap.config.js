module.exports = {
  siteUrl: "https://thecrypto.wiki",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,

  transform: async (config, path) => {
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === "/") {
      priority = 1.0;
    } else if (path.startsWith("/blog")) {
      changefreq = "daily";
      priority = 0.8;
    } else if (path.startsWith("/tools")) {
      priority = 0.9;
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: ["https://thecrypto.wiki/sitemap.xml"],
  },
};
