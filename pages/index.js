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
  FaTags,
  FaUserAlt,
  FaAddressBook,
  FaExchangeAlt,
  FaCalculator,
  FaChartLine,
  FaThermometerHalf,
  FaHashtag,
} from "react-icons/fa";

const Home = ({ posts, ogs, exchanges }) => {
  return (
    <Base>
      <section>
        <div className="container my-7 text-center">
          <h1 className="mb-8 text-2xl font-semibold leading-tight sm:text-4xl">
            Uncover the World of{" "}
            <span className="font-mono text-primary">Crypto</span>
          </h1>
          {markdownify("LATEST POSTS", "h3", "mb-8")}
          <Posts posts={posts} />
          <div className="mb-20 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
            <Link className="btn-primary flex items-center gap-2" href="/posts">
              <FaRegNewspaper />
              <span>ALL POSTS</span>
            </Link>
            <Link
              className="btn-primary flex items-center gap-2"
              href="/categories"
            >
              <FaTags />
              <span>CATEGORIES</span>
            </Link>
            <Link className="btn-primary flex items-center gap-2" href="/tags">
              <FaHashtag />
              <span>TAGS</span>
            </Link>
            <Link
              className="btn-primary flex items-center gap-2"
              href="/authors"
            >
              <FaUserAlt />
              <span>AUTHORS</span>
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
            {markdownify("CRYPTO LEGENDS", "h3", "mb-8")}
            <CryptoOGs ogs={ogs} />
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
            {markdownify("CRYPTO EXCHANGES", "h3", "mb-8")}
            <Exchanges exchanges={exchanges} />
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
  const posts = getSinglePage("content/posts").slice(0, 6);
  const ogs = getSinglePage("content/crypto-ogs").slice(0, 3);
  const exchanges = getSinglePage("content/exchanges").slice(0, 6);

  return {
    props: {
      posts: posts || [],
      ogs: ogs || [],
      exchanges: exchanges || [],
    },
  };
};
