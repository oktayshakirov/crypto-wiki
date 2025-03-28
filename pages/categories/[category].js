import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";
import Posts from "@partials/Posts";
const { blog_folder } = config.settings;
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const Category = ({ category, posts, authors, cryptoOgs, exchanges }) => {
  return (
    <Base
      title={`Discover ${category} posts | News, Guides & Analysis - Crypto Wiki`}
      meta_title={`Discover ${category} posts | News, Guides & Analysis - Crypto Wiki`}
      description={`Explore the latest Crypto ${category} trends, expert analysis, and detailed guides. Perfect for beginners and enthusiasts looking to deepen their crypto knowledge.`}
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/categories/${category.toLowerCase()}`}
    >
      <div className="section">
        <div className="container mb-8 text-left">
          <Link href="/categories">
            <button className="flex items-center">
              <FaArrowLeft className="mr-2" />
              All Categories
            </button>
          </Link>
        </div>
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Showing posts from <span className="text-primary">{category}</span>{" "}
            category
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

export default Category;

export const getStaticPaths = () => {
  const allCategories = getTaxonomy(`content/${blog_folder}`, "categories");

  const paths = allCategories.map((category) => ({
    params: {
      category: category,
    },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = ({ params }) => {
  const posts = getSinglePage(`content/${blog_folder}`);
  const filterPosts = posts.filter((post) =>
    post.frontmatter.categories.find((category) =>
      slugify(category).includes(params.category)
    )
  );
  const authors = getSinglePage("content/authors");
  const cryptoOgs = getSinglePage("content/crypto-ogs");
  const exchanges = getSinglePage("content/exchanges");

  return {
    props: {
      posts: filterPosts,
      category: params.category,
      authors: authors,
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
    },
  };
};
