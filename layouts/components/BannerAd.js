import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

/**
 * BannerAd Component for Bitmedia Ads
 *
 * According to Bitmedia documentation:
 * https://bitmedia.io/guides/publisher/implement-js-code-on-website
 *
 * You can reuse the same ad unit across your entire website.
 * The script is loaded only once per page, even if you use multiple <BannerAd /> components.
 *
 * @param {string} adUnitId - Your Bitmedia ad unit ID (default: "692e0776457ec2706b483e16")
 * @param {number} width - Ad width in pixels (default: 1 for adaptive/responsive ads)
 * @param {number} height - Ad height in pixels (default: 1 for adaptive/responsive ads)
 * @param {string} className - Additional CSS classes
 * @param {object} style - Additional inline styles
 * @param {string} id - Unique ID for the ad instance
 */
const BannerAd = ({
  adUnitId = "692e0776457ec2706b483e16", // Your ad unit ID - can be reused across the website
  width = 1, // 1px for adaptive/responsive ads (matches your Bitmedia code)
  height = 1, // 1px for adaptive/responsive ads (matches your Bitmedia code)
  className = "",
  style = {},
  id,
}) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const router = useRouter();
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

  // Initialize ad on mount and route changes
  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || isDevelopment) return;
    if (!containerRef.current || !adRef.current) return;

    const initializeAd = () => {
      if (!containerRef.current || !adRef.current) return;

      const adElement = document.getElementById(uniqueId);
      if (!adElement) return;

      // Check if script already exists for this ad instance
      const existingInlineScript =
        adElement.nextElementSibling?.getAttribute("data-bitmedia-ad");
      if (existingInlineScript === uniqueId) {
        return; // Already initialized
      }

      // According to Bitmedia documentation, place script right after <ins> tag
      // The script loads the Bitmedia JS file which finds all <ins> tags with the class
      const inlineScript = document.createElement("script");
      inlineScript.setAttribute("data-bitmedia-ad", uniqueId);
      inlineScript.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","${adUnitId}",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      // Insert script right after the <ins> tag (as per Bitmedia docs)
      if (adElement.parentNode) {
        adElement.parentNode.insertBefore(inlineScript, adElement.nextSibling);
      }
    };

    // Handle route changes for Next.js client-side navigation
    const handleRouteChange = () => {
      // Re-initialize after route change with a delay to ensure DOM is ready
      setTimeout(() => {
        initializeAd();
      }, 400);
    };

    // Initialize on mount
    const timer = setTimeout(() => {
      initializeAd();
    }, 200);

    // Listen for route changes
    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      clearTimeout(timer);
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [isMounted, isDevelopment, adUnitId, uniqueId, router]);

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
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#ffffff",
            }}
          >
            Ad Placeholder{" "}
            {width === 1 && height === 1
              ? "(Adaptive)"
              : `(${width}x${height})`}
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7, color: "#d1d5db" }}>
            Bitmedia ads only display in production
          </div>
        </div>
      </div>
    );
  }

  // Production: Render actual Bitmedia ad
  // Matches your Bitmedia code: width:1px;height:1px for adaptive/responsive ads
  return (
    <div
      ref={containerRef}
      style={{
        display: "inline-block",
        width: "100%",
        ...style,
      }}
    >
      <ins
        ref={adRef}
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
