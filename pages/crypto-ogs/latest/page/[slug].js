import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import CryptoOGs from "@partials/CryptoOGs";
import {
  paginatedCanonical,
  paginatedTitle,
  paginatedDescription,
  sortedListingRobots,
} from "@lib/utils/pagination";

const TITLE = "Newest Crypto OG's | Crypto Wiki";
const DESCRIPTION =
  "The crypto figures we profiled most recently, newest first - the founders, builders and investors just added to the wiki.";

const LatestCryptoOGs = ({ ogs, currentPage, totalPages, isApp }) => (
  <Base
    title={paginatedTitle(TITLE, currentPage)}
    meta_title={paginatedTitle(TITLE, currentPage)}
    description={paginatedDescription(DESCRIPTION, currentPage)}
    image="/images/meta-image.png"
    canonical={paginatedCanonical("/crypto-ogs/latest", currentPage)}
    noindex={sortedListingRobots(currentPage)}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Newest Crypto OG&apos;s</h1>
        <ListingTabs
          basePath="/crypto-ogs"
          active="latest"
          defaultLabel="Featured"
          hasLatest
        />
        <CryptoOGs ogs={ogs} />
        <Pagination
          basePath="/crypto-ogs/latest"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </section>
  </Base>
);

export default LatestCryptoOGs;

// getSinglePage hands back OG's in `order` (the Featured ordering), and
// sortByDate sorts in place, so this re-sorts a copy.
const byDate = () =>
  sortByDate([...(getSinglePage("content/crypto-ogs") || [])]);

export const getStaticPaths = () => {
  const totalPages = Math.ceil(
    byDate().length / config.settings.paginationCryptoOGs
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
  const { paginationCryptoOGs } = config.settings;
  const sorted = byDate();
  const end = currentPage * paginationCryptoOGs;

  return {
    props: {
      ogs: sorted.slice(end - paginationCryptoOGs, end).map((og) => ({
        frontmatter: {
          title: og.frontmatter.title,
          description: og.frontmatter.description,
          image: og.frontmatter.image,
        },
        slug: og.slug,
      })),
      currentPage,
      totalPages: Math.ceil(sorted.length / paginationCryptoOGs),
    },
  };
};
