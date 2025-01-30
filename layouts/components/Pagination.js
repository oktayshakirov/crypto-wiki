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
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let pages = [];
  const isInFirstHalf = currentPage <= Math.ceil(totalPages / 2);

  if (isInFirstHalf) {
    pages = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ].filter((page) => page > 0 && page <= totalPages);
    while (pages.length < 4) {
      const nextPage = pages[pages.length - 1] + 1;
      if (nextPage <= totalPages) {
        pages.push(nextPage);
      }
    }
  } else {
    pages = [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ].filter((page) => page > 0 && page <= totalPages);
    while (pages.length < 4) {
      const prevPage = pages[0] - 1;
      if (prevPage > 0) {
        pages.unshift(prevPage);
      }
    }
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

      {visiblePages.map((pageNumber) =>
        pageNumber === currentPage ? (
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
        )
      )}

      {hasNextPage && (
        <NextButton href={generateLink(linkBasePath, currentPage + 1)} />
      )}
    </nav>
  );
};

export default Pagination;
