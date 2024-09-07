import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getSinglePage, getListPage } from "@lib/contentParser";
import Posts from "@partials/Posts";
import { humanize, markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { getTaxonomy } from "@lib/taxonomyParser";

const PostPagination = ({
  postIndex,
  posts,
  currentPage,
  pagination,
  categories,
}) => {
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const totalPages = Math.ceil(posts.length / pagination);
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const { frontmatter } = postIndex;
  const { title } = frontmatter;

  return (
    <Base title={title}>
      <section className="section">
        <div className="container text-center">
          <div className="mb-8">
            <ul className="flex flex-wrap justify-center gap-6">
              {categories.slice(0, 6).map((category, i) => (
                <li key={`category-${i}`} className="mb-2 inline-block">
                  <Link
                    href={`/categories/${category}`}
                    className="rounded-lg bg-theme-light px-4 py-2 text-dark transition hover:bg-primary hover:text-white"
                  >
                    {humanize(category)}
                  </Link>
                </li>
              ))}
              <li className="mb-2 inline-block">
                <Link
                  href="/categories"
                  className="rounded-lg bg-theme-light px-4 py-2 text-dark transition hover:bg-primary hover:text-white"
                >
                  All Categories
                </Link>
              </li>
            </ul>
          </div>
          {markdownify(title, "h1", "h2 mb-8")}
          <Posts posts={currentPosts} />
          <Pagination
            section="posts"
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </Base>
  );
};

export default PostPagination;

export const getStaticPaths = () => {
  const allPosts = getSinglePage("content/posts");
  const allSlugs = allPosts.map((item) => item.slug);
  const { paginationPosts } = config.settings;
  const totalPages = Math.ceil(allSlugs.length / paginationPosts);
  let paths = [];

  for (let i = 1; i <= totalPages; i++) {
    paths.push({
      params: {
        slug: i.toString(),
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1, 10);
  const { paginationPosts, blog_folder } = config.settings;
  const posts = getSinglePage("content/posts");
  const postIndex = await getListPage("content/posts/_index.md");
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  return {
    props: {
      pagination: paginationPosts,
      posts: posts,
      currentPage: currentPage,
      postIndex: postIndex || {},
      categories: categories || [],
    },
  };
};
