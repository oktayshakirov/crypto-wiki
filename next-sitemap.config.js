module.exports = {
  siteUrl: "https://thecrypto.wiki",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/secret-page"], // Exclude specific pages (optional)
  // Define custom routes if necessary
  // transform: async (config, path) => {
  //   return {
  //     loc: path, // The path of the page
  //     changefreq: config.changefreq,
  //     priority: config.priority,
  //     lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  //     alternateRefs: [],
  //   }
  // },
};
