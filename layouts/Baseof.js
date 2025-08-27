import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";
import Footer from "@partials/Footer";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import CoinTracker from "@components/CoinTracker";

const Header = dynamic(() => import("@partials/Header"), {
  ssr: false,
  loading: () => null, // Don't show loading state to prevent layout shift
});

const Base = ({
  title,
  meta_title,
  description,
  image,
  noindex,
  canonical,
  children,
  isApp,
}) => {
  const { meta_image, meta_author, meta_description } = config.metadata;
  const { base_url } = config.site;
  const router = useRouter();

  const getRobotsContent = () => {
    if (typeof noindex === "string") {
      return noindex;
    }
    if (noindex === true) {
      return "noindex,nofollow";
    }
    return "index,follow";
  };

  return (
    <>
      <Head>
        <title>
          {plainify(
            meta_title ? meta_title : title ? title : config.site.title
          )}
        </title>
        {canonical && <link rel="canonical" href={canonical} itemProp="url" />}
        <meta
          name="description"
          content={plainify(description ? description : meta_description)}
        />
        <meta name="robots" content={getRobotsContent()} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content={meta_author} />
        <meta
          property="og:title"
          content={plainify(
            meta_title ? meta_title : title ? title : config.site.title
          )}
        />
        <meta
          property="og:description"
          content={plainify(description ? description : meta_description)}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${base_url}${router.asPath === "/" ? "" : router.asPath}`}
        />
        <meta
          name="twitter:title"
          content={plainify(
            meta_title ? meta_title : title ? title : config.site.title
          )}
        />
        <meta
          name="twitter:description"
          content={plainify(description ? description : meta_description)}
        />
        <meta
          property="og:image"
          content={`${base_url}${image ? image : meta_image}`}
        />
        <meta
          name="twitter:image"
          content={`${base_url}${image ? image : meta_image}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header isApp={isApp} />
      <div className="container">
        <CoinTracker />
      </div>
      <main>{children}</main>
      <Footer isApp={isApp} />
    </>
  );
};

export default Base;
