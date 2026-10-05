import { forwardRef } from "react";
import BaseNextLink from "next/link";

// next/link with viewport prefetching off by default. Every prefetched page is
// a /_next/data request, and on Vercel each one that misses the edge cache is
// billed as an ISR Read - a listing page full of cards fired dozens per visit
// and pushed the shared Hobby team toward its 1M cap. In the Pages Router,
// prefetch={false} still prefetches on hover and touch, so a click lands just
// as fast. Import this instead of next/link; pass prefetch to opt back in.
const NextLink = forwardRef(function NextLink({ prefetch = false, ...props }, ref) {
  return <BaseNextLink ref={ref} prefetch={prefetch} {...props} />;
});

export default NextLink;
