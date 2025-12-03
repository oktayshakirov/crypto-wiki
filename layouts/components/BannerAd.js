import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const BannerAd = ({ className = "", style = {}, id }) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [routeKey, setRouteKey] = useState(0); // Force re-render on route change
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );

  // Detect development environment
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

  // Listen to route changes and force re-initialization
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleRouteChange = () => {
      // Increment routeKey to force re-initialization
      setRouteKey((prev) => prev + 1);
    };

    // Listen to route change completion (Next.js router events)
    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [router]);

  // Fallback: Watch router pathname changes (for cases where events aren't available)
  const prevPathRef = useRef(router.asPath);
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only trigger if path actually changed
    if (prevPathRef.current !== router.asPath) {
      prevPathRef.current = router.asPath;
      // Trigger re-initialization when pathname changes
      setRouteKey((prev) => prev + 1);
    }
  }, [router.pathname, router.asPath]);

  // Load ad script globally (only once)
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;

    // Check if script is already loaded globally
    const existingGlobalScript = document.querySelector(
      'script[data-bitmedia-global="true"]'
    );
    const scriptLoaded = existingGlobalScript || window.bmcdn6;

    if (!scriptLoaded) {
      // Load script once globally in document head
      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-global", "true");
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;
      document.head.appendChild(script);
    }
  }, [isDevelopment]);

  // Initialize ad element (runs on mount and route changes)
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;
    if (!adRef.current) return;

    const initializeAd = () => {
      // Wait for script to load, then trigger ad detection
      const checkAndInit = () => {
        const scriptLoaded =
          document.querySelector('script[data-bitmedia-global="true"]') ||
          window.bmcdn6;

        if (scriptLoaded && adRef.current) {
          // Force ad script to detect this element by cloning it
          const currentAd = adRef.current;
          const parent = currentAd.parentNode;
          if (parent) {
            // Clone the element to trigger ad script detection
            const clonedAd = currentAd.cloneNode(true);
            parent.replaceChild(clonedAd, currentAd);
            adRef.current = clonedAd;
          }
        } else {
          // Script not loaded yet, retry
          setTimeout(checkAndInit, 200);
        }
      };

      // Start checking after a delay to ensure DOM is ready
      setTimeout(checkAndInit, 500);
    };

    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeAd();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [isDevelopment, uniqueId, routeKey]);

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
