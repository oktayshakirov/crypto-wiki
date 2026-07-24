import React from "react";
import Base from "@layouts/Baseof";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import LayoutAd from "@components/ads/LayoutAd";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";
import HalvingCountdown from "@components/HalvingCountdown";
import ExchangeFaq from "@components/ExchangeFaq";
import EmbedSnippet from "@components/EmbedSnippet";
import {
  breadcrumbSchema,
  faqSchema,
  softwareAppSchema,
} from "@lib/utils/jsonLd";

const faqs = [
  {
    question: "When is the next Bitcoin halving?",
    answer:
      "The next halving happens at block 1,050,000. Because blocks are found on average every 10 minutes rather than on a fixed schedule, the exact date moves as network hash rate changes. The countdown above projects the date from the current block height and the 10-minute target, which is why the estimate shifts slightly over time.",
  },
  {
    question: "What is the Bitcoin halving?",
    answer:
      "Every 210,000 blocks, roughly every four years, the reward paid to miners for each new block is cut in half. This is written into Bitcoin's code and is how its supply is capped at 21 million coins. The reward started at 50 BTC in 2009 and has halved at each event since.",
  },
  {
    question: "Why does the halving matter?",
    answer:
      "The halving cuts the rate at which new bitcoin enters circulation, so it reduces new supply. It also directly reduces miner revenue per block, which affects mining economics. Many people watch it as a market event, but a reduction in new supply does not guarantee a price increase, and past cycles are a small sample.",
  },
  {
    question: "How many Bitcoin halvings have there been?",
    answer:
      "Four so far: in 2012 (50 to 25 BTC), 2016 (25 to 12.5), 2020 (12.5 to 6.25) and April 2024 (6.25 to 3.125). Halvings will continue until the block reward becomes negligible, at which point miners are compensated by transaction fees alone.",
  },
  {
    question: "Does the halving happen on a specific date?",
    answer:
      "No. It triggers on a block number, not a calendar date. Any date you see, here or anywhere else, is an estimate based on how quickly blocks are currently being mined.",
  },
];

const HalvingPage = ({ isApp }) => {
  const url = `${config.site.base_url}/tools/bitcoin-halving-countdown`;

  const jsonLd = [
    softwareAppSchema({
      name: "Bitcoin Halving Countdown",
      description:
        "Live countdown to the next Bitcoin halving, with current block height, blocks remaining and the estimated date.",
      url,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: "Bitcoin Halving Countdown", path: "/tools/bitcoin-halving-countdown" },
    ]),
    faqSchema(faqs),
  ];

  return (
    <Base
      title="Bitcoin Halving Countdown | Next Halving Date & Block - Crypto Wiki"
      meta_title="Bitcoin Halving Countdown | Next Halving Date & Block - Crypto Wiki"
      description="Live Bitcoin halving countdown showing days remaining, current block height, blocks to go and the estimated halving date. Free to embed on your own site."
      image="/images/meta-image.png"
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />
          <h1 className="h1 mb-4 text-center">Bitcoin Halving Countdown</h1>
          <p className="mb-8 text-center text-lg">
            Time remaining until the next <strong>Bitcoin halving</strong>, when
            the block reward paid to miners is cut in half. The countdown is
            driven by the live block height, because the halving triggers on a
            block number rather than a calendar date.
          </p>
        </div>

        <div className="container mb-8">
          <HalvingCountdown />
        </div>

        <div className="container">
          <DisclaimerBanner />

          <div className="content prose mt-8 max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">What Is the Bitcoin Halving?</h2>
            <p>
              Bitcoin pays miners a reward for each block they add to the
              chain. Every <strong>210,000 blocks</strong>, roughly every four
              years, that reward is cut in half. This schedule is fixed in
              Bitcoin&apos;s code and is the mechanism that caps total supply at
              21 million coins.
            </p>
            <p>
              The reward began at 50 BTC per block in 2009 and has since fallen
              to 3.125 BTC at the April 2024 halving. Learn more about how new
              coins are created in our guide to{" "}
              <Link className="text-primary" href="/posts/what-is-proof-of-work">
                Proof-of-Work
              </Link>
              , and about the wider supply question in{" "}
              <Link
                className="text-primary"
                href="/posts/who-controls-bitcoins-price"
              >
                who controls Bitcoin&apos;s price
              </Link>
              .
            </p>

            <div className="container mt-5 text-center">
              {!isApp && <LayoutAd />}
            </div>

            <h2 className="h3 my-4">Every Bitcoin Halving So Far</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Halving</th>
                    <th>Block</th>
                    <th>Date</th>
                    <th>Reward</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Genesis</td><td>0</td><td>January 2009</td><td>50 BTC</td></tr>
                  <tr><td>First</td><td>210,000</td><td>November 2012</td><td>25 BTC</td></tr>
                  <tr><td>Second</td><td>420,000</td><td>July 2016</td><td>12.5 BTC</td></tr>
                  <tr><td>Third</td><td>630,000</td><td>May 2020</td><td>6.25 BTC</td></tr>
                  <tr><td>Fourth</td><td>840,000</td><td>April 2024</td><td>3.125 BTC</td></tr>
                  <tr><td>Fifth</td><td>1,050,000</td><td>Estimated 2028</td><td>1.5625 BTC</td></tr>
                </tbody>
              </table>
            </div>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ A Note on Halving Price Predictions
            </h2>
            <p>
              The halving reduces the rate of new supply, and it is often
              discussed as a bullish catalyst. Treat that claim carefully.
              There have only been four halvings, which is far too small a
              sample to establish a pattern, and each occurred under very
              different market conditions. The halving is a known, scheduled
              event, so its effects may already be reflected in the price. It
              guarantees nothing about future returns.
            </p>

            <ExchangeFaq title="Bitcoin Halving" faqs={faqs} />
          </div>

          <EmbedSnippet slug="bitcoin-halving-countdown" />

          <div className="mt-10 text-center">
            <Link href="/tools" className="btn btn-primary">
              View All Tools
            </Link>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default HalvingPage;
