import ExchangeSingle from "@layouts/ExchangeSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";

// post single layout
const Article = ({ exchange, mdxContent }) => {
  const { frontmatter, content } = exchange[0];

  return (
    <ExchangeSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
    />
  );
};

// get exchanges single slug
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

// get exchanges single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const getExchanges = getSinglePage("content/exchanges");
  const exchange = getExchanges.filter((exchange) => exchange.slug == single);
  const mdxContent = await parseMDX(exchange[0].content);

  return {
    props: {
      exchange: exchange,
      mdxContent: mdxContent,
      slug: single,
    },
  };
};

export default Article;
