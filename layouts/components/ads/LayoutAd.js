import config from "@config/config.json";

const adsEnabled = config?.params?.adsEnabled !== false;

// Placeholder layout ad slot. Renders nothing until adsEnabled is true and an
// ad unit (e.g. Google AdSense) is wired in below.
//
// The spacing wrapper lives in here rather than at each call site: while this
// returns null, an outer container with a margin would still push everything
// below it down by 20px for an ad that was never there.
const LayoutAd = () => {
  if (!adsEnabled) {
    return null;
  }

  return null;
};

export default LayoutAd;
