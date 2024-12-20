import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import Posts from "@partials/Posts";
const { blog_folder } = config.settings;

const BlogPagination = ({
  posts,
  authors,
  cryptoOgs,
  exchanges,
  currentPage,
  pagination,
}) => {
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const totalPages = Math.ceil(posts.length / pagination);
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <Base>
      <section className="section">
        <div className="container">
          <Posts
            className="mb-16"
            posts={currentPosts}
            authors={authors}
            cryptoOgs={cryptoOgs}
            exchanges={exchanges}
          />
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </section>
    </Base>
  );
};

export default BlogPagination;

export const getStaticPaths = () => {
  const getAllSlug = getSinglePage(`content/${blog_folder}`);
  const allSlug = getAllSlug.map((item) => item.slug);
  const { pagination } = config.settings;
  const totalPages = Math.ceil(allSlug.length / pagination);
  let paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
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
  const { pagination } = config.settings;
  const posts = getSinglePage(`content/${blog_folder}`);
  const authors = getSinglePage("content/authors");
  const cryptoOgs = getSinglePage("content/crypto-ogs");
  const exchanges = getSinglePage("content/exchanges");

  return {
    props: {
      pagination: pagination,
      posts: posts,
      authors: authors,
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
      currentPage: currentPage,
    },
  };
};
