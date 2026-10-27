import CryptoOgSingle from "@layouts/CryptoOgSingle";
import { getSinglePage } from "@lib/contentParser";
import { parseMDXWithHeadings } from "@lib/utils/mdxParser";

const Article = ({ og, mdxContent, toc, prevOg, nextOg, slug, isApp }) => {
  const { frontmatter, content } = og[0];

  return (
    <CryptoOgSingle
      frontmatter={frontmatter}
      content={content}
      mdxContent={mdxContent}
      toc={toc}
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
  const { mdxSource: mdxContent, toc } = await parseMDXWithHeadings(
    og[0].content
  );

  // Prev/next are cards: title, description and image are all they render.
  const toCard = (item) =>
    item
      ? {
          frontmatter: {
            title: item.frontmatter.title,
            description: item.frontmatter.description,
            image: item.frontmatter.image,
          },
          slug: item.slug,
        }
      : null;

  const currentIndex = getOGs.findIndex((og) => og.slug === single);
  const prevOg = toCard(currentIndex > 0 ? getOGs[currentIndex - 1] : null);
  const nextOg = toCard(
    currentIndex < getOGs.length - 1 ? getOGs[currentIndex + 1] : null
  );

  // The body is already in mdxContent. The layout only reads the raw markdown
  // as a fallback meta description (first 200 characters at most), so ship just
  // that - the full text doubled the page data Vercel bills ISR reads on.
  return {
    props: {
      og: [{ ...og[0], content: og[0].content.slice(0, 200) }],
      mdxContent: mdxContent,
      toc: toc,
      prevOg: prevOg,
      nextOg: nextOg,
      slug: single,
    },
  };
};

export default Article;
