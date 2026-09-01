import Base from "./Baseof";
import Pagination from "@components/Pagination";
import VideoCard from "@components/VideoCard";
import { markdownify } from "@lib/utils/textConverter";
import config from "@config/config.json";
import { breadcrumbSchema, videoObjectSchema } from "@lib/utils/jsonLd";
import { paginatedTitle, paginatedDescription } from "@lib/utils/pagination";

const VideosList = ({ videos, currentPage, totalPages, isApp }) => {
  const path = currentPage > 1 ? `/videos/page/${currentPage}` : "/videos";
  const url = `${config.site.base_url}${path}`;
  const title = paginatedTitle(
    "Crypto Videos | Explainers from Crypto Wiki",
    currentPage
  );
  const description = paginatedDescription(
    "Short explainers on Bitcoin, blockchain and crypto history - each one with chapters and a full transcript, and the article it came from.",
    currentPage
  );

  const jsonLd = [
    // Video is the main content of this page, so the VideoObjects are the page
    // rather than an addition to it. The ItemList says it is a listing of them
    // and not one video repeated.
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: title,
      url,
      numberOfItems: videos.length,
      itemListElement: videos.map((video, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: videoObjectSchema(video),
      })),
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Videos", path: "/videos" },
    ]),
  ].filter(Boolean);

  return (
    <Base
      title={title}
      meta_title={title}
      description={description}
      image="/images/meta-image.png"
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section">
        <div className="container text-center">
          {/* No intro paragraph: /posts, /exchanges and the rest go straight
              from the heading into the grid. `description` is still the meta
              description, which is where it does some work. */}
          {markdownify("Videos", "h1", "h1 mb-10")}
          {videos.length === 0 ? (
            <p>No videos published yet.</p>
          ) : (
            <>
              {/* Same bootstrap-grid row the /posts listing uses, so a short
                  last row stays left-aligned instead of centring itself. */}
              <div className="row text-left">
                {videos.map((video) => (
                  <div
                    key={video.slug}
                    className="col-12 mb-7 min-[650px]:col-6 lg:col-3"
                  >
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
              <Pagination
                section="videos"
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </section>
    </Base>
  );
};

export default VideosList;
