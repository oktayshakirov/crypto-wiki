import React from "react";
import Base from "@layouts/Baseof";
import FearAndGreedIndexChart from "@components/FearAndGreedIndex";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";

const legendData = [
  {
    colorHex: "#f85032",
    bgColorClass: "bg-red-600",
    label: "0-24: Extreme Fear",
  },
  { colorHex: "#ff7e5f", bgColorClass: "bg-orange-500", label: "25-49: Fear" },
  {
    colorHex: "#f2c94c",
    bgColorClass: "bg-yellow-400",
    label: "50-54: Neutral",
  },
  { colorHex: "#a8ff78", bgColorClass: "bg-lime-400", label: "55-74: Greed" },
  {
    colorHex: "#56ab2f",
    bgColorClass: "bg-green-600",
    label: "75-100: Extreme Greed",
  },
];

const calculationComponents = [
  {
    name: "Volatility",
    weight: "25%",
    description:
      "Compares current Bitcoin volatility to its average over the last 30 and 90 days. Unusually high volatility is often a sign of a fearful market.",
  },
  {
    name: "Market Momentum/Volume",
    weight: "25%",
    description:
      "Compares current Bitcoin volume and momentum to the 30/90-day averages. High buying volume in a strong positive market can indicate greedy sentiment.",
  },
  {
    name: "Social Media Sentiment",
    weight: "15%",
    description:
      "Analyzes the volume and sentiment of crypto-related hashtags and posts on platforms like X (formerly Twitter). High interaction rates and positive sentiment can signal greed.",
  },
  {
    name: "Bitcoin Dominance",
    weight: "10%",
    description:
      "Examines Bitcoin's share of the total crypto market cap. Rising dominance can sometimes indicate fear (flight to perceived safety of BTC), while falling dominance might suggest greed (investing in riskier altcoins).",
  },
  {
    name: "Google Trends Data",
    weight: "10%",
    description:
      "Analyzes search volume for various Bitcoin and crypto-related terms. High search volume for negative terms ('Bitcoin crash') indicates fear, while high volume for positive terms might indicate greed.",
  },
  {
    name: "Surveys",
    weight: "15%",
    description:
      "Historically included weekly crypto poll results (Currently Paused by alternative.me).",
  },
];

