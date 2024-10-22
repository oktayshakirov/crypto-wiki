import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import Exchanges from "@partials/Exchanges";

const ExchangePagination = ({
  exchangeIndex,
  exchanges,
  currentPage,
  pagination,
}) => {
  const indexOfLastExchange = currentPage * pagination;
  const indexOfFirstExchange = indexOfLastExchange - pagination;
  const totalPages = Math.ceil(exchanges.length / pagination);
  const currentExchanges = exchanges.slice(
    indexOfFirstExchange,
    indexOfLastExchange
  );
  const { frontmatter } = exchangeIndex;
  const { title } = frontmatter;

  return (
    <Base title={`${title}: Popular Crypto Exchanges`}>
      <section className="section">
        <div className="container text-center">
          {markdownify(title, "h1", "h2 mb-16")}
          <Exchanges exchanges={currentExchanges} />
          <Pagination
            section="exchanges"
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </Base>
  );
};

export default ExchangePagination;

export const getStaticPaths = () => {
  const getAllSlug = getSinglePage("content/exchanges");
  const allSlug = getAllSlug.map((item) => item.slug);
  const { pagination } = config.settings;
  const totalPages = Math.ceil(allSlug.length / pagination);
  let paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { paginationExchanges } = config.settings;
  const exchanges = getSinglePage("content/exchanges");
  const exchangeIndex = await getListPage("content/exchanges/_index.md");

  return {
    props: {
      pagination: paginationExchanges,
      exchanges: exchanges,
      currentPage: currentPage,
      exchangeIndex: exchangeIndex,
      mdxContent: exchangeIndex.mdxContent,
    },
  };
};
