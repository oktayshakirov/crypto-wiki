import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { rankByViews } from "@lib/popularity";
import Exchanges from "@partials/Exchanges";

const PopularExchanges = ({ exchanges, currentPage, totalPages, isApp }) => (
  <Base
    title="Most Viewed Crypto Exchanges | Crypto Wiki"
    meta_title="Most Viewed Crypto Exchanges | Crypto Wiki"
    description="The exchange reviews our readers open most often, ranked by total views."
    image="/images/meta-image.png"
    canonical={`${config.site.base_url}/exchanges/popular`}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Most Viewed Exchanges</h1>
        <ListingTabs basePath="/exchanges" active="popular" />
        <Exchanges exchanges={exchanges} />
        <Pagination
          basePath="/exchanges/popular"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </section>
  </Base>
);

export default PopularExchanges;

export const getStaticPaths = () => {
  const all = getSinglePage("content/exchanges") || [];
  const totalPages = Math.ceil(
    all.length / config.settings.paginationExchanges
  );

  return {
    paths: Array.from({ length: totalPages }, (_, i) => ({
      params: { slug: (i + 1).toString() },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { paginationExchanges } = config.settings;
  const ranked = rankByViews(
    getSinglePage("content/exchanges") || [],
    "exchanges"
  );
  const end = currentPage * paginationExchanges;

  return {
    props: {
      exchanges: ranked
        .slice(end - paginationExchanges, end)
        .map((exchange) => ({
          frontmatter: {
            title: exchange.frontmatter.title,
            description: exchange.frontmatter.description,
            image: exchange.frontmatter.image,
          },
          slug: exchange.slug,
        })),
      currentPage,
      totalPages: Math.ceil(ranked.length / paginationExchanges),
    },
  };
};
