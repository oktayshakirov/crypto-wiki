import React from "react";
import Base from "@layouts/Baseof";
import StakingCalculator from "@components/StakingCalculator";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";

const StakingCalculatorPage = () => {
  return (
    <Base title="Crypto Staking Calculator">
      <section className="section">
        <div className="container">
          <h1 className="mb-3 text-center text-2xl sm:text-3xl md:text-5xl">
            💰 Staking Calculator 💰
          </h1>
          <p className="mb-8 text-center">
            Easily calculate potential staking rewards from popular
            cryptocurrencies like Bitcoin, Ethereum, and more. Enter your
            staking amount, APY, and duration to find out how much you can earn
            with our accurate staking calculator.
          </p>
        </div>
        <StakingCalculator />
        <div className="container">
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>*Disclaimer:</strong> This staking calculator offers
              estimates for informational purposes only. Actual rewards may vary
              based on market conditions and the specific staking platform used.
              Always conduct thorough research and consider risks before staking
              your assets.
            </p>
          </div>
          <h2 className="h3 my-4">What is Crypto Staking?</h2>
          <p>
            Staking allows cryptocurrency holders to lock their assets in a
            blockchain network to support operations like transaction
            validation. In return, they receive staking rewards, usually paid in
            the same crypto they staked. It&apos;s a way to grow your crypto
            holdings without trading.
          </p>
          <h2 className="h3 my-4">How Does Staking Work? </h2>
          <p>
            When you stake your crypto, you contribute to network security and
            decentralization. In exchange, the network rewards you based on the
            amount you stake and the Annual Percentage Yield (APY) offered. You
            can use this calculator to estimate your staking earnings by
            entering your staking amount, APY, and duration.
          </p>
          <h2 className="h3 my-4">Why Should You Stake Crypto? </h2>
          <p>
            Staking is an excellent option for long-term holders looking to grow
            their cryptocurrency portfolio without actively trading. By staking,
            you not only support the blockchain network but also earn rewards,
            helping your crypto grow over time.
          </p>
          <h2 className="h3 my-4">How to Start Staking?</h2>
          <p>
            If you&apos;re ready to start staking your crypto, make sure to
            choose a reliable platform. Compare APY rates across different
            staking platforms to maximize your earnings. Learn more about the
            staking process in our detailed guide on{" "}
            <Link className="text-primary" href="/crypto-staking">
              what is crypto staking
            </Link>
            .
          </p>
        </div>
      </section>
    </Base>
  );
};

export default StakingCalculatorPage;
