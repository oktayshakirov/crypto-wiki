import React from "react";
import Base from "@layouts/Baseof";
import BitcoinRainbowChart from "@components/BitcoinRainbowChart";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import LayoutAd from "@components/ads/LayoutAd";

const BitcoinRainbowChartPage = ({ isApp }) => {
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

  const dataSource = "Binance";

  const rainbowBands = [
    {
      colorClass: "bg-purple-700",
      textColor: "text-purple-700 dark:text-purple-400",
      name: "Purple ('Regret Zone')",
      interpretation:
        "Deep capitulation phase. Extreme fear dominates, investors may regret past decisions or inaction.",
    },
    {
      colorClass: "bg-blue-700",
      textColor: "text-blue-700 dark:text-blue-400",
      name: "Dark Blue ('Market Apocalypse')",
      interpretation:
        "Historically suggested periods of maximum pessimism and potential undervaluation relative to the trend.",
    },
    {
      colorClass: "bg-blue-500",
      textColor: "text-blue-500 dark:text-blue-300",
      name: "Lighter Blue ('Fire Sale')",
      interpretation:
        "Historically suggested a good potential buying opportunity, indicating the price was low within its long-term channel.",
    },
    {
      colorClass: "bg-green-600",
      textColor: "text-green-600 dark:text-green-400",
      name: "Green ('Accumulate')",
      interpretation:
        "Historically suggested a phase where accumulation might be favorable.",
    },
    {
      colorClass: "bg-green-400",
      textColor: "text-green-400 dark:text-green-300",
      name: "Light Green ('BUY!')",
      interpretation:
        "Price is moving up but still potentially below its perceived long-term fair value according to the model.",
    },
    {
      colorClass: "bg-yellow-400",
      textColor: "text-yellow-500 dark:text-yellow-400",
      name: "Yellow ('HODL!')",
      interpretation:
        "Often seen as a neutral or 'hold' phase during a bull market.",
    },
    {
      colorClass: "bg-orange-400",
      textColor: "text-orange-500 dark:text-orange-400",
      name: "Orange ('SELL!')",
      interpretation:
        "Historically suggested increasing optimism and potential 'Fear Of Missing Out'. Caution advised.",
    },
    {
      colorClass: "bg-orange-600",
      textColor: "text-orange-600 dark:text-orange-500",
      name: "Dark Orange ('Bubble territory')",
      interpretation:
        "Historically indicated market heating up significantly, potentially nearing a peak.",
    },
    {
      colorClass: "bg-red-600",
      textColor: "text-red-600 dark:text-red-400",
      name: "Red ('Everyone is Rich!')",
      interpretation:
        "Historically represented peaks of market euphoria and potential maximum overvaluation relative to the trend.",
    },
  ];

  return (
    <Base
      title="Bitcoin Rainbow Chart - Visualize BTC Price Cycles | Crypto Wiki"
      meta_title="Bitcoin Rainbow Chart - Visualize BTC Price Cycles | Crypto Wiki"
      description="Explore the updated Bitcoin Rainbow Chart. Understand BTC's long-term logarithmic growth, market sentiment zones & how to interpret them. Educational tool, not financial advice."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools/bitcoin-rainbow-chart`}
      dateModified={lastUpdated}
      author={author.name}
      isApp={isApp}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />

          <h1 className="h1 mb-4 text-center">Bitcoin Rainbow Chart</h1>

          <p className="mb-6 text-center text-lg">
            Visualize Bitcoin&apos;s long-term price movements and potential
            market sentiment using the classic Rainbow Chart, based on a
            logarithmic growth curve. Explore historical trends in a unique,
            colorful way.
          </p>
        </div>

        <div className="container mb-6">
          <h2 className="h3 mb-3 text-center">Live Bitcoin Rainbow Chart</h2>
          <BitcoinRainbowChart />
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
            Chart data sourced from {dataSource} and updated periodically.
          </p>
          <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Analyzed by:{" "}
            {author.profileUrl ? (
              <Link
                href={author.profileUrl}
                className="text-primary hover:underline"
              >
                {author.name}
              </Link>
            ) : (
              author.name
            )}
            {" | "}Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="container">
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> The Bitcoin Rainbow Chart is
              presented for{" "}
              <strong>
                informational, educational, and entertainment purposes only
              </strong>{" "}
              and should <strong>never</strong> be construed as financial advice
              or used as the sole basis for making financial or investment
              decisions. It is a visual tool designed to reflect historical
              trends using a specific model, and any future projections are
              purely speculative. Past performance is not indicative of future
              results. Bitcoin investments carry significant risk. Always
              conduct your own thorough research (DYOR) and consult with a
              qualified independent financial advisor before making any
              investment choices.
            </p>
          </div>
          <div className="content">
            <h2 className="h3 my-4">What is the Bitcoin Rainbow Chart?</h2>
            <p>
              The Bitcoin Rainbow Chart is a long-term valuation tool that aims
              to visualize Bitcoin&apos;s price evolution over time. It utilizes
              a{" "}
              <strong title="A growth pattern where the rate of growth is proportional to the current value, often appearing as a curve on a standard chart but a straight line on a logarithmic chart.">
                logarithmic growth curve
              </strong>
              , suggesting that while Bitcoin&apos;s price may grow
              exponentially, the rate of growth might slow down over long
              periods. This model gained popularity within the crypto community
              (often attributed to user &apos;Trolololo&apos; on early Bitcoin
              forums) for its simple visualization of Bitcoin&apos;s dramatic
              price cycles.
            </p>
            <p>
              The &quot;rainbow&quot; comes from overlaying colored bands onto
              this growth curve. Each color band represents a different
              potential phase of the Bitcoin market cycle, based purely on where
              the price has historically traded within the logarithmic channel.
              It&apos;s a way to conceptualize market sentiment, from periods of
              potential undervaluation (&apos;buy zones&apos;) to periods of
              potential overvaluation (&apos;sell zones&apos;).
            </p>
            <LayoutAd />
            <h2 className="h3 my-4">
              How the Bitcoin Rainbow Chart Works (Methodology)
            </h2>
            <h3 className="h4 my-3">Logarithmic Growth Explained</h3>
            <p>
              Unlike a linear chart where price increases look larger as the
              price gets higher, a logarithmic scale adjusts the Y-axis (price)
              so that equal vertical distances represent equal percentage
              changes. For an asset like{" "}
              <Link
                href="/posts/what-is-bitcoin"
                className="text-primary hover:underline"
              >
                Bitcoin (BTC)
              </Link>
              , which has seen growth orders of magnitude, a logarithmic scale
              can provide a clearer view of long-term trends and cycles by
              reducing the visual impact of later, larger price swings compared
              to earlier ones. The curve attempts to fit a line to this
              logarithmic price history.
            </p>
            <h3 className="h4 my-3">Understanding the Rainbow Bands</h3>
            <p>
              The colored bands are typically derived by taking the base
              logarithmic regression line and creating parallel bands above and
              below it. The specific mathematical derivation can vary slightly
              between versions, but the core idea is that these bands represent
              different zones relative to the long-term trendline. The colors
              assigned are arbitrary but follow the rainbow spectrum to provide
              an intuitive visual cue for market sentiment, purely based on
              historical price action within these zones.
            </p>

            <h2 className="h3 my-4">
              How to Read and Interpret the Bitcoin Rainbow Chart
            </h2>
            <p>
              Interpreting the chart involves observing which color band the
              current Bitcoin price resides in. The table below summarizes the
              historical sentiment associated with each band:
            </p>

            <div className=" my-6 overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold dark:border-gray-600">
                      Color
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold dark:border-gray-600">
                      Band Name / Sentiment
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold dark:border-gray-600">
                      Historical Interpretation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rainbowBands.map((band, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 align-top dark:border-gray-600">
                        <span
                          className={`inline-block h-5 w-5 rounded-full border border-gray-400 dark:border-gray-500 ${band.colorClass}`}
                        ></span>
                      </td>
                      <td
                        className={`border border-gray-300 px-4 py-2 align-top font-medium dark:border-gray-600 ${band.textColor}`}
                      >
                        {band.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 align-top text-sm dark:border-gray-600">
                        {band.interpretation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 italic">
              <strong>Remember:</strong> These interpretations are based
              *solely* on past price behavior within this specific model. They
              are not predictions and carry no guarantee of future outcomes.
              Market conditions change.
            </p>

            <h3 className="h4 my-3">Historical Context Example</h3>
            <p>
              For instance, looking back at the chart, one might observe that
              during the major market peaks of late 2013, late 2017, and early
              2021, the price entered the upper orange and red bands
              (&apos;FOMO&apos; to &apos;Maximum Bubble Territory&apos;).
              Conversely, during the bear market bottoms of early 2015, late
              2018, and mid-2022, the price often dipped into the lower blue
              bands (&apos;Buy&apos; or &apos;Fire Sale&apos;). This historical
              pattern is what gives the chart its appeal, but relying on it
              repeating is speculative.
            </p>

            <h2 className="h3 my-4">Benefits of Using the Rainbow Chart</h2>
            <ul>
              <li>
                <strong>Long-Term Perspective:</strong> Helps filter out
                short-term noise and visualize Bitcoin&apos;s broader historical
                growth trajectory.
              </li>
              <li>
                <strong>Sentiment Visualization:</strong> Offers a simple,
                colorful way to conceptualize potential market sentiment
                extremes based on historical price zones.
              </li>
              <li>
                <strong>Simplicity:</strong> Easy to understand visually, even
                for beginners, compared to more complex technical indicators.
              </li>
            </ul>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Limitations and Why It&apos;s Not Predictive ⚠️
            </h2>
            <p>
              It is crucial to understand the significant limitations of the
              Bitcoin Rainbow Chart:
            </p>
            <ul>
              <li>
                <strong>Descriptive, Not Predictive:</strong> The chart merely
                describes past price action fitted to a mathematical curve. It
                has zero predictive power regarding future price movements.
              </li>
              <li>
                <strong>Based on Historical Data Only:</strong> Past performance
                is not indicative of future results. The market structure,
                adoption level, regulation, and macroeconomic factors affecting
                Bitcoin today are different from the past.
              </li>
              <li>
                <strong>Model Oversimplification:</strong> Logarithmic
                regression is a very simple model. It doesn&apos;t account for
                fundamental analysis, network developments, breaking news,
                regulatory changes, or shifts in market dynamics.
              </li>
              <li>
                <strong>Curve Fitting Risk:</strong> The specific parameters of
                the logarithmic curve can be debated, and different fits could
                produce different band zones. It&apos;s a model fitted to past
                data, which doesn&apos;t guarantee it fits future data.
              </li>
              <li>
                <strong>Lagging Indicator:</strong> By its nature, it reflects
                where the price *has been*, not where it is definitively going.
              </li>
              <li>
                <strong>False Signals:</strong> Relying on band colors for
                buy/sell decisions is extremely risky and can lead to
                significant losses. Price can stay in &quot;bubble
                territory&quot; longer than expected or drop below &quot;fire
                sale&quot; levels.
              </li>
            </ul>
            <p className="font-bold">
              Therefore, use this chart only as one small piece of a much larger
              analysis puzzle, primarily for historical context and
              visualization. Never trade based solely on its colors.
            </p>
            <LayoutAd />
            <h2 className="h3 my-4">Frequently Asked Questions (FAQ)</h2>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Is the Bitcoin Rainbow Chart accurate or predictive?
                </h3>
                <p className="mb-0">
                  No. It is not predictive and its &quot;accuracy&quot; is only
                  descriptive of past price movements within its own model. It
                  cannot predict future prices.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Who created the Bitcoin Rainbow Chart?
                </h3>
                <p className="mb-0">
                  The concept evolved within the online Bitcoin community. While
                  difficult to pinpoint a single creator, user
                  &apos;Trolololo&apos; on the Bitcointalk forum is often
                  credited with popularizing one of the earliest versions around
                  2014.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What do the different colors mean?
                </h3>
                <p className="mb-0">
                  The colors represent zones based on how far the price is above
                  or below a long-term logarithmic growth trendline,
                  historically correlating with different phases of market
                  sentiment (e.g., blue for potential lows, red for potential
                  highs). See the table in the &apos;How to Read&apos; section
                  above for details.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Should I buy or sell Bitcoin based on this chart?
                </h3>
                <p className="mb-0">
                  <strong>Absolutely not.</strong> This chart is purely an
                  educational and historical visualization tool. Making
                  investment decisions based solely on this chart is highly
                  discouraged and risky. Always consult a qualified financial
                  advisor and conduct thorough research. If you are considering
                  investing, explore resources like our guide on{" "}
                  <Link
                    href="/posts/how-to-buy-your-first-crypto"
                    className="text-primary hover:underline"
                  >
                    how to buy your first crypto
                  </Link>{" "}
                  and research{" "}
                  <Link
                    href="/exchanges"
                    className="text-primary hover:underline"
                  >
                    trusted exchanges
                  </Link>
                  .
                </p>
              </div>
              <div className="py-5">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  How often is the chart updated?
                </h3>
                <p className="mb-0">
                  The chart on this page uses price data from {dataSource} and
                  is updated periodically (e.g., daily, hourly - specify if
                  possible). Check the timestamp if available on the chart
                  component itself.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
              <h2 className="h4 mb-3">Explore More Crypto Tools & Analyses</h2>
              <p>
                Check out other tools and resources available on Crypto Wiki:
              </p>
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

export default BitcoinRainbowChartPage;
