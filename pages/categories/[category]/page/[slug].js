import config from "@config/config.json";
import { getSinglePage } from "@lib/contentParser";
import { getTaxonomy } from "@lib/taxonomyParser";
import { slugify } from "@lib/utils/textConverter";
import CategoryLayout from "@layouts/CategorySingle";
const { blog_folder } = config.settings;

const CategoryPagination = (props) => {
  return <CategoryLayout {...props} />;
};

export default CategoryPagination;

export const getStaticPaths = async () => {
  const allCategories = getTaxonomy(`content/${blog_folder}`, "categories");
  const paths = [];

  for (const category of allCategories) {
    const posts = getSinglePage(`content/${blog_folder}`);
    const filteredPosts = posts.filter((post) =>
      post.frontmatter.categories.find((cat) => slugify(cat).includes(category))
    );

    const postsPerPage = 6;
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      paths.push({
        params: {
          category: category,
          slug: i.toString(),
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const posts = getSinglePage(`content/${blog_folder}`);
  const filteredPosts = posts.filter((post) =>
    post.frontmatter.categories.find((category) =>
      slugify(category).includes(params.category)
    )
  );

  const postsPerPage = 6;
  const currentPage = parseInt(params.slug);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const authors = getSinglePage("content/authors");
  const cryptoOgs = getSinglePage("content/crypto-ogs");
  const exchanges = getSinglePage("content/exchanges");

  return {
    props: {
      posts: currentPosts,
      category: params.category,
      authors: authors,
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
      currentPage: currentPage,
      totalPages: totalPages,
    },
  };
};
