import Image from "next/image";
import Link from "next/link";
import { slugify } from "@lib/utils/textConverter";
import TableOfContents from "@components/TableOfContents";
import RelatedTools from "@components/RelatedTools";

/**
 * Cards for the exchanges an article references.
 *
 * These link to the internal review pages rather than straight out to the
 * affiliate URL: the review is where the labelled affiliate CTA already lives,
 * so the disclosure requirements stay in one place and the internal link keeps
 * its value. `exchanges` arrives already projected to title/description/image
 * by the post page's getStaticProps, so there is no extra data to fetch.
 */
const ExchangeCards = ({ exchanges }) => {
  if (!exchanges || !exchanges.length) return null;

  return (
    <div className="text-start">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide opacity-70">
        Mentioned Exchanges
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {exchanges.map((exchange) => (
          <Link
            key={exchange.slug}
            href={`/exchanges/${slugify(exchange.frontmatter.title)}`}
            className="flex items-center gap-3 rounded-lg border border-gray-700 p-3 transition-colors hover:border-primary"
          >
            {exchange.frontmatter.image && (
              // base.scss sets a global `img { width: 100% }`, so the image
              // needs a sized wrapper to stay a thumbnail - same treatment the
              // Exchanges grid uses. These logos are wide banners, not square
              // avatars, hence the 8:5 box rather than a circle.
              <span className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded">
                <Image
                  src={exchange.frontmatter.image}
                  alt={exchange.frontmatter.title}
                  width={128}
                  height={80}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate font-semibold">
                {exchange.frontmatter.title}
              </span>
              <span className="block text-xs opacity-80">Read the review</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

/**
 * The sticky desktop rail beside a post. Rendered only from xl up - below that
 * the outline appears as a collapsed <details> above the article instead.
 */
const ArticleSidebar = ({ toc, exchanges }) => {
  const hasToc = toc && toc.length >= 3;
  const hasExchanges = exchanges && exchanges.length > 0;
  if (!hasToc && !hasExchanges) return null;

  return (
    <aside className="hidden text-left xl:sticky xl:top-24 xl:block xl:w-[320px] xl:shrink-0">
      {/* 7rem = the 6rem sticky offset plus breathing room. The rail is bounded
          to the viewport and scrolls as a single block: anything below the fold
          of a sticky element can otherwise never be scrolled into view. One
          scroller rather than a scroller per section - nested ones let a long
          outline overflow its own box and paint over the cards beneath it. */}
      <div className="toc-scroll flex max-h-[calc(100vh-7rem)] flex-col gap-8 overflow-y-auto overscroll-contain pr-2">
        <TableOfContents toc={toc} variant="sidebar" />
        <ExchangeCards exchanges={exchanges} />
        <RelatedTools compact />
      </div>
    </aside>
  );
};

export default ArticleSidebar;
