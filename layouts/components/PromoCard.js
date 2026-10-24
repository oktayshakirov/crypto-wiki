import Link from "@components/NextLink";
import Image from "next/image";

/**
 * Shared by AppsBanner and AudiobookBanner. They sit side by side in the
 * footer, so one card keeps them a matched pair; the artwork on the left is
 * what tells them apart. Hover and layout live in `.promo-card`
 * (styles/components.scss).
 *
 * The badges never wrap: a badge row that breaks on one card but not the other
 * reads as a mistake.
 */
const PromoCard = ({
  href,
  artwork,
  artworkAlt,
  linkLabel,
  eyebrow,
  title,
  children,
  badges,
}) => (
  <div className="promo-card">
    <Link href={href} aria-label={linkLabel} className="promo-card__artwork">
      {/* 96px keeps both sources sharp at 2x: the app logo and the 192px
          cover thumbnail. */}
      <Image src={artwork} alt={artworkAlt} width={96} height={96} unoptimized />
    </Link>
    <div className="flex min-w-0 flex-col items-center sm:items-start">
      <span className="mb-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary opacity-85">
        {eyebrow}
      </span>
      <h2 className="promo-card__title text-xl font-semibold leading-tight md:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-normal text-gray-300 md:text-base">
        {children}{" "}
        <Link
          href={href}
          className="whitespace-nowrap font-semibold text-primary underline"
        >
          Learn more
        </Link>
      </p>
      <div className="mt-4 flex items-center gap-2.5">
        {badges.map(({ href: badgeHref, src, alt, width, height }) => (
          <a
            key={badgeHref}
            href={badgeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="promo-card__badge"
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-10 w-auto"
              unoptimized
            />
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default PromoCard;
