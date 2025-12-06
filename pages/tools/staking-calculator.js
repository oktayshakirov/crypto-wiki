import React from "react";
import Base from "@layouts/Baseof";
import StakingCalculator from "@components/StakingCalculator";
import { FaExclamationTriangle } from "react-icons/fa";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import LayoutAd from "@components/ads/LayoutAd";

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

const StakingCalculatorPage = ({ isApp }) => {
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

  return (
    <Base
      title="Crypto Staking Calculator | Estimate Potential Rewards - Crypto Wiki"
      meta_title="Crypto Staking Calculator | Estimate Potential Rewards - Crypto Wiki"
      description="Estimate potential crypto staking rewards based on your amount, estimated APY, and duration. Understand risks & APY variability. For informational purposes only."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools/staking-calculator`}
      dateModified={lastUpdated}
      author={author.name}
      isApp={isApp}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />

          <h1 className="h1 mb-4 text-center">Crypto Staking Calculator</h1>

          <p className="mb-8 text-center text-lg">
            Estimate potential earnings from staking Proof-of-Stake (PoS)
            cryptocurrencies like Ethereum (ETH), Cardano (ADA), Solana (SOL),
            and others. Enter your staking amount, the{" "}
            <strong>estimated Annual Percentage Yield (APY)</strong>, and
            staking duration below. Remember, APYs are variable and rewards are
            estimates.
          </p>
        </div>

        <div className="container mb-6">
          <h2 className="h3 mb-3 text-center">
            Calculate Your Estimated Rewards
          </h2>
          <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your details below. Find the estimated APY on your chosen
            staking platform or validator&apos;s official page.
          </p>
          <StakingCalculator />
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Results are estimates. Last page update: {lastUpdated}.
          </p>
        </div>

        <div className="container">
          <div className="mt-5 rounded-lg border-2 border-orange-400 p-6 text-center">
            <div className="mb-2 flex justify-center">
              <FaExclamationTriangle className="text-4xl text-orange-400" />
            </div>
            <p className="m-0">
              <strong>
                *Disclaimer: Estimates Only, Not Financial Advice.
              </strong>{" "}
              This calculator provides <strong>estimates</strong> based on the
              inputs you provide.{" "}
              <strong>Actual staking rewards are NOT guaranteed</strong> and can
              vary significantly due to factors like network conditions,
              validator performance, slashing penalties, changes in APY, and the
              specific terms of your staking provider. Figures shown do not
              account for potential fees, taxes, or impermanent loss (if
              applicable). Staking involves risks. Always conduct thorough
              research (DYOR) and consult a qualified financial advisor before
              staking assets.
            </p>
          </div>

          <div className="content prose mt-8 max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">What is Crypto Staking?</h2>
            <p>
              Crypto staking is the process of participating in transaction
              validation on a Proof-of-Stake (PoS) blockchain. Unlike
              Proof-of-Work (used by Bitcoin) which requires mining hardware,
              PoS networks rely on participants locking up (staking) their
              cryptocurrency holdings to help secure the network and validate
              new blocks.
            </p>
            <p>
              By staking your coins, you essentially act as a validator (or
              delegate your coins to a validator). In return for contributing to
              the network&apos;s security and operation, you receive staking
              rewards, typically paid out in the same cryptocurrency you staked.
              It&apos;s a way to potentially earn passive income on your crypto
              holdings. Learn more in our guide:{" "}
              <Link className="text-primary" href="/posts/crypto-staking">
                What is Crypto Staking?
              </Link>
            </p>
            <div className="container mt-5 text-center">
              {!isApp && <LayoutAd />}
            </div>
            <h2 className="h3 my-4">
              How Staking Rewards Work & APY Explained
            </h2>
            <p>
              Staking rewards generally come from the network&apos;s inflation
              (new coins being created) and sometimes a portion of transaction
              fees. The amount you earn is often expressed as an{" "}
              <strong>Annual Percentage Yield (APY)</strong>.
            </p>
            <ul>
              <li>
                <strong>APY vs. APR:</strong> APY includes the effect of
                compounding (earning rewards on your previously earned rewards),
                while Annual Percentage Rate (APR) usually does not. Be sure
                which figure your platform provides when inputting into
                calculators.
              </li>
              <li>
                <strong>Variability:</strong> Staking APYs are{" "}
                <strong>highly variable</strong> and not fixed interest rates.
                They depend on factors like the total amount of crypto staked on
                the network (more staked often means lower APY per participant),
                the network&apos;s reward schedule, validator uptime, and
                sometimes the price of the crypto itself.
              </li>
              <li>
                <strong>Finding APY:</strong> Look for the{" "}
                <strong>current estimated APY</strong> provided by the specific
                staking pool, validator, or platform (like an exchange) you plan
                to use. Be cautious of unusually high advertised rates, as they
                might carry higher risks.
              </li>
            </ul>

            <h2 className="h3 my-4">
              How Does This Calculator Estimate Rewards?
            </h2>
            <p>
              This tool uses the information you provide (Amount Staked,
              Estimated APY, Staking Duration) to calculate the potential growth
              of your staked assets. It applies the provided APY using a
              standard calculation method (often assuming some level of
              compounding, though the exact method can vary between
              calculators).
            </p>
            <p className="font-bold">Input Guidance:</p>
            <ul>
              <li>
                <strong>Staking Amount:</strong> The number of coins you plan to
                stake.
              </li>
              <li>
                <strong>Estimated APY (%):</strong> The{" "}
                <strong>current Annual Percentage Yield</strong> advertised by
                your chosen validator or platform. Remember this is an estimate
                and can change. Input it as a percentage (e.g., enter
                &apos;5&apos; for 5%).
              </li>
              <li>
                <strong>Staking Duration:</strong> How long you plan to keep
                your coins staked (e.g., 1 year, 180 days).
              </li>
            </ul>
            <p>
              The calculator outputs an *estimated* total number of coins and
              the *estimated* rewards earned over that period, based purely on
              these inputs.
            </p>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Understanding the Risks of Staking
            </h2>
            <p>
              Staking is not risk-free. Before locking up your assets,
              understand the potential downsides:
            </p>
            <ul>
              <li>
                <strong>Market Risk:</strong> The price of the cryptocurrency
                you are staking could decrease significantly, potentially
                outweighing any staking rewards earned when measured in fiat
                currency (like USD or EUR).
              </li>
              <li>
                <strong>Lock-up Periods:</strong> Many staking protocols require
                you to lock your funds for a specific duration (days, weeks, or
                months). During this time, you cannot withdraw or sell your
                staked assets, even if the market price drops dramatically.
              </li>
              <li>
                <strong>Slashing Penalties:</strong> If the validator you stake
                with misbehaves (e.g., goes offline for too long, validates
                fraudulent transactions), the network can penalize them by
                destroying (&quot;slashing&quot;) a portion of their staked
                coins, including yours if you delegated to them.
              </li>
              <li>
                <strong>APY Volatility:</strong> As mentioned, the APY is not
                guaranteed. It can decrease due to various network factors,
                meaning your actual rewards might be lower than estimated.
              </li>
              <li>
                <strong>Platform/Custodian Risk:</strong> If you stake through
                an exchange or third-party platform, you are exposed to their
                security risks (hacks) and counterparty risk (insolvency).
                &quot;Not your keys, not your coins&quot; applies.
              </li>
              <li>
                <strong>Smart Contract Risk:</strong> Staking often involves
                interacting with smart contracts, which could potentially have
                bugs or vulnerabilities that could be exploited, leading to loss
                of funds.
              </li>
              <li>
                <strong>Technical Complexity:</strong> Staking directly often
                requires some technical understanding. Incorrect setup could
                lead to missed rewards or even slashing.
              </li>
            </ul>
            <p>
              Always weigh the potential rewards against these significant
              risks.
            </p>
            <div className="container mt-5 text-center">
              {!isApp && <LayoutAd />}
            </div>
            <h2 className="h3 my-4">Frequently Asked Questions (FAQ)</h2>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Are the staking rewards shown by the calculator guaranteed?
                </h3>
                <p className="mb-0">
                  <strong>No, absolutely not.</strong> The results are purely
                  mathematical estimates based on the APY you enter. Actual
                  rewards depend heavily on real-time network conditions,
                  validator performance, and potential changes in the APY
                  itself. They can be higher or lower than the estimate.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Where can I find the correct APY to enter?
                </h3>
                <p className="mb-0">
                  You need to find the <strong>current estimated APY</strong>{" "}
                  offered by the specific staking method you plan to use. Check
                  the official website of the validator, staking pool, liquid
                  staking protocol, or cryptocurrency exchange you intend to
                  stake with. Compare rates, but be cautious of rates that seem
                  too good to be true.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What are the main risks of staking crypto?
                </h3>
                <p className="mb-0">
                  Key risks include the potential decrease in the staked
                  asset&apos;s price (market risk), inability to access funds
                  during lock-up periods, loss of funds due to validator
                  slashing, variable APY, platform security/counterparty risks,
                  and smart contract vulnerabilities. See the
                  &apos;Understanding the Risks&apos; section above.
                </p>
              </div>
              <div className="border-b border-gray-200 py-5 dark:border-gray-700">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  What&apos;s the difference between APY and APR in staking?
                </h3>
                <p className="mb-0">
                  APR (Annual Percentage Rate) typically represents the simple
                  interest rate earned over a year. APY (Annual Percentage
                  Yield) usually accounts for the effect of compounding (earning
                  interest on interest). APY will generally be slightly higher
                  than APR if rewards are compounded frequently. Ensure you know
                  which figure you are inputting.
                </p>
              </div>
              <div className="py-5">
                <h3 className="h4 mb-2 mt-0 font-semibold">
                  Can I lose my staked crypto?
                </h3>
                <p className="mb-0">
                  <strong>Yes.</strong> While staking aims to generate rewards,
                  you can lose principal due to slashing penalties if your
                  chosen validator misbehaves. You can also effectively lose
                  value if the market price of the staked asset drops
                  significantly. Additionally, platform hacks or smart contract
                  bugs could lead to losses.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center dark:border-gray-700">
              <h2 className="h4 mb-3">Explore More Crypto Resources</h2>
              <p>Learn more about crypto and related tools:</p>
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

export default StakingCalculatorPage;
