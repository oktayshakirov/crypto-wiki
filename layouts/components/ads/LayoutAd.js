import config from "@config/config.json";

const adsEnabled = config?.params?.adsEnabled !== false;

// Placeholder layout ad slot. Renders nothing until adsEnabled is true
// and an ad unit (e.g. Google AdSense) is wired in below.
const LayoutAd = () => {
  if (!adsEnabled) {
    return null;
  }

  return null;
};

export default LayoutAd;
