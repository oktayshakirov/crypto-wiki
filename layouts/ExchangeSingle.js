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
import EntitySidebar from "@partials/EntitySidebar";
import TableOfContents from "@components/TableOfContents";
import {
  breadcrumbSchema,
  exchangeReviewSchema,
  faqSchema,
  videoObjectSchema,
} from "@lib/utils/jsonLd";
import PostVideo from "@components/PostVideo";
import { PageVideoProvider } from "context/video";
import { getPageVideo } from "@lib/videos";

const ExchangeSingle = ({
  frontmatter,
  content,
  mdxContent,
  toc,
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
  const video = getPageVideo("exchanges", slug);

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
    videoObjectSchema(video),
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
        <div className="container max-w-[1200px]">
          <GoBackLink option="exchanges" />
        </div>
      </section>
      <section className="section">
        <div className="container max-w-[1200px]">
          {/* Same two-column shape as a post: the body keeps a reading measure
              and the rail takes the reference material. `items-start` is what
              makes the rail's sticky positioning work - stretched to row
              height it would silently stop sticking. */}
          <div className="flex flex-col gap-10 xl:flex-row xl:items-start">
            <div className="min-w-0 flex-1 text-center xl:max-w-[760px]">
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
              <div className="xl:hidden">
                <Social source={social} className="social-icons-simple" />
              </div>
              <TableOfContents toc={toc} variant="inline" />
              <PageVideoProvider video={video}>
                {/* Above the quick facts, not below: the facts table runs most of
                  a screen on its own and would push the video out of sight. */}
                {video?.placement === "auto" && (
                  <div className="text-start">
                    <PostVideo video={video} />
                  </div>
                )}
                <div className="xl:hidden">
                  <ExchangeQuickFacts facts={quickFacts} title={title} />
                </div>
                <div className="content text-start">
                  <MDXRemote {...mdxContent} components={mdxComponents} />
                </div>
              </PageVideoProvider>
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
            <EntitySidebar
              toc={toc}
              quickFacts={
                <ExchangeQuickFacts facts={quickFacts} title={title} compact />
              }
              social={social}
              linksTitle="Official Links"
            />
          </div>
        </div>
      </section>
      {(prevExchange || nextExchange) && (
        <section className="section">
          <div className="container max-w-[1200px]">
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
