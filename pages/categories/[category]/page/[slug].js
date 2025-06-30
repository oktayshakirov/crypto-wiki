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

  return {
    props: {
      //ToDo: check if we need to refetch posts for category pages
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
      category: params.category,
      authors: authors,
      currentPage: currentPage,
      totalPages: totalPages,
    },
  };
};
