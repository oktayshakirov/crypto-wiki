import { humanize, slugify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";

const SimilarPosts = ({ posts }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {posts.map((post, i) => (
        <div key={`key-${i}`} className="w-full p-4 sm:w-1/3">
          {post.frontmatter.image && (
            <Link href={`/posts/${post.slug}`}>
              <div className="relative h-56 w-full cursor-pointer">
                <Image
                  className="rounded-lg object-cover"
                  src={post.frontmatter.image}
                  alt={post.frontmatter.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Link>
          )}
          <ul className="mt-4 text-text">
            <li className="mb-2">
              <ul className="flex flex-wrap">
                {post.frontmatter.categories?.slice(0, 2).map((category, i) => (
                  <li className="mr-3" key={`category-${i}`}>
                    <Link
                      href={`/categories/${slugify(category)}`}
                      className="hover:text-primary"
                    >
                      &#9635; {humanize(category)}
                    </Link>
                  </li>
                ))}
                {post.frontmatter.categories?.length > 2 && (
                  <li className="mr-3 inline-block">
                    +{post.frontmatter.categories.length - 2}
                  </li>
                )}
              </ul>
            </li>
          </ul>
          <h5>
            <Link
              href={`/posts/${post.slug}`}
              className="block hover:text-primary"
            >
              {post.frontmatter.title}
            </Link>
          </h5>
        </div>
      ))}
    </div>
  );
};

export default SimilarPosts;
