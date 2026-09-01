import { useEffect, useState } from "react";

// Breathing room from the true bottom of the viewport.
const BOTTOM_MARGIN = 16;
// Recompute at most this often. A plain timeout rather than
// requestAnimationFrame on purpose - rAF callbacks are paused outright while
// `document.hidden` is true, and this only has to feel instant to a human,
// not sync to a paint frame.
const THROTTLE_MS = 50;

/**
 * Keeps a sticky element's internal scroll box sized to exactly the space
 * between its current on-screen top and the viewport bottom, at every scroll
 * position - not just while it's fully pinned.
 *
 * A static `max-height: calc(100vh - Xrem)` only matches reality while the
 * element sits exactly at its sticky `top` offset. Near the end of a tall
 * article, `position: sticky` starts releasing the element early so it
 * doesn't overflow its containing block - its on-screen top shifts down as
 * that happens, but a fixed formula has no way to know that, so the
 * scrollable box's own bottom edge can end up below the true viewport edge.
 * At that point the box's scrollbar is already maxed out with no way to
 * reach the cropped tail - the only way to see it was to scroll the page
 * itself, not the sidebar. Measuring the element's real top on every
 * scroll/resize keeps the box's height correct through that entire
 * transition, so scrolling the box to its own end always reveals the last
 * pixel of its content within the viewport.
 *
 * Returns a CSS length string (e.g. "612px") once measured, or null before
 * the first measurement (SSR and the initial paint) - the caller should keep
 * a static Tailwind max-height as a fallback for that window.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 */
const useStickyRailHeight = (ref) => {
  const [maxHeight, setMaxHeight] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timer = null;

    const measure = () => {
      timer = null;
      const top = el.getBoundingClientRect().top;
      const available = window.innerHeight - top - BOTTOM_MARGIN;
      setMaxHeight(`${Math.max(available, 0)}px`);
    };

    const onScrollOrResize = () => {
      if (timer === null) timer = setTimeout(measure, THROTTLE_MS);
    };

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (timer !== null) clearTimeout(timer);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [ref]);

  return maxHeight;
};

export default useStickyRailHeight;
