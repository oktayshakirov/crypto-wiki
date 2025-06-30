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
  //Todo: Fix for Single Post to not fetch all posts
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
  const allPosts = getSinglePage(`content/${blog_folder}`);
  const post = allPosts.filter((post) => post.slug === single);
  const mdxContent = await parseMDX(post[0].content);

  const referencedCryptoOgs = post[0].frontmatter["crypto-ogs"] || [];
  const referencedExchanges = post[0].frontmatter.exchanges || [];

  const cryptoOgs = getSinglePage("content/crypto-ogs")
    .filter((og) => referencedCryptoOgs.includes(og.frontmatter.title))
    .map((og) => ({
      frontmatter: {
        title: og.frontmatter.title,
        description: og.frontmatter.description,
        image: og.frontmatter.image,
      },
      slug: og.slug,
    }));

  const exchanges = getSinglePage("content/exchanges")
    .filter((exchange) =>
      referencedExchanges.includes(exchange.frontmatter.title)
    )
    .map((exchange) => ({
      frontmatter: {
        title: exchange.frontmatter.title,
        description: exchange.frontmatter.description,
        image: exchange.frontmatter.image,
      },
      slug: exchange.slug,
    }));

  const postsForNavigation = allPosts.map((post) => ({
    frontmatter: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      image: post.frontmatter.image,
      categories: post.frontmatter.categories,
      "crypto-ogs": post.frontmatter["crypto-ogs"] || [],
      exchanges: post.frontmatter.exchanges || [],
    },
    slug: post.slug,
  }));

  return {
    props: {
      post: post,
      mdxContent: mdxContent,
      posts: postsForNavigation,
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
      slug: single,
    },
  };
};

export default Article;
