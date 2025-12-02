import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

// Global manager for Bitmedia ads across route changes
const BitmediaAdManager = {
  currentRoute: null,
  registeredAds: new Map(), // Map of adId -> { container, element }
  collectionTimeout: null,
  isReloading: false,
  mainScriptCheckInterval: null,

  // Reset state on route change
  reset(route) {
    if (this.currentRoute !== route) {
      this.currentRoute = route;
      this.registeredAds.clear();
      this.isReloading = false;
      if (this.collectionTimeout) {
        clearTimeout(this.collectionTimeout);
        this.collectionTimeout = null;
      }
      if (this.mainScriptCheckInterval) {
        clearInterval(this.mainScriptCheckInterval);
        this.mainScriptCheckInterval = null;
      }
    }
  },

  // Register an ad slot
  register(adId, route, container, element) {
    this.reset(route);
    this.registeredAds.set(adId, { container, element });

    // Clear existing timeout
    if (this.collectionTimeout) {
      clearTimeout(this.collectionTimeout);
    }

    // Wait to collect all ads, then reload
    this.collectionTimeout = setTimeout(() => {
      this.reloadAds();
    }, 300);
  },

  // Verify all ads are in DOM
  verifyAdsReady() {
    return Array.from(this.registeredAds.entries()).every(
      ([adId, { element }]) => {
        const domElement = document.getElementById(adId);
        return domElement && domElement.parentNode && domElement.isConnected;
      }
    );
  },

  // Wait for main script to load
  waitForMainScript(callback, maxWait = 5000) {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const mainScript = document.querySelector(
        'script[src*="692e0776457ec2706b483e16"]'
      );
      if (mainScript) {
        clearInterval(checkInterval);
        // Give it a moment to initialize
        setTimeout(callback, 200);
      } else if (Date.now() - startTime > maxWait) {
        clearInterval(checkInterval);
        callback(); // Proceed anyway
      }
    }, 100);
  },

  // Reload ads on route change
  reloadAds() {
    if (this.isReloading) return;

    // Verify all ads are ready
    if (!this.verifyAdsReady()) {
      this.collectionTimeout = setTimeout(() => this.reloadAds(), 100);
      return;
    }

    if (this.registeredAds.size === 0) return;

    this.isReloading = true;

    // Remove main Bitmedia script
    const mainScript = document.querySelector(
      'script[src*="692e0776457ec2706b483e16"]'
    );
    if (mainScript?.parentNode) {
      mainScript.remove();
    }

    // Remove all existing loader scripts
    document.querySelectorAll("script[data-bitmedia-ad]").forEach((script) => {
      script.remove();
    });

    // Wait for DOM to settle, then inject loaders
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Double-check ads are still in DOM
        if (!this.verifyAdsReady()) {
          this.isReloading = false;
          this.collectionTimeout = setTimeout(() => this.reloadAds(), 150);
          return;
        }

        // Inject ONE loader script - the main Bitmedia script will scan for all ads
        const firstAd = Array.from(this.registeredAds.values())[0];
        if (firstAd?.container && firstAd.container.parentNode) {
          // Remove any existing loader scripts
          const existingLoaders = document.querySelectorAll(
            "script[data-bitmedia-loader]"
          );
          existingLoaders.forEach((script) => script.remove());

          // Create and inject single loader script
          const script = document.createElement("script");
          script.setAttribute("data-bitmedia-loader", "true");
          script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

          // Inject into document head for reliability
          const target =
            document.head || document.body || document.documentElement;
          if (target) {
            target.appendChild(script);
          }
        }

        // Wait for main script to load, then verify ads are rendering
        this.waitForMainScript(() => {
          this.isReloading = false;
          // Give ads time to render
          setTimeout(() => {
            this.verifyAdsRendering();
          }, 1000);
        });
      });
    });
  },

  // Verify ads are actually rendering (check if they have content)
  verifyAdsRendering() {
    const adEntries = Array.from(this.registeredAds.entries());
    const notRendering = adEntries.filter(([adId]) => {
      const element = document.getElementById(adId);
      if (!element) return true;
      // Check if ad has been populated (has more than just the initial 1px height)
      const computedStyle = window.getComputedStyle(element);
      const height = parseInt(computedStyle.height);
      return height <= 1;
    });

    // If some ads aren't rendering, try one more reload
    if (notRendering.length > 0 && notRendering.length < adEntries.length) {
      setTimeout(() => {
        if (!this.isReloading) {
          this.reloadAds();
        }
      }, 2000);
    }
  },
};

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const uniqueId = useRef(
    id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  // Detect development mode
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

  // Handle route changes and ad initialization
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;

    const initializeAd = () => {
      const element = document.getElementById(uniqueId);
      if (!element?.parentNode || !containerRef.current) {
        setTimeout(initializeAd, 50);
        return;
      }

      // Register with manager (uses current route from router)
      BitmediaAdManager.register(
        uniqueId,
        router.asPath,
        containerRef.current,
        element
      );
    };

    // Listen for route change completion
    const handleRouteChangeComplete = () => {
      // Small delay to ensure new page content is fully rendered
      setTimeout(() => {
        initializeAd();
      }, 200);
    };

    // Initial registration on mount
    const timer = setTimeout(initializeAd, 150);

    // Listen to router events for route changes
    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChangeComplete);
    }

    return () => {
      clearTimeout(timer);
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDevelopment, uniqueId]); // router handled via events

  // Development placeholder
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

  // Production ad slot
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
