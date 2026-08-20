import VideosList from "@layouts/VideosList";
import config from "@config/config.json";
import { longVideos } from "@lib/videos";

// The feed paginates the same way /posts does, off `paginationVideos`.
// /videos/page/1 is built too so a link to it resolves; its canonical points
// back at /videos, so it is not indexed twice.
const VideosPagination = (props) => <VideosList {...props} />;

export const getStaticPaths = () => {
  const { paginationVideos } = config.settings;
  const totalPages = Math.ceil(longVideos().length / paginationVideos);

  return {
    paths: Array.from({ length: Math.max(totalPages, 1) }, (_, i) => ({
      params: { slug: (i + 1).toString() },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt((params && params.slug) || 1);
  const { paginationVideos } = config.settings;
  const allVideos = longVideos();
  const end = currentPage * paginationVideos;

  return {
    props: {
      videos: allVideos.slice(end - paginationVideos, end),
      currentPage,
      totalPages: Math.ceil(allVideos.length / paginationVideos),
    },
  };
};

export default VideosPagination;
