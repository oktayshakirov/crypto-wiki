import { detectIsApp } from "@lib/utils/isApp";
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
  // False on the server and on the first client render alike, so hydration
  // matches inside the app too; the real value lands right after mount. What
  // the app must never see is hidden by CSS from first paint (see _document).
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    if (detectIsApp()) {
      document.documentElement.classList.add("is-app");
      localStorage.setItem("isApp", "true");
      setIsApp(true);
    }
  }, []);

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
      <Component {...pageProps} isApp={isApp} />
    </JsonContext>
  );
};

export default MyApp;
