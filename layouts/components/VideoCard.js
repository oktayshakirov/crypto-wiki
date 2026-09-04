import Image from "next/image";
import Link from "next/link";
import { formatDuration } from "@lib/videos";

// Feed card. Links to /videos/<slug> rather than out to YouTube: the video page
// has the player anyway, plus the transcript and the link back to the article,
// so sending the click to YouTube only gives the view away.
const VideoCard = ({ video }) => (
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
      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-[11px] font-medium tabular-nums text-white">
        {formatDuration(video.seconds)}
      </span>
    </div>
    <h5 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-white group-hover:text-primary">
      {video.title}
    </h5>
  </Link>
);

export default VideoCard;
