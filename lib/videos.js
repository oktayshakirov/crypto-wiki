import videosJson from "@json/videos.json";

// The registry is the source of truth for anything YouTube. Video metadata is
// deliberately not in MDX frontmatter: `id`, `uploadDate` and `duration` only
// exist after upload, and a video can host on more than one page.
// See docs/site-video-integration.md in the video-edit-automation repo.
const VIDEOS = videosJson.videos || [];

export const allVideos = () => VIDEOS;

export const getVideoById = (id) => VIDEOS.find((v) => v.id === id) || null;

export const getVideoBySlug = (slug) =>
  VIDEOS.find((v) => v.slug === slug) || null;

// Every page a video is meant to appear on: its own article plus any neighbours
// it was deliberately spread to.
const hostPages = (video) =>
  [video.target, ...(video.alsoOn || [])].filter(Boolean);

// The video belonging to a page, for the auto slot, a bare <PostVideo /> and the
// VideoObject. `placement: "none"` keeps a video in the registry - so the feed
// still lists it - without putting it on any article.
export const getPageVideo = (type, slug) =>
  VIDEOS.find(
    (v) =>
      v.placement !== "none" &&
      hostPages(v).some((page) => page.type === type && page.slug === slug)
  ) || null;

// For card badges, where only the yes/no matters.
export const hasPageVideo = (type, slug) => getPageVideo(type, slug) !== null;

// Long form only, newest first. Shorts are deliberately excluded from the feed
// pages: a 35-second vertical clip makes a thin page and a bad card.
export const longVideos = () =>
  VIDEOS.filter((v) => v.kind === "long").sort((a, b) =>
    a.uploadDate < b.uploadDate ? 1 : -1
  );

// The article a video came from, for the "read the article" link.
export const videoSourceHref = (video) =>
  video?.target ? `/${video.target.type}/${video.target.slug}` : null;

// 167 -> "2:47". The registry also carries ISO 8601 `duration`, but that is for
// schema, not for humans.
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};
