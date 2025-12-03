import { useId, useEffect, useRef } from "react";

const BannerAd = ({ id }) => {
  const uniqueId = useId();
  const adId = id || `banner-ad-${uniqueId.replace(/:/g, "-")}`;
  const adRef = useRef(null);

  useEffect(() => {
    // The ad script from _app.js should automatically detect elements with class "692e0776457ec2706b483e16"
    // Each instance is now unique with its own ID, so the script can initialize them separately
    if (adRef.current && typeof window !== "undefined") {
      // Force the ad script to re-scan if it has a method to do so
      // Most ad networks automatically detect new elements, but we can trigger a manual scan
      const triggerAdScan = () => {
        // Dispatch a custom event that the ad script might listen to
        window.dispatchEvent(new Event("ad-slot-added"));
      };

      // Small delay to ensure DOM is ready
      const timeout = setTimeout(triggerAdScan, 50);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="692e0776457ec2706b483e16"
      data-ad-id={adId}
      id={adId}
      style={{ display: "inline-block", width: "1px", height: "1px" }}
    ></ins>
  );
};

export default BannerAd;
