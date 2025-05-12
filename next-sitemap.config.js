module.exports = {
  siteUrl: "https://www.thecrypto.wiki",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,

  transform: async (config, path) => {
    if (path.match(/\/page\/\d+/)) {
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
    } else if (/^\/[a-zA-Z0-9-]+$/.test(path)) {
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
        disallow: ["/search/", "/authors"],
      },
    ],
  },
};
