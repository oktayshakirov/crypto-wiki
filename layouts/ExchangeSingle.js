import { markdownify } from "@lib/utils/textConverter";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Base from "./Baseof";
import Social from "@components/Social";
import Authors from "@components/Authors";
import { FaCalendarAlt, FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import dateFormat from "@lib/utils/dateFormat";
import NextPrevNavigation from "@partials/NextPrevNavigation";
import Button from "@components/Button";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";

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
      title={`${title} Review | In-Depth Exchange Analysis - Crypto Wiki`}
      meta_title={`${title} Review | In-Depth Exchange Analysis - Crypto Wiki`}
      description={description ? description : content.slice(0, 160)}
      image={image}
      canonical={`${config.site.base_url}/exchanges/${slug}`}
    >
      <section className="section">
        <div className="container text-center">
          <GoBackLink option="exchanges" />
          <div className="mt-4 rounded-lg border-2 border-orange-400 p-4">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> The information provided here is for
              informational purposes only and does not constitute financial
              advice. Cryptocurrency trading involves risks, so please DYOR. For
              beginners, check out our{" "}
              <Link href="/categories/beginners" className="text-primary">
                Beginners Guides
              </Link>{" "}
              to learn more.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="text-center md:px-24">
            {image && (
              <div className="mb-8">
                <Image
                  src={image}
                  className="mx-auto aspect-auto rounded-lg"
                  height={250}
                  width={250}
                  alt={title}
                />
              </div>
            )}
            {markdownify(title, "h1", "h2 mb-8")}
            <Social source={social} className="social-icons-simple" />
            <div className="content text-start">
              <MDXRemote {...mdxContent} components={{ Button }} />
            </div>
            <div className="mt-8 flex items-center justify-center">
              <span className="flex items-center md:mt-0">
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
