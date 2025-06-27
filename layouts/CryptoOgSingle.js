import { markdownify } from "@lib/utils/textConverter";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Base from "./Baseof";
import Social from "@components/Social";
import Authors from "@components/Authors";
import { FaCalendarAlt } from "react-icons/fa";
import dateFormat from "@lib/utils/dateFormat";
import NextPrevNavigation from "@partials/NextPrevNavigation";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";

const CryptoOgSingle = ({
  frontmatter,
  content,
  mdxContent,
  ogs = [],
  slug,
  isApp,
}) => {
  const { description, social, title, image, authors, date } = frontmatter;
  const currentIndex = ogs.findIndex((og) => og.slug === slug);
  const nextOg = currentIndex !== -1 ? ogs[currentIndex + 1] : null;
  const prevOg = currentIndex !== -1 ? ogs[currentIndex - 1] : null;

  return (
    <Base
      title={`${title} | Contributions & Impact in the Crypto Space - Crypto Wiki`}
      meta_title={`${title} | Achievements, Contributions & Impact - Crypto Wiki`}
      description={description ? description : content.slice(0, 160)}
      image={image}
      canonical={`${config.site.base_url}/crypto-ogs/${slug}`}
      isApp={isApp}
    >
      <section className="section">
        <div className="container">
          <GoBackLink option="crypto-ogs" />
          <div className="mb-4 text-center md:px-24">
            {image && (
              <div className="mb-8">
                <Image
                  src={image}
                  className="mx-auto aspect-auto rounded-lg"
                  height={150}
                  width={150}
                  alt={title}
                />
              </div>
            )}
            {markdownify(title, "h1", "h1 mb-8")}
            <Social source={social} className="social-icons-simple" />
            <div className="content text-start">
              <MDXRemote {...mdxContent} />
            </div>
            <div className="flex items-center justify-center">
              <span className="mt-2 flex items-center md:mt-0">
                <FaCalendarAlt className="mr-2" />
                {dateFormat(date)}
              </span>
              <Authors authors={authors} />
            </div>
          </div>
        </div>
      </section>
      {(prevOg || nextOg) && (
        <section className="section">
          <div className="container">
            <NextPrevNavigation
              prevItem={prevOg}
              nextItem={nextOg}
              basePath="crypto-ogs"
            />
          </div>
        </section>
      )}
    </Base>
  );
};

export default CryptoOgSingle;
