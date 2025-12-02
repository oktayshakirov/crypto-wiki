import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";
import Posts from "@partials/Posts";
const { blog_folder } = config.settings;

const Tag = ({ tag, posts, authors, cryptoOgs, exchanges, isApp }) => {
  return (
    <Base
      title={`Discover ${tag} content | Latest Posts & Guides - Crypto Wiki`}
      meta_title={`Discover ${tag} content | Latest Posts & Guides - Crypto Wiki`}
      description={`Explore the latest articles, expert guides, and insights about ${tag}. Stay informed with curated crypto content tailored to your interests and trends.`}
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tags/${tag.toLowerCase()}`}
      noindex={true}
      isApp={isApp}
    >
      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Showing posts from <span className="text-primary">{tag}</span> tag
          </h1>
          <Posts
            posts={posts}
            authors={authors}
            cryptoOgs={cryptoOgs}
            exchanges={exchanges}
          />
        </div>
      </div>
    </Base>
  );
};

export default Tag;

export const getStaticPaths = () => {
  const allCategories = getTaxonomy(`content/${blog_folder}`, "tags");

  const paths = allCategories.map((tag) => ({
    params: {
      tag: tag,
    },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = ({ params }) => {
  const posts = getSinglePage(`content/${blog_folder}`);
  const filterPosts = posts.filter((post) =>
    post.frontmatter.tags.find((tag) => slugify(tag).includes(params.tag))
  );
  const authors = getSinglePage("content/authors");

  return {
    props: {
      posts: filterPosts.map((post) => ({
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
      tag: params.tag,
      authors: authors,
    },
  };
};
