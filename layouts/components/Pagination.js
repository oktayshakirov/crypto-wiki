import Link from "next/link";
import React from "react";

const generateLink = (basePath, page) => {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
};

const PrevButton = ({ href }) => (
  <Link href={href} className="btn-primary">
    <span className="sr-only">Previous</span>
    <svg
      className="h-5 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </Link>
);

const NextButton = ({ href }) => (
  <Link href={href} className="btn-primary">
    <span className="sr-only">Next</span>
    <svg
      className="h-5 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </Link>
);

const Pagination = ({ section, currentPage, totalPages, basePath }) => {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;
  const linkBasePath = basePath || (section ? `/${section}` : "/");

  return (
    <nav className="mb-4 flex justify-center space-x-4" aria-label="Pagination">
      {hasPrevPage && (
        <PrevButton href={generateLink(linkBasePath, currentPage - 1)} />
      )}
      {[...Array(totalPages)].map((_, i) => {
        const pageNumber = i + 1;
        return pageNumber === currentPage ? (
          <span
            key={`page-${pageNumber}`}
            aria-current="page"
            className="btn-primary active-page"
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            key={`page-${pageNumber}`}
            href={generateLink(linkBasePath, pageNumber)}
            className="btn-primary hover-page"
          >
            {pageNumber}
          </Link>
        );
      })}
      {hasNextPage && (
        <NextButton href={generateLink(linkBasePath, currentPage + 1)} />
      )}
    </nav>
  );
};

export default Pagination;
