module.exports = {
  siteUrl: "https://www.thecrypto.wiki",
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
      changefreq = "daily";
    } else if (/^\/[a-zA-Z0-9-]+$/.test(path)) {
      priority = 0.85;
      changefreq = "daily";
    } else if (
      path.startsWith("/tools") ||
      path.startsWith("/exchanges") ||
      path.startsWith("/crypto-ogs")
    ) {
      priority = 0.9;
      changefreq = "weekly";
    } else if (path.startsWith("/posts")) {
      priority = 0.95;
      changefreq = "weekly";
    } else if (path.startsWith("/categories")) {
      priority = 0.7;
      changefreq = "weekly";
    } else if (
      /^\/(tags|faq|privacy-policy|terms|about|contact|authors)$/.test(path)
    ) {
      priority = 0.4;
      changefreq = "weekly";
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
  },
};
