import { useEffect, useRef, useState } from "react";

let bitmediaStickyAdLoaded = false;

const StickyAdLeft = ({
  className = "",
  style = {},
  id = "sticky-ad-left",
}) => {
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
      'script[src*="692e1a05583b3fbfcbb4e0a4"]'
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
        "692e1a05583b3fbfcbb4e0a4",
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
        className={`sticky-ad-left-placeholder ${className}`}
        style={{
          position: "fixed",
          left: "0",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: "1000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "250px",
          minWidth: "160px",
          maxWidth: "160px",
          backgroundColor: "#1f2937",
          border: "2px dashed #4b5563",
          borderRadius: "4px",
          color: "#ffffff",
          fontSize: "12px",
          textAlign: "center",
          padding: "20px 10px",
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
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Sticky Ad Left
          </div>
          <div
            style={{
              fontSize: "10px",
              opacity: 0.7,
              color: "#d1d5db",
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Bitmedia ads only display in production
          </div>
        </div>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className={`692e1a05583b3fbfcbb4e0a4 ${className}`}
      style={{
        position: "fixed",
        left: "0",
        top: "50%",
        transform: "translateY(-50%)",
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

export default StickyAdLeft;
