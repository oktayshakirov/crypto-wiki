import React from "react";
import Base from "@layouts/Baseof";
import BitcoinRainbowChart from "@components/BitcoinRainbowChart";

const BitcoinRainbowChartPage = () => {
  return (
    <Base title="Bitcoin Rainbow Chart">
      <section className="section">
        <div className="container text-center">
          <h1 className="h2 mb-3">🌈 Bitcoin Rainbow Chart 🌈</h1>
          <p>
            The Rainbow Chart is like the ultimate crystal ball for Bitcoin
            prices. It uses a fancy, ever-growing curve to give you a colorful
            sneak peek into where BTC might be headed in the future. It’s the
            tool that makes price predictions look like a vibrant adventure!
          </p>
          <BitcoinRainbowChart />
          <p>
            <strong>*Disclaimer:</strong> The Rainbow Chart is not investment
            advice! It&apos;s just a fun, colorful way to think about long-term
            Bitcoin price trends, ignoring the daily ups and downs. So, enjoy
            the rainbow, but don’t bet your life savings on it!
          </p>
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
        </div>
      </section>
    </Base>
  );
};

export default BitcoinRainbowChartPage;
