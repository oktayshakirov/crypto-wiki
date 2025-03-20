import config from "@config/config.json";
import Base from "@layouts/Baseof";
import { getTaxonomy } from "@lib/taxonomyParser";
import { humanize, markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
const { blog_folder } = config.settings;

const Tags = ({ tags }) => {
  return (
    <Base
      title="All Crypto Tags | Explore Topics on Blockchain, AI & More - Crypto Wiki"
      meta_title="All Crypto Tags | Explore Topics on Blockchain, AI & More - Crypto Wiki"
      description="Browse all tags on Crypto Wiki to find articles, guides, and insights about cryptocurrency, blockchain, AI, and Web3. Stay updated with the latest trends and topics."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tags`}
    >
      <section className="section">
        <div className="container text-center">
          {markdownify("TAGS", "h1", "h2 mb-16")}
          <ul className="flex flex-wrap justify-center gap-7">
            {tags.map((category, i) => (
              <li key={`category-${i}`}>
                <Link href={`/tags/${category}`} className="btn-primary">
                  # {humanize(category)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Base>
  );
};

export default Tags;

export const getStaticProps = () => {
  const tags = getTaxonomy(`content/${blog_folder}`, "tags");

  return {
    props: {
      tags: tags,
    },
  };
};
