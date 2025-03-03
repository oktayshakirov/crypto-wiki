import config from "@config/config.json";
import theme from "@config/theme.json";
import { JsonContext } from "context/state";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";
import TagManager from "react-gtm-module";
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

const App = ({ Component, pageProps }) => {
  const pf = theme.fonts.font_family.primary;
  const sf = theme.fonts.font_family.secondary;
  const [fontcss, setFontcss] = useState();
  const isApp = getIsAppFlag();

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

  const tagManagerArgs = {
    gtmId: config.params.tag_manager_id,
  };
  useEffect(() => {
    setTimeout(() => {
      !isApp &&
        config.params.tag_manager_id &&
        TagManager.initialize(tagManagerArgs);
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      </Head>
      {!isApp && (
        <>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-ZRW4Z84C8T"
          ></Script>
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-ZRW4Z84C8T');
            `}
          </Script>
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5852582960793521"
            crossOrigin="anonymous"
          ></script>
        </>
      )}
      <Component {...pageProps} />
    </JsonContext>
  );
};

export default App;
