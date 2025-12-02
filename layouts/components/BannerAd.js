import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Simple global coordinator for route-based script reloading
const AdCoordinator = {
  route: null,
  ads: new Set(),
  timeout: null,

  reset(route) {
    if (this.route !== route) {
      this.route = route;
      this.ads.clear();
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    }
  },

  register(adId, route, container, callback) {
    this.reset(route);
    this.ads.add({ id: adId, container, callback });

    if (this.timeout) clearTimeout(this.timeout);

    // Wait to collect all ads, then trigger
    this.timeout = setTimeout(() => {
      this.triggerReload();
    }, 250);
  },

  triggerReload() {
    // Check all ads are in DOM
    const ready = Array.from(this.ads).every(({ id }) => {
      return document.getElementById(id)?.parentNode;
    });

    if (!ready) {
      this.timeout = setTimeout(() => this.triggerReload(), 100);
      return;
    }

    // Remove main script
    const mainScript = document.querySelector(
      'script[src*="692e0776457ec2706b483e16"]'
    );
    if (mainScript?.parentNode) {
      mainScript.remove();
    }

    // Wait a frame, then inject all loader scripts
    // Each ad needs its own loader to ensure it's detected
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const adArray = Array.from(this.ads);
        // Remove any existing loaders first
        document
          .querySelectorAll("script[data-bitmedia-ad]")
          .forEach((s) => s.remove());

        // Inject all loaders - stagger slightly to ensure proper initialization
        adArray.forEach((ad, index) => {
          if (ad.container && typeof ad.callback === "function") {
            setTimeout(() => {
              ad.callback();
            }, index * 30); // Small stagger to ensure each ad is processed
          }
        });
      });
    });
  },
};

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const scriptRef = useRef(null);
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const uniqueId = useRef(
    id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsDevelopment(
        hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname.includes("localhost") ||
          hostname.includes("127.0.0.1") ||
          hostname === ""
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;

    const injectLoader = () => {
      if (!containerRef.current) return;

      // Remove existing loader for this ad
      if (scriptRef.current?.parentNode) {
        scriptRef.current.remove();
      }

      const existing = containerRef.current.querySelector(
        `script[data-bitmedia-ad="${uniqueId}"]`
      );
      if (existing) existing.remove();

      // Create and inject loader script
      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-ad", uniqueId);
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      containerRef.current.appendChild(script);
      scriptRef.current = script;
    };

    const init = () => {
      const element = document.getElementById(uniqueId);
      if (!element?.parentNode || !containerRef.current) {
        setTimeout(init, 50);
        return;
      }

      // Register with coordinator - it will inject loader when all ads are ready
      AdCoordinator.register(
        uniqueId,
        router.asPath,
        containerRef.current,
        injectLoader
      );
    };

    const timer = setTimeout(init, 100);

    return () => {
      clearTimeout(timer);
      if (scriptRef.current?.parentNode) {
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
