import Base from "@layouts/Baseof";
import Image from "next/image";
import Link from "@components/NextLink";
import PostVideo from "@components/PostVideo";
import config from "@config/config.json";
import {
  AUDIOBOOK,
  AUDIOBOOK_BADGES,
  AUDIOBOOK_CHAPTERS,
} from "@config/audiobook";
import { getVideoById } from "@lib/videos";
import { audiobookSchema, breadcrumbSchema } from "@lib/utils/jsonLd";

const DESCRIPTION =
  "A 64 minute audiobook on the five ways money actually leaves people in crypto: scams, collapses, leverage, panic and lost keys, and how to close every one. No price predictions, no coin picks, every claim sourced. Listen on Spotify or Google Play Books.";

const FACTS = [
  ["64", "minutes"],
  ["5", "ways money leaves"],
  ["0", "coin picks"],
  ["100%", "sourced"],
];

// The book's own spine: every chapter hangs off one of these, and the last two
// chapters close them in order.
const EXITS = [
  [
    "Scams",
    "Wrong-number texts, fake support agents, hacked celebrity accounts and address poisoning. They all run on the same few parts, and one question stops them.",
  ],
  [
    "Collapses",
    "QuadrigaCX, Mt. Gox, FTX and Celsius. Why a balance on an exchange is a promise rather than a coin, and how being repaid in full can still cost you four fifths of your bitcoin.",
  ],
  [
    "Leverage",
    "How a ten percent move wipes out a ten times position, and why October 2025 closed out more than 1.6 million traders in about a day.",
  ],
  [
    "Panic",
    "Why new buyers arrive after the price has already gone up, why they sell near the bottom, and the rules you write on a calm day to stop it.",
  ],
  [
    "Lost keys",
    "Twelve words that are worth everything you own. The two ways to lose them, and the malware built to read them out of your camera roll.",
  ],
];

const StoreBadges = () => (
  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
    {AUDIOBOOK_BADGES.map(({ href, src, alt, width, height }) => (
      <Link
        key={href}
        href={href}
        target="_blank"
        className="inline-block transition-transform duration-200 hover:-translate-y-0.5"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-10 w-auto md:h-12"
          unoptimized
        />
      </Link>
    ))}
  </div>
);

const Section = ({ title, children }) => (
  <section className="my-16 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-6 md:p-12">
    <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
    {children}
  </section>
);

