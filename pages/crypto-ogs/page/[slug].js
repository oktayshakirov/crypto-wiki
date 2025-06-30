import Pagination from "@components/Pagination";
import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getListPage, getSinglePage } from "@lib/contentParser";
import { markdownify } from "@lib/utils/textConverter";
import CryptoOGs from "@partials/CryptoOGs";

const CryptoOgPagination = ({
  ogIndex,
  ogs,
  currentPage,
  pagination,
  isApp,
}) => {
  const indexOfLastOG = currentPage * pagination;
  const indexOfFirstOG = indexOfLastOG - pagination;
  const totalPages = Math.ceil(ogs.length / pagination);
  const currentOGs = ogs.slice(indexOfFirstOG, indexOfLastOG);
  const { frontmatter } = ogIndex;
  const { title } = frontmatter;

  return (
    <Base
      title="Crypto OGs | Pioneers & Visionaries of the Crypto World - Crypto Wiki"
      meta_title="Crypto OGs | Pioneers & Visionaries of the Crypto World - Crypto Wiki"
      description="Discover the legends of crypto like Satoshi Nakamoto, Vitalik Buterin, and CZ. Explore their innovations, investments, and lasting impact on blockchain technology."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/crypto-ogs`}
      isApp={isApp}
    >
      <section className="section">
        <div className="container text-center">
          {markdownify(title, "h1", "h1 mb-16")}
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
  const ogIndex = await getListPage("content/crypto-ogs/_index.mdx");

  return {
    props: {
      pagination: paginationCryptoOGs,
      ogs: ogs.map((og) => ({
        frontmatter: {
          title: og.frontmatter.title,
          description: og.frontmatter.description,
          image: og.frontmatter.image,
        },
        slug: og.slug,
      })),
      currentPage: currentPage,
      ogIndex: ogIndex,
      mdxContent: ogIndex.mdxContent,
    },
  };
};
