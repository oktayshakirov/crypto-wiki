import VideoSingle from "@layouts/VideoSingle";
import { longVideos, getVideoBySlug, videoSourceHref } from "@lib/videos";
import { getSinglePage } from "@lib/contentParser";

const VideoPage = ({ video, related, source, isApp }) => (
  <VideoSingle video={video} related={related} source={source} isApp={isApp} />
);

// Long form only. A 35-second short has no chapters and no transcript, so its
// page would be a thumbnail and a sentence - exactly the thin page this feed is
// meant to avoid.
export const getStaticPaths = async () => ({
  paths: longVideos().map((video) => ({ params: { slug: video.slug } })),
  fallback: false,
});

export const getStaticProps = async ({ params }) => {
  const video = getVideoBySlug(params.slug);

  // The registry's `target` only carries a type and a slug, so the card in the
  // rail needs the title and image from that page's own frontmatter. `image`
  // is coalesced to null because getStaticProps cannot serialize undefined.
  const target = video.target;
  const sourcePage = target
    ? (getSinglePage(`content/${target.type}`) || []).find(
        (page) => page.slug === target.slug
      )
    : null;
  const source = sourcePage
    ? {
        title: sourcePage.frontmatter.title,
        image: sourcePage.frontmatter.image || null,
        href: videoSourceHref(video),
      }
    : null;

  return {
    props: {
      video,
      source,
      related: longVideos()
        .filter((item) => item.slug !== video.slug)
        .slice(0, 3),
    },
  };
};

export default VideoPage;
