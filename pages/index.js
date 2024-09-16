import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import Posts from "@partials/Posts";
import CryptoOGs from "@partials/CryptoOGs";
import Exchanges from "@partials/Exchanges";
import { markdownify } from "@lib/utils/textConverter";
import FearAndGreedIndex from "@layouts/components/FearAndGreedIndex";
import Link from "next/link";
import {
  FaRegNewspaper,
  FaBookOpen,
  FaTags,
  FaUserAlt,
  FaAddressBook,
  FaExchangeAlt,
  FaCalculator,
  FaChartLine,
  FaThermometerHalf,
} from "react-icons/fa";

const Home = ({ posts, ogs, exchanges }) => {
  return (
    <Base>
      <section>
        <div className="container my-7 text-center">
          {markdownify("LATEST POSTS", "h2", "mb-8")}
          <Posts posts={posts.slice(0, 6)} />
          <div className="mb-20 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
            <Link className="btn-primary flex items-center gap-2" href="/posts">
              <FaRegNewspaper />
              <span>MORE POSTS</span>
            </Link>
            <Link
              className="btn-primary flex items-center gap-2"
              href="/categories"
            >
              <FaBookOpen />
              <span>CATEGORIES</span>
            </Link>
            <Link
              className="btn-primary flex items-center gap-2"
              href="/authors"
            >
              <FaUserAlt />
              <span>AUTHORS</span>
            </Link>
            <Link className="btn-primary flex items-center gap-2" href="/tags">
              <FaTags />
              <span>TAGS</span>
            </Link>
          </div>
          <div className="card-secondary mb-10 p-10">
            <div className="mb-20">
              {markdownify("MARKET MOOD", "h3")}
              {markdownify(
                "[Uncover Market Emotions with the Fear and Greed Index](/tools/fear-and-greed-index)"
              )}

              <FearAndGreedIndex />
            </div>
            {markdownify("MORE HELPFUL TOOLS", "h5", "mb-8")}
            <div className="mt-6 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
              <Link
                className="btn-primary flex items-center gap-2"
                href="/tools/bitcoin-rainbow-chart"
              >
                <FaChartLine />
                <span>RAINBOW CHART</span>
              </Link>
              <Link
                className="btn-primary flex items-center gap-2"
                href="/tools/crypto-heatmap"
              >
                <FaThermometerHalf />
                <span>MARKET HEATMAP</span>
              </Link>
              <Link
                className="btn-primary flex items-center gap-2"
                href="/tools/staking-calculator"
              >
                <FaCalculator />
                <span>STAKING CALCULATOR</span>
              </Link>
            </div>
          </div>
          <div className="mb-20">
            {markdownify("CRYPTO LEGENDS", "h2", "mb-8")}
            <CryptoOGs ogs={ogs.slice(0, 3)} />
            <div className="mt-6 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
              <Link
                className="btn-primary flex items-center gap-2"
                href="/crypto-ogs"
              >
                <FaUserAlt />
                <span>MORE CRYPTO OGS</span>
              </Link>
              <Link
                className="btn-primary flex items-center gap-2"
                href="/contact"
              >
                <FaAddressBook />
                <span>REQUEST SOMEONE</span>
              </Link>
            </div>
          </div>
          <div className="mb-20">
            {markdownify("RECOMMENDED CRYPTO EXCHANGES", "h3", "mb-8")}
            <Exchanges exchanges={exchanges.slice(0, 6)} />
            <div className="mt-6 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
              <Link
                className="btn-primary flex items-center gap-2"
                href="/exchanges"
              >
                <FaExchangeAlt />
                <span>MORE EXCHANGES</span>
              </Link>
              <Link
                className="btn-primary flex items-center gap-2"
                href="/contact"
              >
                <FaAddressBook />
                <span>REQUEST AN EXCHANGE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Home;

export const getStaticProps = async () => {
  const posts = getSinglePage("content/posts");
  const ogs = getSinglePage("content/crypto-ogs");
  const exchanges = getSinglePage("content/exchanges");

  return {
    props: {
      posts: posts || [],
      ogs: ogs || [],
      exchanges: exchanges || [],
    },
  };
};
