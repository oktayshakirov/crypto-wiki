import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Global flag to coordinate main script reload across all ad instances
let mainScriptReloadInProgress = false;
let currentRoute = null;
let retryCounts = new Map(); // Track retry counts per ad to prevent infinite loops
let registeredAds = new Set(); // Track all ad IDs that have registered for the current route
let routeChangeTimeout = null; // Timeout to batch ad registrations

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const scriptRef = useRef(null);
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );

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
    }
  }, []);

  // Load script on mount and route changes
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;

    const injectLoaderScript = () => {
      if (!containerRef.current || !adRef.current) return;

      // Verify the <ins> element is actually in the DOM
      const insElement = document.getElementById(uniqueId);
      if (!insElement || !insElement.parentNode) {
        // Retry if element isn't ready yet (max 5 retries = 250ms total)
        const retries = retryCounts.get(uniqueId) || 0;
        if (retries < 5) {
          retryCounts.set(uniqueId, retries + 1);
          setTimeout(() => {
            injectLoaderScript();
          }, 50);
          return;
        }
        // If element still not found after retries, proceed anyway
        retryCounts.delete(uniqueId);
      } else {
        // Reset retry count on success
        retryCounts.delete(uniqueId);
      }

      // Remove existing script for this ad if it exists
      const existingScript = containerRef.current.querySelector(
        `script[data-bitmedia-ad="${uniqueId}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-ad", uniqueId);
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      containerRef.current.appendChild(script);
      scriptRef.current = script;
    };

    const reloadMainScript = () => {
      // Verify all registered ads have their <ins> elements in the DOM
      const allReady = Array.from(registeredAds).every((adId) => {
        const element = document.getElementById(adId);
        return element && element.parentNode;
      });

      if (!allReady) {
        // If not all ready, wait a bit more and retry
        setTimeout(() => {
          reloadMainScript();
        }, 100);
        return;
      }

      // Remove the main Bitmedia script to force reload
      const mainScript = document.querySelector(
        'script[src*="692e0776457ec2706b483e16"]'
      );
      if (mainScript && mainScript.parentNode) {
        mainScript.remove();
      }

      // Set a flag that main script has been removed, so all ads can inject their loaders
      // Each ad will inject its own loader script, and the first one will load the main script
      window.__bitmediaMainScriptRemoved = true;

      // Clear the flag after a delay to allow all ads to inject their loaders
      setTimeout(() => {
        window.__bitmediaMainScriptRemoved = false;
      }, 500);
    };

    const loadScriptForThisAd = () => {
      if (!containerRef.current || !adRef.current) return;

      // Verify the <ins> element is in the DOM
      const insElement = document.getElementById(uniqueId);
      if (!insElement || !insElement.parentNode) {
        // Retry if element isn't ready yet
        const retries = retryCounts.get(uniqueId) || 0;
        if (retries < 10) {
          retryCounts.set(uniqueId, retries + 1);
          setTimeout(() => {
            loadScriptForThisAd();
          }, 50);
          return;
        }
        retryCounts.delete(uniqueId);
      } else {
        retryCounts.delete(uniqueId);
      }

      // Check if route has changed
      const routeChanged = currentRoute !== router.asPath;

      if (routeChanged) {
        // Clear previous route's ads and reset flags
        if (currentRoute !== null) {
          registeredAds.clear();
          mainScriptReloadInProgress = false;
          if (routeChangeTimeout) {
            clearTimeout(routeChangeTimeout);
          }
        }
        currentRoute = router.asPath;
      }

      // Register this ad for the current route
      registeredAds.add(uniqueId);

      // On route change, wait for all ads to register before reloading main script
      if (routeChanged) {
        // Clear any existing timeout
        if (routeChangeTimeout) {
          clearTimeout(routeChangeTimeout);
        }

        // Wait a bit to collect all ads, then reload main script and inject loaders
        routeChangeTimeout = setTimeout(() => {
          if (!mainScriptReloadInProgress) {
            mainScriptReloadInProgress = true;
            reloadMainScript();

            // After removing main script, inject loader for all registered ads
            // Use a small delay to ensure main script is removed
            setTimeout(() => {
              // Inject this ad's loader script
              injectLoaderScript();
            }, 100);
          } else {
            // Another ad already triggered the reload, just inject this ad's loader
            setTimeout(() => {
              injectLoaderScript();
            }, 150);
          }
        }, 300); // Wait 300ms for all ads to mount and be ready
        return;
      }

      // For initial load or same route, inject loader immediately
      injectLoaderScript();
    };

    // Use appropriate delay based on whether it's initial load or route change
    const routeChanged = currentRoute !== router.asPath;
    const delay = currentRoute === null ? 150 : 50; // Shorter delay on route change since we batch
    const timer = setTimeout(() => {
      loadScriptForThisAd();
    }, delay);

    return () => {
      clearTimeout(timer);
      // Cleanup script on unmount
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.remove();
      }
    };
  }, [isDevelopment, uniqueId, router.asPath]);

  if (isDevelopment) {
    return (
      <div
        className={`banner-ad-placeholder ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90px",
          width: "100%",
          backgroundColor: "#1f2937",
          border: "2px dashed #4b5563",
          borderRadius: "4px",
          color: "#ffffff",
          fontSize: "14px",
          textAlign: "center",
          padding: "20px",
          margin: "20px 0",
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
            Ad Placeholder
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7, color: "#d1d5db" }}>
            Bitmedia ads only display in production
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ display: "inline-block", width: "100%", ...style }}
    >
      <ins
        ref={adRef}
        className={`692e0776457ec2706b483e16 ${className}`}
        style={{ display: "inline-block", width: "1px", height: "1px" }}
        id={uniqueId}
      />
    </div>
  );
};

export default BannerAd;
