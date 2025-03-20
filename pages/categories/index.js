import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getTaxonomy } from "@lib/taxonomyParser";
import { humanize, markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
const { blog_folder } = config.settings;

const Categories = ({ categories }) => {
  return (
    <Base
      title="All Crypto Categories | Blockchain, Web3, AI & More - Crypto Wiki"
      meta_title="All Crypto Categories | Blockchain, Web3, AI & More - Crypto Wiki"
      description="Explore a wide range of crypto topics on Crypto Wiki. From blockchain and Bitcoin to AI, security, and investing—access expert insights, guides, and the latest news."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/categories`}
    >
      <section className="section">
        <div className="container text-center">
          {markdownify("Categories", "h1", "h2 mb-16")}
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category, i) => (
              <li key={`category-${i}`} className="mb-2">
                <Link
                  href={`/categories/${category}`}
                  className="btn-categories"
                >
                  {humanize(category)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Base>
  );
};

export default Categories;

export const getStaticProps = () => {
  const categories = getTaxonomy(`content/${blog_folder}`, "categories");

  return {
    props: {
      categories: categories,
    },
  };
};