const Audiobook = () => {
  const { base_url } = config.site;
  const canonical = `${base_url}/audiobook`;
  // Only once the sample is uploaded and in the registry: PostVideo renders
  // nothing without it, and an empty section would promise a video that is
  // not there.
  const sample = AUDIOBOOK.sampleVideoId
    ? getVideoById(AUDIOBOOK.sampleVideoId)
    : null;

  return (
    <Base
      layoutAds="none"
      title={`${AUDIOBOOK.title} | Audiobook`}
      meta_title={`${AUDIOBOOK.title} | Audiobook | The Crypto Wiki`}
      description={DESCRIPTION}
      image={AUDIOBOOK.ogImage}
      canonical={canonical}
      jsonLd={[
        audiobookSchema({
          ...AUDIOBOOK,
          description: DESCRIPTION,
          url: "/audiobook",
          image: AUDIOBOOK.ogImage,
          offers: [AUDIOBOOK.spotify, AUDIOBOOK.googlePlay],
        }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Audiobook", path: "/audiobook" },
        ]),
      ]}
    >
      <div className="container my-7 max-w-5xl">
        <header className="rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-6 text-center md:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Audiobook
          </span>
          <h1 className="mb-4 mt-2 text-4xl font-extrabold md:text-5xl">
            {AUDIOBOOK.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
            {AUDIOBOOK.subtitle}
          </p>

          <div className="mx-auto mt-8 w-60 max-w-full md:w-80">
            <Image
              src={AUDIOBOOK.cover}
              alt={`${AUDIOBOOK.title} audiobook cover`}
              width={320}
              height={320}
              priority
              className="block h-auto w-full rounded-xl shadow-2xl"
            />
          </div>

          <StoreBadges />
        </header>

        <Section title="What this is">
          <div className="space-y-4 text-base leading-relaxed md:text-lg">
            <p>
              {AUDIOBOOK.title} is a one hour audiobook about the losses that
              do not come back. Not a red chart, which you can sit out as long
              as you still hold the coin, but the five ways money actually
              leaves people in crypto: scams, collapses, leverage, panic and
              lost keys.
            </p>
            <p>
              In 2025, Americans reported losing more than $11 billion in
              crypto related fraud to the FBI, $7.2 billion of it to investment
              scams alone. That money went to a friendly stranger, an exchange
              that was quietly broke, a trade made with borrowed money, or
              twelve words on a scrap of paper that went out with the rubbish.
              Those losses are total, they are permanent, and most of them can
              be prevented.
            </p>
            <p>
              It opens with QuadrigaCX, the Canadian exchange whose founder
              supposedly took everyone&apos;s money to his grave, and what
              regulators found when they dug in. The real story is worse, and
              it is the most useful story in crypto. Then it takes each exit in
              turn and ends with the plan that closes them.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {FACTS.map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center"
              >
                <div className="text-3xl font-bold text-primary">{value}</div>
                <div className="mt-1 text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </Section>

        {sample && (
          <Section title="Hear the first nine minutes">
            <p className="mb-6 text-gray-400">
              The introduction and chapter one, free and unbroken. It is the
              real opening rather than a highlight reel, so if you like this you
              will like the book.
            </p>
            <PostVideo video={sample} label="Free sample" />
          </Section>
        )}

        <Section title="The five ways money leaves">
          <div className="grid gap-4 md:grid-cols-2">
            {EXITS.map(([name, text]) => (
              <div
                key={name}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <h3 className="mb-2 text-lg font-bold text-primary">{name}</h3>
                <p className="text-gray-300">{text}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <h3 className="mb-2 text-lg font-bold text-primary">
                Then the practice
              </h3>
              <p className="text-gray-300">
                Build a vault for your crypto, step by step: a hardware wallet
                bought from the right place, a backup that survives fire, a
                recovery test before any real money goes in. Then a thirty day
                plan that spreads it all into one small job at a time.
              </p>
            </div>
          </div>
        </Section>

        <Section title="How it opens">
          <p className="mb-6 text-gray-400">
            The first words of the introduction, so you know what you are
            getting before you pay for it.
          </p>
          <blockquote className="space-y-4 border-l-[3px] border-primary pl-4 text-base leading-relaxed md:pl-6 md:text-lg">
            <p>You probably think the danger in crypto is the price.</p>
            <p>
              It goes up. It goes down. It falls off a cliff on a Sunday night
              while you are asleep, and you wake up to a number that makes you
              feel sick. That is what the headlines are about. That is what
              your family warned you about. That is the thing you check ten,
              twenty times a day.
            </p>
            <p>
              But here is the thing about a price drop. If you still hold the
              coin, you still hold the coin. The number on the screen is a bad
              day. It is not the end of the story.
            </p>
          </blockquote>
        </Section>

        <Section title="Chapters">
          <ol>
            {AUDIOBOOK_CHAPTERS.map(([label, title, length]) => (
              <li
                key={label}
                className="flex flex-wrap items-baseline gap-x-3 border-b border-white/[0.07] py-2.5 last:border-b-0 sm:flex-nowrap"
              >
                <span className="shrink-0 text-sm text-gray-400 sm:min-w-[96px]">
                  {label}
                </span>
                <span className="order-3 basis-full sm:order-none sm:flex-1 sm:basis-auto">
                  {title}
                </span>
                <span className="ml-auto shrink-0 text-sm tabular-nums text-gray-400">
                  {length}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="What it does not do">
          <div className="space-y-4 text-base leading-relaxed md:text-lg">
            <p>
              It does not tell you what to buy, when to buy it or how much.
              There are no price predictions, no coin picks and no secret
              strategy, and it is not financial advice. It does not invent an
              expert or a quote. Every case and every number in it traces to a
              named source: the FBI&apos;s internet crime reports, the Ontario
              Securities Commission&apos;s review of QuadrigaCX, the court
              records from FTX and Celsius, and the security researchers who
              found the malware.
            </p>
            <p className="text-base text-gray-400">
              Narrated by {AUDIOBOOK.narrator}. This audiobook uses a synthetic
              voice, which both stores disclose on the listing. Want the free
              version first? Most of its topics have a guide in{" "}
              <Link href="/posts" className="text-primary hover:underline">
                our posts
              </Link>
              .
            </p>
          </div>
        </Section>

        <section className="rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-6 text-center md:p-8">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">Listen now</h2>
          <p className="mx-auto max-w-xl text-gray-400">
            {AUDIOBOOK.runtime}, {AUDIOBOOK.chapters} chapters. Both stores let
            you hear a free sample first.
          </p>
          <StoreBadges />
        </section>
      </div>
    </Base>
  );
};

export default Audiobook;
