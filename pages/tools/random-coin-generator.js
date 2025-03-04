import React from "react";
import Base from "@layouts/Baseof";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import RandomCoinGenerator from "@components/RandomCoinGenerator";
import GoBackLink from "@partials/GoBackLink";
const RandomCoinPage = () => {
  return (
    <Base title="Random Coin Generator - Find Your Next Crypto Adventure">
      <section className="section">
        <div className="container">
          <GoBackLink option="tools" />
          <h1 className="mb-3 text-center text-xl sm:text-3xl md:text-5xl">
            🎲 Random Coin Generator 🎲
          </h1>
          <p className="mb-3 text-center">
            Ready to discover new cryptocurrencies? Our Random Coin Generator
            helps you explore the diverse world of crypto by presenting you with
            a random coin each time. Whether you&apos;re doing research, looking
            for investment ideas, or just having fun, this tool is a great way
            to dive into the crypto universe!
          </p>
          <RandomCoinGenerator />
          <div className="mt-10 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> The Random Coin Generator is
              intended for entertainment and informational purposes only. It is
              not financial advice and should not be used to make investment
              decisions. Always conduct thorough research and consult a
              qualified financial advisor before making any investment choices.
            </p>
          </div>
          <h2 className="h3 my-4">What is the Random Coin Generator?</h2>
          <p>
            The Random Coin Generator is a simple yet fun way to discover new
            cryptocurrencies. With thousands of coins out there, it can be
            overwhelming to know where to start. This tool helps by presenting
            you with a random coin, which you can explore further to learn more
            about its market performance, use cases, and potential for the
            future.
          </p>
          <h2 className="h3 my-4">How to Use the Random Coin Generator?</h2>
          <p>
            It’s easy! Just click the button to generate a random cryptocurrency
            and start your journey of discovery. You can look up more
            information about the coin&apos;s market history, technology, and
            community to help you decide whether it sparks your interest. While
            it&apos;s a fun way to explore, make sure you combine it with your
            own research before making any decisions.
          </p>
          <h2 className="h3 my-4">Explore More Tools</h2>
          <p>
            If you&apos;re new to crypto, why not explore more of our tools?
            Check out the{" "}
            <Link className="text-primary" href="/tools/fear-and-greed-index">
              Fear and Greed Index
            </Link>{" "}
            to see the current sentiment of the market, or explore the{" "}
            <Link className="text-primary" href="/tools/bitcoin-rainbow-chart">
              Bitcoin Rainbow Chart
            </Link>{" "}
            to get a sense of where Bitcoin might be headed. And if you’re just
            starting out, don&apos;t miss our guide on{" "}
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

export default RandomCoinPage;
