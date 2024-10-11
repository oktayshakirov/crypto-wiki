import { markdownify } from "@lib/utils/textConverter";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Base from "./Baseof";
import Social from "@components/Social";
import Authors from "@components/Authors";
import { FaCalendarAlt } from "react-icons/fa";
import dateFormat from "@lib/utils/dateFormat";
import NextPrevNavigation from "@partials/NextPrevNavigation";

const ExchangeSingle = ({
  frontmatter,
  content,
  mdxContent,
  exchanges = [],
  slug,
}) => {
  const { description, social, title, image, authors, date } = frontmatter;
  const currentIndex = exchanges.findIndex(
    (exchange) => exchange.slug === slug
  );

  const nextExchange = currentIndex !== -1 ? exchanges[currentIndex + 1] : null;
  const prevExchange = currentIndex !== -1 ? exchanges[currentIndex - 1] : null;

  return (
    <Base
      title={title}
      description={description ? description : content.slice(0, 120)}
      image={image}
    >
      <section className="section">
        <div className="container">
          <div className="text-center md:px-24">
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
              <MDXRemote {...mdxContent} components={shortcodes} />
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
      {(prevExchange || nextExchange) && (
        <section className="section">
          <div className="container">
            <NextPrevNavigation
              prevItem={prevExchange}
              nextItem={nextExchange}
              basePath="exchanges"
            />
          </div>
        </section>
      )}
    </Base>
  );
};

export default ExchangeSingle;
