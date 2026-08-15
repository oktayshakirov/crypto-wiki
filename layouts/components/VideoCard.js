import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";
import { formatDuration } from "@lib/videos";

// Feed card. Links to /videos/<slug> rather than out to YouTube: the video page
// has the player anyway, plus the transcript and the link back to the article,
// so sending the click to YouTube only gives the view away.
const VideoCard = ({ video }) => (
  <div className="card h-full rounded-lg p-4">
    <Link href={`/videos/${video.slug}`} className="group block">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          className="object-cover"
          src={video.poster}
          alt={video.title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
          <FaPlay className="text-3xl text-white drop-shadow" />
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
          {formatDuration(video.seconds)}
        </span>
      </div>
    </Link>
    <h5 className="mt-4">
      <Link
        href={`/videos/${video.slug}`}
        className="flex min-h-[44px] items-center hover:text-primary"
      >
        {video.title}
      </Link>
    </h5>
  </div>
);

export default VideoCard;
