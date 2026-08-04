import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { POPULAR_LIMIT, rankByViews } from "@lib/popularity";
import CryptoOGs from "@partials/CryptoOGs";

const PopularCryptoOGs = ({ ogs, isApp }) => (
  <Base
    title="Most Viewed Crypto OG's | Crypto Wiki"
    meta_title="Most Viewed Crypto OG's | Crypto Wiki"
    description="The crypto figures our readers look up most often, ranked by total views."
    image="/images/meta-image.png"
    canonical={`${config.site.base_url}/crypto-ogs/popular`}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Most Viewed Crypto OG&apos;s</h1>
        <ListingTabs basePath="/crypto-ogs" active="popular" />
        <CryptoOGs ogs={ogs} />
      </div>
    </section>
  </Base>
);

export default PopularCryptoOGs;

export const getStaticProps = async () => {
  const allOgs = getSinglePage("content/crypto-ogs") || [];
  const ranked = rankByViews(allOgs, "crypto-ogs", POPULAR_LIMIT);

  return {
    props: {
      ogs: ranked.map((og) => ({
        frontmatter: {
          title: og.frontmatter.title,
          description: og.frontmatter.description,
          image: og.frontmatter.image,
        },
        slug: og.slug,
      })),
    },
  };
};
