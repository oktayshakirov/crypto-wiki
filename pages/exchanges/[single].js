import ExchangeSingle from "@layouts/ExchangeSingle";
import { getSinglePage } from "@lib/contentParser";
import { parseMDXWithHeadings } from "@lib/utils/mdxParser";

const Article = ({
  exchange,
  mdxContent,
  toc,
  prevExchange,
  nextExchange,
  slug,
  isApp,
}) => {
  const { frontmatter, content } = exchange[0];

  return (
    <ExchangeSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      toc={toc}
      prevExchange={prevExchange}
      nextExchange={nextExchange}
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
  const { mdxSource: mdxContent, toc } = await parseMDXWithHeadings(
    exchange[0].content
  );

  const currentIndex = getExchanges.findIndex(
    (exchange) => exchange.slug === single
  );
  const prevExchange =
    currentIndex > 0
      ? {
          frontmatter: {
            title: getExchanges[currentIndex - 1].frontmatter.title,
            description: getExchanges[currentIndex - 1].frontmatter.description,
            image: getExchanges[currentIndex - 1].frontmatter.image,
          },
          slug: getExchanges[currentIndex - 1].slug,
        }
      : null;
  const nextExchange =
    currentIndex < getExchanges.length - 1
      ? {
          frontmatter: {
            title: getExchanges[currentIndex + 1].frontmatter.title,
            description: getExchanges[currentIndex + 1].frontmatter.description,
            image: getExchanges[currentIndex + 1].frontmatter.image,
          },
          slug: getExchanges[currentIndex + 1].slug,
        }
      : null;

  return {
    props: {
      exchange,
      mdxContent,
      toc,
      prevExchange,
      nextExchange,
      slug: single,
    },
  };
};

export default Article;
