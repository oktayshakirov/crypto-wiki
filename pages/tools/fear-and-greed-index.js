import React from "react";
import Base from "@layouts/Baseof";
import FearAndGreedIndexChart from "@components/FearAndGreedIndex";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";

const data = [
  { color: "#e73827", label: "Extreme Fear" },
  { color: "#f2c94c", label: "Fear" },
  { color: "#78ffd6", label: "Neutral" },
  { color: "#56ab2f", label: "Greed" },
];

const FearAndGreedIndexPage = () => {
  return (
    <Base
      title="Crypto Fear & Greed Index | Market Mood Tracker - Crypto Wiki"
      meta_title="Crypto Fear & Greed Index | Market Mood Tracker - Crypto Wiki"
      description="Track real-time crypto market mood with the Crypto Fear and Greed Index. Analyze emotions driving the market and enhance your trading strategy with valuable insights."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools/fear-and-greed-index`}
    >
      <section className="section">
        <div className="container ">
          <GoBackLink option="tools" />
          <h1 className="mb-3 text-center text-2xl sm:text-3xl md:text-5xl">
            📉 Fear and Greed Index 📈
          </h1>
          <p className="mb-3 text-center">
            The Fear and Greed Index is a tool that tracks market sentiment by
            analyzing various factors. The index ranges from 0 to 100, with
            lower values representing fear and higher values indicating greed.
            It provides insight into market emotions, offering a way to better
            understand current market conditions.
          </p>
          <FearAndGreedIndexChart />
          <div className="mt-2 flex flex-wrap justify-center gap-1 md:gap-4">
            {data.map((item, index) => (
              <div key={index} className="flex max-w-xs items-center">
                <div
                  style={{
                    backgroundColor: item.color,
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    marginRight: "5px",
                  }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> The Fear and Greed Index is a market
              sentiment analysis tool and is provided for informational purposes
              only. It is not intended to be used as financial or investment
              advice. Please ensure that you perform thorough research and
              consult with a qualified financial advisor before making any
              investment decisions.
            </p>
          </div>

          <h2 className="h3 my-4">What Is The Fear and Greed Index?</h2>
          <p>
            The Fear and Greed Index is designed to help investors understand
            the emotional state of the cryptocurrency market. It aggregates
            multiple factors such as volatility, market momentum, social media
            sentiment, and more to provide a single value that represents the
            overall market sentiment. A low value indicates fear, which could
            signal a buying opportunity, while a high value indicates greed,
            which might suggest a market correction.
          </p>

          <h2 className="h3 my-4">How to Use the Fear and Greed Index?</h2>
          <p>
            Investors often use the Fear and Greed Index to time their market
            entries and exits. When the index shows extreme fear, it could be a
            good time to buy, and when it shows extreme greed, it might be time
            to sell. However, this is just one of many tools and should not be
            relied upon exclusively. Always conduct thorough research and
            consider various factors before making any investment decisions.
          </p>

          <h2 className="h3 my-4">Learn More About Crypto Investing</h2>
          <p>
            If you&apos;re new to cryptocurrency investing, check out our
            beginner&apos;s guide on{" "}
            <Link
              className="text-primary"
              href="/posts/how-to-buy-your-first-crypto"
            >
              how to buy your first crypto
            </Link>
            .
          </p>
        </div>
      </section>
    </Base>
  );
};

export default FearAndGreedIndexPage;
