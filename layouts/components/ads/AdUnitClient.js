import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export const AdUnitClient = ({ children }) => {
  const router = useRouter();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadBitmediaAd = () => {
      const insElement = containerRef.current.querySelector(
        "ins.692e0776457ec2706b483e16"
      );
      if (!insElement) {
        return;
      }

      const adId = insElement.id || insElement.getAttribute("data-ad-id");

      const existingScript = containerRef.current.querySelector(
        `script[data-bitmedia-ad-id="${adId}"]`
      );
      if (existingScript) {
        return;
      }

      const script = document.createElement("script");
      script.setAttribute("data-bitmedia-ad-id", adId || "default");
      script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","692e0776457ec2706b483e16",["cdn.bmcdn6.com"], 0, new Date().getTime())}();`;

      if (insElement.nextSibling) {
        insElement.parentNode.insertBefore(script, insElement.nextSibling);
      } else {
        insElement.parentNode.appendChild(script);
      }
    };

    const timer = setTimeout(() => {
      loadBitmediaAd();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [router.pathname, router.query]);

  return (
    <div ref={containerRef} style={{ display: "inline-block", width: "100%" }}>
      {children}
    </div>
  );
};

export default AdUnitClient;
