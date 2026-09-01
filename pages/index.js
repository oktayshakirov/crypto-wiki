import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import { rankByViews } from "@lib/popularity";
import Posts from "@partials/Posts";
import Pagination from "@components/Pagination";
import CryptoOGs from "@partials/CryptoOGs";
import Exchanges from "@partials/Exchanges";
import Tools from "@partials/Tools";
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
  FaYoutube,
} from "react-icons/fa";
import config from "@config/config.json";
import VideoCard from "@components/VideoCard";
import { longVideos } from "@lib/videos";

// Eight, matching the page size of the /videos, /exchanges and /crypto-ogs
// feeds these rows preview. Their 1/2/4 column track divides 8 evenly at every
// width, so no breakpoint ends on a short row.
const HOME_VIDEO_COUNT = 8;

// Matches the Latest Posts row above it.
const MOST_READ_COUNT = 6;

const Home = ({
  posts,
  mostRead,
  ogs,
  exchanges,
  currentPage,
  postPages,
  ogPages,
  exchangePages,
  videos,
  videoPages,
  isApp,
}) => {
  return (
    <Base
      title="Crypto Wiki | Ultimate Resource for Crypto News, Guides & Analysis"
      meta_title="Crypto Wiki | Ultimate Resource for Crypto News, Guides & Analysis"
      description="Explore Crypto Wiki - your all-in-one hub for crypto news, guides, exchange reviews, and market tools. Stay informed and master the world of Bitcoin, blockchain, and Web3."
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

          {/* Directly under the hero, not at the foot of the page. The tools
              are the part of this site people come back to rather than read
              once, and in the apps they had no route at all: the site's own
              nav is hidden there to avoid a second navbar under the native
              one, and the tab bar has no room for them. One row of six on a
              desktop, two rows of three on a phone - a shortcut bar, so it
              costs the feed one screen of height at most. */}
          <div className="mb-12">
            {markdownify("CRYPTO TOOLS", "h3", "mb-6")}
            {/* isApp adds the portfolio tile: it is a native screen, so it
                exists in the apps and nowhere else. */}
            <Tools isApp={isApp} />
          </div>

          {markdownify("LATEST POSTS", "h3", "mb-8")}
          <Posts posts={posts} />
          <Pagination
            section="posts"
            currentPage={currentPage}
            totalPages={postPages}
          />
          {/* No button of its own: the ALL POSTS row below already leads to
              /posts, where Most popular is one tab away. */}
          {mostRead.length > 0 && (
            <div className="mt-12">
              {markdownify("MOST POPULAR", "h3", "mb-8")}
              <Posts posts={mostRead} />
            </div>
          )}
          {videos.length > 0 && (
            <div className="mt-12">
              {markdownify("WATCH", "h3", "mb-8")}
              <div className="flex flex-wrap justify-center text-left">
                {videos.map((video) => (
                  <div
                    key={video.slug}
                    className="w-full p-4 sm:w-1/2 lg:w-1/4"
                  >
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
              <Pagination
                section="videos"
                currentPage={currentPage}
                totalPages={videoPages}
              />
            </div>
          )}
          <div className="mb-10 mt-6 flex flex-col justify-center space-y-3 md:flex-row md:space-x-3 md:space-y-0">
            <Link className="btn-primary flex items-center gap-2" href="/posts">
              <FaRegNewspaper />
              <span>ALL POSTS</span>
            </Link>
            {videos.length > 0 && (
              <Link
                className="btn-primary flex items-center gap-2"
                href="/videos"
              >
                <FaYoutube />
                <span>ALL VIDEOS</span>
              </Link>
            )}
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
          {!isApp && <LayoutAd />}
        </div>
      </section>
    </Base>
  );
};

export default Home;

export const getStaticProps = async () => {
  // How many cards each home-page row shows (independent of the listing pages).
  const homePosts = 6;
  // Match the feed page size so the home preview and the listing pages show
  // the same number of cards.
  const homeOGs = 8;
  const homeExchanges = 8;
  const allPosts = getSinglePage("content/posts");
  const allOGs = getSinglePage("content/crypto-ogs");
  const allExchanges = getSinglePage("content/exchanges");
  const currentPage = 1;
  // The pagination links point at the listing sections, so the page counts have
  // to use the sections' own page sizes, not the number of cards shown here.
  const totalPostsPages = Math.ceil(
    allPosts.length / config.settings.paginationPosts
  );
  const totalOGsPages = Math.ceil(
    allOGs.length / config.settings.paginationCryptoOGs
  );
  const totalExchangesPages = Math.ceil(
    allExchanges.length / config.settings.paginationExchanges
  );
  const totalVideoPages = Math.ceil(
    longVideos().length / config.settings.paginationVideos
  );

  const currentPosts = allPosts.slice(0, homePosts);
  // Anything already sitting in "Latest" above is skipped, so the two rows
  // never show the same card twice on one screen.
  const latestSlugs = new Set(currentPosts.map((post) => post.slug));
  const mostRead = rankByViews(allPosts, "posts")
    .filter((post) => !latestSlugs.has(post.slug))
    .slice(0, MOST_READ_COUNT);
  const currentOGs = allOGs.slice(0, homeOGs);
  const currentExchanges = allExchanges.slice(0, homeExchanges);

  return {
    props: {
      mostRead: mostRead.map((post) => ({
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
      videos: longVideos().slice(0, HOME_VIDEO_COUNT),
      postPages: totalPostsPages,
      ogPages: totalOGsPages,
      exchangePages: totalExchangesPages,
      videoPages: totalVideoPages,
      currentPage,
    },
  };
};
