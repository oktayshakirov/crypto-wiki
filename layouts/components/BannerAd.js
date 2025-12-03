import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";

/**
 * BannerAd Component for Bitmedia Ads
 *
 * According to Bitmedia documentation:
 * https://bitmedia.io/guides/publisher/implement-js-code-on-website
 *
 * You can reuse the same ad unit across your entire website.
 *
 * @param {string} adUnitId - Your Bitmedia ad unit ID (default: "692e0776457ec2706b483e16")
 * @param {number} width - Ad width in pixels (default: 1 for adaptive/responsive ads)
 * @param {number} height - Ad height in pixels (default: 1 for adaptive/responsive ads)
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

  // Initialize ad script for this specific ad instance
  const initializeAd = useCallback(() => {
    if (!isMounted || isDevelopment || typeof window === "undefined") {
      return false;
    }

    const adElement = adRef.current || document.getElementById(uniqueId);
    if (!adElement) {
      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Element not found`);
      }
      return false;
    }

    // Check if script already exists
    const existingScript =
      adElement.nextElementSibling?.getAttribute("data-bitmedia-ad");
    if (existingScript === uniqueId) {
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
      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Script inserted`);
      }
      return true;
    }

    return false;
  }, [uniqueId, adUnitId, isMounted, isDevelopment, debug]);

  // Force Bitmedia to re-scan after navigation
  // This is called once per route change, globally
  useEffect(() => {
    if (!isMounted || isDevelopment || typeof window === "undefined") {
      return;
    }

    const globalRescanKey = `__bitmedia_rescan_${adUnitId}`;

    const handleRouteChange = () => {
      if (debug) {
        console.log(`[BannerAd] Route change detected, will force re-scan`);
      }

      // Only rescan once per route change
      if (window[globalRescanKey]) {
        return;
      }
      window[globalRescanKey] = true;

      // Reset flag after 2 seconds
      setTimeout(() => {
        window[globalRescanKey] = false;
      }, 2000);

      // Wait for new ads to initialize, then force re-scan
      setTimeout(() => {
        try {
          // Find all <ins> tags with the ad unit class
          const allInsTags = Array.from(
            document.getElementsByTagName("ins")
          ).filter(
            (ins) =>
              ins.classList.contains(adUnitId) &&
              ins.parentNode &&
              document.body.contains(ins)
          );

          // Find the main Bitmedia JS file script
          const bitmediaScript = document.querySelector(
            `script[src*="/js/${adUnitId}.js"]`
          );

          if (bitmediaScript && allInsTags.length > 0) {
            if (debug) {
              console.log(
                `[BannerAd] Found ${allInsTags.length} ad(s), forcing Bitmedia re-scan`
              );
            }

            // Remove the existing Bitmedia script
            const src = bitmediaScript.src;
            const baseUrl = src.split("?")[0];
            bitmediaScript.remove();

            // Re-add with cache buster to force re-execution
            setTimeout(() => {
              const newScript = document.createElement("script");
              newScript.async = true;
              newScript.src = `${baseUrl}?v=${new Date().getTime()}&rescan=1`;

              if (document.body) {
                document.body.appendChild(newScript);
              } else {
                document.head.appendChild(newScript);
              }

              if (debug) {
                console.log(
                  `[BannerAd] Bitmedia script reloaded, should detect ${allInsTags.length} ad(s)`
                );
              }
            }, 100);
          } else if (debug) {
            if (!bitmediaScript) {
              console.log(
                `[BannerAd] Bitmedia script not loaded yet, inline scripts will load it`
              );
            }
            if (allInsTags.length === 0) {
              console.log(`[BannerAd] No ads found on this page`);
            }
          }
        } catch (error) {
          if (debug) {
            console.error(`[BannerAd] Error forcing re-scan:`, error);
          }
        }
      }, 1200); // Wait 1.2s for new ads to initialize
    };

    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [isMounted, isDevelopment, adUnitId, router, debug]);

  // Initialize ad when element is mounted
  useEffect(() => {
    if (!isMounted || isDevelopment) {
      return;
    }

    // Try to initialize immediately
    if (adRef.current) {
      initializeAd();
    }

    // Also try after a short delay
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
        // Initialize after a short delay to ensure element is fully in DOM
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
