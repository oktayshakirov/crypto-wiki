import Base from "@layouts/Baseof";
import { getSinglePage } from "@lib/contentParser";
import Posts from "@partials/Posts";
import { markdownify } from "@lib/utils/textConverter";
import FearAndGreedIndex from "@layouts/components/FearAndGreedIndex";
import Link from "next/link";

const Home = ({ posts }) => {
  return (
    <Base>
      <section>
        <div className="container my-7 text-center">
          {markdownify("LATEST POSTS", "h2", "mb-8")}
          <Posts posts={posts.slice(0, 6)} />
          <div className="container mb-20">
            <Link className="btn btn-outline mx-3" href="/posts">
              MORE POSTS
            </Link>
            <Link className="btn btn-outline mx-3" href="/categories">
              CATEGORIES
            </Link>
            <Link className="btn btn-outline mx-3" href="/tags">
              TAGS
            </Link>
            <Link className="btn btn-outline mx-3" href="/authors">
              AUTHORS
            </Link>
          </div>
          {markdownify("MARKET MOOD: The Crypto Rollercoaster!", "h3")}
          <Link href="/tools/fear-and-greed-index">Learn more</Link>
          <FearAndGreedIndex />
        </div>
      </section>
    </Base>
  );
};

export default Home;

export const getStaticProps = async () => {
  const posts = getSinglePage("content/posts");

  return {
    props: {
      posts: posts || [],
    },
  };
};
