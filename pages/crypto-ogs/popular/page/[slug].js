import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { rankByViews } from "@lib/popularity";
import CryptoOGs from "@partials/CryptoOGs";

const PopularCryptoOGs = ({ ogs, currentPage, totalPages, isApp }) => (
  <Base
    title="Most Popular Crypto OG's | Crypto Wiki"
    meta_title="Most Popular Crypto OG's | Crypto Wiki"
    description="The crypto figures our readers look up most often, ranked by total views."
    image="/images/meta-image.png"
    canonical={`${config.site.base_url}/crypto-ogs/popular`}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Most Popular Crypto OG&apos;s</h1>
        <ListingTabs
          basePath="/crypto-ogs"
          active="popular"
          defaultLabel="Featured"
        />
        <CryptoOGs ogs={ogs} />
        <Pagination
          basePath="/crypto-ogs/popular"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </section>
  </Base>
);

export default PopularCryptoOGs;

export const getStaticPaths = () => {
  const all = getSinglePage("content/crypto-ogs") || [];
  const totalPages = Math.ceil(
    all.length / config.settings.paginationCryptoOGs
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
  const { paginationCryptoOGs } = config.settings;
  const ranked = rankByViews(
    getSinglePage("content/crypto-ogs") || [],
    "crypto-ogs"
  );
  const end = currentPage * paginationCryptoOGs;

  return {
    props: {
      ogs: ranked.slice(end - paginationCryptoOGs, end).map((og) => ({
        frontmatter: {
          title: og.frontmatter.title,
          description: og.frontmatter.description,
          image: og.frontmatter.image,
        },
        slug: og.slug,
      })),
      currentPage,
      totalPages: Math.ceil(ranked.length / paginationCryptoOGs),
    },
  };
};
