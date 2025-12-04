import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { registerAdInstance } from "./BitmediaAdManager";

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );
  const [isMounted, setIsMounted] = useState(false);
  const [routeKey, setRouteKey] = useState(router.asPath);

  useEffect(() => {
    setIsMounted(true);
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
    setRouteKey(router.asPath);
  }, [router.asPath]);

  const loadBitmediaScript = useCallback(() => {
    if (!containerRef.current || !adRef.current) return;

    const existingScript = containerRef.current.querySelector(
      `script[data-bitmedia-ad="${uniqueId}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    try {
      if (containerRef.current && adRef.current) {
        const script = document.createElement("script");
        script.setAttribute("data-bitmedia-ad", uniqueId);
        script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

        containerRef.current.appendChild(script);

        if (process.env.NODE_ENV === "development") {
          script.onload = () => {
            const bitmediaGlobals = {
              bmblocks: window.bmblocks,
              bm: window.bm,
            };
            console.log("Bitmedia window objects:", bitmediaGlobals);
          };
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error loading Bitmedia ad:", err);
      }
    }
  }, [uniqueId]);

  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment || !isMounted) return;

    if (!containerRef.current || !adRef.current) return;

    const refreshAd = () => {
      if (!containerRef.current || !adRef.current) return;

      const existingScript = containerRef.current.querySelector(
        `script[data-bitmedia-ad="${uniqueId}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }

      setTimeout(() => {
        loadBitmediaScript();
      }, 100);
    };

    loadBitmediaScript();

    const unregister = registerAdInstance(uniqueId, refreshAd);

    return () => {
      unregister();
    };
  }, [isDevelopment, uniqueId, isMounted, loadBitmediaScript, routeKey]);

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
