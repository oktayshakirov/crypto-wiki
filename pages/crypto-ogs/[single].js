import CryptoOgSingle from "@layouts/CryptoOgSingle";
import { getSinglePage } from "@lib/contentParser";
import parseMDX from "@lib/utils/mdxParser";

const Article = ({ og, mdxContent, prevOg, nextOg, slug, isApp }) => {
  const { frontmatter, content } = og[0];

  return (
    <CryptoOgSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      prevOg={prevOg}
      nextOg={nextOg}
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

  const currentIndex = getOGs.findIndex((og) => og.slug === single);
  const prevOg = currentIndex > 0 ? getOGs[currentIndex - 1] : null;
  const nextOg =
    currentIndex < getOGs.length - 1 ? getOGs[currentIndex + 1] : null;

  return {
    props: {
      og: og,
      mdxContent: mdxContent,
      prevOg: prevOg,
      nextOg: nextOg,
      slug: single,
    },
  };
};

export default Article;
