import { useEffect, useState } from "react";
import Link from "next/link";
import Base from "./Baseof";
import GoBackLink from "@partials/GoBackLink";
import PostVideo from "@components/PostVideo";
import VideoCard from "@components/VideoCard";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";
import config from "@config/config.json";
import { formatDuration, videoSourceHref } from "@lib/videos";
import { breadcrumbSchema, videoObjectSchema } from "@lib/utils/jsonLd";

const timestamp = (seconds) => formatDuration(seconds);

/**
 * One page per long-form video.
 *
 * This is the only surface on the site where video is unambiguously the page's
 * main content, which is the condition Google's August 2023 change put on the
 * video rich result - an article with a supplementary embed does not qualify.
 * The transcript is what keeps it from being a thin page: it is the script,
 * which is written narration rather than the article's prose, so it is 450-700
 * words that exist nowhere else on the site.
 */
const VideoSingle = ({ video, related, isApp }) => {
  const url = `${config.site.base_url}/videos/${video.slug}`;
  const sourceHref = videoSourceHref(video);
  const chapters = video.chapters || [];
  const words = chapters.reduce(
    (total, chapter) => total + chapter.text.split(/\s+/).length,
    0
  );

  const transcriptId = `transcript-${video.slug}`;
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [pendingJump, setPendingJump] = useState(null);

  // A chapter link points into the transcript, so it has to open it first, and
  // the jump has to wait for that: while collapsed the target has no box to
  // scroll to. Hence the effect rather than the browser's own anchor handling.
  useEffect(() => {
    if (pendingJump === null) return;
    document
      .getElementById(`t-${pendingJump}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setPendingJump(null);
  }, [pendingJump]);

  const jumpToChapter = (start) => (event) => {
    event.preventDefault();
    setTranscriptOpen(true);
    setPendingJump(start);
  };

  const jsonLd = [
    videoObjectSchema(video, { withClips: true }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Videos", path: "/videos" },
      { name: video.title, path: `/videos/${video.slug}` },
    ]),
  ].filter(Boolean);

  return (
    <Base
      title={`${video.title} | Crypto Wiki`}
      meta_title={`${video.title} | Crypto Wiki`}
      description={video.description}
      image={video.poster}
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section">
        <div className="container">
          <GoBackLink option="videos" />
          <article className="mx-auto max-w-4xl">
            <h1 className="h2 mb-4">{video.title}</h1>
            <p className="mb-6 text-gray-400">
              {formatDuration(video.seconds)}
              {sourceHref && (
                <>
                  {" · "}
                  <Link href={sourceHref} className="text-primary">
                    Read the full article
                  </Link>
                </>
              )}
            </p>

            {/* Open by default: on this page the video is what the visitor
                came for, unlike the collapsed bar on an article. */}
            <PostVideo video={video} autoExpand />

            {chapters.length > 0 && (
              <>
                <h2 className="h4 mb-4 mt-10">Chapters</h2>
                <ul className="mb-10 list-none pl-0">
                  {chapters.map((chapter) => (
                    <li key={chapter.start} className="mb-1">
                      <a
                        href={`#t-${chapter.start}`}
                        onClick={jumpToChapter(chapter.start)}
                        className="inline-flex min-h-[36px] items-center hover:text-primary"
                      >
                        <span className="mr-3 tabular-nums text-primary">
                          {timestamp(chapter.start)}
                        </span>
                        {chapter.title}
                      </a>
                    </li>
                  ))}
                </ul>

                <h2 className="h4 mb-4">Transcript</h2>
                {/* Folded away by default. Nobody opens a video page to read
                    six hundred words, and a wall of narration under the player
                    buries the article link and the other videos.

                    Hidden with CSS rather than unmounted: the text has to stay
                    in the served HTML, because being indexable is the entire
                    point of having a transcript. Google reads collapsed content
                    the same either way, but it cannot read what was never
                    rendered. */}
                <button
                  type="button"
                  aria-expanded={transcriptOpen}
                  aria-controls={transcriptId}
                  onClick={() => setTranscriptOpen((open) => !open)}
                  className="mb-2 inline-flex min-h-[44px] items-center text-primary"
                >
                  {transcriptOpen
                    ? "Hide the transcript"
                    : `Read the transcript (${words} words)`}
                </button>
                <div
                  id={transcriptId}
                  className={`mb-12 text-left ${
                    transcriptOpen ? "" : "hidden"
                  }`}
                >
                  {chapters.map((chapter) => (
                    <div key={chapter.start} id={`t-${chapter.start}`}>
                      {/* Deliberately outside `.content`: that wrapper styles
                          headings at article scale, which makes a seven-part
                          transcript read as seven new articles. */}
                      <h3 className="mb-2 mt-8 scroll-mt-4 text-lg font-semibold">
                        <span className="mr-3 tabular-nums text-primary">
                          {timestamp(chapter.start)}
                        </span>
                        {chapter.title}
                      </h3>
                      <div className="content">
                        <p>{chapter.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {sourceHref && (
              <p className="mb-8">
                <Link href={sourceHref} className="text-primary">
                  Read the full article, with sources &rarr;
                </Link>
              </p>
            )}

            <DisclaimerBanner />
          </article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="mb-8 text-center">More videos</h2>
            <div className="flex flex-wrap justify-center">
              {related.map((item) => (
                <div
                  key={item.slug}
                  className="w-full p-4 sm:w-1/2 md:w-1/3 xl:w-1/3"
                >
                  <VideoCard video={item} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Base>
  );
};

export default VideoSingle;
