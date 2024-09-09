import React from "react";
import Base from "@layouts/Baseof";
import BitcoinRainbowChart from "@components/BitcoinRainbowChart";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

const BitcoinRainbowChartPage = () => {
  return (
    <Base title="Bitcoin Rainbow Chart">
      <section className="section">
        <div className="container">
          <h1 className="mb-3 text-center text-2xl sm:text-3xl md:text-5xl">
            🌈 Bitcoin Rainbow Chart 🌈
          </h1>
          <p className="mb-3 text-center">
            The Rainbow Chart is like the ultimate crystal ball for Bitcoin
            prices. It uses a sophisticated, ever-growing curve to give you a
            colorful sneak peek into where BTC might be headed in the future.
          </p>
        </div>

        <div className="lg:mx-28">
          <BitcoinRainbowChart />
        </div>

        <div className="container">
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> The Rainbow Chart is not investment
              advice! It&apos;s just a fun, colorful way to think about
              long-term Bitcoin price trends, ignoring the daily ups and downs.
              So, enjoy the rainbow, but don’t bet your life savings on it!
            </p>
          </div>

          <h2 className="h3 my-4">What Is The Bitcoin Rainbow Chart?</h2>
          <p>
            The Rainbow Chart is a long-term valuation tool designed to give you
            an idea of where Bitcoin might be headed. It uses a logarithmic
            growth curve, which basically means it expects Bitcoin’s price to
            grow steadily over time, rather than in a straight line. The chart
            overlays rainbow-colored bands on top of this growth curve, with
            each color representing different levels of market sentiment. As
            Bitcoin’s price moves through these colorful stages, the chart
            attempts to highlight potential opportunities to buy or sell. It’s a
            colorful way of seeing market emotions in action! But remember, this
            is for educational and entertainment purposes only. Just because
            Bitcoin has followed the rainbow pattern so far, doesn’t mean it
            will in the future. So, take it with a grain of salt—or a pot of
            gold, if you’re lucky!
          </p>

          <h2 className="h3 my-4">What Is Bitcoin?</h2>
          <p>
            Bitcoin is the first and most well-known cryptocurrency, created to
            provide a decentralized form of digital money. It has revolutionized
            the way we think about money by allowing peer-to-peer transactions
            without the need for a central authority. To dive deeper into what
            Bitcoin is and how it works, check out our detailed guide on{" "}
            <Link className="text-primary" href="/what-is-bitcoin">
              What is Bitcoin?
            </Link>
            .
          </p>
          <h2 className="h3 my-4">How to invest in Bitcoin?</h2>
          <p>
            If you&apos;re new to the world of cryptocurrencies and want to
            start your journey, we have a beginner-friendly guide on{" "}
            <Link className="text-primary" href="/how-to-buy-your-first-crypto">
              how to buy your first crypto
            </Link>
            . This guide will walk you through the steps to get started safely
            and securely. Once you&apos;re ready to buy Bitcoin, be sure to
            check out our list of{" "}
            <Link className="text-primary" href="/exchanges">
              trusted exchanges
            </Link>{" "}
            to find the best and most secure platforms for your transactions.
          </p>
        </div>
      </section>
    </Base>
  );
};

export default BitcoinRainbowChartPage;
