import { markdownify } from "@lib/utils/textConverter";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Base from "./Baseof";
import Social from "@components/Social";
import Authors from "@components/Authors";
import { FaCalendarAlt } from "react-icons/fa";
import dateFormat from "@lib/utils/dateFormat";
import NextPrevNavigation from "@partials/NextPrevNavigation";

const CryptoOgSingle = ({
  frontmatter,
  content,
  mdxContent,
  ogs = [],
  slug,
}) => {
  const { description, social, title, image, authors, date } = frontmatter;
  const currentIndex = ogs.findIndex((og) => og.slug === slug);
  const nextOg = currentIndex !== -1 ? ogs[currentIndex + 1] : null;
  const prevOg = currentIndex !== -1 ? ogs[currentIndex - 1] : null;

  return (
    <Base
      title={`${title}: Contributions and Role in the Crypto Space`}
      description={description ? description : content.slice(0, 120)}
      image={image}
    >
      <section className="section">
        <div className="container">
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
            {markdownify(title, "h1", "h2 mb-8")}
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
