import { slugify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";
import { FaTag, FaUser, FaAt } from "react-icons/fa";
import { useRouter } from "next/router";

const Posts = ({ posts }) => {
  const router = useRouter();

  const handleCardClick = (e, slug) => {
    if (!e.target.closest("a")) {
      router.push(`/posts/${slug}`);
    }
  };

  return (
    <div className="row">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="col-12 mb-7 justify-center min-[650px]:col-6"
        >
          <div
            className="card flex h-full flex-col justify-between"
            onClick={(e) => handleCardClick(e, post.slug)}
            style={{ cursor: "pointer" }}
          >
            {post.frontmatter.image && (
              <div className="relative h-64 w-full">
                <Image
                  className="rounded-lg object-cover"
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
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
                      className="mr-1 flex items-center text-xs hover:text-primary sm:text-sm"
                    >
                      <FaTag className="mx-2 text-xs sm:text-base" />
                      <span>{category}</span>
                    </Link>
                  ))}
                {post.frontmatter.categories.length > 3 && (
                  <span className="text-secondary ml-2 text-xs sm:text-sm">
                    +{post.frontmatter.categories.length - 3}
                  </span>
                )}
              </li>
              {post.frontmatter["crypto-ogs"]?.length && (
                <li className="flex flex-wrap items-center space-x-2">
                  {post.frontmatter["crypto-ogs"]
                    .slice(0, 3)
                    .map((cryptoOg, index) => (
                      <Link
                        href={`/crypto-ogs/${slugify(cryptoOg)}`}
                        key={`cryptoOg-${index}`}
                        className="mx-2 flex items-center text-xs hover:text-primary sm:text-sm"
                      >
                        <FaUser className="mr-2 text-xs sm:text-base" />
                        <span>{cryptoOg}</span>
                      </Link>
                    ))}
                  {post.frontmatter["crypto-ogs"].length > 3 && (
                    <span className="text-secondary text-xs sm:text-sm">
                      +{post.frontmatter["crypto-ogs"].length - 3}
                    </span>
                  )}
                </li>
              )}
              {post.frontmatter["exchanges"]?.length && (
                <li className="flex flex-wrap items-center space-x-2">
                  {post.frontmatter["exchanges"]
                    .slice(0, 3)
                    .map((exchange, index) => (
                      <Link
                        href={`/exchanges/${slugify(exchange)}`}
                        key={`exchange-${index}`}
                        className="mx-2 flex items-center text-xs hover:text-primary sm:text-sm"
                      >
                        <FaAt className="mr-2 text-xs sm:text-base" />
                        <span>{exchange}</span>
                      </Link>
                    ))}
                  {post.frontmatter["exchanges"].length > 3 && (
                    <span className="text-secondary text-xs sm:text-sm">
                      +{post.frontmatter["exchanges"].length - 3}
                    </span>
                  )}
                </li>
              )}
            </ul>
            <h4 className="mb-2 text-lg sm:text-2xl">
              {post.frontmatter.title}
            </h4>
            <p className="text-sm sm:text-sm">{post.frontmatter.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
