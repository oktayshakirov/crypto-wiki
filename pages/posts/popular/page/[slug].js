import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { rankByViews } from "@lib/popularity";
import Posts from "@partials/Posts";
import {
  paginatedCanonical,
  paginatedTitle,
  paginatedDescription,
  sortedListingRobots,
} from "@lib/utils/pagination";

const PopularPosts = ({ posts, currentPage, totalPages, isApp }) => (
  <Base
    title={paginatedTitle(
      "Most Popular Crypto Posts | Crypto Wiki",
      currentPage
    )}
    meta_title={paginatedTitle(
      "Most Popular Crypto Posts | Crypto Wiki",
      currentPage
    )}
    description={paginatedDescription(
      "The crypto guides and explainers our readers open most often, ranked by total views.",
      currentPage
    )}
    image="/images/meta-image.png"
    canonical={paginatedCanonical("/posts/popular", currentPage)}
    noindex={sortedListingRobots(currentPage)}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Most Popular Posts</h1>
        <ListingTabs basePath="/posts" active="popular" />
        <Posts posts={posts} />
        <Pagination
          basePath="/posts/popular"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </section>
  </Base>
);

export default PopularPosts;

export const getStaticPaths = () => {
  const allPosts = getSinglePage("content/posts") || [];
  const totalPages = Math.ceil(
    allPosts.length / config.settings.paginationPosts
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
  const { paginationPosts } = config.settings;
  const ranked = rankByViews(getSinglePage("content/posts") || [], "posts");
  const end = currentPage * paginationPosts;
  const currentPosts = ranked.slice(end - paginationPosts, end);

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
      currentPage,
      totalPages: Math.ceil(ranked.length / paginationPosts),
    },
  };
};
