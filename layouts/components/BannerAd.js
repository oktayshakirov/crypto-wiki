import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getBitmediaManager } from "@lib/utils/bitmediaManager";

const BannerAd = ({ className = "", style = {}, id }) => {
  const router = useRouter();
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );
  const managerRef = useRef(null);
  const initializationTimeoutRef = useRef(null);
  const observerRef = useRef(null);

  // Determine if we're in development
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

  // Register ad with manager - let manager handle initialization
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;
    if (!containerRef.current || !adRef.current) return;

    const manager = getBitmediaManager();
    if (!manager) return;

    managerRef.current = manager;
    const currentRoute = router.pathname;

    // Register this ad instance
    manager.registerAd(uniqueId, containerRef.current, currentRoute);

    // If manager is already on this route, trigger initialization after a delay
    // This handles the case where the ad registers after the route change handler runs
    if (manager.currentRoute === currentRoute) {
      const initTimer = setTimeout(() => {
        // Only initialize if still on the same route and not already initializing
        if (manager.currentRoute === currentRoute && !manager.isInitializing) {
          manager.initializeAdsForRoute(currentRoute);
        }
      }, 500);

      initializationTimeoutRef.current = initTimer;
    }

    // Cleanup on unmount
    return () => {
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (managerRef.current) {
        managerRef.current.unregisterAd(uniqueId);
      }
    };
  }, [isDevelopment, uniqueId, router.pathname]);

  // Handle route changes - update route registration
  // The manager will handle re-initialization via route change listener in _app.js
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;
    if (!containerRef.current || !managerRef.current) return;

    const currentRoute = router.pathname;
    const instance = managerRef.current.adInstances.get(uniqueId);

    if (instance) {
      // Update route for this ad instance
      // The manager's handleRouteChange will trigger re-initialization
      instance.route = currentRoute;
    }
  }, [router.pathname, uniqueId, isDevelopment]);

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
