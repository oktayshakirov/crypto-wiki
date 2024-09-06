import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";

// post single layout
const Article = ({ post, mdxContent }) => {
  const { frontmatter, content } = post[0];

  return (
    <PostSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
    />
  );
};

// get posts single slug
export const getStaticPaths = () => {
  const allSlug = getSinglePage("content/posts");
  const paths = allSlug.map((item) => ({
    params: {
      single: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

// get posts single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const getPosts = getSinglePage("content/posts");
  const post = getPosts.filter((post) => post.slug == single);
  const mdxContent = await parseMDX(post[0].content);

  return {
    props: {
      post: post,
      mdxContent: mdxContent,
      slug: single,
    },
  };
};

export default Article;
