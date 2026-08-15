import VideosList from "@layouts/VideosList";
import { longVideos } from "@lib/videos";

const VideosPage = ({ videos, isApp }) => (
  <VideosList videos={videos} isApp={isApp} />
);

export const getStaticProps = async () => ({
  props: { videos: longVideos() },
});

export default VideosPage;
