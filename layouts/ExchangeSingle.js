import { markdownify } from "@lib/utils/textConverter";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Base from "./Baseof";
import Social from "@components/Social";
import Authors from "@components/Authors";
import { FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import dateFormat from "@lib/utils/dateFormat";
import NextPrevNavigation from "@partials/NextPrevNavigation";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import { mdxComponents } from "@lib/mdxComponents";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";

const ExchangeSingle = ({
  frontmatter,
  content,
  mdxContent,
  prevExchange,
  nextExchange,
  slug,
  isApp,
}) => {
  const { description, social, title, image, authors, date } = frontmatter;

  return (
    <Base
      title={`${title} Review | In-Depth Exchange Analysis - Crypto Wiki`}
      meta_title={`${title} Review | In-Depth Exchange Analysis - Crypto Wiki`}
      description={description ? description : content.slice(0, 160)}
      image={image}
      canonical={`${config.site.base_url}/exchanges/${slug}`}
      isApp={isApp}
    >
      <section className="section">
        <div className="container ">
          <GoBackLink option="exchanges" />
          <DisclaimerBanner />
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
            {markdownify(title, "h1", "h1 mb-8")}
            <Social source={social} className="social-icons-simple" />
            <div className="content text-start">
              <MDXRemote {...mdxContent} components={mdxComponents} />
            </div>
            <div className="mt-4 rounded-lg border-2 border-orange-400 p-4 text-center">
              <p className="m-0">
                Explore other platforms on our{" "}
                <Link href="/exchanges" className="text-primary">
                  Exchanges page
                </Link>{" "}
                or learn more about exchanges and brokers in general in our
                guide:{" "}
                <Link
                  href="/posts/understanding-crypto-exchanges"
                  className="text-primary"
                >
                  Understanding Crypto Exchanges
                </Link>
                .
              </p>
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
