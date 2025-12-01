import { useEffect, useRef, useState } from "react";

let bitmediaStickyAdLoaded = false;

const StickyAd = ({ className = "", style = {}, id = "sticky-ad-bottom" }) => {
  const adRef = useRef(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

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

    if (bitmediaStickyAdLoaded || typeof window === "undefined") return;

    const existingScript = document.querySelector(
      'script[src*="692e1c90583b3fbfcbb4e450"]'
    );
    if (existingScript) {
      bitmediaStickyAdLoaded = true;
      return;
    }

    !(function (e, n, c, t, o, r, d) {
      !(function e(n, c, t, o, r, m, d, s, a) {
        s = c.getElementsByTagName(t)[0];
        a = c.createElement(t);
        a.async = !0;
        a.src = "https://" + r[m] + "/js/" + o + ".js?v=" + d;
        a.onerror = function () {
          a.remove();
          m + 1 >= r.length || e(n, c, t, o, r, m);
        };
        s.parentNode.insertBefore(a, s);
      })(
        window,
        document,
        "script",
        "692e1c90583b3fbfcbb4e450",
        ["cdn.bmcdn6.com"],
        0,
        new Date().getTime()
      );
    })();

    bitmediaStickyAdLoaded = true;
  }, []);

  if (isDevelopment) {
    return (
      <div
        className={`sticky-ad-bottom-placeholder ${className}`}
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          zIndex: "1000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "90px",
          width: "100%",
          backgroundColor: "#1f2937",
          border: "2px dashed #4b5563",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          color: "#ffffff",
          fontSize: "14px",
          textAlign: "center",
          padding: "20px",
          margin: "0",
          ...style,
        }}
        id={id}
      >
        <div>
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#ffffff",
            }}
          >
            Sticky Ad Bottom
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
      className={`692e1c90583b3fbfcbb4e450 ${className}`}
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        zIndex: "1000",
        display: "inline-block",
        width: "1px",
        height: "1px",
        ...style,
      }}
      id={id}
    />
  );
};

export default StickyAd;
