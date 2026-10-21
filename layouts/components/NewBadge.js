import { HiSparkles } from "react-icons/hi";
import useIsNew from "@hooks/useIsNew";

// Top-left of a card image, opposite the video badge. Brand gold rather than
// the badge's black so a fresh item catches the eye in a grid of old ones.
const NewBadge = ({ date }) => {
  const isNew = useIsNew(date);
  if (!isNew) return null;

  return (
    <span className="absolute left-2 top-2 flex h-6 items-center gap-1 rounded bg-primary px-2 text-[11px] font-bold uppercase tracking-wider text-black shadow-md shadow-black/40 ring-1 ring-black/50">
      <HiSparkles className="text-xs" />
      New
    </span>
  );
};

export default NewBadge;
