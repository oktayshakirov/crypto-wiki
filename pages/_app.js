import config from "@config/config.json";
import { JsonContext } from "context/state";
import Head from "next/head";
import Script from "next/script";
import { Mulish } from "next/font/google";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
import "styles/style.scss";

// Self-hosted at build time by next/font. This replaces a client-side fetch of
// the Google Fonts stylesheet, which only ran after hydration and so shipped
// `<style>undefined</style>` in the static HTML, then caused a flash of
// unstyled text once the CSS finally arrived. Weights match theme.json.
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-primary",
});

const MyApp = ({ Component, pageProps }) => {
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
    const tagManagerArgs = {
      gtmId: config.params.tag_manager_id,
    };
    if (!isApp && config.params.tag_manager_id) {
      setTimeout(() => {
        TagManager.initialize(tagManagerArgs);
      }, 5000);
    }
  }, [isApp]);

  return (
    <JsonContext>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </Head>
      <style jsx global>{`
        :root {
          --font-primary: ${mulish.style.fontFamily};
        }
      `}</style>
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
      {/*
        AdSense script — commented out while no ad units are being served.
        LayoutAd and ArticleAd currently render nothing (config.params.adsEnabled
        is false), so loading this only added a third-party request and set
        advertising cookies without any consent flow. Uncomment when reapplying
        for AdSense review, and add a consent banner (CMP) at the same time:
        the privacy policy already tells users one exists.

      {!isApp && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5852582960793521"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
      */}
      <Component {...pageProps} isApp={isApp} />
    </JsonContext>
  );
};

export default MyApp;
