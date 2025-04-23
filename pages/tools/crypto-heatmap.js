import React from "react";
import Base from "@layouts/Baseof";
import Heatmap from "@components/Heatmap";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";

const legendData = [
  {
    colorHex: "#56ab2f",
    bgColorClass: "bg-green-600",
    label: "Positive Price Change (e.g., 24h)",
  },
  {
    colorHex: "#e73827",
    bgColorClass: "bg-red-600",
    label: "Negative Price Change (e.g., 24h)",
  },
];

const CryptoHeatmapPage = () => {
  const author = {
    name: "Crypto Wiki Team",
    profileUrl: "/authors/crypto-wiki-team",
  };

  const today = new Date();
  const lastUpdated = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dataSource = "CoinGecko API"; // Example: Fill with your actual source
  const updateFrequency = "every few minutes"; // Example: Fill with actual frequency
  const displayedAssets = "Top 100+ cryptocurrencies by Market Cap"; // Example: Fill with actual scope
  const timePeriod = "past 24 hours"; // Example: Fill with actual timeframe

  return (
    <Base
      title={`Crypto Market Heatmap (Live ${timePeriod}) | Visualize Trends - Crypto Wiki`}
      meta_title={`Crypto Market Heatmap (Live ${timePeriod}) | Visualize Trends - Crypto Wiki`}
      description={`Visualize live crypto market performance (${timePeriod}) with our interactive heatmap. Track price changes & market cap dominance for top cryptocurrencies. Not financial advice.`}
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools/crypto-heatmap`}
      dateModified={lastUpdated}
      author={author.name}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />

          <h1 className="h1 mb-4 text-center">🔥 Crypto Market Heatmap 🔥</h1>

          <p className="mb-6 text-center text-lg">
            Get a real-time visual overview of the cryptocurrency market&apos;s
            performance. This heatmap tracks the price changes of major
            cryptocurrencies over the {timePeriod}, using color intensity and
            size to represent performance and market dominance.
          </p>
        </div>

        <div className="container mb-6">
          <h2 className="h3 mb-3 text-center">
            Live Crypto Performance ({timePeriod})
          </h2>

          <div className="mb-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {legendData.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                {item.bgColorClass ? (
                  <span
                    className={`mr-1.5 inline-block h-3 w-3 flex-shrink-0 rounded-full border border-gray-400 dark:border-gray-500 ${item.bgColorClass}`}
                    title={`Color approx: ${item.colorHex}`}
                  ></span>
                ) : (
                  <span className="mr-1.5"></span>
                )}
                <span>{item.label}</span>
              </div>
            ))}
            <div className="flex items-center text-sm">
              <span className="mr-1.5 inline-block h-3 w-3 flex-shrink-0 rounded-sm border border-gray-400 bg-gray-300 dark:border-gray-500 dark:bg-gray-600"></span>
              <span>Box Size represents Market Cap</span>
            </div>
          </div>

          <Heatmap />

          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Heatmap data sourced from {dataSource}, updated {updateFrequency}.
            Displaying approx. {displayedAssets}. Last page update:{" "}
            {lastUpdated}.
          </p>
        </div>

        <div className="container">
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer: Not Financial Advice.</strong> The Crypto
              Market Heatmap is a data visualization tool provided for
              informational and educational purposes only. It **should not** be
              interpreted as financial advice, investment recommendations, or
              endorsements of any specific cryptocurrency. Market data can
              change rapidly. Always conduct your own thorough research (DYOR),
              consider multiple factors, and consult with a qualified
              independent financial advisor before making investment decisions.
            </p>
          </div>

          <div className="content prose mt-8 max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">What is a Crypto Heatmap?</h2>
            <p>
              A crypto heatmap offers a dynamic, visual snapshot of the
              cryptocurrency market&apos;s performance at a glance. Instead of
              scanning lists of numbers, you can quickly identify trends and
              outliers based on two key visual cues:
            </p>
            <ul>
              <li>
                <strong>Color:</strong> Indicates the price change of a
                cryptocurrency over a specific time period (typically the{" "}
                {timePeriod} on this page). Green generally signifies a price
                increase, while red signifies a price decrease. The intensity of
                the color often corresponds to the magnitude of the change
                (brighter green = larger gain, brighter red = larger loss).
              </li>
              <li>
                <strong>Size:</strong> The area of each rectangle usually
                represents the cryptocurrency&apos;s market capitalization
                (Market Cap). Larger boxes correspond to cryptocurrencies with
                higher market caps (like Bitcoin and Ethereum), while smaller
                boxes represent smaller-cap assets.
              </li>
            </ul>
            <p>
              By combining color and size, the heatmap allows users to quickly
              assess not only individual coin performance but also the overall
              market mood and the relative impact of different cryptocurrencies.
            </p>

            <h2 className="h3 my-4">How Does This Heatmap Work?</h2>
            <p>This heatmap tool functions by:</p>
            <ol>
              <li>
                Fetching real-time (or near real-time) market data for a
                predefined list of assets (e.g., the {displayedAssets}) from a
                reliable source (like {dataSource}).
              </li>
              <li>
                Calculating the percentage price change for each asset over the
                specified {timePeriod}.
              </li>
              <li>
                Assigning a color (and intensity) to each asset&apos;s rectangle
                based on its price change.
              </li>
              <li>
                Scaling the size of each rectangle proportionally to the
                asset&apos;s current market capitalization.
              </li>
              <li>
                Arranging the rectangles visually, often grouping similar assets
                or sectors together if applicable (layout may vary).
              </li>
              <li>
                Refreshing the data periodically (approximately{" "}
                {updateFrequency}) to reflect current market conditions.
              </li>
            </ol>
            <p>
              Transparency about the data source, update frequency, and the
              metrics used for color/size is key to understanding the
              visualization.
            </p>

            <h2 className="h3 my-4">
              How to Interpret the Crypto Heatmap (Use With Caution)
            </h2>
            <p>
              The heatmap is primarily useful for getting a quick visual summary
              and identifying potential areas for further research. Here are
              some ways to interpret it, keeping the limitations in mind:
            </p>
            <ul>
              <li>
                <strong>Overall Market Sentiment:</strong> Is the map
                predominantly green or red? This gives an immediate sense of the
                general market direction over the chosen timeframe.
              </li>
              <li>
                <strong>Identify Top Performers/Losers:</strong> Bright green or
                bright red boxes stand out, highlighting assets with significant
                price movements.
              </li>
              <li>
                <strong>Sector Analysis:</strong> If assets are grouped by
                category (e.g., DeFi, Memecoins, Layer 1s), you can quickly see
                if a particular sector is outperforming or underperforming the
                rest of the market.
              </li>
              <li>
                <strong>Large-Cap Influence:</strong> Observe the color of the
                largest boxes (BTC, ETH). Their performance often heavily
                influences the overall market sentiment.
              </li>
              <li>
                <strong>Spotting Divergence:</strong> Notice if most of the
                market is red, but a specific coin or sector is green, or
                vice-versa. This might warrant further investigation into *why*.
              </li>
            </ul>
            <p className="font-bold text-red-700 dark:text-red-500">
              ⚠️ Important: Correlation is not causation, and past performance
              is not indicative of future results. This heatmap is a *snapshot*,
              not a predictive tool.
            </p>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Key Limitations to Consider
            </h2>
            <ul>
              <li>
                <strong>Snapshot in Time:</strong> Only reflects performance
                over the specified period ({timePeriod}). Short-term movements
                can be misleading without broader context.
              </li>
              <li>
                <strong>No &apos;Why&apos;:</strong> Shows *what* happened
                (price change) but not *why* (news, technical factors,
                fundamentals).
              </li>
              <li>
                <strong>Market Cap Dominance:</strong> Large-cap coins dominate
                visually due to size, potentially overshadowing significant
                percentage moves in smaller caps.
              </li>
              <li>
                <strong>Data Lag/Accuracy:</strong> Relies on the accuracy and
                update speed of the underlying data source ({dataSource}).
              </li>
              <li>
                <strong>Not Investment Advice:</strong> A green box doesn&apos;t
                automatically mean &quot;buy,&quot; and a red box doesn&apos;t
                automatically mean &quot;sell.&quot;
              </li>
            </ul>

            <h2 className="h3 my-4">Frequently Asked Questions (FAQ)</h2>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What do the colors on the heatmap mean?
                </h3>
                <p className="mb-0">
                  Green indicates a positive price change over the specified
                  period (usually {timePeriod}), while red indicates a negative
                  price change. Brighter colors often signify larger percentage
                  changes.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What determines the size of the boxes?
                </h3>
                <p className="mb-0">
                  The size (area) of each rectangle typically represents the
                  cryptocurrency&apos;s market capitalization. Larger boxes mean
                  higher market caps.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  How often is the heatmap data updated?
                </h3>
                <p className="mb-0">
                  This heatmap aims to update approximately {updateFrequency},
                  based on data from {dataSource}. However, slight delays can
                  occur.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What cryptocurrencies are included in the heatmap?
                </h3>
                <p className="mb-0">
                  This heatmap generally displays the {displayedAssets}, but the
                  exact list may vary slightly based on data availability.
                </p>
              </div>
              <div className="py-5">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Can I use the heatmap to decide when to buy or sell crypto?
                </h3>
                <p className="mb-0">
                  <strong>No.</strong> The heatmap is an informational tool for
                  visualizing past performance. It does not predict future
                  movements and should **never** be the sole basis for
                  investment decisions. Always do your own research and consult
                  a financial advisor.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
              <h2 className="h4 mb-3">Explore More Crypto Tools</h2>
              <p>Check out other visualization and analysis tools:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <Link href="/tools" className="btn btn-primary">
                  View All Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default CryptoHeatmapPage;
