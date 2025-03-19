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
    <Base
      title={`CRYPTO ${title}`}
      meta_title={`CRYPTO ${title} – Reviews & Ratings`}
      description="Explore our detailed reviews of top crypto exchanges trusted by millions of investors. Discover expert insights, comprehensive ratings, and the latest updates to help you choose the best platform for your crypto trading."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/exchanges`}
    >
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
  const exchangeIndex = await getListPage("content/exchanges/_index.mdx");

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