const FearAndGreedIndexPage = ({ isApp }) => {
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

  const originalSource = {
    name: "alternative.me",
    url: "https://alternative.me/crypto/fear-and-greed-index/",
  };

  const dataSource = originalSource.name;

  return (
    <Base
      title="Crypto Fear & Greed Index (Live) - Market Sentiment Analysis | Crypto Wiki"
      meta_title="Crypto Fear & Greed Index (Live) - Market Sentiment Analysis | Crypto Wiki"
      description="Track the current Crypto Fear and Greed Index score. Understand the factors driving crypto market sentiment (volatility, social media, etc.) & its limitations. Not financial advice."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools/fear-and-greed-index`}
      dateModified={lastUpdated}
      author={author.name}
      isApp={isApp}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />

          <h1 className="h1 mb-4 text-center">Crypto Fear & Greed Index</h1>

          <p className="mb-6 text-center text-lg">
            Gauge the current emotional state of the cryptocurrency market. This
            index analyzes various factors to produce a score from 0 (Extreme
            Fear) to 100 (Extreme Greed), providing a snapshot of market
            sentiment.
          </p>
        </div>

        <div className="container mb-6">
          <h2 className="h3 mb-3 text-center">Current Market Sentiment</h2>
          <div className="mx-auto">
            <FearAndGreedIndexChart />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {legendData.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <span
                  className={`mr-1.5 inline-block h-3 w-3 flex-shrink-0 rounded-full border border-gray-400 dark:border-gray-500 ${item.bgColorClass}`}
                  title={`Color approx: ${item.colorHex}`}
                ></span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Index data sourced via {dataSource}. Original concept by{" "}
            <a
              href={originalSource.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-primary hover:underline"
            >
              {originalSource.name}
            </a>
            . Last Updated: {lastUpdated}.
          </p>
        </div>

        <div className="container">
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer: Not Financial Advice.</strong> The Crypto
              Fear & Greed Index is a market sentiment indicator provided for
              informational and educational purposes only. It reflects an
              aggregation of data points and{" "}
              <strong>
                does not constitute investment advice or a recommendation to buy
                or sell
              </strong>{" "}
              any asset. Market sentiment can be irrational and is only one
              factor among many influencing price. Always conduct your own
              thorough research (DYOR) and consult with a qualified independent
              financial advisor before making any investment decisions.
              Significant risk of loss exists in crypto markets.
            </p>
          </div>

          <div className="content prose mt-8 max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">
              What Exactly is the Crypto Fear & Greed Index?
            </h2>
            <p>
              The Crypto Fear & Greed Index aims to quantify the prevailing
              emotion in the cryptocurrency market. It operates on the premise
              that excessive fear can drive prices down to potential buying
              opportunities, while extreme greed can inflate prices
              unsustainably, potentially signaling a market correction. The
              index calculates a single score from 0 to 100, where:
            </p>
            <ul>
              <li>
                <strong>0-24: Extreme Fear</strong> (Indicates widespread worry,
                potentially oversold conditions)
              </li>
              <li>
                <strong>25-49: Fear</strong> (General unease in the market)
              </li>
              <li>
                <strong>50-54: Neutral</strong> (Market is relatively balanced
                emotionally)
              </li>
              <li>
                <strong>55-74: Greed</strong> (Growing optimism and potential
                FOMO - Fear Of Missing Out)
              </li>
              <li>
                <strong>75-100: Extreme Greed</strong> (Indicates high euphoria,
                potentially overbought conditions)
              </li>
            </ul>
            <p>
              This index was popularized by{" "}
              <a
                href={originalSource.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-primary hover:underline"
              >
                {originalSource.name}
              </a>
              , inspired by the traditional market Fear & Greed Index.
            </p>

            <h2 className="h3 my-4">
              How is the Index Calculated? (Methodology)
            </h2>
            <p>
              The index aggregates data from multiple sources, each weighted
              differently, to arrive at the final score. The table below
              outlines the typical components and their approximate weighting
              according to {originalSource.name}:
            </p>

            <div className="my-6 overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold dark:border-gray-600">
                      Component
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold dark:border-gray-600">
                      Weight
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold dark:border-gray-600">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculationComponents.map((component, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 align-top font-medium dark:border-gray-600">
                        {component.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 align-top dark:border-gray-600">
                        {component.weight}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 align-top text-sm dark:border-gray-600">
                        {component.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Understanding these components helps appreciate that the index is
              a complex blend of market activity and online behavior analysis.
            </p>

            <h2 className="h3 my-4">
              How to Interpret the Fear & Greed Index (Use With Extreme Caution)
            </h2>
            <p>
              Some traders view the Fear & Greed Index through a{" "}
              <strong>contrarian lens</strong>. The theory is:
            </p>
            <ul>
              <li>
                <strong>Extreme Fear (0-24):</strong> Could potentially signal
                that investors are overly worried, and the market might be
                oversold, presenting a potential (but not guaranteed) buying
                opportunity for contrarians.
              </li>
              <li>
                <strong>Extreme Greed (75-100):</strong> Could potentially
                signal that investors are overly euphoric, and the market might
                be overbought, suggesting a potential need for caution or
                profit-taking, as corrections often follow euphoria.
              </li>
            </ul>
            <p className="font-bold text-red-700 dark:text-red-500">
              ⚠️ However, using this index for market timing is highly
              speculative and risky!
            </p>
            <ul>
              <li>
                It&apos;s a <strong>lagging indicator</strong> reflecting recent
                sentiment, not predicting the future.
              </li>
              <li>
                Markets can remain fearful or greedy (or become even more so)
                for extended periods.
              </li>
              <li>
                It doesn&apos;t account for fundamental changes, news events, or
                regulatory impacts.
              </li>
              <li>
                <strong>Never</strong> use this index as your sole reason to buy
                or sell.
              </li>
            </ul>
            <p>
              It is best used as a supplementary tool to get a rough gauge of
              the market&apos;s emotional temperature alongside thorough
              technical and fundamental analysis.
            </p>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Key Limitations of the Index
            </h2>
            <ul>
              <li>
                <strong>Oversimplification:</strong> Reduces complex market
                psychology to a single number.
              </li>
              <li>
                <strong>Lagging Nature:</strong> Reflects past or current
                sentiment, not future price action.
              </li>
              <li>
                <strong>No Predictive Power:</strong> Cannot reliably predict
                market tops or bottoms.
              </li>
              <li>
                <strong>Component Susceptibility:</strong> Factors like social
                media can be influenced by bots or temporary hype.
              </li>
              <li>
                <strong>Ignores Fundamentals:</strong> Doesn&apos;t consider the
                underlying value, technology, or news related to crypto assets.
              </li>
              <li>
                <strong>Potential for False Signals:</strong> High fear
                doesn&apos;t always mean a bottom is in; high greed doesn&apos;t
                always mean a top is imminent.
              </li>
            </ul>

            <h2 className="h3 my-4">Frequently Asked Questions (FAQ)</h2>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What is considered a &apos;good&apos; Fear and Greed score?
                </h3>
                <p className="mb-0">
                  There&apos;s no single &apos;good&apos; score. Extreme scores
                  (very high or very low) are points of interest for potential
                  contrarian analysis, but they are not inherently good or bad,
                  nor are they direct signals.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  How is the Crypto Fear and Greed Index calculated?
                </h3>
                <p className="mb-0">
                  It aggregates weighted data from multiple sources including
                  market volatility, volume/momentum, social media sentiment,
                  Bitcoin dominance, and Google Trends. See the table in the
                  &apos;How is the Index Calculated?&apos; section above for
                  component details.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Is the Fear and Greed Index accurate or reliable for trading?
                </h3>
                <p className="mb-0">
                  No. While it reflects certain sentiment metrics, it&apos;s not
                  reliably predictive of future price movements and should
                  <strong>not</strong> be used as a standalone trading
                  indicator. Its accuracy in gauging true, underlying sentiment
                  is debatable, and its utility for precise market timing is
                  very low.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Who created the Crypto Fear and Greed Index?
                </h3>
                <p className="mb-0">
                  The popular version widely referenced in the crypto space was
                  created and is maintained by{" "}
                  <a
                    href={originalSource.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-primary hover:underline"
                  >
                    {originalSource.name}
                  </a>
                  .
                </p>
              </div>
              <div className="py-5">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Should I buy when the index shows &apos;Extreme Fear&apos;?
                </h3>
                <p className="mb-0">
                  <strong>No, not based solely on the index.</strong> While
                  extreme fear can coincide with market bottoms, it&apos;s not
                  guaranteed. Prices can continue to fall. Making investment
                  decisions requires comprehensive analysis and consideration of
                  your own risk tolerance, not just one sentiment indicator.
                  Consult a financial advisor.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
              <h2 className="h4 mb-3">Explore More Crypto Resources</h2>
              <p>Further your understanding of crypto markets:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <Link href="/tools" className="btn btn-primary">
                  View All Crypto Tools
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default FearAndGreedIndexPage;
