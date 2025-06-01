import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";

const Pagination = ({ section, currentPage, totalPages, basePath }) => {
  const [isMobile, setIsMobile] = useState(false);
  const linkBasePath = basePath || (section ? `/${section}` : "/");
  const hasPrevPage = currentPage > 1;
  const hasNextPage = totalPages > currentPage;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const getVisiblePages = () => {
    const maxVisible = isMobile ? 5 : 8;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const generateLink = (page) => {
    return page === 1 ? linkBasePath : `${linkBasePath}/page/${page}`;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2 py-4"
      aria-label="Pagination"
    >
      {hasPrevPage && (
        <Link
          href={generateLink(currentPage - 1)}
          className="btn-pagination"
          aria-label="Previous page"
        >
          <FaChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {getVisiblePages().map((pageNumber) => (
        <Link
          key={`page-${pageNumber}`}
          href={generateLink(pageNumber)}
          className={`btn-pagination ${
            pageNumber === currentPage ? "active" : ""
          }`}
          aria-current={pageNumber === currentPage ? "page" : undefined}
        >
          {pageNumber}
        </Link>
      ))}

      {hasNextPage && (
        <Link
          href={generateLink(currentPage + 1)}
          className="btn-pagination"
          aria-label="Next page"
        >
          <FaChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
