import { useRef } from "react";
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
  totalPosts,
}) => {
  const totalPages = Math.ceil(totalPosts / pagination);
  const { frontmatter } = postIndex;
  const { title } = frontmatter;
  const categoryListRef = useRef(null);

  const scrollCategoryList = (direction) => {
    const scrollAmount = 200;
    if (direction === "left") {
      categoryListRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else if (direction === "right") {
      categoryListRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <Base title={title}>
      <section className="section">
        <div className="container text-center">
          <div className="mb-8 flex items-center justify-center">
            <button
              className="btn-primary lg:hidden"
              onClick={() => scrollCategoryList("left")}
            >
              ←
            </button>
            <ul
              ref={categoryListRef}
              className="scrollbar-hide lg:scrollbar-none mx-4 flex flex-nowrap gap-3 overflow-x-auto lg:flex-wrap lg:justify-center lg:overflow-x-visible"
            >
              {categories.map((category, i) => (
                <li key={`category-${i}`} className="inline-block">
                  <Link
                    href={`/categories/${category}`}
                    className="btn-primary"
                  >
                    {humanize(category)}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              className="btn-primary lg:hidden"
              onClick={() => scrollCategoryList("right")}
            >
              →
            </button>
          </div>
          {markdownify(title, "h1", "h2 mb-8")}
          <Posts posts={posts} />
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
  const { paginationPosts } = config.settings;
  const totalPages = Math.ceil(allPosts.length / paginationPosts);
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
  const allPosts = getSinglePage("content/posts");
  const indexOfLastPost = currentPage * paginationPosts;
  const indexOfFirstPost = indexOfLastPost - paginationPosts;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const postIndex = await getListPage("content/posts/_index.md");
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  return {
    props: {
      pagination: paginationPosts,
      posts: currentPosts,
      currentPage: currentPage,
      postIndex: postIndex || {},
      categories: categories || [],
      totalPosts: allPosts.length,
    },
  };
};
