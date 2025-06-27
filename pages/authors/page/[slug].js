import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import Authors from "@partials/Authors";

const AuthorPagination = ({
  authorIndex,
  authors,
  currentPage,
  pagination,
  isApp,
}) => {
  const indexOfLastAuthor = currentPage * pagination;
  const indexOfFirstAuthor = indexOfLastAuthor - pagination;
  const totalPages = Math.ceil(authors.length / pagination);
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  const { frontmatter, content } = authorIndex;
  const { title } = frontmatter;

  return (
    <Base
      title="Meet the Crypto Wiki Authors | Expert Writers & Analysts"
      meta_title="Meet the Crypto Wiki Authors | Expert Writers & Analysts"
      description="Discover the expert contributors behind Crypto Wiki. Learn about their insights, articles, and analysis that keep you informed on the latest crypto trends and developments."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/authors`}
      isApp={isApp}
    >
      <section className="section">
        <div className="container text-center">
          {markdownify(title, "h1", "h1 mb-16")}
          <Authors authors={currentAuthors} />
          <Pagination
            section="authors"
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </Base>
  );
};

export default AuthorPagination;

// get authors pagination slug
export const getStaticPaths = () => {
  const getAllSlug = getSinglePage("content/authors");
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

// get authors pagination content
export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { paginationAuthors } = config.settings;
  const authors = getSinglePage("content/authors");
  const authorIndex = await getListPage("content/authors/_index.mdx");

  return {
    props: {
      pagination: paginationAuthors,
      authors: authors,
      currentPage: currentPage,
      authorIndex: authorIndex,
      mdxContent: authorIndex.mdxContent,
    },
  };
};
