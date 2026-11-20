import TwSizeIndicator from "@components/TwSizeIndicator";
import config from "@config/config.json";
import { Head, Html, Main, NextScript } from "next/document";

// Marks the native app's WebView before first paint, so CSS can hide the
// website-only chrome (`.web-only`) without a flash. It has to be inline and
// in the head: React learns about the app only after mount (see _app.js), and
// these are the same flags detectIsApp reads.
//
// Only the app's WebView may keep app mode across page loads:
// react-native-webview defines window.ReactNativeWebView there from document
// start (every app WebView sets onMessage), and never in a browser. In a
// browser, ?isApp=true hides the chrome for that one view only, and a stored
// flag - e.g. from opening a link copied out of the app - is ignored and
// cleared, so the visitor is not stuck without header, footer and ads.
const MARK_APP = `try{var w=!!window.ReactNativeWebView;if(!w)localStorage.removeItem("isApp");if(new URLSearchParams(location.search).get("isApp")==="true"||window.isApp||(w&&localStorage.getItem("isApp")==="true")){document.documentElement.classList.add("is-app")}}catch(e){}`;

const Document = () => {
  // destructuring items from config object
  const { favicon } = config.site;
  return (
    <Html lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: MARK_APP }} />
        {/* favicon */}
        <link rel="shortcut icon" href={favicon} />
        {/* theme meta */}
        <meta name="theme-name" content="bookworm-light-nextjs" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
      </Head>
      <body>
        <Main />
        <TwSizeIndicator />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
