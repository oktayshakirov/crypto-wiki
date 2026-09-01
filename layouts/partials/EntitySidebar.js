import Image from "next/image";
import Link from "next/link";
import TableOfContents from "@components/TableOfContents";
import StickyRail, { RailSection } from "@partials/StickyRail";

/**
 * Compact prev/next cards for the rail - same visual language as the
 * "Mentioned Exchanges" cards on a post, so every rail on the site reads
 * alike. The full-width NextPrevNavigation cards (with a description
 * paragraph and a 192px image) are built for a full-width row, not a 320px
 * column; this is the same prev/next data in the rail's own card shape.
 */
const PrevNextCards = ({ prevItem, nextItem, basePath, imageShape }) => {
  if (!prevItem && !nextItem) return null;

  const items = [
    prevItem && { ...prevItem, label: "← Previous" },
    nextItem && { ...nextItem, label: "Next →" },
  ].filter(Boolean);

  return (
    <RailSection
      title={basePath === "exchanges" ? "More Exchanges" : "More Crypto OGs"}
    >
      <div className="grid grid-cols-1 gap-3">
        {items.map((item) => (
          <Link
            key={item.label}
            href={`/${basePath}/${item.slug}`}
            className="flex items-center gap-3 rounded-lg border border-gray-700 p-3 transition-colors hover:border-primary"
          >
            {item.frontmatter.image && (
              // base.scss sets a global `img { width: 100% }`, so the image
              // needs a sized wrapper to stay a thumbnail.
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
              <span className="block text-xs opacity-80">{item.label}</span>
              <span className="block truncate font-semibold">
                {item.frontmatter.title}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </RailSection>
  );
};

/**
 * The rail beside an exchange review or an OG bio: the outline, then the
 * neighbouring entries to browse to next. Quick Facts and the official links
 * stay in the body at every width - they read better as a wide infobox
 * fronting the review than a narrow rail list, and this way nothing on the
 * page is hidden until a reader scrolls.
 */
const EntitySidebar = ({ toc, prevItem, nextItem, basePath, imageShape }) => {
  const hasToc = toc && toc.length >= 3;
  if (!hasToc && !prevItem && !nextItem) return null;

  return (
    <StickyRail>
      <TableOfContents toc={toc} variant="sidebar" />
      <PrevNextCards
        prevItem={prevItem}
        nextItem={nextItem}
        basePath={basePath}
        imageShape={imageShape}
      />
    </StickyRail>
  );
};

export default EntitySidebar;
