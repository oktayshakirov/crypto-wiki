import React from "react";
import Head from "next/head";
import config from "@config/config.json";
import embeddableTools, { getEmbeddableTool } from "@config/embeddableTools";

import HalvingCountdown from "@components/HalvingCountdown";
import BitcoinRoiCalculator from "@components/BitcoinRoiCalculator";
import BitcoinRainbowChart from "@components/BitcoinRainbowChart";
import FearAndGreedIndex from "@components/FearAndGreedIndex";
import StakingCalculator from "@components/StakingCalculator";

// Bare, chrome-free renderings of our own tools for use in other sites'
// iframes. No header, footer, nav or ads: just the tool plus a followed
// attribution link back to the canonical page.
//
// These pages are noindex so they never compete with the real tool pages in
// search, while the attribution link still passes value to us.

const COMPONENTS = {
  "bitcoin-halving-countdown": HalvingCountdown,
  "bitcoin-roi-calculator": BitcoinRoiCalculator,
  "bitcoin-rainbow-chart": BitcoinRainbowChart,
  "fear-and-greed-index": FearAndGreedIndex,
  "staking-calculator": StakingCalculator,
};

const EmbedPage = ({ tool }) => {
  const Tool = COMPONENTS[tool.slug];
  const canonical = `${config.site.base_url}${tool.toolPath}`;

  return (
    <>
      <Head>
        <title>{`${tool.name} | The Crypto Wiki`}</title>
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href={canonical} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="p-4">
        <div className="mb-3 text-center">
          <a
            href={canonical}
            target="_blank"
            rel="noopener"
            className="text-base font-bold hover:text-primary"
          >
            {tool.name}
          </a>
        </div>

        {Tool ? <Tool /> : null}

        <div className="mt-4 border-t border-gray-200 pt-3 text-center text-xs opacity-80 dark:border-gray-800">
          <a
            href={canonical}
            target="_blank"
            rel="noopener"
            className="hover:text-primary"
          >
            {tool.name} by The Crypto Wiki
          </a>
          <span className="mx-1">·</span>
          <span>Informational only, not financial advice.</span>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths = () => ({
  paths: embeddableTools.map((t) => ({ params: { tool: t.slug } })),
  fallback: false,
});

export const getStaticProps = ({ params }) => {
  const tool = getEmbeddableTool(params.tool);
  if (!tool) return { notFound: true };
  return { props: { tool } };
};

export default EmbedPage;
