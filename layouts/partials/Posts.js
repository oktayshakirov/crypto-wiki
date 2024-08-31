import { slugify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { FaTag, FaUser, FaExchangeAlt } from "react-icons/fa";

const Posts = ({ posts }) => {
  return (
    <div className="row justify-center">
      {posts.map((post, i) => (
        <div key={`key-${i}`} className="col-12 mb-10 justify-center sm:col-6">
          <div className="group flex h-full flex-col justify-between rounded-lg border border-white p-4 hover:bg-black hover:bg-opacity-40 group-hover:text-primary">
            {post.frontmatter.image && (
              <Link href={`/${post.slug}`}>
                <div className="relative h-64 w-full">
                  <Image
                    className="rounded-lg object-cover"
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    layout="fill"
                  />
                </div>
              </Link>
            )}
            <ul className="mb-4 mt-4 ">
              {/* Categories */}
              <li className="flex flex-wrap">
                {post.frontmatter.categories
                  .slice(0, 3)
                  .map((category, index) => (
                    <Link
                      key={`category-${index}`}
                      href={`/categories/${slugify(category)}`}
                      className="mr-2 flex items-center hover:text-primary"
                    >
                      <FaTag className="mx-2" />
                      <span>{category}</span>
                    </Link>
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
                          className="mx-3 flex items-center hover:text-primary"
                        >
                          {/* Profile icon for Crypto OGs */}
                          <FaUser className="mr-2" />
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
                          className="mx-3 flex items-center hover:text-primary"
                        >
                          {/* Currency exchange icon for Exchanges */}
                          <FaExchangeAlt className="mr-2" />
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
            {/* Title */}
            <h4 className="mb-2 group-hover:text-primary">
              <Link href={`/${post.slug}`} className="block ">
                {post.frontmatter.title}
              </Link>
            </h4>

            <p className="group-hover:text-primary">
              {post.frontmatter.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
