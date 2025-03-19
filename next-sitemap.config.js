module.exports = {
  siteUrl: "https://www.thecrypto.wiki",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,

  transform: async (config, path) => {
    // Completely exclude certain pages from sitemap
    const excludePaths = [
      "/contact",
      "/faq",
      "/privacy-policy",
      "/terms",
      "/affiliate-disclosure",
      "/advertising",
      "/search",
      "/tags",
      "/authors",
    ];

    if (excludePaths.some((excludedPath) => path.startsWith(excludedPath))) {
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
    } else if (/^\/authors(\/.+)?$/.test(path)) {
      priority = 0.6;
      changefreq = "weekly";
    } else if (/^\/[a-zA-Z0-9-]+$/.test(path)) {
      // For individual pages like /app, /about, etc.
      priority = 0.8;
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
        disallow: [
          "/tags/",
          "/search/",
          "/contact",
          "/faq",
          "/privacy-policy",
          "/terms",
          "/affiliate-disclosure",
          "/advertising",
          "/authors",
        ],
      },
    ],
  },
};
