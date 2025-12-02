import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

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

  // Load/reload Bitmedia script
  useEffect(() => {
    // Don't run on server or in development
    if (typeof window === "undefined" || isDevelopment) return;

    if (!containerRef.current || !adRef.current) return;

    const loadScriptForThisAd = () => {
      // Reset the ad element to ensure clean reinitialization
      if (adRef.current) {
        adRef.current.innerHTML = "";
        // Reset styles to initial state
        adRef.current.style.display = "inline-block";
        adRef.current.style.width = "1px";
        adRef.current.style.height = "1px";
      }

      // Clean up any existing scripts for this ad
      const existingScripts = containerRef.current.querySelectorAll(
        `script[data-bitmedia-ad="${uniqueId}"]`
      );
      existingScripts.forEach((script) => script.remove());

      // Also clean up any Bitmedia-generated scripts that might be stale
      // We'll reload fresh on route change
      const bitmediaScripts = containerRef.current.querySelectorAll(
        'script[src*="cdn.bmcdn6.com"]'
      );
      bitmediaScripts.forEach((script) => {
        // Only remove if it's a child of our container
        if (containerRef.current.contains(script)) {
          script.remove();
        }
      });

      // Create and inject the script
      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-ad", uniqueId);
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      containerRef.current.appendChild(script);
    };

    // Load script with a delay to ensure cleanup completes and DOM is ready
    const timer = setTimeout(() => {
      loadScriptForThisAd();
    }, 200);

    return () => clearTimeout(timer);
  }, [isDevelopment, uniqueId, router.asPath]); // Re-run on route change

  // Global cleanup of Bitmedia scripts on route changes
  useEffect(() => {
    // Don't run on server or in development
    if (typeof window === "undefined" || isDevelopment) return;

    // Clean up all Bitmedia scripts and state on route change
    const cleanupGlobalScripts = () => {
      // Remove all Bitmedia scripts from document head
      const headScripts = document.head.querySelectorAll(
        'script[src*="cdn.bmcdn6.com"], script[src*="bmcdn6.com"]'
      );
      headScripts.forEach((script) => script.remove());

      // Also remove any Bitmedia source scripts
      const sourceScripts = document.head.querySelectorAll(
        'script[id*="G5hF8MZvNqn"], script[src*="bmcdn6.com/js/source"]'
      );
      sourceScripts.forEach((script) => script.remove());

      // Clear all ad slot content to force fresh initialization
      // Use attribute selector since class name starts with a number (invalid CSS selector)
      const allAdSlots = document.querySelectorAll(
        'ins[class*="692e0776457ec2706b483e16"]'
      );
      allAdSlots.forEach((slot) => {
        slot.innerHTML = "";
        slot.style.display = "inline-block";
        slot.style.width = "1px";
        slot.style.height = "1px";
      });

      // Clear Bitmedia's global state if it exists
      if (window.bm) {
        try {
          if (window.bm.destroy) window.bm.destroy();
          if (window.bm.clear) window.bm.clear();
          // Clear any arrays that might track ad slots
          if (Array.isArray(window.bm.slots)) {
            window.bm.slots = [];
          }
        } catch (e) {
          // Ignore errors
        }
      }

      // Clear any other Bitmedia global variables
      try {
        delete window.bm;
        delete window._bm;
      } catch (e) {
        // Ignore errors
      }
    };

    // Cleanup immediately on route change
    cleanupGlobalScripts();

    return () => {
      // Also cleanup in cleanup function
      cleanupGlobalScripts();
    };
  }, [router.asPath, isDevelopment]);

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
