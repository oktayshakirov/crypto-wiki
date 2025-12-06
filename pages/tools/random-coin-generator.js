import React from "react";
import Base from "@layouts/Baseof";
import RandomCoinGenerator from "@components/RandomCoinGenerator";
import { FaExclamationTriangle, FaSkullCrossbones } from "react-icons/fa";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import LayoutAd from "@components/ads/LayoutAd";

const RandomCoinPage = ({ isApp }) => {
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

  const dataSource = "CoinGecko API";
  const coinListScope = "top 500 cryptocurrencies by market cap";
  const listUpdateFrequency = "daily";

  return (
    <Base
      title="Random Coin Generator | Explore Cryptos (Use with Caution!) - Crypto Wiki"
      meta_title="Random Coin Generator | Explore Cryptos (Use with Caution!) - Crypto Wiki"
      description={`Discover random cryptocurrencies from the ${coinListScope} for educational and entertainment purposes. Learn how to research coins responsibly. Not investment advice.`}
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools/random-coin-generator`}
      dateModified={lastUpdated}
      author={author.name}
      isApp={isApp}
    >
      <section className="section">
        <div className="container">
          <GoBackLink option="tools" />

          <h1 className="h1 mb-4 text-center">Random Coin Generator</h1>

          <p className="text-center text-lg">
            Curious about the vast crypto universe? Click the button below to
            discover a random cryptocurrency pulled from the {coinListScope}.
            Use this tool for
            <strong>
              entertainment and as a starting point for further research only.
            </strong>
          </p>
        </div>

        <div className="container mb-6">
          <div className="mb-6 flex flex-col items-center">
            <RandomCoinGenerator />
            <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Coin list sourced via {dataSource}, updated approx.{" "}
              {listUpdateFrequency}. Scope: {coinListScope}. Last page update:{" "}
              {lastUpdated}.
            </p>
          </div>

          <div className="mb-8 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer: Not Financial Advice.</strong> The Random
              Coin Generator is intended solely for entertainment and
              informational purposes.
              <strong>
                It provides absolutely no investment recommendation or financial
                advice.
              </strong>{" "}
              Any coin generated should be thoroughly researched using
              independent sources. Always conduct extensive due diligence (DYOR)
              and consult a qualified independent financial advisor before
              making <em>any</em> investment decisions, especially in the highly
              volatile crypto market.
            </p>
          </div>

          <div className="content prose max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">What is the Random Coin Generator?</h2>
            <p>
              With thousands of cryptocurrencies in existence, exploring the
              market can feel overwhelming. The Random Coin Generator is a
              simple tool designed to combat this by presenting you with a
              single cryptocurrency selected randomly from our defined list
              (currently the {coinListScope} sourced from {dataSource}).
            </p>
            <p>
              Think of it as a digital &quot;spin the wheel&quot; for crypto
              discovery. Its purpose is <strong>not</strong> to suggest
              investments, but to offer a random starting point if you want to
              learn about a coin you might not have encountered otherwise.
            </p>
            <LayoutAd />
            <h2 className="h3 my-4">How Does This Generator Work?</h2>
            <ul>
              <li>
                <strong>Coin Selection Pool:</strong> We maintain a list of
                cryptocurrencies based on our defined scope ({coinListScope})
                using data from {dataSource}. This list is updated periodically
                ({listUpdateFrequency}).
              </li>
              <li>
                <strong>Randomization:</strong> When you click the button, a
                standard computer algorithm randomly selects one coin from this
                current list.
              </li>
              <li>
                <strong>Display:</strong> The tool then displays basic
                information about the selected coin (e.g., name, ticker, logo).
                <em>
                  Ideally, your component also provides links to reputable
                  external sources like CoinGecko/CoinMarketCap for further
                  research.
                </em>
              </li>
            </ul>
            <p>
              The selection is purely random based on the available list; there
              is no weighting or filtering based on quality, potential, or
              safety.
            </p>

            <h2 className="h3 my-4">
              How to Use This Tool <strong>Responsibly</strong>
            </h2>
            <p>
              Using this tool for entertainment is fine, but if you use it as a
              starting point for research, follow these steps{" "}
              <strong>critically</strong>:
            </p>
            <ol>
              <li>
                <strong>Generate a Coin:</strong> Click the button.
              </li>
              <li>
                <strong>Note the Details:</strong> Write down the name and
                ticker symbol.
              </li>
              <li>
                <strong>IGNORE Any Impulse to Invest:</strong> Treat the result
                as nothing more than a random name.{" "}
                <strong>Do not assume it has value or potential.</strong>
              </li>
              <li>
                <strong>Begin Independent Research (DYOR):</strong> Use
                reputable, independent sources (e.g., CoinGecko, CoinMarketCap,
                official project website, <em>not</em> just social media hype)
                to investigate:
                <ul>
                  <li>
                    <strong>Project Basics:</strong> What problem does it solve?
                    What is its use case?
                  </li>
                  <li>
                    <strong>Team & Technology:</strong> Is the team known and
                    credible? Is the technology sound?
                  </li>
                  <li>
                    <strong>Tokenomics:</strong> What is the coin&apos;s supply,
                    distribution, and utility?
                  </li>
                  <li>
                    <strong>Market Data:</strong> Check Market Cap, 24h Trading
                    Volume (is it liquid?), historical price action, and
                    exchange listings (is it on major exchanges?).
                  </li>
                  <li>
                    <strong>Community & Activity:</strong> Is there an active
                    development team and community? Check GitHub activity. Be
                    wary of pure hype.
                  </li>
                  <li>
                    <strong>Red Flags:</strong> Look for signs of potential
                    scams (anonymous team, unrealistic promises, low liquidity,
                    poor website/whitepaper).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Assess Risk:</strong> Understand that investing in{" "}
                <em>any</em>
                cryptocurrency is risky, and investing in lesser-known coins
                selected randomly is <strong>exponentially riskier</strong>.
              </li>
              <li>
                <strong>Consult an Advisor:</strong> If, after extensive
                research, you are still considering an investment, discuss it
                with a qualified financial advisor who understands your risk
                tolerance.
              </li>
            </ol>
            <p>
              Remember, the vast majority of cryptocurrencies fail or have very
              little value. Random selection does not improve your odds.
            </p>

            <div className="mb-8 rounded-lg border-4 border-red-500 bg-red-50 p-6 text-center dark:bg-red-900/20">
              <div className="mb-3 flex justify-center">
                <FaSkullCrossbones className="text-5xl text-red-600 dark:text-red-400" />
              </div>
              <strong className="mb-2 block text-xl font-bold text-red-700 dark:text-red-400">
                EXTREME RISK WARNING!
              </strong>
              <p className="m-0 text-red-700 dark:text-red-400">
                Generating a random coin does NOT mean it is safe, valuable, or
                a good investment. The crypto market contains thousands of
                coins, many with low quality, high risk, no utility, or
                potential for scams . Relying on random selection for investment
                ideas is highly dangerous and can lead to significant financial
                loss. This tool is for entertainment and education ONLY.
              </p>
            </div>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Understanding the EXTREME Risks
            </h2>
            <ul>
              <li>
                <strong>High Chance of Low Quality:</strong> Depending on the
                coin list scope, you might generate inactive projects, meme
                coins with no utility, or outright scams.
              </li>
              <li>
                <strong>Illiquidity Risk:</strong> Many smaller coins have very
                low trading volume, meaning you might not be able to sell them
                easily if you buy them.
              </li>
              <li>
                <strong>Volatility:</strong> Smaller coins can experience
                extreme price swings (both up and down) very quickly.
              </li>
              <li>
                <strong>Scams & Rug Pulls:</strong> The crypto space, especially
                outside the top established projects, is rife with scams where
                developers disappear with investors&apos; money.
              </li>
              <li>
                <strong>No Guarantee of Value:</strong> A randomly generated
                coin has no inherent guarantee of current or future value. Its
                selection by this tool is meaningless from an investment
                perspective.
              </li>
            </ul>
            <LayoutAd />
            <h2 className="h3 my-4">Frequently Asked Questions (FAQ)</h2>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Is the Random Coin Generator truly random?
                </h3>
                <p className="mb-0">
                  It uses a standard pseudo-random number generator algorithm
                  common in computing to select from the defined list (
                  {coinListScope}). For practical purposes, the selection is
                  unpredictable.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Where does the list of coins come from?
                </h3>
                <p className="mb-0">
                  The coins are selected from a list based on the{" "}
                  {coinListScope}, sourced from the {dataSource} API and updated
                  approximately {listUpdateFrequency}.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Is the coin generated by this tool a good investment?
                </h3>
                <p className="mb-0">
                  <strong>Absolutely NOT necessarily, and likely NO.</strong>{" "}
                  The selection is random and carries no implication of quality,
                  safety, or investment potential. Treat any generated coin with
                  extreme skepticism and conduct thorough independent research
                  as outlined above. Assume it is <strong>NOT</strong> a good
                  investment until proven otherwise through rigorous due
                  diligence.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  How should I research a cryptocurrency?
                </h3>
                <p className="mb-0">
                  Start by looking at reliable data aggregators (CoinGecko,
                  CoinMarketCap), read the official project website and
                  whitepaper critically, check the team&apos;s background,
                  assess tokenomics, analyze trading volume and liquidity on
                  exchanges, and review community channels and developer
                  activity. Look for independent reviews and analyses, but be
                  wary of hype. See the &apos;How to Use This Tool
                  Responsibly&apos; section for more steps.
                </p>
              </div>
              <div className="py-5">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What&apos;s the point of this tool if it&apos;s so risky?
                </h3>
                <p className="mb-0">
                  Its primary purpose is{" "}
                  <strong>entertainment and discovery</strong>. It can be a fun
                  way to stumble upon projects you might never have heard of,
                  prompting you to *learn* more about different niches within
                  the crypto space. It should <strong>never</strong> be used as
                  a shortcut for investment decisions.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
              <h2 className="h4 mb-3">
                Explore Other Crypto Tools & Resources
              </h2>
              <p>Use these tools alongside your own research:</p>
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

export default RandomCoinPage;
