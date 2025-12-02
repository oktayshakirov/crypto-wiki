import dateFormat from "@lib/utils/dateFormat";
import { humanize, markdownify, slugify } from "@lib/utils/textConverter";
import SimilarPosts from "@partials/SimilarPosts";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTag, FaUser, FaExchangeAlt } from "react-icons/fa";
import NextPrevNavigation from "@partials/NextPrevNavigation";
import GoBackLink from "@partials/GoBackLink";
import Base from "./Baseof";
import config from "@config/config.json";

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
  let { description, title, date, image, categories, tags, authors } =
    frontmatter;
  description = description ? description : content.slice(0, 120);

  return (
    <Base
      title={`${title} | Crypto Wiki`}
      meta_title={`${title} | Crypto Wiki`}
      description={description ? description : content.slice(0, 160)}
      image={image}
      canonical={`${config.site.base_url}/posts/${slug}`}
      isApp={isApp}
    >
      <section className="section">
        <div className="container">
          <GoBackLink option="posts" />
          <article className="text-center">
            {markdownify(title, "h1", "h1 mb-4")}
            <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <span className="flex items-center whitespace-nowrap">
                  <FaCalendarAlt className="mr-1.5 opacity-80" />
                  {dateFormat(date)}
                </span>
                {authors && authors.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                    <span className="flex items-center">
                      <FaUser className="mr-1.5 opacity-80" />
                    </span>
                    {authors.map((author, i) => (
                      <Link
                        key={slugify(author)}
                        href={`/authors/${slugify(author)}`}
                        className="hover:text-primary hover:underline"
                      >
                        {author}
                        {i < authors.length - 1 ? (
                          <span className="ml-1 opacity-80">,</span>
                        ) : (
                          ""
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {categories && categories.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  <FaTag className="mr-1 opacity-80" />
                  {categories.map((category, i) => (
                    <Link
                      key={`category-${i}`}
                      href={`/categories/${slugify(category)}`}
                      className="hover:text-primary hover:underline"
                    >
                      {humanize(category)}
                      {i < categories.length - 1 ? (
                        <span className="ml-1">,</span>
                      ) : (
                        ""
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              {(frontmatter["crypto-ogs"] || []).length > 0 && cryptoOgs && (
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  <span className="flex items-center font-medium">
                    <FaUser className="mr-1.5 opacity-80" /> OGs:
                  </span>
                  {cryptoOgs
                    .filter((og) =>
                      (frontmatter["crypto-ogs"] || [])
                        .map((name) => slugify(name))
                        .includes(slugify(og.frontmatter.title))
                    )
                    .map((og, i, arr) => (
                      <Link
                        key={`cryptoOg-${i}`}
                        href={`/crypto-ogs/${slugify(og.frontmatter.title)}`}
                        className="hover:text-primary hover:underline"
                      >
                        {og.frontmatter.title}
                        {i < arr.length - 1 ? (
                          <span className="ml-1 opacity-80">,</span>
                        ) : (
                          ""
                        )}
                      </Link>
                    ))}
                </div>
              )}
              {(frontmatter["exchanges"] || []).length > 0 && exchanges && (
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  <span className="flex items-center font-medium">
                    <FaExchangeAlt className="mr-1.5 opacity-80" /> Exchanges:
                  </span>
                  {exchanges
                    .filter((ex) =>
                      (frontmatter["exchanges"] || [])
                        .map((name) => slugify(name))
                        .includes(slugify(ex.frontmatter.title))
                    )
                    .map((ex, i, arr) => (
                      <Link
                        key={`exchange-${i}`}
                        href={`/exchanges/${slugify(ex.frontmatter.title)}`}
                        className="hover:text-primary hover:underline"
                      >
                        {ex.frontmatter.title}
                        {i < arr.length - 1 ? (
                          <span className="ml-1 opacity-80">,</span>
                        ) : (
                          ""
                        )}
                      </Link>
                    ))}
                </div>
              )}
            </div>
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
              <MDXRemote {...mdxContent} />
            </div>
            <div className="flex flex-wrap items-center justify-center">
              <ul className="flex flex-wrap justify-center gap-2">
                {tags.map((tag, i) => (
                  <li key={`tag-${i}`} className="inline-block">
                    <Link
                      href={`/tags/${slugify(tag)}`}
                      className="inline-block rounded-lg bg-theme-light px-3 py-1.5 text-sm font-medium text-light hover:text-primary"
                    >
                      #{humanize(tag)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
