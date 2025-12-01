import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

let routeChangeHandlerRegistered = false;
let mutationObserver = null;

const BannerAd = ({ className = "", style = {}, id }) => {
  const containerRef = useRef(null);
  const adRef = useRef(null);
  const router = useRouter();
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [uniqueId] = useState(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`
  );
  const scriptLoadedRef = useRef(false);

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

    const initAdElement = (adElement) => {
      const container = adElement.parentElement;
      if (container) {
        const existingScript = container.querySelector(
          `script[data-bitmedia-ad="${adElement.id}"]`
        );
        if (existingScript) {
          existingScript.remove();
        }
        const script = document.createElement("script");
        script.setAttribute("data-bitmedia-ad", adElement.id);
        script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;
        container.appendChild(script);
      }
    };

    const initAllAds = () => {
      const allAdElements = document.querySelectorAll(
        "ins.692e0776457ec2706b483e16"
      );
      allAdElements.forEach((adElement) => {
        initAdElement(adElement);
      });
    };

    if (!routeChangeHandlerRegistered && router.events) {
      routeChangeHandlerRegistered = true;

      const handleRouteChange = () => {
        setTimeout(initAllAds, 300);
        setTimeout(initAllAds, 1000);
        setTimeout(initAllAds, 2000);
      };

      router.events.on("routeChangeComplete", handleRouteChange);
    }

    if (!mutationObserver && typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver((mutations) => {
        let shouldInit = false;
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === 1 &&
              (node.classList?.contains("692e0776457ec2706b483e16") ||
                node.querySelector?.("ins.692e0776457ec2706b483e16"))
            ) {
              shouldInit = true;
            }
          });
        });
        if (shouldInit) {
          setTimeout(initAllAds, 200);
        }
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }, [router, isDevelopment]);

  useEffect(() => {
    if (typeof window === "undefined" || isDevelopment) return;

    if (!containerRef.current || !adRef.current) return;

    const loadScriptForThisAd = () => {
      const existingScript = containerRef.current.querySelector(
        `script[data-bitmedia-ad="${uniqueId}"]`
      );
      if (existingScript) {
        existingScript.remove();
      }

      scriptLoadedRef.current = false;

      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-ad", uniqueId);
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      script.onload = () => {
        scriptLoadedRef.current = true;
      };

      containerRef.current.appendChild(script);
    };

    const timer1 = setTimeout(() => {
      loadScriptForThisAd();
    }, 100);

    const timer2 = setTimeout(() => {
      if (!scriptLoadedRef.current) {
        loadScriptForThisAd();
      }
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      scriptLoadedRef.current = false;
    };
  }, [isDevelopment, uniqueId, router.pathname]);

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
