import Base from "@layouts/Baseof";
import Posts from "@partials/Posts";
import Pagination from "@components/Pagination";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import {
  paginatedCanonical,
  paginatedTitle,
  paginatedDescription,
} from "@lib/utils/pagination";

const CategoryLayout = ({
  category,
  posts,
  cryptoOgs,
  exchanges,
  currentPage,
  totalPages,
  isApp,
}) => {
  const metaTitle = paginatedTitle(
    `Discover ${category} posts | News, Guides & Analysis - Crypto Wiki`,
    currentPage
  );

  return (
    <Base
      title={metaTitle}
      meta_title={metaTitle}
      description={paginatedDescription(
        `Explore the latest Crypto ${category} trends, expert analysis, and detailed guides. Perfect for beginners and enthusiasts looking to deepen their crypto knowledge.`,
        currentPage
      )}
      image="/images/meta-image.png"
      canonical={paginatedCanonical(
        `/categories/${category.toLowerCase()}`,
        currentPage
      )}
      isApp={isApp}
    >
      <div className="section">
        <div className="container mb-8 text-left">
          <Link href="/categories">
            <button className="flex items-center">
              <FaArrowLeft className="mr-2" />
              All Categories
            </button>
          </Link>
        </div>
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Showing posts from <span className="text-primary">{category}</span>{" "}
            category
          </h1>
          <Posts posts={posts} cryptoOgs={cryptoOgs} exchanges={exchanges} />
          <Pagination
            section={`categories/${category}`}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </div>
    </Base>
  );
};

export default CategoryLayout;
