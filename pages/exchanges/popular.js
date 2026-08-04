import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { POPULAR_LIMIT, rankByViews } from "@lib/popularity";
import Exchanges from "@partials/Exchanges";

const PopularExchanges = ({ exchanges, isApp }) => (
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
      </div>
    </section>
  </Base>
);

export default PopularExchanges;

export const getStaticProps = async () => {
  const allExchanges = getSinglePage("content/exchanges") || [];
  const ranked = rankByViews(allExchanges, "exchanges", POPULAR_LIMIT);

  return {
    props: {
      exchanges: ranked.map((exchange) => ({
        frontmatter: {
          title: exchange.frontmatter.title,
          description: exchange.frontmatter.description,
          image: exchange.frontmatter.image,
        },
        slug: exchange.slug,
      })),
    },
  };
};
