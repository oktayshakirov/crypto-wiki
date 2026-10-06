import { JsonContext } from "context/state";
import Head from "next/head";
import Script from "next/script";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import "styles/style.scss";

// Self-hosted by next/font. This replaces a client-side fetch of the Google
// Fonts stylesheet, which only ran after hydration and so shipped
// `<style>undefined</style>` in the static HTML, then caused a flash of
// unstyled text once the CSS finally arrived. The file is committed rather
// than fetched by next/font/google at build time: that fetch failed two
// production builds in a row on 2026-10-06. It is Google's Mulish v18 latin
// variable font, one file covering every weight theme.json uses (400-700).
const mulish = localFont({
  src: "../styles/fonts/mulish-latin.woff2",
  weight: "400 700",
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
      {!isApp && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5852582960793521"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
      <Component {...pageProps} isApp={isApp} />
    </JsonContext>
  );
};

export default MyApp;
