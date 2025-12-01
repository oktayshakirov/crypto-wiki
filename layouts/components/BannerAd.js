import { useEffect, useRef, useState } from "react";

let bitmediaScriptLoaded = false;
let bitmediaLoadTimeout = null;

const BannerAd = ({ className = "", style = {}, id }) => {
  const adRef = useRef(null);
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

    if (typeof window === "undefined") return;

    const loadBitmediaScript = () => {
      if (bitmediaScriptLoaded) return;

      const existingScript = document.querySelector(
        'script[src*="692e0776457ec2706b483e16"]'
      );
      if (existingScript) {
        bitmediaScriptLoaded = true;
        return;
      }

      if (bitmediaLoadTimeout) {
        clearTimeout(bitmediaLoadTimeout);
      }

      bitmediaLoadTimeout = setTimeout(() => {
        !(function (e, n, c, t, o, r, d) {
          !(function e(n, c, t, o, r, m, d, s, a) {
            s = c.getElementsByTagName(t)[0];
            a = c.createElement(t);
            a.async = !0;
            a.src = "https://" + r[m] + "/js/" + o + ".js?v=" + d;
            a.onload = function () {
              bitmediaScriptLoaded = true;
            };
            a.onerror = function () {
              a.remove();
              m + 1 >= r.length || e(n, c, t, o, r, m);
            };
            s.parentNode.insertBefore(a, s);
          })(
            window,
            document,
            "script",
            "692e0776457ec2706b483e16",
            ["cdn.bmcdn6.com"],
            0,
            new Date().getTime()
          );
        })();
      }, 1500);
    };

    loadBitmediaScript();

    return () => {
      if (bitmediaLoadTimeout) {
        clearTimeout(bitmediaLoadTimeout);
      }
    };
  }, [isDevelopment]);

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
    <ins
      ref={adRef}
      className={`692e0776457ec2706b483e16 ${className}`}
      style={{ display: "inline-block", width: "1px", height: "1px", ...style }}
      id={uniqueId}
    />
  );
};

export default BannerAd;
