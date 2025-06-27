import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TagManager from "react-gtm-module";
import App from "next/app";
import "styles/style.scss";

const MyApp = ({ Component, pageProps, isApp }) => {
  const router = useRouter();
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState();

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

  const noIndexPages = [
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms",
    "/affiliate-disclosure",
    "/advertising",
    "/authors",
  ];

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
        {/* ExoClick */}
        <meta
          name="6a97888e-site-verification"
          content="d0624c09694d795539537403fa4dbe14"
        ></meta>
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
          <Script
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5852582960793521"
            crossOrigin="anonymous"
          />
        </>
      )} */}
      <Component {...pageProps} isApp={isApp} />
    </JsonContext>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const isApp = appContext.ctx.req?.cookies.isApp === "true";
  return { ...appProps, isApp };
};

export default MyApp;
