import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const generateLink = (basePath, page) => {
  return page === 1 ? basePath : `${basePath}/page/${page}`;
};

const PrevButton = ({ href }) => (
  <Link href={href} className="btn-primary">
    <FaChevronLeft className="h-5 w-2" />
  </Link>
);

const NextButton = ({ href }) => (
  <Link href={href} className="btn-primary">
    <FaChevronRight className="h-5 w-2" />
  </Link>
);

const getVisiblePages = (currentPage, totalPages, isMobile) => {
  if (!isMobile) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const maxVisible = 3;
  let pages = [];

  if (totalPages <= maxVisible + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage <= 3) {
    pages.push(2);
    pages.push(3);
    if (totalPages > 4) {
      pages.push("...");
    }
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push("...");
    for (let i = totalPages - 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push("...");
    pages.push(currentPage);
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};

const Pagination = ({ section, currentPage, totalPages, basePath }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;
  const linkBasePath = basePath || (section ? `/${section}` : "/");

  const visiblePages = mounted
    ? getVisiblePages(currentPage, totalPages, isMobile)
    : getVisiblePages(currentPage, totalPages, false);

  return (
    <nav className="pagination" aria-label="Pagination">
      {hasPrevPage && (
        <PrevButton href={generateLink(linkBasePath, currentPage - 1)} />
      )}

      {visiblePages.map((pageNumber, index) => {
        if (pageNumber === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          );
        }

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
