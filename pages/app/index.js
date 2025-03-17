import React from "react";
import Base from "@layouts/Baseof";
import Image from "next/image";
import Link from "next/link";
import {
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaBookReader,
  FaChartLine,
  FaUsers,
  FaTools,
  FaUser,
  FaQuoteLeft,
  FaChevronDown,
  FaStar,
} from "react-icons/fa";
import {
  StyledContainer,
  HeaderSection,
  FeatureItem,
  ReviewsSection,
  ReviewsGrid,
  ReviewCard,
  FeaturesGrid,
  FeatureBox,
  FeaturesSection,
  CallToActionSection,
} from "./App.styled";

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
      href="https://apps.apple.com/de/app/crypto-wiki/id6742765176?l=en-GB"
      target="_blank"
    >
      <Image
        src="/app-store-badge-ios.png"
        alt="Download on the App Store"
        width={180}
        height={60}
      />
    </Link>
    <Link href="/" target="_blank">
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
    icon: <FaBookReader className="text-2xl text-primary" />,
    title: "Educational Content",
    description: "Access expert-curated guides and tutorials",
    highlight: "100+ Articles",
  },
  {
    icon: <FaChartLine className="text-2xl text-primary" />,
    title: "Real-Time Data",
    description: "Live market data and analysis",
    highlight: "24/7 Updates",
  },
  {
    icon: <FaShieldAlt className="text-2xl text-primary" />,
    title: "Secure Platform",
    description: "Verified exchange reviews and safety guides",
    highlight: "Trusted",
  },
];

const KEY_FEATURES = [
  {
    icon: <FaBookReader className="text-5xl text-primary" />,
    title: "Learn & Understand",
  },
  {
    icon: <FaChartLine className="text-5xl text-primary" />,
    title: "Market Analysis",
  },
  {
    icon: <FaUsers className="text-5xl text-primary" />,
    title: "Community",
  },
  {
    icon: <FaTools className="text-5xl text-primary" />,
    title: "Trading Tools",
  },
];

const REVIEWS = [
  {
    name: "Alex Thompson",
    location: "New York, USA",
    rating: 5,
    text: "Crypto Wiki has been an invaluable resource for my crypto journey. The educational content is top-notch, and the real-time market data helps me make informed decisions.",
    date: "2 weeks ago",
  },
  {
    name: "Sarah Chen",
    location: "Singapore",
    rating: 5,
    text: "The app's interface is clean and intuitive. I particularly love the exchange reviews and security guides that help me stay safe in the crypto space.",
    date: "1 month ago",
  },
  {
    name: "Michael Rodriguez",
    location: "London, UK",
    rating: 5,
    text: "As a beginner in crypto, this app has been my go-to resource. The educational content is well-structured and easy to understand.",
    date: "3 months ago",
  },
];

const App = () => {
  return (
    <Base title={"CRYPTO WIKI APP: Your All-In-One Crypto Hub"}>
      <StyledContainer>
        <HeaderSection>
          <h1 className="to-secondary mb-4 bg-gradient-to-r from-primary bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
            CRYPTO WIKI APP
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
            Your personalized companion for navigating the crypto universe
          </p>
        </HeaderSection>

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

        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureItem key={feature.title}>
              <div className="flex h-[56px] min-w-[56px] items-center justify-center rounded-xl bg-white/5 p-4 text-primary shadow-lg">
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-400">
                    {feature.description}
                  </p>
                  <span className="inline-block rounded border border-white/10 bg-white/5 px-2 py-1 text-sm text-primary">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            </FeatureItem>
          ))}
        </div>

        <FeaturesSection>
          <SectionTitle subtitle="Everything you need to master the crypto universe">
            Key Features
          </SectionTitle>

          <FeaturesGrid>
            {KEY_FEATURES.map((feature) => (
              <FeatureBox key={feature.title}>
                <div className="mb-4 flex h-20 items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary">
                  {feature.title}
                </h3>
              </FeatureBox>
            ))}
          </FeaturesGrid>
        </FeaturesSection>

        <ReviewsSection>
          <SectionTitle subtitle="Join thousands of successful crypto enthusiasts who trust our platform">
            What Our Users Say
          </SectionTitle>

          <ReviewsGrid>
            {REVIEWS.map((review) => (
              <ReviewCard key={review.name}>
                <div className="mb-6 flex items-center">
                  <div className="to-secondary/40 mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary/40 text-primary shadow-lg">
                    <FaUser size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <p className="text-sm text-gray-400">{review.location}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <FaQuoteLeft
                    size={20}
                    className="mr-2 inline-block text-white/30"
                  />
                  <p className="text-gray-300">{review.text}</p>
                </div>

                <div className="mb-4 flex text-yellow-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className="mt-auto border-t border-white/5 pt-4 text-sm text-gray-400">
                  {review.date}
                </p>
              </ReviewCard>
            ))}
          </ReviewsGrid>

          <div className="mt-8 text-center">
            <div className="mb-2 flex items-center justify-center gap-2 text-2xl text-primary">
              <FaStar />
              <span>4.9 out of 5 stars</span>
            </div>
            <p className="text-gray-400">
              Based on 1,000+ reviews from App Store and Google Play
            </p>
          </div>
        </ReviewsSection>

        <CallToActionSection>
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Start Your Crypto Journey?
          </h2>
          <p className="mb-8 text-xl">
            Download Crypto Wiki today and join thousands of successful crypto
            enthusiasts who trust our platform for their crypto education and
            investment decisions.
          </p>
          <FaChevronDown className="mx-auto mb-8 animate-bounce text-2xl text-primary" />

          <AppStoreBadges />
        </CallToActionSection>
      </StyledContainer>
    </Base>
  );
};

export default App;
