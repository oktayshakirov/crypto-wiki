import { useEffect, useState } from "react";

// How long a card keeps its NEW badge. A week rather than a few days: posts and
// videos land every 2-5 days, so a 3-day window often leaves the feed with no
// badge at all, while 7 days keeps the last two or three items flagged.
export const NEW_FOR_DAYS = 7;

/**
 * Whether something published on `date` still counts as new.
 *
 * Decided in the browser after mount, not at build time: the pages are static
 * and only rebuild on deploy, so a build-time check would keep the badge on
 * until the next deploy however long that takes. Starting false also keeps
 * the server HTML and the first client render identical.
 *
 * @param {string | null | undefined} date - anything `new Date()` parses
 */
const useIsNew = (date) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const published = date ? new Date(date).getTime() : NaN;
    if (Number.isNaN(published)) return;
    const age = Date.now() - published;
    setIsNew(age >= 0 && age < NEW_FOR_DAYS * 24 * 60 * 60 * 1000);
  }, [date]);

  return isNew;
};

export default useIsNew;
