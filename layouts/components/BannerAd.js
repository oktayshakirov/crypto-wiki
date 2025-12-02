import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Global coordinator to manage Bitmedia script reloading across all ad instances
const BitmediaCoordinator = {
  currentRoute: null,
  registeredAds: new Set(),
  reloadTimeout: null,
  mainScriptLoading: false,
  mainScriptLoaded: false,

  registerAd(adId, route) {
    // If route changed, reset everything
    if (this.currentRoute !== route) {
      this.currentRoute = route;
      this.registeredAds.clear();
      this.mainScriptLoaded = false;
      this.mainScriptLoading = false;
      if (this.reloadTimeout) {
        clearTimeout(this.reloadTimeout);
        this.reloadTimeout = null;
      }
    }

    this.registeredAds.add(adId);

    // Clear any existing timeout
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
    }

    // Wait a bit to collect all ads on the page, then reload script
    // Increased delay to ensure DOM is fully ready
    this.reloadTimeout = setTimeout(() => {
      this.reloadMainScript();
    }, 300);
  },

  reloadMainScript() {
    if (this.mainScriptLoading) return;

    // Verify all registered ads have their DOM elements ready
    const readyAds = Array.from(this.registeredAds).filter((adId) => {
      const element = document.getElementById(adId);
      return element && element.parentNode;
    });

    // Need at least some ads ready, but wait for all if possible
    if (readyAds.length === 0) {
      // Retry if no ads ready yet
      setTimeout(() => {
        this.reloadMainScript();
      }, 100);
      return;
    }

    // If not all ads are ready but we have some, wait a bit more
    if (readyAds.length < this.registeredAds.size) {
      setTimeout(() => {
        this.reloadMainScript();
      }, 100);
      return;
    }

    // All ads ready, proceed with reload
    this.mainScriptLoading = true;

    // Remove the main Bitmedia script to force reload
    const mainScript = document.querySelector(
      'script[src*="692e0776457ec2706b483e16"]'
    );
    if (mainScript && mainScript.parentNode) {
      mainScript.remove();
      this.mainScriptLoaded = false;
    }

    // Wait for next animation frame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.injectLoaderScript();
      });
    });
  },

  injectLoaderScript() {
    // Verify at least one ad is ready before injecting
    const readyAds = Array.from(this.registeredAds).filter((adId) => {
      const element = document.getElementById(adId);
      return element && element.parentNode;
    });

    if (readyAds.length === 0) {
      // Retry if no ads ready yet
      setTimeout(() => {
        this.injectLoaderScript();
      }, 50);
      return;
    }

    // Remove any existing loader scripts from document
    const existingLoaders = document.querySelectorAll(
      'script[data-bitmedia-loader="true"]'
    );
    existingLoaders.forEach((script) => script.remove());

    // Inject the loader script into document head for reliability
    const script = document.createElement("script");
    script.setAttribute("data-bitmedia-loader", "true");
    script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

    // Insert into head, or body if head not available
    const target = document.head || document.body || document.documentElement;
    if (target) {
      target.appendChild(script);
    }

    // Wait for main script to load, then mark as loaded
    let checkCount = 0;
    const maxChecks = 100; // 5 seconds max (50ms * 100)
    const checkScriptLoaded = setInterval(() => {
      checkCount++;
      const mainScript = document.querySelector(
        'script[src*="692e0776457ec2706b483e16"]'
      );
      if (mainScript) {
        clearInterval(checkScriptLoaded);
        this.mainScriptLoaded = true;
        this.mainScriptLoading = false;
      } else if (checkCount >= maxChecks) {
        clearInterval(checkScriptLoaded);
        this.mainScriptLoading = false;
      }
    }, 50);
  },
};

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
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

  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;
    if (!containerRef.current || !adRef.current) return;

    // Verify the <ins> element is in the DOM
    const verifyElement = () => {
      const element = document.getElementById(uniqueId);
      if (!element || !element.parentNode) {
        // Retry if element not ready
        setTimeout(verifyElement, 50);
        return;
      }

      // Register this ad with the coordinator
      BitmediaCoordinator.registerAd(uniqueId, router.asPath);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      verifyElement();
    }, 150);

    return () => {
      clearTimeout(timer);
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
