import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Global flag to coordinate main script reload across all ad instances
let mainScriptReloadInProgress = false;
let currentRoute = null;
let retryCounts = new Map(); // Track retry counts per ad to prevent infinite loops

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

    const loadScriptForThisAd = () => {
      if (!containerRef.current || !adRef.current) return;

      // Check if route has changed - if so, we need to reload the main script
      const routeChanged = currentRoute !== router.asPath;

      if (routeChanged) {
        // Reset the flag if route changed
        if (currentRoute !== null) {
          mainScriptReloadInProgress = false;
        }
        currentRoute = router.asPath;
      }

      // Only the first ad on a new route should handle main script reload
      // This prevents race conditions where multiple ads try to reload simultaneously
      if (routeChanged && !mainScriptReloadInProgress) {
        mainScriptReloadInProgress = true;

        const mainScript = document.querySelector(
          'script[src*="692e0776457ec2706b483e16"]'
        );
        if (mainScript && mainScript.parentNode) {
          mainScript.remove();
          // Wait a bit longer for the first ad to ensure DOM is fully ready
          // Then inject this ad's loader script which will trigger the main script reload
          setTimeout(() => {
            injectLoaderScript();
          }, 150);
          return;
        }
      }

      // For subsequent ads on route change, wait a bit longer to ensure
      // the first ad has finished removing the main script
      if (routeChanged && mainScriptReloadInProgress) {
        setTimeout(() => {
          injectLoaderScript();
        }, 150);
        return;
      }

      // For same route or initial load, inject loader immediately
      injectLoaderScript();
    };

    // Use appropriate delay based on whether it's initial load or route change
    const routeChanged = currentRoute !== router.asPath;
    const delay = currentRoute === null ? 150 : routeChanged ? 100 : 100;
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
