import PromoCard from "@components/PromoCard";

const BADGES = [
  {
    href: "https://apps.apple.com/de/app/crypto-wiki/id6742765176",
    src: "/app-store-badge-ios.png",
    alt: "Download on the App Store",
    width: 120,
    height: 40,
  },
  {
    href: "https://play.google.com/store/apps/details?id=com.shadev.thecryptowiki",
    src: "/google-play-badge.png",
    alt: "Get it on Google Play",
    width: 120,
    height: 40,
  },
];

const AppsBanner = () => (
  <PromoCard
    href="/app"
    artwork="/images/app-icon.png"
    artworkAlt="The Crypto Wiki app icon"
    linkLabel="About The Crypto Wiki app"
    eyebrow="Mobile app"
    title="Download our app"
    badges={BADGES}
  >
    Master the crypto universe with The Crypto Wiki - your all-in-one hub for
    learning, investing and connecting with the visionaries reshaping finance.
  </PromoCard>
);

export default AppsBanner;
