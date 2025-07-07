import PostSingle from "@layouts/PostSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";
import config from "@config/config.json";
import similerItems from "@lib/utils/similarItems";

const { blog_folder } = config.settings;

const Article = ({
  post,
  mdxContent,
  prevPost,
  nextPost,
  cryptoOgs,
  exchanges,
  slug,
  isApp,
  similarPosts,
}) => {
  return (
    <PostSingle
      post={{
        ...post,
        mdxContent,
      }}
      prevPost={prevPost}
      nextPost={nextPost}
      cryptoOgs={cryptoOgs}
      exchanges={exchanges}
      slug={slug}
      isApp={isApp}
      similarPosts={similarPosts}
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
  const allPosts = getSinglePage(`content/${blog_folder}`) || [];
  const post = allPosts.filter((post) => post.slug === single);
  if (!post[0]) {
    return { notFound: true };
  }
  const mdxContent = await parseMDX(post[0].content);

  const referencedCryptoOgs = post[0].frontmatter["crypto-ogs"] || [];
  const referencedExchanges = post[0].frontmatter.exchanges || [];

  const allCryptoOgs = getSinglePage("content/crypto-ogs") || [];
  const cryptoOgs = allCryptoOgs
    .filter((og) => referencedCryptoOgs.includes(og.frontmatter.title))
    .map((og) => ({
      frontmatter: {
        title: og.frontmatter.title,
        description: og.frontmatter.description,
        image: og.frontmatter.image,
      },
      slug: og.slug,
    }));

  const allExchanges = getSinglePage("content/exchanges") || [];
  const exchanges = allExchanges
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

  const currentIndex = allPosts.findIndex((p) => p.slug === single);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const formatPost = (post) =>
    post
      ? {
          frontmatter: {
            title: post.frontmatter.title,
            description: post.frontmatter.description,
            image: post.frontmatter.image,
            categories: post.frontmatter.categories,
            "crypto-ogs": post.frontmatter["crypto-ogs"] || [],
            exchanges: post.frontmatter.exchanges || [],
          },
          slug: post.slug,
        }
      : null;

  const minimalPosts = allPosts
    .filter((p) => p.slug !== single)
    .map((p) => formatPost(p));
  const similarPosts = similerItems(post[0], minimalPosts);

  return {
    props: {
      post: post[0],
      mdxContent: mdxContent,
      prevPost: formatPost(prevPost),
      nextPost: formatPost(nextPost),
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
      slug: single,
      similarPosts: similarPosts,
    },
  };
};

export default Article;
