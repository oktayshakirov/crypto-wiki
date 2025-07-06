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

  const currentIndex = getExchanges.findIndex(
    (exchange) => exchange.slug === single
  );
  const prevExchange = currentIndex > 0 ? getExchanges[currentIndex - 1] : null;
  const nextExchange =
    currentIndex < getExchanges.length - 1
      ? getExchanges[currentIndex + 1]
      : null;

  const navigationExchanges = [];
  if (prevExchange) {
    navigationExchanges.push({
      frontmatter: {
        title: prevExchange.frontmatter.title,
        description: prevExchange.frontmatter.description,
        image: prevExchange.frontmatter.image,
      },
      slug: prevExchange.slug,
    });
  }

  if (nextExchange) {
    navigationExchanges.push({
      frontmatter: {
        title: nextExchange.frontmatter.title,
        description: nextExchange.frontmatter.description,
        image: nextExchange.frontmatter.image,
      },
      slug: nextExchange.slug,
    });
  }

  return {
    props: {
      exchange,
      mdxContent,
      exchanges: navigationExchanges,
      slug: single,
    },
  };
};

export default Article;
