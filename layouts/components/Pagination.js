import Link from "next/link";
import React from "react";

const generateLink = (section, page) => {
  const base = section ? `/${section}` : "/";
  return page === 1 ? base : `${base}/page/${page}`;
};

const PrevButton = ({ href }) => (
  <Link
    href={href}
    className="rounded-lg border border-primary px-2 py-2 text-dark"
  >
    <span className="sr-only">Previous</span>
    <svg
      className="mt-1 h-5 w-5"
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
  <Link
    href={href}
    className="rounded-lg border border-primary px-2 py-2 text-dark"
  >
    <span className="sr-only">Next</span>
    <svg
      className="mt-1 h-5 w-5"
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

const Pagination = ({ section, currentPage, totalPages }) => {
  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;

  return (
    <>
      {totalPages > 1 && (
        <nav
          className="mb-4 flex justify-center space-x-4"
          aria-label="Pagination"
        >
          {hasPrevPage ? (
            <PrevButton href={generateLink(section, currentPage - 1)} />
          ) : (
            <span
              className="2px rounded-lg border border-primary px-2 py-2 text-dark"
              aria-disabled="true"
            >
              <svg
                className="mt-1 h-5 w-5"
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
            </span>
          )}
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return pageNumber === currentPage ? (
              <span
                key={`page-${pageNumber}`}
                aria-current="page"
                className="rounded-lg border border-primary bg-primary px-4 py-2 font-bold text-black"
              >
                {pageNumber}
              </span>
            ) : (
              <Link
                key={`page-${pageNumber}`}
                href={generateLink(section, pageNumber)}
                className="rounded-lg border border-primary px-4 py-2 text-dark"
              >
                {pageNumber}
              </Link>
            );
          })}
          {hasNextPage ? (
            <NextButton href={generateLink(section, currentPage + 1)} />
          ) : (
            <span
              className="rounded-lg border border-primary px-2 py-2 text-dark"
              aria-disabled="true"
            >
              <svg
                className="mt-1 h-5 w-5"
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
            </span>
          )}
        </nav>
      )}
    </>
  );
};

export default Pagination;
