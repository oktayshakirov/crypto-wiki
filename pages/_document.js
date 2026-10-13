import TwSizeIndicator from "@components/TwSizeIndicator";
import config from "@config/config.json";
import { Head, Html, Main, NextScript } from "next/document";

// Marks the native app's WebView before first paint, so CSS can hide the
// website-only chrome (`.web-only`) without a flash. It has to be inline and
// in the head: React learns about the app only after mount (see _app.js), and
// these are the same flags detectIsApp reads.
const MARK_APP = `try{if(new URLSearchParams(location.search).get("isApp")==="true"||window.isApp||localStorage.getItem("isApp")==="true"){document.documentElement.classList.add("is-app")}}catch(e){}`;

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
