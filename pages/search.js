import Base from "@layouts/Baseof";
import Posts from "@layouts/partials/Posts";
import { getSinglePage } from "@lib/contentParser";
import { slugify } from "@lib/utils/textConverter";
import { useSearchContext } from "context/state";
import { useRouter } from "next/router";

const SearchPage = ({ authors, cryptoOgs, exchanges }) => {
  const router = useRouter();
  const { query } = router;
  const keyword = slugify(query.key);
  const { posts } = useSearchContext();

  const searchResults = posts.filter((post) => {
    if (post.frontmatter.draft) {
      return !post.frontmatter.draft;
    }
    if (slugify(post.frontmatter.title).includes(keyword)) {
      return true;
    } else if (
      post.frontmatter.categories.find((category) =>
        slugify(category).includes(keyword)
      )
    ) {
      return true;
    } else if (
      post.frontmatter.tags.find((tag) => slugify(tag).includes(keyword))
    ) {
      return true;
    } else if (slugify(post.content).includes(keyword)) {
      return true;
    }
    return false;
  });

  const filterEntities = (entityType, entityArray) => {
    return searchResults
      .flatMap((post) => post.frontmatter[entityType] || [])
      .map((entity) => slugify(entity))
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((slug) => {
        return entityArray.find(
          (item) => slugify(item.frontmatter.title) === slug
        );
      });
  };

  const filteredCryptoOgs = filterEntities("crypto-ogs", cryptoOgs);
  const filteredExchanges = filterEntities("exchanges", exchanges);

  return (
    <Base title={`Search results for ${query.key}`} noindex={true}>
      <div className="section">
        <div className="container">
          <h1 className="h2 mb-8 text-center">
            Search results for <span className="text-primary">{query.key}</span>
          </h1>
          {searchResults.length > 0 ? (
            <Posts
              posts={searchResults}
              authors={authors}
              cryptoOgs={filteredCryptoOgs}
              exchanges={filteredExchanges}
            />
          ) : (
            <div className="py-24 text-center text-h3 shadow">
              No Search Found
            </div>
          )}
        </div>
      </div>
    </Base>
  );
};

export default SearchPage;

export const getStaticProps = () => {
  const authors = getSinglePage("content/authors");
  const cryptoOgs = getSinglePage("content/crypto-ogs");
  const exchanges = getSinglePage("content/exchanges");
  return {
    props: {
      authors: authors,
      cryptoOgs: cryptoOgs,
      exchanges: exchanges,
    },
  };
};
