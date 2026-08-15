import VideoSingle from "@layouts/VideoSingle";
import { longVideos, getVideoBySlug } from "@lib/videos";

const VideoPage = ({ video, related, isApp }) => (
  <VideoSingle video={video} related={related} isApp={isApp} />
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

  return {
    props: {
      video,
      related: longVideos()
        .filter((item) => item.slug !== video.slug)
        .slice(0, 3),
    },
  };
};

export default VideoPage;
