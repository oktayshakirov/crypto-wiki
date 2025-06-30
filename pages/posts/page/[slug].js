import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getSinglePage, getListPage } from "@lib/contentParser";
import Posts from "@partials/Posts";
import { humanize, markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import { getTaxonomy } from "@lib/taxonomyParser";
import { FaTags } from "react-icons/fa";

const PostPagination = ({
  postIndex,
  posts,
  currentPage,
  pagination,
  categories,
  totalPosts,
  isApp,
}) => {
  const totalPages = Math.ceil(totalPosts / pagination);
  const { frontmatter } = postIndex;
  const { title } = frontmatter;

  return (
    <Base
      title="All Crypto Posts | Guides, News & Expert Insights - Crypto Wiki"
      meta_title="All Crypto Posts | Guides, News & Expert Insights - Crypto Wiki"
      description="Browse comprehensive crypto articles, including guides, news, and expert analysis. Perfect for beginners and seasoned investors seeking valuable tips and insights."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/posts`}
      isApp={isApp}
    >
      <section className="section">
        <div className="container text-center">
          <div className="mb-8">
            <div className="block md:hidden">
              <Link
                href="/categories"
                className="btn-primary flex items-center gap-2"
              >
                <FaTags />
                Show Categories
              </Link>
            </div>
            <ul className="hidden flex-wrap justify-center gap-6 md:flex">
              {categories.slice(0, 6).map((category, i) => (
                <li key={`category-${i}`} className="mb-2 inline-block">
                  <Link
                    href={`/categories/${category}`}
                    className="btn-primary"
                  >
                    {humanize(category)}
                  </Link>
                </li>
              ))}
              <li className="mb-2 inline-block">
                <Link href="/categories" className="btn-primary">
                  All Categories
                </Link>
              </li>
            </ul>
          </div>
          {markdownify(title, "h1", "h1 mb-8")}
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
  const currentPage = parseInt((params && params.slug) || 1);
  const { paginationPosts, blog_folder } = config.settings;
  const allPosts = getSinglePage("content/posts");
  const indexOfLastPost = currentPage * paginationPosts;
  const indexOfFirstPost = indexOfLastPost - paginationPosts;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

  const postIndex = await getListPage("content/posts/_index.mdx");
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  return {
    props: {
      pagination: paginationPosts,
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
      currentPage: currentPage,
      postIndex: postIndex || {},
      categories: categories || [],
      totalPosts: allPosts.length,
    },
  };
};
