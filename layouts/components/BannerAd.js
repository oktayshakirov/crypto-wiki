import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";

/**
 * BannerAd Component for Bitmedia Ads - Next.js Optimized
 *
 * Handles Next.js client-side navigation by tracking ads per route
 * and only initializing ads that are on the current active route.
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
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );

  // Initialize development mode and track route
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
      setCurrentRoute(router.asPath);
    }
  }, [router.asPath]);

  // Track route changes
  useEffect(() => {
    const handleRouteChange = (url) => {
      setCurrentRoute(url);

      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Route changed to: ${url}`);
      }
    };

    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [router, uniqueId, debug]);

  // Check if this ad is on the current route
  const isOnCurrentRoute = useCallback(() => {
    if (!currentRoute || !adRef.current) return false;

    // Check if the ad element is actually visible and in the viewport
    const element = adRef.current;
    const rect = element.getBoundingClientRect();
    const isVisible =
      element.offsetParent !== null &&
      rect.width > 0 &&
      rect.height > 0 &&
      document.body.contains(element);

    return isVisible;
  }, [currentRoute]);

  // Initialize ad script for this specific ad instance
  const initializeAd = useCallback(() => {
    if (!isMounted || isDevelopment || typeof window === "undefined") {
      return false;
    }

    // Only initialize if on current route
    if (!isOnCurrentRoute()) {
      if (debug) {
        console.log(
          `[BannerAd:${uniqueId}] Not on current route, skipping initialization`
        );
      }
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
    script.setAttribute("data-route", currentRoute || "");
    script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","${adUnitId}",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

    if (adElement.parentNode) {
      adElement.parentNode.insertBefore(script, adElement.nextSibling);
      if (debug) {
        console.log(
          `[BannerAd:${uniqueId}] Script inserted for route: ${currentRoute}`
        );
      }
      return true;
    }

    return false;
  }, [
    uniqueId,
    adUnitId,
    isMounted,
    isDevelopment,
    currentRoute,
    isOnCurrentRoute,
    debug,
  ]);

  // Global handler to reinitialize Bitmedia after route change
  useEffect(() => {
    if (!isMounted || isDevelopment || typeof window === "undefined") {
      return;
    }

    const globalRescanKey = `__bitmedia_rescan_${adUnitId}`;

    const handleRouteChange = (url) => {
      if (debug) {
        console.log(
          `[BannerAd] Route change to: ${url}, will reinitialize Bitmedia`
        );
      }

      // Only rescan once per route change
      if (window[globalRescanKey]) {
        return;
      }
      window[globalRescanKey] = true;

      setTimeout(() => {
        window[globalRescanKey] = false;
      }, 3000);

      // Wait for new page to render, then reinitialize
      setTimeout(() => {
        try {
          // Find all <ins> tags that are visible on the current route
          const allInsTags = Array.from(
            document.getElementsByTagName("ins")
          ).filter((ins) => {
            if (!ins.classList.contains(adUnitId)) return false;
            if (!ins.parentNode || !document.body.contains(ins)) return false;

            // Check if element is visible
            const rect = ins.getBoundingClientRect();
            return (
              ins.offsetParent !== null && rect.width > 0 && rect.height > 0
            );
          });

          if (allInsTags.length === 0) {
            if (debug) {
              console.log(`[BannerAd] No visible ads found on route: ${url}`);
            }
            return;
          }

          if (debug) {
            console.log(
              `[BannerAd] Found ${allInsTags.length} visible ad(s) on route: ${url}`
            );
          }

          // Remove old Bitmedia scripts from previous routes
          const allScripts = document.querySelectorAll(
            `script[data-bitmedia-ad], script[src*="/js/${adUnitId}.js"]`
          );

          allScripts.forEach((script) => {
            const scriptRoute = script.getAttribute("data-route");
            // Remove scripts from old routes or if route doesn't match
            if (scriptRoute && scriptRoute !== url) {
              script.remove();
            }
          });

          // Remove main Bitmedia script to force reload
          const bitmediaScript = document.querySelector(
            `script[src*="/js/${adUnitId}.js"]`
          );

          if (bitmediaScript) {
            const src = bitmediaScript.src;
            const baseUrl = src.split("?")[0];
            bitmediaScript.remove();

            // Re-add with cache buster
            setTimeout(() => {
              const newScript = document.createElement("script");
              newScript.async = true;
              newScript.src = `${baseUrl}?v=${new Date().getTime()}&route=${encodeURIComponent(
                url
              )}`;

              if (document.body) {
                document.body.appendChild(newScript);
              } else {
                document.head.appendChild(newScript);
              }

              if (debug) {
                console.log(
                  `[BannerAd] Bitmedia script reloaded for route: ${url}, should detect ${allInsTags.length} ad(s)`
                );
              }
            }, 200);
          } else {
            // If no main script, re-execute inline scripts for visible ads
            allInsTags.forEach((insTag) => {
              const existingScript = insTag.nextElementSibling;
              if (
                existingScript &&
                existingScript.getAttribute("data-bitmedia-ad")
              ) {
                // Re-execute the script
                const scriptContent = existingScript.textContent;
                existingScript.remove();

                setTimeout(() => {
                  const newScript = document.createElement("script");
                  newScript.textContent = scriptContent;
                  newScript.setAttribute(
                    "data-bitmedia-ad",
                    existingScript.getAttribute("data-bitmedia-ad")
                  );
                  newScript.setAttribute("data-route", url);

                  if (insTag.nextSibling) {
                    insTag.parentNode.insertBefore(
                      newScript,
                      insTag.nextSibling
                    );
                  } else {
                    insTag.parentNode.appendChild(newScript);
                  }
                }, 100);
              }
            });
          }
        } catch (error) {
          if (debug) {
            console.error(`[BannerAd] Error reinitializing:`, error);
          }
        }
      }, 1000); // Wait 1s for new page to render
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

  // Initialize ad when element is mounted and on current route
  useEffect(() => {
    if (!isMounted || isDevelopment || !currentRoute) {
      return;
    }

    // Wait a bit for route to settle
    const timer = setTimeout(() => {
      if (isOnCurrentRoute()) {
        initializeAd();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isMounted, isDevelopment, currentRoute, isOnCurrentRoute, initializeAd]);

  // Ref callback to initialize when element is rendered
  const adRefCallback = useCallback(
    (element) => {
      adRef.current = element;
      if (element && isMounted && !isDevelopment && currentRoute) {
        requestAnimationFrame(() => {
          if (isOnCurrentRoute()) {
            initializeAd();
          }
        });
      }
    },
    [isMounted, isDevelopment, currentRoute, isOnCurrentRoute, initializeAd]
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
