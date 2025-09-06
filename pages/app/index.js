import React from "react";
import Base from "@layouts/Baseof";
import Image from "next/image";
import Link from "next/link";
import {
  FaShieldAlt,
  FaBookReader,
  FaBitcoin,
  FaUsers,
  FaTools,
  FaUser,
  FaQuoteLeft,
  FaChevronDown,
  FaStar,
  FaWifi,
  FaMobile,
} from "react-icons/fa";
import config from "@config/config.json";

const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-12 text-center">
    <h2 className="mb-4 text-4xl font-bold">{children}</h2>
    {subtitle && (
      <p className="mx-auto max-w-2xl text-lg text-gray-400">{subtitle}</p>
    )}
  </div>
);

const AppStoreBadges = () => (
  <div className="mt-8 flex flex-wrap justify-center gap-6">
    <Link
      href="https://apps.apple.com/de/app/crypto-wiki/id6742765176"
      target="_blank"
    >
      <Image
        src="/app-store-badge-ios.png"
        alt="Download on the App Store"
        width={180}
        height={60}
      />
    </Link>
    <Link
      href="https://play.google.com/store/apps/details?id=com.shadev.thecryptowiki"
      target="_blank"
    >
      <Image
        src="/google-play-badge.png"
        alt="Get it on Google Play"
        width={185}
        height={60}
      />
    </Link>
  </div>
);

const FEATURES = [
  {
    icon: <FaBookReader className="text-4xl text-primary" />,
    title: "Educational Content",
    description:
      "Access comprehensive expert-curated guides and tutorials for all skill levels.",
    highlight: "100+ Articles",
  },
  {
    icon: <FaShieldAlt className="text-4xl text-primary" />,
    title: "Smart Security",
    description:
      "Make confident decisions with our verified exchange reviews and security insights.",
    highlight: "Trusted",
  },
  {
    icon: <FaBitcoin className="text-4xl text-primary" />,
    title: "Real-Time Data",
    description:
      "Stay informed with live market data and in-depth analysis updates.",
    highlight: "24/7 Updates",
  },
];

const KEY_FEATURES = [
  {
    icon: <FaBookReader className="text-5xl text-primary" />,
    title: "Articles",
  },
  {
    icon: <FaBitcoin className="text-5xl text-primary" />,
    title: "Exchanges",
  },
  {
    icon: <FaUsers className="text-5xl text-primary" />,
    title: "Crypto OG's",
  },
  {
    icon: <FaTools className="text-5xl text-primary" />,
    title: "Trading Tools",
  },
];

const PORTFOLIO_FEATURES = [
  {
    icon: <FaBitcoin className="text-3xl text-primary" />,
    title: "500+ Cryptocurrencies",
    description: "Track any cryptocurrency from Bitcoin to the newest altcoins",
  },
  {
    icon: <FaShieldAlt className="text-3xl text-primary" />,
    title: "Real-Time Monitoring",
    description: "Live portfolio value updates and performance tracking",
  },
  {
    icon: <FaUsers className="text-3xl text-primary" />,
    title: "Secure Data Storage",
    description: "Your data stays on your device - no cloud storage required",
  },
];

const OFFLINE_FEATURES = [
  {
    icon: <FaBookReader className="text-3xl text-primary" />,
    title: "Download Articles",
    description: "Save content for offline reading anywhere",
  },
  {
    icon: <FaWifi className="text-3xl text-primary" />,
    title: "Offline Access",
    description: "Access your saved content without connection",
  },
  {
    icon: <FaMobile className="text-3xl text-primary" />,
    title: "Perfect for Travel",
    description: "Learn during commutes or when traveling",
  },
];

const ADVANCED_TOOLS = [
  {
    name: "Fear & Greed Index",
    description: "Follow market sentiment in real time",
    icon: "📊",
  },
  {
    name: "Bitcoin Rainbow Chart",
    description: "Visualize BTC's price trends at a glance",
    icon: "🌈",
  },
  {
    name: "Market Heatmap",
    description: "Spot booming sectors and tokens with live data",
    icon: "🔥",
  },
  {
    name: "Staking Calculator",
    description: "Estimate rewards and optimize your passive income",
    icon: "💰",
  },
  {
    name: "Random Coin Generator",
    description: "Feeling lucky? Discover new investment ideas instantly!",
    icon: "🎲",
  },
  {
    name: "More Coming Soon",
    description: "We're working hard to grow our collection of trading tools",
    icon: "🚀",
  },
];

const REVIEWS = [
  {
    name: "Alex Jones",
    location: "New York, USA",
    rating: 5,
    text: "The educational content on Crypto Wiki is incredibly easy to understand. The real-time market data and analysis tools help me make more informed investment decisions.",
    date: "2 weeks ago",
  },
  {
    name: "Sarah Woods",
    location: "Singapore",
    rating: 5,
    text: "The app's interface is beautifully designed and intuitive to navigate. The exchange reviews and security features help me make safe and confident trading decisions.",
    date: "1 month ago",
  },
  {
    name: "Falco Lang",
    location: "Berlin, DE",
    rating: 5,
    text: "As someone new to cryptocurrency, this app provides clear and practical guidance. The educational resources and trading insights have made my learning journey smooth.",
    date: "3 months ago",
  },
];

