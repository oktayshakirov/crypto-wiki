import AdSlot from "@components/ads/AdSlot";

// Native in-article unit, placed inside post, exchange and OG bodies from MDX
// as <ArticleAd />.
const ArticleAd = () => (
  <AdSlot
    slot="5145200170"
    variant="in-article"
    placeholder="Ad Example (Content)"
  />
);

export default ArticleAd;
