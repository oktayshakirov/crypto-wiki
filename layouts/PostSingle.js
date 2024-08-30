import dateFormat from "@lib/utils/dateFormat";
import similerItems from "@lib/utils/similarItems";
import { humanize, markdownify, slugify } from "@lib/utils/textConverter";
import SimilarPosts from "@partials/SimilarPosts";
import shortcodes from "@shortcodes/all";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTag, FaUser, FaExchangeAlt } from "react-icons/fa";

const PostSingle = ({ post, posts, authors, cryptoOgs, exchanges, slug }) => {
  const { frontmatter, content, mdxContent } = post;
  let { description, title, date, image, categories, tags } = frontmatter;
  description = description ? description : content.slice(0, 120);
  const similarPosts = similerItems(post, posts, slug);

  return (
    <>
      <section className="section">
        <div className="container">
          <article className="text-center">
            {markdownify(title, "h1", "h2")}
            <ul className="my-5">
              {/* Author, Date, and Categories Row */}
              <li className="mb-5 flex flex-wrap items-center justify-between">
                <div className="flex flex-wrap items-center">
                  {/* Date Section */}
                  <span className="mt-2 flex items-center md:mt-0">
                    <FaCalendarAlt className="mr-2" />
                    {dateFormat(date)}
                  </span>
                </div>

                {/* Categories Section */}
                <div className="mt-4 flex flex-wrap justify-center gap-3 md:mt-0 md:justify-end">
                  {categories.map((category, i) => (
                    <Link
                      href={`/categories/${slugify(category)}`}
                      key={`category-${i}`}
                      className="flex items-center hover:text-primary"
                    >
                      <FaTag className="mr-2" />
                      {humanize(category)}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Crypto OGs Section */}
              {frontmatter["crypto-ogs"] && cryptoOgs && (
                <li className="mt-4 flex flex-wrap items-center justify-center space-x-2 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <FaUser />
                    <span>Crypto OG&apos;s mentioned:</span>
                  </div>
                  <ul className="mt-2 flex flex-wrap justify-center gap-4 md:mt-0">
                    {cryptoOgs
                      .filter((cryptoOg) =>
                        frontmatter["crypto-ogs"]
                          .map((cryptoOg) => slugify(cryptoOg))
                          .includes(slugify(cryptoOg.frontmatter.title))
                      )
                      .map((cryptoOg, i) => (
                        <li key={`cryptoOg-${i}`} className="flex items-center">
                          <Link
                            href={`/crypto-ogs/${slugify(
                              cryptoOg.frontmatter.title
                            )}`}
                            className="flex items-center hover:text-primary"
                          >
                            {cryptoOg.frontmatter.image && (
                              <Image
                                src={cryptoOg.frontmatter.image}
                                alt={cryptoOg.frontmatter.title}
                                height={50}
                                width={50}
                                className="mr-2 h-6 w-6 rounded-full"
                              />
                            )}
                            <span>{cryptoOg.frontmatter.title}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
              )}

              {/* Exchanges Section */}
              {frontmatter["exchanges"] && exchanges && (
                <li className="mt-4 flex flex-wrap items-center justify-center space-x-2 md:mt-0">
                  <div className="flex items-center space-x-2">
                    <FaExchangeAlt />
                    <span>Exchanges mentioned:</span>
                  </div>
                  <ul className="mt-2 flex flex-wrap justify-center gap-4 md:mt-0">
                    {exchanges
                      .filter((exchange) =>
                        frontmatter["exchanges"]
                          .map((exchange) => slugify(exchange))
                          .includes(slugify(exchange.frontmatter.title))
                      )
                      .map((exchange, i) => (
                        <li key={`exchange-${i}`} className="flex items-center">
                          <Link
                            href={`/exchanges/${slugify(
                              exchange.frontmatter.title
                            )}`}
                            className="flex items-center hover:text-primary"
                          >
                            {exchange.frontmatter.image && (
                              <Image
                                src={exchange.frontmatter.image}
                                alt={exchange.frontmatter.title}
                                height={50}
                                width={50}
                                className="mr-2 h-6 w-6 rounded-full"
                              />
                            )}
                            <span>{exchange.frontmatter.title}</span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </li>
              )}
            </ul>
            {image && (
              <Image
                src={image}
                height={500}
                width={1000}
                alt={title}
                className="rounded-lg"
              />
            )}
            <div className="content mb-16 text-left text-white">
              <MDXRemote {...mdxContent} components={shortcodes} />
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <ul className="mb-4 mr-4 flex flex-wrap justify-center gap-3">
                {tags.map((tag, i) => (
                  <li className="inline-block" key={`tag-${i}`}>
                    <Link
                      href={`/tags/${slugify(tag)}`}
                      className="block rounded-lg bg-theme-light px-4 py-2 font-semibold text-light hover:text-primary"
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
          <h2 className="mb-8 text-center">Similar Posts</h2>
          <SimilarPosts posts={similarPosts.slice(0, 3)} />
        </div>
      </section>
    </>
  );
};

export default PostSingle;
