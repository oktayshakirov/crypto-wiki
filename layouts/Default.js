import { markdownify } from "@lib/utils/textConverter";
import { MDXRemote } from "next-mdx-remote";

const Default = ({ data }) => {
  const { frontmatter, mdxContent } = data;
  const { title } = frontmatter;
  return (
    <section className="section">
      <div className="container">
        {markdownify(title, "h1", "h1 mb-8 text-center")}
        <div className="content">
          <MDXRemote {...mdxContent} />
        </div>
      </div>
    </section>
  );
};

export default Default;
