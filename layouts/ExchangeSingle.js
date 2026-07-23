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
import { mdxComponents } from "@lib/mdxComponents";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";
import ViewsCounter from "@components/ViewsCounter";
import ExchangeFaq from "@components/ExchangeFaq";
import ExchangeQuickFacts from "@components/ExchangeQuickFacts";
import RelatedTools from "@components/RelatedTools";
import {
  breadcrumbSchema,
  exchangeReviewSchema,
  faqSchema,
} from "@lib/utils/jsonLd";

const ExchangeSingle = ({
  frontmatter,
  content,
  mdxContent,
  prevExchange,
  nextExchange,
  slug,
  isApp,
}) => {
  const {
    description,
    social,
    title,
    image,
    authors,
    date,
    updated,
    faqs,
    quickFacts,
  } = frontmatter;

  const url = `${config.site.base_url}/exchanges/${slug}`;
  const metaDescription = description ? description : content.slice(0, 160);

  const jsonLd = [
    exchangeReviewSchema({
      title,
      description: metaDescription,
      image,
      datePublished: date,
      dateModified: updated || date,
      url,
      quickFacts,
      website: social && social.website,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Exchanges", path: "/exchanges" },
      { name: title, path: `/exchanges/${slug}` },
    ]),
    faqSchema(faqs),
  ].filter(Boolean);

  return (
    <Base
      title={`${title} Review | In-Depth Exchange Analysis - Crypto Wiki`}
      meta_title={`${title} Review | In-Depth Exchange Analysis - Crypto Wiki`}
      description={metaDescription}
      image={image}
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section">
        <div className="container ">
          <GoBackLink option="exchanges" />
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
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <ViewsCounter type="exchanges" slug={slug} />
            </div>
            <Social source={social} className="social-icons-simple" />
            <ExchangeQuickFacts facts={quickFacts} title={title} />
            <div className="content text-start">
              <MDXRemote {...mdxContent} components={mdxComponents} />
            </div>
            {faqs && faqs.length > 0 && (
              <ExchangeFaq title={title} faqs={faqs} />
            )}
            <RelatedTools />
            <div className="mb-8 mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center md:mt-0">
                <FaCalendarAlt className="mr-2 opacity-80" />
                {updated ? "Last updated: " : ""}
                {dateFormat(updated || date)}
              </span>
              {authors && authors.length > 0 && (
                <span className="flex items-center md:mt-0">
                  <span className="mr-2 opacity-80">Reviewed by</span>
                  <Authors authors={authors} />
                </span>
              )}
            </div>
            <DisclaimerBanner />
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
