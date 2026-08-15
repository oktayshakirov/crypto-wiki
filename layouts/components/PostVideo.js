import { useState } from "react";
import Image from "next/image";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { usePageVideo } from "context/video";
import { getVideoById, formatDuration } from "@lib/videos";

/**
 * Facade embed. Nothing is requested from Google until the visitor clicks:
 * a stock YouTube iframe is ~500KB-1.5MB across several third-party origins,
 * which on 130 pages would cost more in Core Web Vitals than the video gains.
 * It also sets cookies and hands Google the visitor's IP on page load, before
 * any consent - not something to ship under a German Impressum.
 *
 * Collapsed by default and sized to sit above the fold, so a reader who would
 * rather watch sees that within a second without scrolling.
 *
 *   <PostVideo />                     this page's video, at this exact spot
 *   <PostVideo id="Sbxrw7ZFI9o" />    another page's video, explicitly
 */
const PostVideo = ({
  id,
  video: videoProp,
  className = "",
  // /videos/<slug> opens with the player already there: the video is what the
  // visitor came for, so the collapsed bar would be an extra click for nothing.
  autoExpand = false,
}) => {
  const [playing, setPlaying] = useState(autoExpand);
  const pageVideo = usePageVideo();
  const video = videoProp || (id ? getVideoById(id) : pageVideo);

  if (!video) return null;

  const length = formatDuration(video.seconds);

  if (playing) {
    return (
      <div className={`mb-8 ${className}`}>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <iframe
            // youtube-nocookie only matters once it is actually loaded, which is
            // the point of the facade - but the visitor who clicks gets it too.
            src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0${
              autoExpand ? "" : "&autoplay=1"
            }`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${video.title}${length ? ` (${length})` : ""}`}
      className={`group mb-8 flex w-full items-center gap-4 rounded-lg border border-gray-700 bg-gray-900/40 p-3 text-left transition hover:border-primary ${className}`}
    >
      <span className="relative block shrink-0 overflow-hidden rounded">
        <Image
          src={video.poster}
          alt=""
          width={160}
          height={90}
          className="block h-[90px] w-[160px] object-cover"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
          <FaPlay className="text-xl text-white drop-shadow" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
          Watch instead
        </span>
        {/* Clamped: a four-line title on mobile turns a "compact" bar into a
            160px block sitting between the reader and the article. */}
        <span className="mt-1 line-clamp-2 block font-semibold leading-snug text-white">
          {video.title}
        </span>
        <span className="mt-1 flex items-center gap-2 text-sm text-gray-400">
          <FaYoutube aria-hidden="true" />
          {length && <span>{length}</span>}
        </span>
      </span>
    </button>
  );
};

export default PostVideo;
