import NotFound from "@layouts/404";
import About from "@layouts/About";
import Base from "@layouts/Baseof";
import Contact from "@layouts/Contact";
import Default from "@layouts/Default";
import { getRegularPage, getSinglePage } from "@lib/contentParser";

const RegularPages = ({ slug, data, isApp }) => {
  const { title, meta_title, description, image, noindex, canonical, layout } =
    data.frontmatter;

  return (
    <Base
      title={title}
      description={description}
      meta_title={meta_title}
      image={image}
      noindex={noindex}
      canonical={canonical}
      isApp={isApp}
    >
      {layout === "404" ? (
        <NotFound data={data} />
      ) : layout === "about" ? (
        <About data={data} />
      ) : layout === "contact" ? (
        <Contact data={data} />
      ) : layout === "faq" ? (
        <Default data={data} />
      ) : layout === "privacy-policy" ? (
        <Default data={data} />
      ) : layout === "terms" ? (
        <Default data={data} />
      ) : layout === "affiliate-disclosure" ? (
        <Default data={data} />
      ) : layout === "advertising" ? (
        <Default data={data} />
      ) : (
        <Default data={data} />
      )}
    </Base>
  );
};

export default RegularPages;

export const getStaticPaths = async () => {
  const regularSlugs = getSinglePage("content");
  const paths = regularSlugs.map((item) => ({
    params: {
      regular: item.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { regular } = params;
  const allPages = await getRegularPage(regular);

  return {
    props: {
      slug: regular,
      data: allPages,
    },
  };
};
