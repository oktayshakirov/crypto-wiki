import { useEffect, useRef, useState, useCallback } from "react";

/**
 * BannerAd Component for Bitmedia Ads
 *
 * Simple implementation that works with separate ad units per page.
 * Each page can use a different adUnitId, eliminating navigation issues.
 *
 * @param {string} adUnitId - Your Bitmedia ad unit ID
 * @param {number} width - Ad width in pixels (default: 1 for adaptive)
 * @param {number} height - Ad height in pixels (default: 1 for adaptive)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {string} id - Unique ID for the ad instance
 */
const BannerAd = ({
  adUnitId = "692e0776457ec2706b483e16",
  width = 1,
  height = 1,
  className = "",
  style = {},
  id,
  debug = typeof window !== "undefined" &&
    window.__BITMEDIA_DEBUG__ !== false &&
    process.env.NEXT_PUBLIC_BITMEDIA_DEBUG !== "false",
}) => {
  const adRef = useRef(null);
  const scriptInsertedRef = useRef(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );

  // Initialize development mode check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isDev =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.includes("localhost") ||
        hostname.includes("127.0.0.1") ||
        hostname === "";

      setIsDevelopment(isDev);
      setIsMounted(true);
    }
  }, []);

  // Initialize ad script - simple and straightforward
  const initializeAd = useCallback(() => {
    if (!isMounted || isDevelopment || typeof window === "undefined") {
      return false;
    }

    // Prevent duplicate script insertion
    if (scriptInsertedRef.current) {
      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Script already inserted`);
      }
      return true;
    }

    const adElement = adRef.current || document.getElementById(uniqueId);
    if (!adElement) {
      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Element not found`);
      }
      return false;
    }

    // Check if script already exists
    const existingScript = adElement.nextElementSibling;
    if (
      existingScript &&
      existingScript.getAttribute("data-bitmedia-ad") === uniqueId
    ) {
      scriptInsertedRef.current = true;
      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Script already exists`);
      }
      return true;
    }

    // Create and insert the Bitmedia script
    const script = document.createElement("script");
    script.setAttribute("data-bitmedia-ad", uniqueId);
    script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","${adUnitId}",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

    if (adElement.parentNode) {
      adElement.parentNode.insertBefore(script, adElement.nextSibling);
      scriptInsertedRef.current = true;
      if (debug) {
        console.log(
          `[BannerAd:${uniqueId}] Script inserted for ad unit: ${adUnitId}`
        );
      }
      return true;
    }

    return false;
  }, [uniqueId, adUnitId, isMounted, isDevelopment, debug]);

  // Initialize ad when element is mounted
  useEffect(() => {
    if (!isMounted || isDevelopment) {
      return;
    }

    // Reset script inserted flag on mount (for new page loads)
    scriptInsertedRef.current = false;

    // Try to initialize immediately
    if (adRef.current) {
      initializeAd();
    }

    // Also try after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeAd();
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted, isDevelopment, initializeAd]);

  // Ref callback to initialize when element is rendered
  const adRefCallback = useCallback(
    (element) => {
      adRef.current = element;
      if (element && isMounted && !isDevelopment) {
        // Initialize after element is in DOM
        requestAnimationFrame(() => {
          initializeAd();
        });
      }
    },
    [isMounted, isDevelopment, initializeAd]
  );

  // Show placeholder in development mode
  if (isDevelopment) {
    return (
      <div
        className={`banner-ad-placeholder ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: width === 1 && height === 1 ? "90px" : `${height}px`,
          width: "100%",
          maxWidth: width === 1 ? "970px" : `${width}px`,
          margin: "0 auto",
          backgroundColor: "#1f2937",
          border: "2px dashed #4b5563",
          borderRadius: "4px",
          color: "#ffffff",
          fontSize: "14px",
          textAlign: "center",
          padding: "20px",
          marginTop: "20px",
          marginBottom: "20px",
          ...style,
        }}
        id={uniqueId}
      >
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Ad Placeholder{" "}
            {width === 1 && height === 1
              ? "(Adaptive)"
              : `(${width}x${height})`}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7 }}>
            Bitmedia ads only display in production
          </div>
          <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "4px" }}>
            Ad Unit: {adUnitId}
          </div>
        </div>
      </div>
    );
  }

  // Production: Render actual Bitmedia ad
  return (
    <div
      style={{
        display: "inline-block",
        width: "100%",
        ...style,
      }}
    >
      <ins
        ref={adRefCallback}
        className={`${adUnitId} ${className}`}
        style={{
          display: "inline-block",
          width: `${width}px`,
          height: `${height}px`,
        }}
        id={uniqueId}
      />
    </div>
  );
};

export default BannerAd;
