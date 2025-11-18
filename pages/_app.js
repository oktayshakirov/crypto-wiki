import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import Head from "next/head";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TagManager from "react-gtm-module";
import "styles/style.scss";

if (typeof window !== "undefined") {
  window.adsbygoogle = window.adsbygoogle || [];
}

function getIsAppFlag() {
  if (typeof window === "undefined") return false;
  const appFlag = document.documentElement.classList.contains("is-app");
  if (appFlag) return true;
  const urlParams = new URLSearchParams(window.location.search);
  return (
    urlParams.get("isApp") === "true" ||
    !!window.isApp ||
    localStorage.getItem("isApp") === "true"
  );
}

const AdsWrapper = () => {
  useEffect(() => {
    const appFlag = document.documentElement.classList.contains("is-app");

    if (appFlag) {
      localStorage.setItem("isApp", "true");
    } else {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement("script");
        script.async = true;
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5852582960793521";
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
      localStorage.removeItem("isApp");
    }
  }, []);

  return null;
};

const DynamicAdsWrapper = dynamic(() => Promise.resolve(AdsWrapper), {
  ssr: false,
});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState();
  const [isApp, setIsApp] = useState(() => getIsAppFlag());

  useEffect(() => {
    const checkIsApp = () => {
      const appFlag = document.documentElement.classList.contains("is-app");
      setIsApp((currentIsApp) => {
        return appFlag !== currentIsApp ? appFlag : currentIsApp;
      });
    };
    checkIsApp();
    const timeout = setTimeout(checkIsApp, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isApp) {
      localStorage.setItem("isApp", "true");
      document.documentElement.classList.add("is-app");
    } else {
      localStorage.removeItem("isApp");
      document.documentElement.classList.remove("is-app");
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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .is-app .isApp {
                display: none !important;
              }
            `,
          }}
        />
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
      <DynamicAdsWrapper />
      <Component {...pageProps} isApp={isApp} />
    </JsonContext>
  );
};

export default MyApp;
