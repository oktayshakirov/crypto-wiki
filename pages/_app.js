import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TagManager from "react-gtm-module";
import { getBitmediaManager } from "@lib/utils/bitmediaManager";
import "styles/style.scss";

function getIsAppFlag() {
  if (typeof window === "undefined") return false;
  const urlParams = new URLSearchParams(window.location.search);
  return (
    urlParams.get("isApp") === "true" ||
    !!window.isApp ||
    localStorage.getItem("isApp") === "true"
  );
}

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState();
  const [isApp, setIsApp] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      return (
        urlParams.get("isApp") === "true" ||
        !!window.isApp ||
        localStorage.getItem("isApp") === "true"
      );
    }
    return false;
  });

  useEffect(() => {
    if (isApp) {
      localStorage.setItem("isApp", "true");
    }
  }, [isApp]);

  useEffect(() => {
    fetch(
      `https://fonts.googleapis.com/css2?family=${pf}${
        sf ? "&family=" + sf : ""
      }&display=swap`
    ).then((res) => res.text().then((css) => setFontcss(css)));
  }, [pf, sf]);

  useEffect(() => {
    const tagManagerArgs = {
      gtmId: config.params.tag_manager_id,
    };
    if (!isApp && config.params.tag_manager_id) {
      setTimeout(() => {
        TagManager.initialize(tagManagerArgs);
      }, 5000);
    }
  }, [isApp]);

  // Handle Bitmedia ads on route changes
  useEffect(() => {
    if (isApp || typeof window === "undefined") return;

    const manager = getBitmediaManager();
    if (!manager) return;

    // Wait a bit for components to mount and register their ads
    const initTimer = setTimeout(() => {
      const currentRoute = router.pathname;
      manager.handleRouteChange(currentRoute);
    }, 500);

    // Listen for route changes
    const handleRouteChangeComplete = (url) => {
      // Wait a bit for components to mount and register their ads
      setTimeout(() => {
        const newRoute = router.pathname;
        manager.handleRouteChange(newRoute);
      }, 300);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    // Cleanup
    return () => {
      clearTimeout(initTimer);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router, isApp]);

  const noIndexPages = ["/contact", "/faq", "/authors"];

  return (
    <JsonContext>
      <Head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `${fontcss}`,
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        {noIndexPages.includes(router.pathname) && (
          <meta name="robots" content="noindex, follow" />
        )}
      </Head>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-ZRW4Z84C8T"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZRW4Z84C8T', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      {/* {!isApp && (
        <>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5852582960793521"
            crossorigin="anonymous"
          ></script>
        </>
      )} */}
      <Component {...pageProps} isApp={isApp} />
    </JsonContext>
  );
};

export default MyApp;
