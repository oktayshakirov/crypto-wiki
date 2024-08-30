import dateFormat from "@lib/utils/dateFormat";
import { slugify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaTag } from "react-icons/fa";

const Posts = ({ posts, cryptoOgs, exchanges, className }) => {
  return (
    <div className="row justify-center">
      {posts.map((post, i) => (
        <div key={`key-${i}`} className="col-12 mb-10 justify-center sm:col-6">
          <div className="group flex h-full flex-col justify-between rounded-lg border border-white p-4 hover:border-primary hover:bg-black hover:bg-opacity-40">
            {post.frontmatter.image && (
              <Image
                className="rounded-lg"
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                width={445}
                height={230}
              />
            )}
            <ul className="mb-4 mt-4 ">
              {/* Title */}
              <h4 className="mb-2 group-hover:text-primary">
                <Link href={`/${post.slug}`} className="block ">
                  {post.frontmatter.title}
                </Link>
              </h4>
              {/* Categories */}
              <li className="flex flex-wrap">
                {post.frontmatter.categories
                  .slice(0, 3)
                  .map((category, index) => (
                    <div
                      key={`category-${index}`}
                      className="mr-2 flex items-center"
                    >
                      <FaTag className="mx-2" />
                      <Link
                        href={`/categories/${slugify(category)}`}
                        className="hover:text-primary"
                      >
                        <span>{category}</span>
                      </Link>
                    </div>
                  ))}
                {post.frontmatter.categories.length > 3 && (
                  <span className="text-secondary ml-2">
                    +{post.frontmatter.categories.length - 3}
                  </span>
                )}
              </li>
              {/* Crypto OGs Row */}
              {post.frontmatter["crypto-ogs"] &&
                post.frontmatter["crypto-ogs"].length > 0 && (
                  <li className="flex flex-wrap items-center space-x-3">
                    {post.frontmatter["crypto-ogs"]
                      .slice(0, 3)
                      .map((cryptoOg, index) => (
                        <Link
                          href={`/crypto-ogs/${slugify(cryptoOg)}`}
                          key={`cryptoOg-${index}`}
                          className="mr-3 flex items-center hover:text-primary"
                        >
                          {cryptoOgs
                            .filter(
                              (og) =>
                                slugify(og.frontmatter.title) ===
                                slugify(cryptoOg)
                            )
                            .map((og) => (
                              <Image
                                key={og.frontmatter.title}
                                src={og.frontmatter.image}
                                alt={og.frontmatter.title}
                                height={50}
                                width={50}
                                className="mr-2 h-6 w-6 rounded-full"
                              />
                            ))}
                          <span>{cryptoOg}</span>
                        </Link>
                      ))}
                    {post.frontmatter["crypto-ogs"].length > 3 && (
                      <span className="text-secondary">
                        +{post.frontmatter["crypto-ogs"].length - 3}
                      </span>
                    )}
                  </li>
                )}

              {/* Exchanges Row */}
              {post.frontmatter["exchanges"] &&
                post.frontmatter["exchanges"].length > 0 && (
                  <li className="flex flex-wrap items-center space-x-3">
                    {post.frontmatter["exchanges"]
                      .slice(0, 3)
                      .map((exchange, index) => (
                        <Link
                          href={`/exchanges/${slugify(exchange)}`}
                          key={`exchange-${index}`}
                          className="mr-3 flex items-center hover:text-primary"
                        >
                          {exchanges
                            .filter(
                              (ex) =>
                                slugify(ex.frontmatter.title) ===
                                slugify(exchange)
                            )
                            .map((ex) => (
                              <Image
                                key={ex.frontmatter.title}
                                src={ex.frontmatter.image}
                                alt={ex.frontmatter.title}
                                height={50}
                                width={50}
                                className="mr-2 h-6 w-6 rounded-full"
                              />
                            ))}
                          <span>{exchange}</span>
                        </Link>
                      ))}
                    {post.frontmatter["exchanges"].length > 3 && (
                      <span className="text-secondary">
                        +{post.frontmatter["exchanges"].length - 3}
                      </span>
                    )}
                  </li>
                )}
            </ul>
            <p className="text-text">{post.frontmatter.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
