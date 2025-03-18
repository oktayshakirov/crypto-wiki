import Link from "next/link";
import Image from "next/image";

const AppsBanner = () => {
  return (
    <div className="mx-auto mb-2.5 rounded-[25px] p-4 text-base">
      <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div className="flex flex-col items-center sm:max-w-[70%] sm:items-start">
          <h2 className="mb-2 text-xl font-semibold">Download our app</h2>
          <p className="mb-2 text-sm">
            Master the crypto universe with The Crypto Wiki—your all-in-one hub
            for learning, investing and connecting with the visionaries
            reshaping finance.
          </p>
          <Link href="/app" className="text-sm text-primary">
            Learn more
          </Link>
        </div>
        <div className="flex shrink-0 items-center justify-center gap-2.5">
          <a
            href="https://apps.apple.com/de/app/crypto-wiki/id6742765176?l=en-GB"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/app-store-badge-ios.png"
              alt="Download on the App Store"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </a>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              src="/google-play-badge.png"
              alt="Get it on Google Play"
              width={123}
              height={40}
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppsBanner;
