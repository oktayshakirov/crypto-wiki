import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "@lib/videos";
import StickyRail, { RailSection } from "@partials/StickyRail";

/**
 * A card for the article the video was made from. Same shape as the
 * "Mentioned Exchanges" cards on a post, so the two rails read alike.
 *
 * `source` is resolved in getStaticProps from the registry's `target`, which
 * only carries a type and a slug - the title and image come from that page's
 * own frontmatter.
 */
const SourceArticleCard = ({ source }) => {
  if (!source) return null;

  return (
    <RailSection title="From the article">
      <Link
        href={source.href}
        className="flex items-center gap-3 rounded-lg border border-gray-700 p-3 transition-colors hover:border-primary"
      >
        {source.image && (
          // base.scss sets a global `img { width: 100% }`, so the image needs
          // a sized wrapper to stay a thumbnail.
          <span className="flex h-10 w-16 shrink-0 items-center justify-center overflow-hidden rounded">
            <Image
              src={source.image}
              alt={source.title}
              width={128}
              height={80}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate font-semibold">{source.title}</span>
          <span className="block text-xs opacity-80">Read the full article</span>
        </span>
      </Link>
    </RailSection>
  );
};

/**
 * The rail beside a video page: the source article, then the chapter list.
 *
 * Chapters are not plain anchors - the transcript they point into is collapsed
 * by default, so a click has to open it before jumping. `onJump` is the same
 * handler the in-body list uses, owned by VideoSingle because it drives that
 * state.
 */
const VideoSidebar = ({ source, chapters, onJump, activeStart }) => {
  const hasChapters = chapters && chapters.length > 0;
  if (!source && !hasChapters) return null;

  return (
    <StickyRail>
      <SourceArticleCard source={source} />
      {hasChapters && (
        <RailSection title="Chapters">
          <ul className="space-y-1 text-sm">
            {chapters.map((chapter) => {
              const isActive = activeStart === chapter.start;
              return (
                <li key={chapter.start}>
                  <a
                    href={`#t-${chapter.start}`}
                    onClick={onJump(chapter.start)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex gap-2 border-l-2 py-1 pl-3 transition-colors hover:text-primary ${
                      isActive
                        ? "border-primary font-semibold text-primary"
                        : "border-transparent text-text opacity-80 hover:opacity-100"
                    }`}
                  >
                    <span className="shrink-0 tabular-nums text-primary">
                      {formatDuration(chapter.start)}
                    </span>
                    <span className="min-w-0">{chapter.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </RailSection>
      )}
    </StickyRail>
  );
};

export default VideoSidebar;
