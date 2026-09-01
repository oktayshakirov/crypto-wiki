import Image from "next/image";
import Link from "next/link";
import { slugify } from "@lib/utils/textConverter";
import TableOfContents from "@components/TableOfContents";

/**
 * Cards for the exchanges or crypto OGs an article references.
 *
 * These link to the internal review/bio pages rather than out to an affiliate
 * URL: the exchange review is where the labelled affiliate CTA already lives,
 * so the disclosure requirements stay in one place and the internal link keeps
 * its value. `items` arrives already projected to title/description/image by
 * the post page's getStaticProps, so there is no extra data to fetch.
 */
const MentionedCards = ({ items, heading, basePath, imageShape = "logo" }) => {
  if (!items || !items.length) return null;

  return (
    <div className="text-start">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide opacity-70">
        {heading}
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/${basePath}/${slugify(item.frontmatter.title)}`}
            className="flex items-center gap-3 rounded-lg border border-gray-700 p-3 transition-colors hover:border-primary"
          >
            {item.frontmatter.image && (
              // base.scss sets a global `img { width: 100% }`, so the image
              // needs a sized wrapper to stay a thumbnail. Exchange logos are
              // wide banners (8:5 box); OG portraits are square, so they get a
              // circle instead.
              <span
                className={`flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden ${
                  imageShape === "portrait" ? "rounded-full" : "rounded"
                }`}
              >
                <Image
                  src={item.frontmatter.image}
                  alt={item.frontmatter.title}
                  width={128}
                  height={80}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate font-semibold">
                {item.frontmatter.title}
              </span>
              <span className="block text-xs opacity-80">
                {basePath === "exchanges" ? "Read the review" : "Read the bio"}
              </span>
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
const ArticleSidebar = ({ toc, exchanges, cryptoOgs }) => {
  const hasToc = toc && toc.length >= 3;
  const hasExchanges = exchanges && exchanges.length > 0;
  const hasCryptoOgs = cryptoOgs && cryptoOgs.length > 0;
  if (!hasToc && !hasExchanges && !hasCryptoOgs) return null;

  return (
    <aside className="hidden text-left xl:sticky xl:top-24 xl:block xl:w-[320px] xl:shrink-0">
      {/* 7rem = the 6rem sticky offset plus breathing room. The rail is bounded
          to the viewport and scrolls as a single block: anything below the fold
          of a sticky element can otherwise never be scrolled into view. One
          scroller rather than a scroller per section - nested ones let a long
          outline overflow its own box and paint over the cards beneath it. */}
      <div className="toc-scroll flex max-h-[calc(100vh-7rem)] flex-col gap-8 overflow-y-auto overscroll-contain pr-2">
        <TableOfContents toc={toc} variant="sidebar" />
        <MentionedCards
          items={exchanges}
          heading="Mentioned Exchanges"
          basePath="exchanges"
          imageShape="logo"
        />
        <MentionedCards
          items={cryptoOgs}
          heading="Mentioned Crypto OGs"
          basePath="crypto-ogs"
          imageShape="portrait"
        />
      </div>
    </aside>
  );
};

export default ArticleSidebar;
