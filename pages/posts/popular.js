import config from "@config/config.json";
import Base from "@layouts/Baseof";
import ListingTabs from "@components/ListingTabs";
import { getSinglePage } from "@lib/contentParser";
import { POPULAR_LIMIT, rankByViews } from "@lib/popularity";
import Posts from "@partials/Posts";

const PopularPosts = ({ posts, isApp }) => (
  <Base
    title="Most Viewed Crypto Posts | Crypto Wiki"
    meta_title="Most Viewed Crypto Posts | Crypto Wiki"
    description="The crypto guides and explainers our readers open most often, ranked by total views."
    image="/images/meta-image.png"
    canonical={`${config.site.base_url}/posts/popular`}
    isApp={isApp}
  >
    <section className="section">
      <div className="container text-center">
        <h1 className="h1 mb-8">Most Viewed Posts</h1>
        <ListingTabs basePath="/posts" active="popular" />
        <Posts posts={posts} />
      </div>
    </section>
  </Base>
);

export default PopularPosts;

export const getStaticProps = async () => {
  const allPosts = getSinglePage("content/posts") || [];
  const ranked = rankByViews(allPosts, "posts", POPULAR_LIMIT);

  return {
    props: {
      posts: ranked.map((post) => ({
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
    },
  };
};
