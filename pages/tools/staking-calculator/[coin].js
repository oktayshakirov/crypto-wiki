import React from "react";
import Base from "@layouts/Baseof";
import StakingCalculator from "@components/StakingCalculator";
import ExchangeFaq from "@components/ExchangeFaq";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import LayoutAd from "@components/ads/LayoutAd";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";
import stakingCoins, { getStakingCoin } from "@config/stakingCoins";
import {
  breadcrumbSchema,
  faqSchema,
  softwareAppSchema,
} from "@lib/utils/jsonLd";

const buildFaqs = (coin) => [
  {
    question: `What is the current ${coin.name} (${coin.symbol}) staking APY?`,
    answer: `${coin.name} staking yields are typically in the range of ${coin.apyRange}, but this is an estimate that changes constantly. The actual rate depends on how much ${coin.symbol} is staked network-wide, validator performance and commission, and the network's reward schedule. Always check the live rate on your chosen validator or platform and enter it into the calculator above.`,
  },
  {
    question: `How much can I earn staking ${coin.name}?`,
    answer: `Your rewards depend on how much ${coin.symbol} you stake, the APY at the time, and how long you stake for. Enter your amount and an up-to-date APY into the calculator above to see an estimate. Remember the result is an estimate only and does not account for price changes in ${coin.symbol}.`,
  },
  {
    question: `Is there a lock-up period when staking ${coin.symbol}?`,
    answer: coin.lockup,
  },
  {
    question: `Is staking ${coin.name} safe?`,
    answer: `Staking ${coin.name} carries real risks: the ${coin.symbol} price can fall while your funds are staked or unbonding, validators can be slashed for misbehaviour, and staking through an exchange or third party adds custodial and smart-contract risk. Staking rewards do not guarantee a profit. Never stake more than you can afford to lock up and potentially lose.`,
  },
];

const StakingCoinPage = ({ coin, isApp }) => {
  const author = { name: "Oktay Shakirov", profileUrl: "/authors/oktay-shakirov" };

  const today = new Date();
  const lastUpdated = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const url = `${config.site.base_url}/tools/staking-calculator/${coin.slug}`;
  const pageTitle = `${coin.name} (${coin.symbol}) Staking Calculator`;
  const faqs = buildFaqs(coin);

  const jsonLd = [
    softwareAppSchema({
      name: pageTitle,
      description: `Estimate potential ${coin.name} (${coin.symbol}) staking rewards based on your amount, APY, and duration.`,
      url,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: "Staking Calculator", path: "/tools/staking-calculator" },
      { name: `${coin.symbol} Staking`, path: `/tools/staking-calculator/${coin.slug}` },
    ]),
    faqSchema(faqs),
  ];

  const otherCoins = stakingCoins.filter((c) => c.slug !== coin.slug);

  return (
    <Base
      title={`${pageTitle} | Estimate Rewards - Crypto Wiki`}
      meta_title={`${pageTitle} | Estimate Rewards - Crypto Wiki`}
      description={`Free ${coin.name} (${coin.symbol}) staking calculator. Estimate your potential ${coin.symbol} staking rewards by amount, APY, and duration. Typical APY around ${coin.apyRange}. Rewards are estimates, not guarantees.`}
      image="/images/meta-image.png"
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />

          <h1 className="h1 mb-4 text-center">{pageTitle}</h1>

          <p className="mb-6 text-center text-lg">
            Estimate your potential rewards from staking{" "}
            <strong>
              {coin.name} ({coin.symbol})
            </strong>
            . Typical {coin.symbol} staking yields are around{" "}
            <strong>{coin.apyRange}</strong>, but rates are variable — the
            calculator is pre-filled with an estimate you should replace with the
            live APY from your validator or platform.
          </p>
        </div>

        <div className="container mb-6">
          <h2 className="h3 mb-3 text-center">
            Estimate Your {coin.symbol} Staking Rewards
          </h2>
          <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Pre-filled with a typical APY of {coin.apy}%. Adjust it to match the
            current rate offered by your chosen validator or platform.
          </p>
          <StakingCalculator defaultApy={coin.apy} defaultUnit="tokens" />
          <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Results are estimates. Last page update: {lastUpdated}.
          </p>
        </div>

        <div className="container">
          <DisclaimerBanner />

          <div className="content prose mt-8 max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">About Staking {coin.name}</h2>
            <p>{coin.intro}</p>

            <h2 className="h3 my-4">
              {coin.name} Staking: APY and Lock-Up at a Glance
            </h2>
            <ul>
              <li>
                <strong>Typical APY:</strong> {coin.apyRange} (variable — always
                verify the live rate)
              </li>
              <li>
                <strong>Lock-up / unbonding:</strong> {coin.lockup}
              </li>
              <li>
                <strong>Reward type:</strong> Paid in {coin.symbol}, so your fiat
                value still depends on the {coin.symbol} price.
              </li>
            </ul>

            <div className="container mt-5 text-center">
              {!isApp && <LayoutAd />}
            </div>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Risks of Staking {coin.name}
            </h2>
            <p>
              Staking is not a savings account. Before staking {coin.symbol},
              understand the downsides: the market price can drop while your
              funds are locked or unbonding; validators can be{" "}
              <strong>slashed</strong> for downtime or misbehaviour, costing you
              part of your stake; APY is variable and not guaranteed; and staking
              through an exchange or protocol adds custodial and smart-contract
              risk. Learn more in our guide on{" "}
              <Link className="text-primary" href="/posts/crypto-staking">
                what crypto staking is
              </Link>
              .
            </p>

            <ExchangeFaq title={`${coin.name} Staking`} faqs={faqs} />

            <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-700">
              <h2 className="h4 mb-3 text-center">
                Staking Calculators for Other Coins
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {otherCoins.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tools/staking-calculator/${c.slug}`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary dark:border-gray-700"
                  >
                    {c.name} ({c.symbol})
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/tools/staking-calculator" className="btn btn-primary">
                  General Staking Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export const getStaticPaths = () => ({
  paths: stakingCoins.map((coin) => ({ params: { coin: coin.slug } })),
  fallback: false,
});

export const getStaticProps = ({ params }) => {
  const coin = getStakingCoin(params.coin);
  if (!coin) {
    return { notFound: true };
  }
  return { props: { coin } };
};

export default StakingCoinPage;
