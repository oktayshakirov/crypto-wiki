import { serialize } from "next-mdx-remote/serialize";

/**
 * Parse MDX content for next-mdx-remote v6.
 * remark-gfm and rehype-slug are omitted: they trigger "this.getData is not a function"
 * with the MDX 3 pipeline. Basic Markdown (bold, links, lists, etc.) works without them.
 */
const parseMDX = async (content) => {
  return await serialize(content);
};

export default parseMDX;
