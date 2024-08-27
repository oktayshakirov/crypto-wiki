import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const Authors = ({ authors }) => {
  const router = useRouter();

  return (
    <div className="row justify-center">
      {authors.map((author, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`key-${i}`}>
          <div className="group flex h-full flex-col justify-between rounded-lg border border-white p-4 hover:border-primary hover:bg-black hover:bg-opacity-40">
            {author.frontmatter.image && (
              <div className="mb-4 flex items-center justify-center">
                <Link href={`/authors/${author.slug}`}>
                  <Image
                    src={author.frontmatter.image}
                    alt={author.frontmatter.title}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </Link>
              </div>
            )}
            <h3 className="h4 mb-2 text-center">
              <Link
                href={`/authors/${author.slug}`}
                className="group-hover:text-primary"
              >
                {author.frontmatter.title}
              </Link>
            </h3>
            <p
              className="flex-grow text-center group-hover:text-primary"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {author.frontmatter.description}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                className="btn btn-outline-primary flex items-center group-hover:border-primary group-hover:text-primary"
                onClick={() => router.push(`/authors/${author.slug}`)}
              >
                <FaUser className="mr-2" />
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Authors;
