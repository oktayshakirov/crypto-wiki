import { useEffect, useRef, useState, useCallback } from "react";
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
  debug = true, // Debug enabled globally - set to false or window.__BITMEDIA_DEBUG__ = false to disable
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

  // Shared initialization function - memoized to avoid recreating on every render
  const initializeAdScript = useCallback(
    (element = null, source = "unknown") => {
      if (debug) {
        console.log(
          `[BannerAd:${uniqueId}] initializeAdScript called from:`,
          source
        );
      }

      // Use provided element or try to find it
      const adElement = element || document.getElementById(uniqueId);

      if (!adElement) {
        if (debug) {
          console.warn(`[BannerAd:${uniqueId}] Element not found in DOM`);
        }
        return false; // Element not found
      }

      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Element found:`, {
          id: adElement.id,
          className: adElement.className,
          hasParent: !!adElement.parentNode,
          nextSibling: adElement.nextElementSibling?.tagName,
        });
      }

      // Verify this is the right element (has the correct class and ID)
      if (
        adElement.id !== uniqueId ||
        !adElement.classList.contains(adUnitId)
      ) {
        if (debug) {
          console.warn(
            `[BannerAd:${uniqueId}] Wrong element - ID mismatch or missing class`,
            {
              expectedId: uniqueId,
              actualId: adElement.id,
              hasClass: adElement.classList.contains(adUnitId),
            }
          );
        }
        return false; // Wrong element
      }

      // Check if script already exists for this ad instance
      const existingInlineScript =
        adElement.nextElementSibling?.getAttribute("data-bitmedia-ad");
      if (existingInlineScript === uniqueId) {
        if (debug) {
          console.log(`[BannerAd:${uniqueId}] Script already exists, skipping`);
        }
        return true; // Already initialized
      }

      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Creating and inserting script`);
      }

      // According to Bitmedia documentation, place script right after <ins> tag
      // The script loads the Bitmedia JS file which finds all <ins> tags with the class
      const inlineScript = document.createElement("script");
      inlineScript.setAttribute("data-bitmedia-ad", uniqueId);
      inlineScript.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","${adUnitId}",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      // Insert script right after the <ins> tag (as per Bitmedia docs)
      if (adElement.parentNode) {
        adElement.parentNode.insertBefore(inlineScript, adElement.nextSibling);
        if (debug) {
          console.log(`[BannerAd:${uniqueId}] Script inserted successfully`);
        }
        return true;
      }

      if (debug) {
        console.error(
          `[BannerAd:${uniqueId}] Failed to insert script - no parent node`
        );
      }
      return false;
    },
    [uniqueId, adUnitId, debug]
  );

  // Initialize ad when element is rendered and on route changes
  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || isDevelopment) return;

    const initializeAd = initializeAdScript;

    // Initialize when ref is set (for initial load)
    const tryInitializeWithRef = () => {
      if (adRef.current) {
        return initializeAd(adRef.current);
      }
      return false;
    };

    // Handle route changes for Next.js client-side navigation
    const handleRouteChange = () => {
      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Route change detected`);
      }

      // Initialize ads on new page after route change
      // Don't remove existing scripts - just check if they exist and add if missing
      const initOnRouteChange = (retryCount = 0) => {
        const maxRetries = 20; // Increased retries for navigation

        if (debug && retryCount > 0) {
          console.log(
            `[BannerAd:${uniqueId}] Route change retry ${retryCount}/${maxRetries}`
          );
        }

        // Try to find the element by ID (this component's specific ad)
        const adElement = document.getElementById(uniqueId);

        if (adElement) {
          // Verify this is actually our element (check it's in the viewport or has correct class)
          // This ensures we're not getting an old element from previous page
          const rect = adElement.getBoundingClientRect();
          const isVisible = adElement.offsetParent !== null || rect.width > 0;

          if (debug) {
            console.log(
              `[BannerAd:${uniqueId}] Element found on route change:`,
              {
                id: adElement.id,
                className: adElement.className,
                isVisible,
                rect: { width: rect.width, height: rect.height },
                hasParent: !!adElement.parentNode,
              }
            );
          }

          if (!isVisible && retryCount < 5) {
            // Element might not be rendered yet, retry
            if (debug) {
              console.log(
                `[BannerAd:${uniqueId}] Element not visible, retrying...`
              );
            }
            setTimeout(() => initOnRouteChange(retryCount + 1), 50);
            return;
          }

          // Check if script already exists - if it does, we're done
          const existingScript = adElement.nextElementSibling;
          if (existingScript?.getAttribute("data-bitmedia-ad") === uniqueId) {
            if (debug) {
              console.log(
                `[BannerAd:${uniqueId}] Script already exists, skipping`
              );
            }
            return; // Already initialized, no need to do anything
          }

          // Script doesn't exist, so initialize it
          if (initializeAd(adElement, `routeChange-retry${retryCount}`)) {
            if (debug) {
              console.log(
                `[BannerAd:${uniqueId}] Successfully initialized on route change`
              );
            }
            return; // Successfully initialized
          }
        } else {
          if (debug && retryCount < 3) {
            console.log(
              `[BannerAd:${uniqueId}] Element not found, retrying...`
            );
          }
        }

        // Element not found yet, retry
        if (retryCount < maxRetries) {
          setTimeout(() => initOnRouteChange(retryCount + 1), 100);
        } else if (debug) {
          console.error(
            `[BannerAd:${uniqueId}] Failed after ${maxRetries} retries on route change`
          );
        }
      };

      // Start initialization after route change
      // Use multiple delays to catch different timing scenarios
      setTimeout(() => initOnRouteChange(), 100);
      setTimeout(() => initOnRouteChange(), 300);
      setTimeout(() => initOnRouteChange(), 500);
      setTimeout(() => initOnRouteChange(), 700);
      setTimeout(() => initOnRouteChange(), 900);

      // Also use requestAnimationFrame for next paint
      requestAnimationFrame(() => {
        setTimeout(() => initOnRouteChange(), 50);
      });

      // Additional fallback after longer delay
      setTimeout(() => initOnRouteChange(), 1200);
    };

    // Initialize on mount - use multiple strategies to ensure it runs on initial load
    let timers = [];

    // Strategy 1: Use ref callback (most reliable for initial load)
    // The ref will be set when React renders the element
    const refInitTimer = setTimeout(() => {
      tryInitializeWithRef();
    }, 0);

    // Strategy 2: After DOMContentLoaded (for initial page load)
    if (document.readyState === "loading") {
      const domReadyHandler = () => {
        setTimeout(() => {
          if (!tryInitializeWithRef()) {
            initializeAd(); // Fallback
          }
        }, 50);
      };
      document.addEventListener("DOMContentLoaded", domReadyHandler, {
        once: true,
      });
    } else {
      // DOM already ready
      setTimeout(() => {
        if (!tryInitializeWithRef()) {
          initializeAd(); // Fallback
        }
      }, 100);
    }

    // Strategy 3: After window load (ensures everything is ready)
    if (document.readyState !== "complete") {
      const loadHandler = () => {
        setTimeout(() => {
          if (!tryInitializeWithRef()) {
            initializeAd(); // Fallback
          }
        }, 50);
      };
      window.addEventListener("load", loadHandler, { once: true });
    } else {
      setTimeout(() => {
        if (!tryInitializeWithRef()) {
          initializeAd(); // Fallback
        }
      }, 150);
    }

    // Strategy 4: Fallback with requestAnimationFrame (for next paint)
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (!tryInitializeWithRef()) {
          initializeAd(); // Fallback
        }
      }, 50);
    });

    // Strategy 5: Additional fallback with retry mechanism
    const retryInit = (attempt = 0) => {
      if (attempt < 10) {
        if (!tryInitializeWithRef() && !initializeAd()) {
          setTimeout(() => retryInit(attempt + 1), 100);
        }
      }
    };
    timers.push(setTimeout(() => retryInit(), 200));

    // Listen for route changes
    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      clearTimeout(refInitTimer);
      timers.forEach((timer) => clearTimeout(timer));
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [
    isMounted,
    isDevelopment,
    adUnitId,
    uniqueId,
    router,
    initializeAdScript,
    debug,
  ]);

  // Use callback ref to initialize when element is actually rendered
  // This ensures ads initialize on initial page load, not just on navigation
  // Memoized to prevent unnecessary re-renders
  const adRefCallback = useCallback(
    (element) => {
      adRef.current = element;

      if (debug) {
        console.log(`[BannerAd:${uniqueId}] Ref callback called`, {
          hasElement: !!element,
          isMounted,
          isDevelopment,
        });
      }

      // Initialize immediately when ref is set (for initial load and navigation)
      if (
        element &&
        isMounted &&
        !isDevelopment &&
        typeof window !== "undefined"
      ) {
        // Use requestAnimationFrame to ensure element is fully in DOM
        requestAnimationFrame(() => {
          // Use the shared initialization function
          initializeAdScript(element, "refCallback");
        });
      }
    },
    [isMounted, isDevelopment, initializeAdScript, uniqueId, debug]
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
