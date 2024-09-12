import React from "react";
import Base from "@layouts/Baseof";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import Heatmap from "@components/Heatmap";

const data = [
  { color: "#56ab2f", label: "Positive Price Change" },
  { color: "#e73827", label: "Negative Price Change" },
];

const CryptoHeatmapPage = () => {
  return (
    <Base title="Crypto Market Heatmap">
      <section className="section">
        <div className="container">
          <h1 className="mb-3 text-center text-2xl sm:text-3xl md:text-5xl">
            🔥 Market Heatmap 🔥
          </h1>
          <p className="mb-3 text-center">
            The Crypto Heatmap is an essential tool for tracking the real-time
            performance of various cryptocurrencies. It provides a visual
            representation of the entire crypto market, highlighting price
            movements and market sentiment.
          </p>

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
          <Heatmap />
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> The Crypto Market Heatmap provides a
              visual representation of market data for analysis purposes. It is
              not intended to serve as financial advice. Please conduct your own
              research before making investment decisions.
            </p>
          </div>

          <h2 className="h3 my-4">What is a Crypto Heatmap?</h2>
          <p>
            A crypto heatmap is a visual tool that shows the price movement and
            market sentiment of various cryptocurrencies. In this heatmap, green
            represents a positive price change, while red indicates a negative
            price change. This enables users to quickly identify which coins are
            gaining or losing value in real time.
          </p>

          <h2 className="h3 my-4">How to Use the Crypto Heatmap?</h2>
          <p>
            The crypto heatmap is designed to help traders and investors make
            informed decisions. By observing the green and red blocks, users can
            quickly assess which cryptocurrencies are performing well and which
            are experiencing declines. While green signifies growth and could
            indicate buying opportunities, red highlights declines, signaling
            caution. However, it&apos;s important to combine this with other
            analysis tools and not rely on the heatmap alone for investment
            decisions.
          </p>

          <h2 className="h3 my-4">Explore More Tools</h2>
          <p>
            Discover more resources to help you navigate the crypto market. From
            sentiment tools like the{" "}
            <Link className="text-primary" href="/tools/fear-and-greed-index">
              Fear and Greed Index
            </Link>{" "}
            to price tracking tools, like{" "}
            <Link className="text-primary" href="/tools/bitcoin-rainbow-chart">
              Bitcoin Rainbow Chart
            </Link>{" "}
            . If you&apos;re new to cryptocurrency investing, check out our
            beginner&apos;s guide on{" "}
            <Link className="text-primary" href="/how-to-buy-your-first-crypto">
              how to buy your first crypto
            </Link>
            .
          </p>
        </div>
      </section>
    </Base>
  );
};

export default CryptoHeatmapPage;
