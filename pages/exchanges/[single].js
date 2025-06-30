import ExchangeSingle from "@layouts/ExchangeSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";

const Article = ({ exchange, mdxContent, exchanges, slug, isApp }) => {
  const { frontmatter, content } = exchange[0];

  return (
    <ExchangeSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      exchanges={exchanges}
      slug={slug}
      isApp={isApp}
    />
  );
};

export const getStaticPaths = () => {
  const allSlug = getSinglePage("content/exchanges");
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

export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const getExchanges = getSinglePage("content/exchanges");
  const exchange = getExchanges.filter((exchange) => exchange.slug === single);
  const mdxContent = await parseMDX(exchange[0].content);

  return {
    props: {
      exchange,
      mdxContent,
      exchanges: getExchanges.map((exchange) => ({
        frontmatter: {
          title: exchange.frontmatter.title,
          description: exchange.frontmatter.description,
          image: exchange.frontmatter.image,
        },
        slug: exchange.slug,
      })),
      slug: single,
    },
  };
};

export default Article;
