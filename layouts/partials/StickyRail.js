import { useRef } from "react";
import useStickyRailHeight from "@hooks/useStickyRailHeight";

/**
 * A titled block inside the rail. Every section uses the same small uppercase
 * label so the rail reads as one list of sections rather than a stack of
 * unrelated widgets.
 */
export const RailSection = ({ title, children }) => (
  <div className="text-start">
    <h2 className="mb-3 text-sm font-bold uppercase tracking-wide opacity-70">
      {title}
    </h2>
    {children}
  </div>
);

/**
 * The sticky desktop rail beside a page's main column. Shared by posts,
 * videos, exchange reviews and OG bios so they behave identically.
 *
 * Rendered only from xl up - below that each page falls back to putting the
 * same information in its body flow, where there is no room for a rail.
 *
 * The rail is bounded to the viewport and scrolls as a single block: anything
 * below the fold of a sticky element can otherwise never be scrolled into
 * view. One scroller rather than a scroller per section - nested ones let a
 * long outline overflow its own box and paint over whatever sits beneath it.
 *
 * max-height is measured live by useStickyRailHeight and kept in sync with the
 * rail's actual on-screen top, not just assumed from the sticky offset -
 * `top-24` only describes where the rail sits while fully pinned. Near the end
 * of the page, position: sticky starts releasing it early so it doesn't
 * overflow the row, and its real top shifts down as that happens. A static
 * `calc(100vh - Xrem)` has no way to know that and can let the box's own bottom
 * edge drift below the true viewport edge - the scrollbar maxes out with the
 * last item still off-screen. The Tailwind class here is only the fallback for
 * the instant before that first measurement lands (SSR and initial paint).
 */
const StickyRail = ({ children }) => {
  const railRef = useRef(null);
  const measuredMaxHeight = useStickyRailHeight(railRef);

  return (
    <aside className="hidden text-left xl:sticky xl:top-24 xl:block xl:w-[320px] xl:shrink-0">
      <div
        ref={railRef}
        className="toc-scroll flex max-h-[calc(100vh-7rem)] flex-col gap-8 overflow-y-auto overscroll-contain pr-2"
        style={measuredMaxHeight ? { maxHeight: measuredMaxHeight } : undefined}
      >
        {children}
      </div>
    </aside>
  );
};

export default StickyRail;