const App = () => {
  return (
    <Base
      title="Crypto Wiki App | Your All-In-One Crypto Hub for iOS & Android"
      meta_title="Crypto Wiki App | Crypto Guides, News & Insights on iOS & Android"
      description="Download the Crypto Wiki App for iOS and Android. Stay updated with real-time crypto news, expert analysis, and comprehensive guides—your go-to crypto resource on the go."
      image="/images/app.jpg"
      canonical={`${config.site.base_url}/app`}
    >
      <div className="container my-7">
        <div className="relative rounded-2xl p-8 text-center">
          <h1 className="to-secondary mb-4 bg-primary bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
            CRYPTO WIKI APP
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl">
            Your personalized companion for navigating the crypto universe
          </p>
        </div>

        <div className="relative mb-8 overflow-hidden rounded-2xl">
          <Image
            src="/images/app.jpg"
            alt="Crypto Wiki App Interface"
            layout="responsive"
            width={815}
            height={351}
          />
        </div>

        <div className="mb-16 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-6 text-center md:p-12">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            Transform Your Crypto Journey
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed">
            Master the crypto universe with Crypto Wiki—your trusted companion
            for learning, investing, and connecting with visionaries who are
            reshaping the future of finance.
          </p>

          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="flex items-center">
              <FaStar className="mr-2 text-yellow-400" />
              <span className="font-bold">4.9/5</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">Available Worldwide</span>
          </div>

          <div className="mx-auto max-w-2xl rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="flex items-center justify-center gap-2 text-base font-medium md:text-lg">
              <FaQuoteLeft className="text-sm opacity-50" />
              <span>
                Rated <strong>5 stars</strong> by thousands of users worldwide
              </span>
            </p>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex h-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300"
            >
              <div className="flex h-[80px] w-[80px] items-center justify-center rounded-2xl bg-[#242424] text-primary shadow-lg">
                {feature.icon}
              </div>
              <div className="flex flex-1 flex-col text-center">
                <h3 className="mb-2 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mb-4 flex-1 text-gray-400">
                  {feature.description}
                </p>
                <span className="inline-block rounded-lg bg-[#242424] px-4 py-2 text-sm text-primary">
                  {feature.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="my-20 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12">
          <SectionTitle subtitle="Everything you need to master the crypto universe">
            Key Features
          </SectionTitle>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {KEY_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl"
              >
                <div className="mb-4 flex h-20 items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-primary">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <div className="my-20 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12">
          <SectionTitle subtitle="Track Your Crypto Portfolio">
            Portfolio Management
          </SectionTitle>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PORTFOLIO_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex h-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#242424] text-primary shadow-lg">
                  {feature.icon}
                </div>
                <div className="flex flex-1 flex-col text-center">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-20 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12">
          <SectionTitle subtitle="Read Offline, Learn Anywhere">
            Offline Capabilities
          </SectionTitle>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {OFFLINE_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex h-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#242424] text-primary shadow-lg">
                  {feature.icon}
                </div>
                <div className="flex flex-1 flex-col text-center">
                  <h3 className="mb-2 text-xl font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-20 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12">
          <SectionTitle subtitle="Smarter Tools, Smarter Wins">
            Advanced Trading Tools
          </SectionTitle>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADVANCED_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 transition-all duration-300 hover:bg-white/5"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-3xl">{tool.icon}</span>
                  <h3 className="text-lg font-bold text-white">{tool.name}</h3>
                </div>
                <p className="text-gray-400">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-20 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Completely Free, No Ads, No Signup Required
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              Get full access to all features without any hidden costs,
              subscriptions, or annoying advertisements. Your crypto education
              journey starts here, completely free.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2">
                <FaShieldAlt className="text-green-400" />
                <span className="text-sm font-semibold text-white">No Ads</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2">
                <FaUsers className="text-green-400" />
                <span className="text-sm font-semibold text-white">
                  No Signup
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2">
                <FaBitcoin className="text-green-400" />
                <span className="text-sm font-semibold text-white">
                  100% Free
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-b from-black/20 to-transparent px-4 py-12 md:p-12">
          <SectionTitle subtitle="Join thousands of successful crypto enthusiasts who trust our platform">
            What Our Users Say
          </SectionTitle>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#1a1a1a] p-4 backdrop-blur-lg"
              >
                <div className="mb-3 flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary/40 to-primary/20 text-primary shadow-lg">
                    <FaUser size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{review.name}</h4>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>

                <div className="mb-3 flex-1">
                  <p className="text-sm leading-relaxed text-gray-300">
                    {review.text}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar key={i} size={12} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-2xl text-primary">
              <FaStar />
              <span>4.9 out of 5 stars</span>
            </div>
            <p className="text-gray-400">
              Based on 1,000+ reviews from App Store and Google Play
            </p>
          </div>
        </div>

        <div className="relative rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Start Your Crypto Journey?
          </h2>
          <p className="mb-8 text-lg">
            Download Crypto Wiki today and join thousands of successful crypto
            enthusiasts who trust our platform for their crypto education and
            investment decisions.
          </p>
          <FaChevronDown className="mx-auto mb-8 animate-bounce text-2xl text-primary" />

          <AppStoreBadges />
        </div>
      </div>
    </Base>
  );
};

export default App;
