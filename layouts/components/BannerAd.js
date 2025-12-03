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

          if (allInsTags.length === 0) {
            if (debug) {
              console.log(`[BannerAd] No ads found on this page`);
            }
            return;
          }

          if (debug) {
            console.log(
              `[BannerAd] Found ${allInsTags.length} ad(s), attempting to trigger Bitmedia re-scan`
            );
          }

          // Strategy 1: Try to use Bitmedia's API if it exists
          let apiCalled = false;
          const bitmediaApi =
            window.bitmedia ||
            window.Bitmedia ||
            window[`bitmedia_${adUnitId}`];

          if (bitmediaApi) {
            // Try common API methods
            const methods = ["reload", "reloadAds", "init", "refresh", "scan"];
            for (const method of methods) {
              if (typeof bitmediaApi[method] === "function") {
                try {
                  if (debug) {
                    console.log(
                      `[BannerAd] Calling window.bitmedia.${method}()`
                    );
                  }
                  bitmediaApi[method]();
                  apiCalled = true;
                  break;
                } catch (e) {
                  if (debug) {
                    console.warn(`[BannerAd] Error calling ${method}:`, e);
                  }
                }
              }
            }
          }

          // Strategy 2: If API doesn't exist or didn't work, completely reset Bitmedia
          if (!apiCalled) {
            if (debug) {
              console.log(
                `[BannerAd] No API found, performing complete Bitmedia reset`
              );
            }

            // Find and store all inline scripts with their corresponding <ins> tags
            const inlineScripts = Array.from(
              document.querySelectorAll(`script[data-bitmedia-ad]`)
            );
            const inlineScriptsData = inlineScripts.map((script) => {
              // Find the <ins> tag that this script belongs to (it should be the previous sibling)
              let insTag = script.previousElementSibling;
              while (insTag && insTag.tagName !== "INS") {
                insTag = insTag.previousElementSibling;
              }

              return {
                textContent: script.textContent,
                dataAttr: script.getAttribute("data-bitmedia-ad"),
                insTag: insTag, // Store reference to the <ins> tag
                parent: script.parentNode,
              };
            });

            // Remove ALL Bitmedia scripts (main script + all inline scripts)
            const bitmediaScript = document.querySelector(
              `script[src*="/js/${adUnitId}.js"]`
            );
            if (bitmediaScript) {
              bitmediaScript.remove();
            }

            inlineScripts.forEach((script) => {
              if (script.parentNode) {
                script.remove();
              }
            });

            // Also clear any Bitmedia global state
            if (window.bitmedia) {
              delete window.bitmedia;
            }
            if (window.Bitmedia) {
              delete window.Bitmedia;
            }

            // Wait a moment, then re-execute all inline scripts
            // This will cause a fresh load of Bitmedia
            setTimeout(() => {
              if (debug) {
                console.log(
                  `[BannerAd] Re-executing ${inlineScriptsData.length} inline script(s) to reload Bitmedia`
                );
              }

              inlineScriptsData.forEach((scriptData) => {
                try {
                  if (!scriptData.insTag || !scriptData.parent) {
                    if (debug) {
                      console.warn(
                        `[BannerAd] Skipping script - no <ins> tag or parent found`
                      );
                    }
                    return;
                  }

                  const newScript = document.createElement("script");
                  newScript.textContent = scriptData.textContent;
                  newScript.setAttribute(
                    "data-bitmedia-ad",
                    scriptData.dataAttr
                  );

                  // Insert right after the <ins> tag (as per Bitmedia docs)
                  if (scriptData.insTag.nextSibling) {
                    scriptData.parent.insertBefore(
                      newScript,
                      scriptData.insTag.nextSibling
                    );
                  } else {
                    scriptData.parent.appendChild(newScript);
                  }
                } catch (e) {
                  if (debug) {
                    console.warn(
                      `[BannerAd] Error re-executing inline script:`,
                      e
                    );
                  }
                }
              });

              if (debug) {
                console.log(
                  `[BannerAd] All scripts re-executed, Bitmedia should reload and detect ${allInsTags.length} ad(s)`
                );
              }
            }, 300); // Wait 300ms before re-executing
          }
        } catch (error) {
          if (debug) {
            console.error(`[BannerAd] Error forcing re-scan:`, error);
          }
        }
      }, 1500); // Wait 1.5s for new ads to initialize
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
