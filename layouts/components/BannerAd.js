import { useEffect, useRef } from "react";

/**
 * BannerAd - Bitmedia ad component
 *
 * Reusable banner ad component that loads Bitmedia ads.
 * The script is loaded once globally, even if multiple instances are used.
 */

// Global flag to ensure script is only loaded once
let bitmediaScriptLoaded = false;

const BannerAd = ({ className = "", style = {}, id = "banner-ad" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Only load the script once globally
    if (bitmediaScriptLoaded || typeof window === "undefined") return;

    // Check if the Bitmedia script already exists
    const existingScript = document.querySelector(
      'script[src*="692e0776457ec2706b483e16"]'
    );
    if (existingScript) {
      bitmediaScriptLoaded = true;
      return;
    }

    // Load the Bitmedia ad script (original code from Bitmedia)
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
        "692e0776457ec2706b483e16",
        ["cdn.bmcdn6.com"],
        0,
        new Date().getTime()
      );
    })();

    bitmediaScriptLoaded = true;
  }, []);

  return (
    <ins
      ref={adRef}
      className={`692e0776457ec2706b483e16 ${className}`}
      style={{ display: "inline-block", width: "1px", height: "1px", ...style }}
      id={id}
    />
  );
};

export default BannerAd;
