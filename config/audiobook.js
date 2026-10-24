// One place for the audiobook's links and copy, so the footer card, the
// /audiobook page and anything added later cannot drift apart.
export const AUDIOBOOK = {
  title: "Stop Losing Money in Crypto",
  subtitle:
    "The Scams, Collapses, Leverage and Lost Keys That Take It, and How to Keep Yours",
  runtime: "64 minutes",
  // ISO 8601 for the schema. The listing is 63:44.
  duration: "PT63M44S",
  spotify: "https://open.spotify.com/show/5L3CgtyFC83zbayVI9LSKU",
  googlePlay:
    "https://play.google.com/store/audiobooks/details?id=AQAAAEBGeRs5TM",
  chapters: 14,
  cover: "/images/audiobook-cover.jpg",
  // 192px for the footer card: 2x its 96px slot, served as-is so it costs no
  // Image Optimization transformations.
  coverThumb: "/images/audiobook-cover-thumb.jpg",
  ogImage: "/images/audiobook-og.jpg",
  narrator: "Kokoro (AI Voice)",
  author: "Oktay Shakirov",
  // Month only: both stores show "Oct 2026" and neither gives a day.
  released: "2026-10",
  // The free sample on YouTube: introduction plus chapter 1. Registered in
  // json/videos.json, which owns its metadata and its VideoObject schema on
  // /videos/<slug>, so nothing here duplicates it. The page only shows the
  // sample once the registry has it.
  sampleVideoId: "yUBkHbY28sI",
  sampleVideoSlug: "stop-losing-money-in-crypto-sample",
};

// One row per track, as the stores list them. Lengths are measured from the
// rendered files, not estimated.
export const AUDIOBOOK_CHAPTERS = [
  ["Introduction", "The Price Is Not What Takes Your Money", "3:19"],
  ["Chapter 1", "The Man Who Took the Keys to His Grave", "5:40"],
  ["Chapter 2", "Nobody Can Reverse It. That Is the Point.", "4:58"],
  ["Chapter 3", "Twelve Words Worth Everything You Own", "5:29"],
  ["Chapter 4", "Not Your Keys", "5:36"],
  ["Chapter 5", "The Scam Is Always Friendly", "5:47"],
  ["Chapter 6", "You Bought the Top Because Everyone Else Did", "4:37"],
  ["Chapter 7", "The Influencer Was Paid to Say That", "3:08"],
  ["Chapter 8", "Leverage Is a Machine for Liquidating You", "3:08"],
  ["Chapter 9", "The Memecoin Was Never Going to Make You Rich", "3:11"],
  ["Chapter 10", "You Are Not Unlucky. You Are Unprotected.", "3:12"],
  ["Chapter 11", "Build Your Vault", "7:28"],
  ["Chapter 12", "The Thirty Day Crypto Reset", "5:21"],
  ["Conclusion", "The Day You Stop Checking the Price", "2:45"],
];

// Rendered at 40px high to match the app badges beside them in the footer.
// Google Play reuses the badge the app card already ships: same storefront,
// same artwork.
export const AUDIOBOOK_BADGES = [
  {
    href: AUDIOBOOK.spotify,
    src: "/spotify-badge.png",
    alt: `Listen to ${AUDIOBOOK.title} on Spotify`,
    width: 135,
    height: 40,
  },
  {
    href: AUDIOBOOK.googlePlay,
    src: "/google-play-badge.png",
    alt: `Get ${AUDIOBOOK.title} on Google Play Books`,
    width: 120,
    height: 40,
  },
];
