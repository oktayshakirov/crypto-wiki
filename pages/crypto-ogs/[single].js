import CryptoOgSingle from "@layouts/CryptoOgSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";

const Article = ({ og, mdxContent, ogs, slug, isApp }) => {
  const { frontmatter, content } = og[0];

  return (
    <CryptoOgSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      ogs={ogs}
      slug={slug}
      isApp={isApp}
    />
  );
};

export const getStaticPaths = () => {
  const allSlug = getSinglePage("content/crypto-ogs");
  const paths = allSlug.map((item) => ({
    params: {
      single: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { single } = params;
  const getOGs = getSinglePage("content/crypto-ogs");
  const og = getOGs.filter((og) => og.slug === single);
  const mdxContent = await parseMDX(og[0].content);

  return {
    props: {
      og: og,
      mdxContent: mdxContent,
      ogs: getOGs.map((og) => ({
        frontmatter: {
          title: og.frontmatter.title,
          description: og.frontmatter.description,
          image: og.frontmatter.image,
        },
        slug: og.slug,
      })),
      slug: single,
    },
  };
};

export default Article;
