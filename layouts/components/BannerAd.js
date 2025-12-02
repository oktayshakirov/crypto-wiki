import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const router = useRouter();
  const [routeKey, setRouteKey] = useState(0);
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

  // Listen for route changes and update routeKey to force re-initialization
  useEffect(() => {
    const handleRouteChange = () => {
      setRouteKey((prev) => prev + 1);
    };

    router.events?.on("routeChangeComplete", handleRouteChange);
    router.events?.on("routeChangeError", handleRouteChange);

    return () => {
      router.events?.off("routeChangeComplete", handleRouteChange);
      router.events?.off("routeChangeError", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;
    if (!containerRef.current) return;

    // Copy ref value for use in cleanup function
    const container = containerRef.current;

    const loadScriptForThisAd = () => {
      if (!container) return;

      // Remove ALL existing scripts from this container
      const existingScripts = container.querySelectorAll(
        `script[data-bitmedia-ad]`
      );
      existingScripts.forEach((script) => script.remove());

      // Completely remove the old ins element if it exists
      // This is crucial - the Bitmedia library won't reprocess an element it's already seen
      const oldAdElement = container.querySelector(
        "ins.692e0776457ec2706b483e16"
      );
      if (oldAdElement) {
        oldAdElement.remove();
      }

      // Create a completely fresh ins element
      const adElement = document.createElement("ins");
      adElement.className = `692e0776457ec2706b483e16 ${className}`;
      adElement.style.cssText =
        "display: inline-block; width: 1px; height: 1px;";
      adElement.id = `${uniqueId}-${routeKey}`;
      container.appendChild(adElement);
      adRef.current = adElement;

      // Create a fresh script with a unique timestamp to force execution
      const script = document.createElement("script");
      const scriptId = `${uniqueId}-${Date.now()}-${routeKey}`;
      script.setAttribute("data-bitmedia-ad", scriptId);
      // Add timestamp to force script re-execution
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      container.appendChild(script);
    };

    // Wait a bit longer to ensure DOM is fully ready after route change
    const timer = setTimeout(() => {
      loadScriptForThisAd();
    }, 300);

    return () => {
      clearTimeout(timer);
      // Clean up scripts and ins element on unmount or route change
      if (container) {
        const existingScripts = container.querySelectorAll(
          `script[data-bitmedia-ad]`
        );
        existingScripts.forEach((script) => script.remove());

        const existingIns = container.querySelector(
          "ins.692e0776457ec2706b483e16"
        );
        if (existingIns) {
          existingIns.remove();
        }
      }
    };
  }, [isDevelopment, uniqueId, routeKey, className, router.asPath]);

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
      {/* ins element will be created dynamically in useEffect */}
    </div>
  );
};

export default BannerAd;
