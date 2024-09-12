import { slugify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { FaTag, FaUser, FaAt } from "react-icons/fa";
import { useRouter } from "next/router";

const Posts = ({ posts }) => {
  const router = useRouter();

  return (
    <div className="row">
      {posts.map((post, i) => (
        <div key={`key-${i}`} className="col-12 mb-10 justify-center sm:col-6">
          <div
            className="card flex h-full flex-col justify-between"
            onClick={() => router.push(`/${post.slug}`)}
            style={{ cursor: "pointer" }}
          >
            {post.frontmatter.image && (
              <div className="relative h-64 w-full">
                <Image
                  className="rounded-lg object-cover"
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  layout="fill"
                />
              </div>
            )}
            <ul className="my-4">
              <li className="flex flex-wrap">
                {post.frontmatter.categories
                  .slice(0, 3)
                  .map((category, index) => (
                    <Link
                      key={`category-${index}`}
                      href={`/categories/${slugify(category)}`}
                      className="mr-1 flex items-center hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
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
              {post.frontmatter["crypto-ogs"]?.length > 0 && (
                <li className="flex flex-wrap items-center space-x-2">
                  {post.frontmatter["crypto-ogs"]
                    .slice(0, 3)
                    .map((cryptoOg, index) => (
                      <Link
                        href={`/crypto-ogs/${slugify(cryptoOg)}`}
                        key={`cryptoOg-${index}`}
                        className="mx-2 flex items-center hover:text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
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
              {post.frontmatter["exchanges"]?.length > 0 && (
                <li className="flex flex-wrap items-center space-x-2">
                  {post.frontmatter["exchanges"]
                    .slice(0, 3)
                    .map((exchange, index) => (
                      <Link
                        href={`/exchanges/${slugify(exchange)}`}
                        key={`exchange-${index}`}
                        className="mx-2 flex items-center hover:text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaAt className="mr-2" />
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
            <h4 className="mb-2">{post.frontmatter.title}</h4>
            <p>{post.frontmatter.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
