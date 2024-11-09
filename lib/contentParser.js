import fs from "fs";
import matter from "gray-matter";
import path from "path";
import parseMDX from "./utils/mdxParser";
import { sortByDate, sortByOrder } from "./utils/sortFunctions";

export const getListPage = async (filePath) => {
  const pageData = fs.readFileSync(path.join(filePath), "utf-8");
  const pageDataParsed = matter(pageData);
  const notFoundPage = fs.readFileSync(path.join("content/404.mdx"), "utf-8");
  const notFoundDataParsed = matter(notFoundPage);
  let frontmatter, content;

  if (pageDataParsed) {
    content = pageDataParsed.content;
    frontmatter = pageDataParsed.data;
  } else {
    content = notFoundDataParsed.content;
    frontmatter = notFoundDataParsed.data;
  }
  const mdxContent = await parseMDX(content);

  return {
    frontmatter,
    content,
    mdxContent,
  };
};

export const getSinglePage = (folder) => {
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
    return { frontmatter: frontmatter, slug: url, content: content };
  });

  const publishedPages = singlePages.filter(
    (page) => !page.frontmatter.draft && page.frontmatter.layout !== "404"
  );

  let sortedPages;
  if (
    folder.includes("crypto-ogs") ||
    folder.includes("exchanges") ||
    folder.includes("authors")
  ) {
    sortedPages = sortByOrder(publishedPages);
  } else {
    sortedPages = sortByDate(publishedPages);
  }

  return sortedPages;
};

export const getRegularPage = async (slug) => {
  let frontmatter, content;
  const publishedPages = getSinglePage("content/posts");
  const regularPage = getSinglePage("content");

  if (publishedPages.some((page) => page.slug === slug)) {
    const pageData = publishedPages.find((data) => data.slug === slug);
    content = pageData.content;
    frontmatter = pageData.frontmatter;
  } else if (regularPage.some((page) => page.slug === slug)) {
    const regulerData = regularPage.find((data) => data.slug === slug);
    content = regulerData.content;
    frontmatter = regulerData.frontmatter;
  } else {
    const notFoundPage = fs.readFileSync(path.join("content/404.mdx"), "utf-8");
    const notFoundDataParsed = matter(notFoundPage);
    content = notFoundDataParsed.content;
    frontmatter = notFoundDataParsed.data;
  }

  const mdxContent = await parseMDX(content);

  return {
    frontmatter,
    content,
    mdxContent,
  };
};
