import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Global cleanup state - tracks the last route that was cleaned up
let lastCleanedRoute = null;
let cleanupTimestamp = 0;
let cleanupInProgress = false;

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );

  // Check if we're in development mode
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

  // Global cleanup - runs once per route change, before any ads load
  useEffect(() => {
    // Don't run on server or in development
    if (typeof window === "undefined" || isDevelopment) return;

    // Only cleanup if this is a new route
    if (lastCleanedRoute === router.asPath && !cleanupInProgress) return;

    // Mark cleanup as in progress
    cleanupInProgress = true;
    lastCleanedRoute = router.asPath;
    cleanupTimestamp = Date.now();

    // Comprehensive cleanup function
    const performGlobalCleanup = () => {
      // Remove all Bitmedia scripts from document head and body
      const allScripts = document.querySelectorAll(
        'script[src*="cdn.bmcdn6.com"], script[src*="bmcdn6.com"], script[id*="G5hF8MZvNqn"]'
      );
      allScripts.forEach((script) => script.remove());

      // Remove any Bitmedia iframes
      const iframes = document.querySelectorAll('iframe[src*="bmcdn6.com"]');
      iframes.forEach((iframe) => iframe.remove());

      // Clear all ad slot content - this is critical
      const allAdSlots = document.querySelectorAll(
        'ins[class*="692e0776457ec2706b483e16"]'
      );
      allAdSlots.forEach((slot) => {
        slot.innerHTML = "";
        slot.style.display = "inline-block";
        slot.style.width = "1px";
        slot.style.height = "1px";
        // Remove any data attributes Bitmedia might have added
        Array.from(slot.attributes).forEach((attr) => {
          if (
            attr.name.startsWith("data-") &&
            attr.name !== "data-bitmedia-ad"
          ) {
            slot.removeAttribute(attr.name);
          }
        });
      });

      // Aggressively clear Bitmedia's global state
      try {
        if (window.bm) {
          if (typeof window.bm.destroy === "function") {
            window.bm.destroy();
          }
          if (typeof window.bm.clear === "function") {
            window.bm.clear();
          }
          if (typeof window.bm.reset === "function") {
            window.bm.reset();
          }
          // Clear any tracking arrays or objects
          if (Array.isArray(window.bm.slots)) {
            window.bm.slots.length = 0;
          }
          if (window.bm.slots && typeof window.bm.slots === "object") {
            Object.keys(window.bm.slots).forEach((key) => {
              delete window.bm.slots[key];
            });
          }
        }
      } catch (e) {
        // Ignore errors
      }

      // Delete global Bitmedia variables
      try {
        delete window.bm;
        delete window._bm;
        delete window.bitmedia;
        delete window.Bitmedia;
      } catch (e) {
        // Ignore errors
      }

      // Mark cleanup as complete after a short delay to ensure everything is cleared
      setTimeout(() => {
        cleanupInProgress = false;
      }, 100);
    };

    // Perform cleanup immediately
    performGlobalCleanup();
  }, [router.asPath, isDevelopment]);

  // Load/reload Bitmedia script for this specific ad
  useEffect(() => {
    // Don't run on server or in development
    if (typeof window === "undefined" || isDevelopment) return;

    if (!containerRef.current || !adRef.current) return;

    // Wait for cleanup to complete and DOM to be ready
    const loadAdScript = () => {
      // Wait for cleanup to complete
      if (cleanupInProgress) {
        setTimeout(loadAdScript, 50);
        return;
      }

      // Ensure cleanup has happened for this route
      const timeSinceCleanup = Date.now() - cleanupTimestamp;
      const minWaitTime = 200; // Minimum wait after cleanup completes

      if (timeSinceCleanup < minWaitTime) {
        setTimeout(loadAdScript, minWaitTime - timeSinceCleanup);
        return;
      }

      // Reset the ad element
      if (adRef.current) {
        adRef.current.innerHTML = "";
        adRef.current.style.display = "inline-block";
        adRef.current.style.width = "1px";
        adRef.current.style.height = "1px";
      }

      // Clean up any existing scripts for this specific ad
      const existingScripts = containerRef.current.querySelectorAll(
        `script[data-bitmedia-ad="${uniqueId}"]`
      );
      existingScripts.forEach((script) => script.remove());

      // Create and inject the script with a fresh timestamp to avoid caching
      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-ad", uniqueId);
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      containerRef.current.appendChild(script);
    };

    // Start loading after ensuring DOM is ready
    const timer = setTimeout(() => {
      loadAdScript();
    }, 250);

    return () => {
      clearTimeout(timer);
      // Clean up this ad's scripts on unmount
      const container = containerRef.current;
      if (container) {
        const scripts = container.querySelectorAll(
          `script[data-bitmedia-ad="${uniqueId}"]`
        );
        scripts.forEach((script) => script.remove());
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
      key={`banner-ad-container-${router.asPath}-${uniqueId}`}
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
