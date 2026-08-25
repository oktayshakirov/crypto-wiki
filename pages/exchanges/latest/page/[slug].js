import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import Exchanges from "@partials/Exchanges";
import {
  paginatedCanonical,
  paginatedTitle,
  paginatedDescription,
  sortedListingRobots,
} from "@lib/utils/pagination";

const TITLE = "Newest Crypto Exchanges | Crypto Wiki";
const DESCRIPTION =
  "The exchange reviews we published most recently, newest first - the platforms that have just launched or just been added to the wiki.";

const LatestExchanges = ({ exchanges, currentPage, totalPages, isApp }) => (
  <Base
    title={paginatedTitle(TITLE, currentPage)}
    meta_title={paginatedTitle(TITLE, currentPage)}
    description={paginatedDescription(DESCRIPTION, currentPage)}
    image="/images/meta-image.png"
    canonical={paginatedCanonical("/exchanges/latest", currentPage)}
    noindex={sortedListingRobots(currentPage)}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Newest Exchanges</h1>
        <ListingTabs
          basePath="/exchanges"
          active="latest"
          defaultLabel="Featured"
          hasLatest
        />
        <Exchanges exchanges={exchanges} />
        <Pagination
          basePath="/exchanges/latest"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </section>
  </Base>
);

export default LatestExchanges;

// getSinglePage hands back exchanges in `order` (the Featured ordering), and
// sortByDate sorts in place, so this re-sorts a copy.
const byDate = () =>
  sortByDate([...(getSinglePage("content/exchanges") || [])]);

export const getStaticPaths = () => {
  const totalPages = Math.ceil(
    byDate().length / config.settings.paginationExchanges
  );

  return {
    paths: Array.from({ length: Math.max(totalPages, 1) }, (_, i) => ({
      params: { slug: (i + 1).toString() },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { paginationExchanges } = config.settings;
  const sorted = byDate();
  const end = currentPage * paginationExchanges;

  return {
    props: {
      exchanges: sorted
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
      totalPages: Math.ceil(sorted.length / paginationExchanges),
    },
  };
};
