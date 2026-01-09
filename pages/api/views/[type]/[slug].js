import fs from "fs";
import path from "path";

const viewsFilePath = path.join(process.cwd(), "data", "views.json");

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(viewsFilePath)) {
  fs.writeFileSync(viewsFilePath, JSON.stringify({}), "utf8");
}

function getViews() {
  try {
    const data = fs.readFileSync(viewsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function saveViews(views) {
  fs.writeFileSync(viewsFilePath, JSON.stringify(views, null, 2), "utf8");
}

function getViewKey(type, slug) {
  return `${type}/${slug}`;
}

export default function handler(req, res) {
  const { type, slug } = req.query;

  if (!type || !slug) {
    return res.status(400).json({ error: "Type and slug are required" });
  }

  const viewKey = getViewKey(type, slug);
  const views = getViews();

  if (req.method === "GET") {
    const count = views[viewKey] || 0;
    return res.status(200).json({ views: count });
  } else if (req.method === "POST") {
    views[viewKey] = (views[viewKey] || 0) + 1;
    saveViews(views);
    return res.status(200).json({ views: views[viewKey] });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
