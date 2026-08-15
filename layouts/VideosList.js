import Base from "./Baseof";
import VideoCard from "@components/VideoCard";
import { markdownify } from "@lib/utils/textConverter";
import config from "@config/config.json";
import { breadcrumbSchema, videoObjectSchema } from "@lib/utils/jsonLd";

const VideosList = ({ videos, isApp }) => {
  const url = `${config.site.base_url}/videos`;
  const title = "Crypto Videos | Explainers from Crypto Wiki";
  const description =
    "Short explainers on Bitcoin, blockchain and crypto history - each one with chapters and a full transcript, and the article it came from.";

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
          {markdownify("Videos", "h1", "h1 mb-4")}
          <p className="mx-auto mb-10 max-w-2xl text-gray-400">{description}</p>
          {videos.length === 0 ? (
            <p>No videos published yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center text-left">
              {videos.map((video) => (
                <div
                  key={video.slug}
                  className="w-full p-4 sm:w-1/2 md:w-1/3 xl:w-1/3"
                >
                  <VideoCard video={video} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Base>
  );
};

export default VideosList;
