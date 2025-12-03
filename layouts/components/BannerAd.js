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
          tagName: adElement.tagName,
        });
      }

      // Verify this is the right element
      // If element was passed directly (e.g., from ref callback), trust it more
      // React might not have set the ID yet when ref callback fires
      const wasPassedDirectly = element !== null;
      const hasCorrectId = adElement.id === uniqueId;
      const hasCorrectClass = adElement.classList.contains(adUnitId);
      const isInsTag = adElement.tagName === "INS";

      // Validation logic:
      // - If element was passed directly AND has the correct class, trust it (ID might not be set yet)
      // - If element was found by ID, it must have the correct ID
      // - In all cases, it must have the correct class and be an INS tag
      const isValidElement =
        isInsTag && hasCorrectClass && (wasPassedDirectly || hasCorrectId);

      if (!isValidElement) {
        if (debug) {
          console.warn(
            `[BannerAd:${uniqueId}] Wrong element - validation failed`,
            {
              expectedId: uniqueId,
              actualId: adElement.id,
              hasClass: hasCorrectClass,
              isInsTag,
              wasPassedDirectly,
              hasCorrectId,
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
      // Use a cache-busting timestamp to ensure the script re-runs on navigation
      // This is important because Bitmedia needs to re-scan for new <ins> tags after navigation
      const cacheBuster = new Date().getTime();
      const inlineScript = document.createElement("script");
      inlineScript.setAttribute("data-bitmedia-ad", uniqueId);
      inlineScript.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","${adUnitId}",["cdn.bmcdn6.com"], 0, ${cacheBuster})}();`;

      // Insert script right after the <ins> tag (as per Bitmedia docs)
      if (adElement.parentNode) {
        adElement.parentNode.insertBefore(inlineScript, adElement.nextSibling);
        if (debug) {
          console.log(`[BannerAd:${uniqueId}] Script inserted successfully`);
        }

        // After inserting script, if this is during navigation, try to trigger Bitmedia re-scan
        // Wait a bit for the script to load, then try to trigger refresh
        if (source.includes("routeChange") || source.includes("refCallback")) {
          setTimeout(() => {
            // Try to find and trigger Bitmedia refresh if it exposes an API
            // Bitmedia might store its instance in window or have a global function
            if (typeof window !== "undefined") {
              // Look for common Bitmedia global objects
              const bitmediaGlobals = [
                window.bitmedia,
                window.Bitmedia,
                window[`bitmedia_${adUnitId}`],
                window[`Bitmedia_${adUnitId}`],
              ];

              for (const bitmedia of bitmediaGlobals) {
                if (bitmedia && typeof bitmedia.refresh === "function") {
                  if (debug) {
                    console.log(
                      `[BannerAd:${uniqueId}] Triggering Bitmedia refresh`
                    );
                  }
                  try {
                    bitmedia.refresh();
                  } catch (e) {
                    if (debug) {
                      console.warn(
                        `[BannerAd:${uniqueId}] Failed to trigger refresh:`,
                        e
                      );
                    }
                  }
                  break;
                }
              }

              // Also try dispatching a custom event that might trigger re-scan
              if (document.body) {
                const event = new CustomEvent("bitmedia:refresh", {
                  detail: { adUnitId },
                });
                document.body.dispatchEvent(event);
              }
            }
          }, 500);
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

      // Force Bitmedia to re-scan by ensuring the script re-executes
      // Use a global flag to only do this once per route change
      const globalRescanKey = `__bitmedia_rescan_${adUnitId}`;
      const forceBitmediaRescan = () => {
        // Only rescan once per route change to avoid multiple re-scans
        if (window[globalRescanKey]) {
          return;
        }
        window[globalRescanKey] = true;

        // Reset the flag after a delay
        setTimeout(() => {
          window[globalRescanKey] = false;
        }, 2000);

        // Find all Bitmedia script tags for this adUnitId
        const bitmediaScripts = document.querySelectorAll(
          `script[src*="/js/${adUnitId}.js"]`
        );

        if (bitmediaScripts.length > 0) {
          if (debug) {
            console.log(
              `[BannerAd:${uniqueId}] Found ${bitmediaScripts.length} Bitmedia script(s), forcing re-scan`
            );
          }

          // Remove old Bitmedia script tags to force re-load
          // This will cause Bitmedia to re-scan all <ins> tags
          bitmediaScripts.forEach((script) => {
            const src = script.src;
            const parent = script.parentNode;
            if (parent && src) {
              script.remove();

              // Re-add the script with a new cache-busting parameter
              // This forces the browser to re-execute the script, which will re-scan for <ins> tags
              const newScript = document.createElement("script");
              newScript.async = true;
              // Extract base URL and add new cache buster
              const baseUrl = src.split("?")[0];
              newScript.src = `${baseUrl}?v=${new Date().getTime()}&rescan=1`;

              // Insert at the end of body to ensure it loads
              if (document.body) {
                document.body.appendChild(newScript);
              } else {
                // Fallback: insert in head
                document.head.appendChild(newScript);
              }

              if (debug) {
                console.log(
                  `[BannerAd:${uniqueId}] Re-added Bitmedia script to force re-scan`
                );
              }
            }
          });
        } else if (debug) {
          console.log(
            `[BannerAd:${uniqueId}] No existing Bitmedia scripts found, will load fresh`
          );
        }
      };

      // Initialize ads on new page after route change
      // Only initialize if this component is still mounted and on the current page
      const initOnRouteChange = (retryCount = 0) => {
        const maxRetries = 15; // Reduced retries - if element doesn't exist after this, component is likely unmounted

        if (debug && retryCount > 0 && retryCount < 5) {
          console.log(
            `[BannerAd:${uniqueId}] Route change retry ${retryCount}/${maxRetries}`
          );
        }

        // Try to find the element by ID (this component's specific ad)
        const adElement = document.getElementById(uniqueId);

        if (adElement) {
          // Verify this is actually our element and it's on the current page
          // Check that it has the correct class and is an INS tag
          const hasCorrectClass = adElement.classList.contains(adUnitId);
          const isInsTag = adElement.tagName === "INS";
          const hasCorrectId = adElement.id === uniqueId;
          const isInDocument = document.body.contains(adElement);

          if (debug && retryCount === 0) {
            console.log(
              `[BannerAd:${uniqueId}] Element found on route change:`,
              {
                id: adElement.id,
                className: adElement.className,
                hasCorrectClass,
                isInsTag,
                hasCorrectId,
                isInDocument,
                hasParent: !!adElement.parentNode,
              }
            );
          }

          // If element doesn't match our criteria, it might be from a previous page
          if (!isInDocument || !isInsTag || !hasCorrectClass || !hasCorrectId) {
            if (debug && retryCount < 3) {
              console.log(
                `[BannerAd:${uniqueId}] Element validation failed, might be from previous page`
              );
            }
            // Don't retry if validation fails - this is likely an old element
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
          // Element not found - might not be on this page (component unmounted)
          // Only log first few retries to avoid spam
          if (debug && retryCount < 3) {
            console.log(
              `[BannerAd:${uniqueId}] Element not found on route change (component may be unmounted)`
            );
          }
        }

        // Element not found yet, retry (but only if we haven't exceeded max retries)
        if (retryCount < maxRetries) {
          setTimeout(() => initOnRouteChange(retryCount + 1), 100);
        } else if (debug && retryCount === maxRetries) {
          // Only log once when max retries reached
          console.log(
            `[BannerAd:${uniqueId}] Element not found after ${maxRetries} retries (likely not on this page)`
          );
        }
      };

      // Force Bitmedia to re-scan first (before initializing new ads)
      // This ensures Bitmedia is ready to detect new <ins> tags
      setTimeout(() => {
        forceBitmediaRescan();
      }, 50);

      // Start initialization after route change
      // Use multiple delays to catch different timing scenarios
      setTimeout(() => initOnRouteChange(), 100);
      setTimeout(() => initOnRouteChange(), 300);
      setTimeout(() => initOnRouteChange(), 500);

      // Also use requestAnimationFrame for next paint
      requestAnimationFrame(() => {
        setTimeout(() => {
          forceBitmediaRescan();
          initOnRouteChange();
        }, 50);
      });

      // Additional fallback after longer delay
      setTimeout(() => {
        forceBitmediaRescan();
        initOnRouteChange();
      }, 800);
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
          elementId: element?.id,
          elementClass: element?.className,
        });
      }

      // Initialize when ref is set (for initial load and navigation)
      if (
        element &&
        isMounted &&
        !isDevelopment &&
        typeof window !== "undefined"
      ) {
        // Use multiple strategies to ensure element is fully ready
        // Strategy 1: Immediate with requestAnimationFrame (for when element is ready)
        requestAnimationFrame(() => {
          // Check if element has the class (more reliable than ID which might not be set yet)
          if (element.classList.contains(adUnitId)) {
            initializeAdScript(element, "refCallback-raf");
          } else {
            // Class not set yet, wait a bit
            setTimeout(() => {
              initializeAdScript(element, "refCallback-delayed");
            }, 10);
          }
        });

        // Strategy 2: Small delay to ensure React has set all attributes
        setTimeout(() => {
          // Only initialize if script doesn't already exist
          const existingScript =
            element.nextElementSibling?.getAttribute("data-bitmedia-ad");
          if (existingScript !== uniqueId) {
            initializeAdScript(element, "refCallback-timeout");
          }
        }, 50);
      }
    },
    [isMounted, isDevelopment, initializeAdScript, uniqueId, adUnitId, debug]
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
