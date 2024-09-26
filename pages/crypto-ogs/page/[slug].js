import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import CryptoOGs from "@partials/CryptoOGs";

const CryptoOgPagination = ({ ogIndex, ogs, currentPage, pagination }) => {
  const indexOfLastOG = currentPage * pagination;
  const indexOfFirstOG = indexOfLastOG - pagination;
  const totalPages = Math.ceil(ogs.length / pagination);
  const currentOGs = ogs.slice(indexOfFirstOG, indexOfLastOG);
  const { frontmatter } = ogIndex;
  const { title } = frontmatter;

  return (
    <Base title={title}>
      <section className="section">
        <div className="container text-center">
          {markdownify(title, "h1", "h2 mb-16")}
          <CryptoOGs ogs={currentOGs} />
          <Pagination
            section="crypto-ogs"
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </Base>
  );
};

export default CryptoOgPagination;

export const getStaticPaths = () => {
  const getAllSlug = getSinglePage("content/crypto-ogs");
  const allSlug = getAllSlug.map((item) => item.slug);
  const { paginationCryptoOGs } = config.settings;
  const totalPages = Math.ceil(allSlug.length / paginationCryptoOGs);
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
  const { paginationCryptoOGs } = config.settings;
  const ogs = getSinglePage("content/crypto-ogs");
  const ogIndex = await getListPage("content/crypto-ogs/_index.md");

  return {
    props: {
      pagination: paginationCryptoOGs,
      ogs: ogs,
      currentPage: currentPage,
      ogIndex: ogIndex,
      mdxContent: ogIndex.mdxContent,
    },
  };
};
