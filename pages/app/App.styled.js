import { keyframes } from "@emotion/react";

export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
`;

export const StyledContainer = ({ children }) => (
  <div className="container mx-auto max-w-7xl px-4 py-8">{children}</div>
);

export const HeaderSection = ({ children }) => (
  <div className="relative rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-8 text-center">
    {children}
  </div>
);

export const FeaturesSection = ({ children }) => (
  <div className="my-24 rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12">
    {children}
  </div>
);

export const FeaturesGrid = ({ children }) => (
  <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
    {children}
  </div>
);

export const FeatureBox = ({ children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 hover:shadow-2xl">
    {children}
  </div>
);

export const FeatureItem = ({ children }) => (
  <div className="flex items-start gap-6 rounded-2xl border border-white/5 p-5 transition-all duration-300">
    {children}
  </div>
);

export const ReviewsSection = ({ children }) => (
  <div className="rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12">
    {children}
  </div>
);

export const ReviewsGrid = ({ children }) => (
  <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);

export const ReviewCard = ({ children }) => (
  <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg">
    {children}
  </div>
);

export const CallToActionSection = ({ children }) => (
  <div className="relative rounded-2xl bg-gradient-to-b from-black/20 to-transparent p-12 text-center">
    {children}
  </div>
);
