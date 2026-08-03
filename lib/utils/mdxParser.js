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

export default parseMDX;
