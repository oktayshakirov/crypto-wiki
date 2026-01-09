import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";
import { slugify } from "@lib/utils/textConverter";

const Authors = ({ authors }) => {
  if (!authors || authors.length === 0) return null;

  return (
    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
      {authors.map((author, i) => (
        <span key={`author-${i}`} className="flex items-center">
          <Link
            href={`/authors/${slugify(author)}`}
            className="flex items-center hover:text-primary"
          >
            <FaPencilAlt className="mr-2 opacity-80" />
            {author}
          </Link>
          {i < authors.length - 1 ? "," : ""}
        </span>
      ))}
    </div>
  );
};

export default Authors;
