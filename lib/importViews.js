const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { slug } = require("github-slugger");

function getSinglePage(folder) {
  const filesPath = fs.readdirSync(path.join(folder));
  const sanitizeFiles = filesPath.filter(
    (file) => file.endsWith(".md") || file.endsWith(".mdx")
  );
  const filterSingleFiles = sanitizeFiles.filter(
    (file) => !file.startsWith("_")
  );
  const singlePages = filterSingleFiles.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const pageData = fs.readFileSync(path.join(folder, filename), "utf-8");
    const pageDataParsed = matter(pageData);
    const frontmatterString = JSON.stringify(pageDataParsed.data);
    const frontmatter = JSON.parse(frontmatterString);
    const content = pageDataParsed.content;
    const url = frontmatter.url ? frontmatter.url.replace("/", "") : slug;
    return {
      frontmatter: frontmatter,
      slug: url,
      content: content,
    };
  });

  const publishedPages = singlePages.filter(
    (page) => !page.frontmatter.draft && page.frontmatter.layout !== "404"
  );

  return publishedPages;
}

function normalizeTitle(title) {
  return title
    .replace(/\s*\|\s*Crypto Wiki\s*/gi, "")
    .replace(/\s*\|\s*In-Depth Exchange Analysis\s*- Crypto Wiki\s*/gi, "")
    .replace(/\s*\|\s*Achievements, Contributions & Impact\s*- Crypto Wiki\s*/gi, "")
    .replace(/\s*\|\s*Contributions & Impact in the Crypto Space\s*- Crypto Wiki\s*/gi, "")
    .replace(/\s*\|\s*Pioneers & Visionaries of the Crypto World\s*- Crypto Wiki\s*/gi, "")
    .replace(/\s*\|\s*Reviews & Ratings\s*- Crypto Wiki\s*/gi, "")
    .trim();
}

function slugifyTitle(title) {
  return slug(title);
}

function parseCSV(csvPath) {
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(/^"?(.+?)"?\s*,\s*(\d+)/);
    if (match) {
      const title = match[1].replace(/^"|"$/g, "");
      const views = parseInt(match[2], 10);
      if (title && !isNaN(views)) {
        data.push({ title, views });
      }
    }
  }

  return data;
}

function matchTitleToContent(csvTitle, contentItems) {
  const normalizedCSV = normalizeTitle(csvTitle);
  const csvSlug = slugifyTitle(normalizedCSV);

  for (const item of contentItems) {
    const itemTitle = item.frontmatter.title;
    const normalizedItem = normalizeTitle(itemTitle);
    const itemSlug = slugifyTitle(normalizedItem);

    if (
      csvSlug === itemSlug ||
      normalizedCSV.toLowerCase() === normalizedItem.toLowerCase() ||
      csvTitle.toLowerCase().includes(itemTitle.toLowerCase()) ||
      itemTitle.toLowerCase().includes(normalizedCSV.toLowerCase())
    ) {
      return item;
    }
  }

  return null;
}

function importViews() {
  const csvPath = path.join(process.cwd(), "data", "Pages_and_screens_Page_title_and_screen_class.csv");
  const viewsPath = path.join(process.cwd(), "data", "views.json");

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    return;
  }

  const posts = getSinglePage("content/posts");
  const exchanges = getSinglePage("content/exchanges");
  const cryptoOgs = getSinglePage("content/crypto-ogs");

  console.log(`Found ${posts.length} posts, ${exchanges.length} exchanges, ${cryptoOgs.length} crypto-ogs`);

  const csvData = parseCSV(csvPath);
  console.log(`Parsed ${csvData.length} rows from CSV`);

  const views = {};
  const matchLog = [];
  let matched = 0;
  let unmatched = 0;

  for (const row of csvData) {
    let matchedItem = null;
    let type = null;

    matchedItem = matchTitleToContent(row.title, posts);
    if (matchedItem) {
      type = "posts";
    } else {
      matchedItem = matchTitleToContent(row.title, exchanges);
      if (matchedItem) {
        type = "exchanges";
      } else {
        matchedItem = matchTitleToContent(row.title, cryptoOgs);
        if (matchedItem) {
          type = "crypto-ogs";
        }
      }
    }

    if (matchedItem && type) {
      const viewKey = `${type}/${matchedItem.slug}`;
      if (!views[viewKey] || views[viewKey] < row.views) {
        views[viewKey] = row.views;
      }
      matched++;
      matchLog.push(`✓ Matched: "${row.title}" -> ${viewKey} (${row.views} views)`);
    } else {
      unmatched++;
      if (unmatched <= 20) {
        matchLog.push(`✗ Unmatched: "${row.title}" (${row.views} views)`);
      }
    }
  }

  matchLog.forEach((log) => console.log(log));

  console.log(`\nMatched: ${matched}, Unmatched: ${unmatched}`);

  if (fs.existsSync(viewsPath)) {
    const existingViews = JSON.parse(fs.readFileSync(viewsPath, "utf-8"));
    Object.assign(existingViews, views);
    fs.writeFileSync(viewsPath, JSON.stringify(existingViews, null, 2), "utf8");
    console.log(`\nUpdated views.json with ${Object.keys(views).length} entries`);
  } else {
    fs.writeFileSync(viewsPath, JSON.stringify(views, null, 2), "utf8");
    console.log(`\nCreated views.json with ${Object.keys(views).length} entries`);
  }
}

if (require.main === module) {
  importViews();
}

module.exports = importViews;
