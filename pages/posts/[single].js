import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";
import config from "@config/config.json";

const { blog_folder } = config.settings;

const Article = ({
  post,
  mdxContent,
  posts,
  cryptoOgs,
  exchanges,
  slug,
  isApp,
}) => {
  return (
    <PostSingle
      post={{
        ...post[0],
        mdxContent,
      }}
      posts={posts}
      cryptoOgs={cryptoOgs}
      exchanges={exchanges}
      slug={slug}
      isApp={isApp}
    />
  );
};

export const getStaticPaths = () => {
  const posts = getSinglePage(`content/${blog_folder}`);
  const paths = posts.map((item) => ({
    params: {
      single: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const posts = getSinglePage(`content/${blog_folder}`);
  const post = posts.filter((post) => post.slug === single);
  const mdxContent = await parseMDX(post[0].content);

  // Get cryptoOGs
  const cryptoOgs = getSinglePage("content/crypto-ogs");

  // Get exchanges
  const exchanges = getSinglePage("content/exchanges");

  return {
    props: {
      post: post,
      mdxContent: mdxContent,
      posts: posts.map((post) => ({
        frontmatter: post.frontmatter,
        slug: post.slug,
      })),
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
      slug: single,
    },
  };
};

export default Article;
