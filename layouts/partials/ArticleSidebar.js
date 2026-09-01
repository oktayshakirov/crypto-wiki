import Image from "next/image";
import Link from "next/link";
import { slugify } from "@lib/utils/textConverter";
import TableOfContents from "@components/TableOfContents";
import StickyRail, { RailSection } from "@partials/StickyRail";

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
    <RailSection title={heading}>
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
    </RailSection>
  );
};

/**
 * The rail beside a post: its outline, plus the exchanges and OGs it cites.
 */
const ArticleSidebar = ({ toc, exchanges, cryptoOgs }) => {
  const hasToc = toc && toc.length >= 3;
  const hasExchanges = exchanges && exchanges.length > 0;
  const hasCryptoOgs = cryptoOgs && cryptoOgs.length > 0;
  if (!hasToc && !hasExchanges && !hasCryptoOgs) return null;

  return (
    <StickyRail>
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
    </StickyRail>
  );
};

export default ArticleSidebar;
