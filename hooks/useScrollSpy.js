import { useEffect, useMemo, useState } from "react";

// Roughly the sticky header plus a little slack: a heading counts as current
// once it crosses this line, which is also where anchor jumps park it.
const ACTIVE_LINE = 120;

/**
 * Tracks which heading the reader is currently under and returns its id.
 *
 * Position-based rather than IntersectionObserver-based on purpose. An
 * observer only fires when an element's intersection *changes*, so scrolling
 * within one long section - or landing at the top of the page after an anchor
 * jump - leaves the last value stale with no callback to correct it. Comparing
 * scroll position against the heading offsets always yields the right answer.
 *
 * Offsets are measured once and cached, so the scroll handler does no layout
 * work; it is rAF-throttled on top of that. Re-measures on resize and on load,
 * since images settling above a heading move it.
 *
 * @param {Array<{id: string}>} headings - outline in document order
 * @returns {string} id of the active heading, or "" above the first one
 */
const useScrollSpy = (headings) => {
  const [activeId, setActiveId] = useState("");

  // Depend on the ids themselves: `headings` may be a fresh array each render.
  const key = useMemo(
    () => (headings || []).map((h) => h.id).join("|"),
    [headings]
  );

  useEffect(() => {
    const ids = key ? key.split("|") : [];
    if (!ids.length) return;

    let positions = [];
    let frame = null;

    const measure = () => {
      positions = ids
        .map((id) => {
          const el = document.getElementById(id);
          return el
            ? { id, top: el.getBoundingClientRect().top + window.scrollY }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.top - b.top);
    };

    const update = () => {
      frame = null;
      if (!positions.length) return;

      // At the very bottom the last section may never reach the line, so give
      // it the highlight rather than leaving the previous one lit.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(positions[positions.length - 1].id);
        return;
      }

      const line = window.scrollY + ACTIVE_LINE;
      let current = "";
      for (const position of positions) {
        if (position.top > line) break;
        current = position.id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
    };
  }, [key]);

  return activeId;
};

export default useScrollSpy;
