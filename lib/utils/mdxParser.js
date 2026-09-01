import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

/**
 * Parse MDX content for next-mdx-remote v6.
 * remark-gfm gives us tables, strikethrough and autolinks; rehype-slug puts
 * ids on headings so in-page anchors work. Both need versions built for the
 * MDX 3 pipeline (gfm v4+, slug v6+) - older ones fail with
 * "this.getData is not a function".
 */
const parseMDX = async (content) => {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    },
  });
};

/**
 * Walks the rendered hast tree and records h2/h3 headings into `toc`.
 *
 * This has to run *after* rehype-slug and read the same tree it wrote, because
 * rehype-slug slugs the rendered text: `## What is **DeFi**?` becomes
 * `what-is-defi`. Re-deriving the slugs from the raw markdown instead would
 * drift on any heading containing bold, links or inline code - and drift
 * silently, producing anchors that point nowhere. github-slugger's duplicate
 * counter is stateful too, so a second pass would have to reproduce the exact
 * heading sequence to keep `-1` suffixes aligned.
 *
 * Headings emitted by JSX components in MDX arrive as `mdxJsxFlowElement`, not
 * `element`, so rehype-slug skips them and so does this - which is what we
 * want: no id, no table-of-contents entry.
 */
const collectHeadings = (toc) => () => (tree) => {
  const textOf = (node) =>
    node.type === "text"
      ? node.value
      : (node.children || []).map(textOf).join("");

  const walk = (node) => {
    if (
      node.type === "element" &&
      (node.tagName === "h2" || node.tagName === "h3") &&
      node.properties?.id
    ) {
      toc.push({
        id: String(node.properties.id),
        text: textOf(node).trim(),
        level: Number(node.tagName.slice(1)),
      });
    }
    (node.children || []).forEach(walk);
  };

  walk(tree);
};

/**
 * As parseMDX, but also returns the article's h2/h3 outline for the table of
 * contents. Separate entry point so the exchange/OG/author layouts keep using
 * the plain parser and pay nothing for a tree walk they do not need.
 */
export const parseMDXWithHeadings = async (content) => {
  const toc = [];
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug, collectHeadings(toc)],
    },
  });
  return { mdxSource, toc };
};

export default parseMDX;
