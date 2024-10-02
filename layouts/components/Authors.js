import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";
import { slugify } from "@lib/utils/textConverter";

const Authors = ({ authors }) => {
  if (!authors || authors.length === 0) return null;

  return (
    <div className="ml-4 mt-2 flex items-center md:mt-0">
      {authors.map((author, i) => (
        <span key={`author-${i}`} className="ml-2 flex items-center">
          <Link
            href={`/authors/${slugify(author)}`}
            className="flex items-center hover:text-primary"
          >
            <FaPencilAlt className="mr-2" />
            {author}
          </Link>
          {i < authors.length - 1 ? "," : ""}
        </span>
      ))}
    </div>
  );
};

export default Authors;
