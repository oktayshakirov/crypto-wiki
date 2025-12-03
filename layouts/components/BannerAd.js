import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const BannerAd = ({ className = "", style = {}, id }) => {
  const router = useRouter();
  const adRef = useRef(null);
  const [isDevelopment, setIsDevelopment] = useState(false);
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

  // Trigger ad re-initialization on route changes
  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;
    if (!adRef.current) return;

    const triggerAdRefresh = () => {
      // Wait a bit for the page to settle after route change
      setTimeout(() => {
        if (adRef.current) {
          // Clone the element to force ad script to re-detect it
          const currentAd = adRef.current;
          const parent = currentAd?.parentNode;
          if (parent) {
            const clonedAd = currentAd.cloneNode(true);
            parent.replaceChild(clonedAd, currentAd);
            adRef.current = clonedAd;
          }
        }
      }, 300);
    };

    // Listen to route changes
    const handleRouteChange = () => {
      triggerAdRefresh();
    };

    if (router.events) {
      router.events.on("routeChangeComplete", handleRouteChange);
    }

    return () => {
      if (router.events) {
        router.events.off("routeChangeComplete", handleRouteChange);
      }
    };
  }, [router, isDevelopment]);

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
    <div style={{ display: "inline-block", width: "100%", ...style }}>
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
