import PromoCard from "@components/PromoCard";
import { AUDIOBOOK, AUDIOBOOK_BADGES } from "@config/audiobook";

const AudiobookBanner = () => (
  <PromoCard
    href="/audiobook"
    artwork={AUDIOBOOK.coverThumb}
    artworkAlt={`${AUDIOBOOK.title} audiobook cover`}
    linkLabel={`About ${AUDIOBOOK.title}`}
    eyebrow="Audiobook"
    title={AUDIOBOOK.title}
    badges={AUDIOBOOK_BADGES}
  >
    {AUDIOBOOK.runtime} on the scams, collapses, leverage and lost keys that
    take people&apos;s crypto, and how to keep yours.
  </PromoCard>
);

export default AudiobookBanner;
