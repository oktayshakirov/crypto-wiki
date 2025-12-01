import config from "@config/config.json";
import Base from "@layouts/Baseof";
import Posts from "@partials/Posts";
import Pagination from "@components/Pagination";
import BannerAd from "@layouts/components/BannerAd";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

const CategoryLayout = ({
  category,
  posts,
  cryptoOgs,
  exchanges,
  currentPage,
  totalPages,
  isApp,
}) => {
  return (
    <Base
      title={`Discover ${category} posts | News, Guides & Analysis - Crypto Wiki`}
      meta_title={`Discover ${category} posts | News, Guides & Analysis - Crypto Wiki`}
      description={`Explore the latest Crypto ${category} trends, expert analysis, and detailed guides. Perfect for beginners and enthusiasts looking to deepen their crypto knowledge.`}
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/categories/${category.toLowerCase()}`}
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
          {!isApp && <BannerAd id={`category-${category}-ad-1`} />}
          <Posts posts={posts} cryptoOgs={cryptoOgs} exchanges={exchanges} />
          {!isApp && <BannerAd id={`category-${category}-ad-2`} />}
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
