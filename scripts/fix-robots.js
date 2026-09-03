/**
 * next-sitemap (every version through at least 4.2.3) unconditionally appends a
 *
 *   # Host
 *   Host: <siteUrl>
 *
 * block to robots.txt. `Host:` is a Yandex-only directive that Google and Bing
 * ignore; Search Console flags it as "Rule ignored by Googlebot". There is no
 * config switch to disable it, so strip it here as the last build step.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "public", "robots.txt");

const cleaned = fs
  .readFileSync(file, "utf8")
  .split("\n")
  .filter((line) => {
    const t = line.trim();
    return t !== "# Host" && !/^Host:/i.test(t);
  })
  .join("\n")
  .replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(file, cleaned);
console.log("fix-robots: stripped the Host directive from public/robots.txt");
