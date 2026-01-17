import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import Posts from "@partials/Posts";
import Pagination from "@components/Pagination";
import CryptoOGs from "@partials/CryptoOGs";
import Exchanges from "@partials/Exchanges";
import { markdownify } from "@lib/utils/textConverter";
import FearAndGreedIndex from "@layouts/components/FearAndGreedIndex";
import LayoutAd from "@layouts/components/ads/LayoutAd";
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
} from "react-icons/fa";
import config from "@config/config.json";

const Home = ({
  posts,
  ogs,
  exchanges,
  currentPage,
  postPages,
  ogPages,
  exchangePages,
  isApp,
}) => {
  return (
    <Base
      title="Crypto Wiki | Ultimate Resource for Crypto News, Guides & Analysis"
      meta_title="Crypto Wiki | Ultimate Resource for Crypto News, Guides & Analysis"
      description="Explore Crypto Wiki – your all-in-one hub for crypto news, guides, exchange reviews, and market tools. Stay informed and master the world of Bitcoin, blockchain, and Web3."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/`}
      isApp={isApp}
    >
      <section>
        <div className="container my-7 text-center">
          <h1 className="mb-8 text-3xl font-bold leading-tight sm:text-4xl">
            Uncover the World of{" "}
            <span className="font-mono text-primary">CRYPTO</span>
          </h1>
          {markdownify("LATEST POSTS", "h3", "mb-8")}
          <Posts posts={posts} />
          <Pagination
            section="posts"
            currentPage={currentPage}
            totalPages={postPages}
          />
          <div className="mb-10 mt-6 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
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
          </div>
          {!isApp && <LayoutAd />}
          <div className="card-secondary my-10 p-10">
            <div className="mb-10">
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
          {!isApp && <LayoutAd />}
          <div className="my-10">
            {markdownify("CRYPTO LEGENDS", "h3", "mb-8")}
            <CryptoOGs ogs={ogs} />
            <Pagination
              section="crypto-ogs"
              currentPage={currentPage}
              totalPages={ogPages}
            />
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
          {!isApp && <LayoutAd />}
          <div className="my-10">
            {markdownify("CRYPTO EXCHANGES", "h3", "mb-8")}
            <Exchanges exchanges={exchanges} />
            <Pagination
              section="exchanges"
              currentPage={currentPage}
              totalPages={exchangePages}
            />
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
  const paginationPosts = 6;
  const paginationOGs = 6;
  const paginationExchanges = 6;
  const allPosts = getSinglePage("content/posts");
  const allOGs = getSinglePage("content/crypto-ogs");
  const allExchanges = getSinglePage("content/exchanges");
  const currentPage = 1;
  const totalPostsPages = Math.ceil(allPosts.length / paginationPosts);
  const totalOGsPages = Math.ceil(allOGs.length / paginationOGs);
  const totalExchangesPages = Math.ceil(
    allExchanges.length / paginationExchanges
  );

  const currentPosts = allPosts.slice(0, paginationPosts);
  const currentOGs = allOGs.slice(0, paginationOGs);
  const currentExchanges = allExchanges.slice(0, paginationExchanges);

  return {
    props: {
      posts: currentPosts.map((post) => ({
        frontmatter: {
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          image: post.frontmatter.image,
          categories: post.frontmatter.categories,
          "crypto-ogs": post.frontmatter["crypto-ogs"] || [],
          exchanges: post.frontmatter.exchanges || [],
        },
        slug: post.slug,
      })),
      ogs: currentOGs.map((og) => ({
        frontmatter: {
          title: og.frontmatter.title,
          description: og.frontmatter.description,
          image: og.frontmatter.image,
        },
        slug: og.slug,
      })),
      exchanges: currentExchanges.map((exchange) => ({
        frontmatter: {
          title: exchange.frontmatter.title,
          description: exchange.frontmatter.description,
          image: exchange.frontmatter.image,
        },
        slug: exchange.slug,
      })),
      postPages: totalPostsPages,
      ogPages: totalOGsPages,
      exchangePages: totalExchangesPages,
      currentPage,
    },
  };
};
