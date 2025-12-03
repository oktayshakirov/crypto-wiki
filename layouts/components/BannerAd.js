import { useId, useEffect, useRef } from "react";

// Global counter to ensure unique IDs across all instances
let adCounter = 0;

const BannerAd = ({ id }) => {
  const uniqueId = useId();
  const instanceId = useRef(adCounter++);
  const adId =
    id || `banner-ad-${instanceId.current}-${uniqueId.replace(/:/g, "-")}`;
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && typeof window !== "undefined") {
      const element = adRef.current;

      // Ensure this element is marked as ready for ad initialization
      // The ad script should detect all elements with the class
      element.setAttribute("data-ad-slot", adId);

      // Try to trigger ad script re-scan after a delay
      // This helps if the script loaded before this component mounted
      const triggerRescan = () => {
        // Create a custom event that might trigger ad re-initialization
        const event = new CustomEvent("adSlotAdded", {
          detail: { element, adClass: "692e0776457ec2706b483e16" },
        });
        document.dispatchEvent(event);

        // Also try to manually trigger if there's a global ad function
        if (window.bmcdn6 && typeof window.bmcdn6.refresh === "function") {
          window.bmcdn6.refresh();
        }
      };

      // Trigger immediately and after delays to catch script loading at different times
      triggerRescan();
      const timeout1 = setTimeout(triggerRescan, 200);
      const timeout2 = setTimeout(triggerRescan, 1000);
      const timeout3 = setTimeout(triggerRescan, 2000);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
      };
    }
  }, [adId]);

  return (
    <div
      data-banner-ad-wrapper={adId}
      style={{ display: "block", width: "100%" }}
    >
      <ins
        ref={adRef}
        className="692e0776457ec2706b483e16"
        data-ad-id={adId}
        id={adId}
        data-ad-slot={adId}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
      ></ins>
    </div>
  );
};

export default BannerAd;
