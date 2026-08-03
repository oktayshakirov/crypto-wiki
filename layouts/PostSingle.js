import dateFormat from "@lib/utils/dateFormat";
import { humanize, markdownify, slugify } from "@lib/utils/textConverter";
import SimilarPosts from "@partials/SimilarPosts";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import { FaCalendarAlt, FaTag, FaUser, FaExchangeAlt } from "react-icons/fa";
import NextPrevNavigation from "@partials/NextPrevNavigation";
import GoBackLink from "@partials/GoBackLink";
import Base from "./Baseof";
import config from "@config/config.json";
import { mdxComponents } from "@lib/mdxComponents";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";
import ViewsCounter from "@components/ViewsCounter";
import Authors from "@components/Authors";
import { articleSchema, breadcrumbSchema } from "@lib/utils/jsonLd";
import PostMeta from "@components/PostMeta";

// Frontmatter lists entities by title; the full pages live in a separate array.
// Match them on slug so casing and punctuation differences do not drop links.
const matchFrontmatter = (pages, titles) => {
  const wanted = (titles || []).map((title) => slugify(title));
  return (pages || []).filter((page) =>
    wanted.includes(slugify(page.frontmatter.title))
  );
};

const PostSingle = ({
  post,
  prevPost,
  nextPost,
  cryptoOgs,
  exchanges,
  slug,
  isApp,
  similarPosts,
}) => {
  const { frontmatter, content, mdxContent } = post;
  let { description, title, date, image, categories, authors, updated } =
    frontmatter;
  description = description ? description : content.slice(0, 120);

  const url = `${config.site.base_url}/posts/${slug}`;
  const jsonLd = [
    articleSchema({
      title,
      description,
      image,
      datePublished: date,
      dateModified: updated || date,
      url,
      type: "BlogPosting",
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Posts", path: "/posts" },
      { name: title, path: `/posts/${slug}` },
    ]),
  ];

  return (
    <Base
      title={`${title} | Crypto Wiki`}
      meta_title={`${title} | Crypto Wiki`}
      description={description ? description : content.slice(0, 160)}
      image={image}
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section">
        <div className="container">
          <GoBackLink option="posts" />
          <article className="text-center">
            {markdownify(title, "h1", "h1 mb-4")}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center">
                <FaCalendarAlt className="mr-2 opacity-80" aria-hidden="true" />
                {dateFormat(date)}
              </span>
              {/* No separator glyph: the counter fades in later, and a lone
                  middot sitting next to the date looks like a typo. */}
              <ViewsCounter type="posts" slug={slug} />
            </div>
            {/* Ordered to match the main menu: Posts, Exchanges, OG's. */}
            <PostMeta
              groups={[
                {
                  key: "topics",
                  icon: FaTag,
                  singular: "topic",
                  plural: "topics",
                  items: (categories || []).map((category) => ({
                    title: humanize(category),
                    href: `/categories/${slugify(category)}`,
                  })),
                },
                {
                  key: "exchanges",
                  icon: FaExchangeAlt,
                  singular: "exchange",
                  plural: "exchanges",
                  items: matchFrontmatter(
                    exchanges,
                    frontmatter["exchanges"]
                  ).map((ex) => ({
                    title: ex.frontmatter.title,
                    href: `/exchanges/${slugify(ex.frontmatter.title)}`,
                  })),
                },
                {
                  key: "crypto-ogs",
                  icon: FaUser,
                  singular: "OG",
                  plural: "OG's",
                  items: matchFrontmatter(
                    cryptoOgs,
                    frontmatter["crypto-ogs"]
                  ).map((og) => ({
                    title: og.frontmatter.title,
                    href: `/crypto-ogs/${slugify(og.frontmatter.title)}`,
                  })),
                },
              ]}
            />
            {image && (
              <Image
                src={image}
                height={500}
                width={1000}
                alt={title}
                className="mb-8 rounded-lg"
                priority
              />
            )}
            <div className="content mb-16 text-left text-white">
              <MDXRemote {...mdxContent} components={mdxComponents} />
            </div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center whitespace-nowrap">
                <FaCalendarAlt className="mr-2 opacity-80" />
                {updated ? "Last updated: " : ""}
                {dateFormat(updated || date)}
              </span>
              {authors && authors.length > 0 && (
                <Authors authors={authors} />
              )}
            </div>
            <DisclaimerBanner />
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <NextPrevNavigation
            prevItem={prevPost}
            nextItem={nextPost}
            basePath="posts"
          />
        </div>
      </section>
      {similarPosts && similarPosts.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="mb-8 text-center">Similar Posts</h2>
            <SimilarPosts posts={similarPosts} />
          </div>
        </section>
      )}
    </Base>
  );
};

export default PostSingle;
