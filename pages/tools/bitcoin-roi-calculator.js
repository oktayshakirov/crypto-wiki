import React from "react";
import Base from "@layouts/Baseof";
import Link from "next/link";
import GoBackLink from "@partials/GoBackLink";
import config from "@config/config.json";
import LayoutAd from "@components/ads/LayoutAd";
import DisclaimerBanner from "@layouts/components/DisclaimerBanner";
import BitcoinRoiCalculator from "@components/BitcoinRoiCalculator";
import ExchangeFaq from "@components/ExchangeFaq";
import EmbedSnippet from "@components/EmbedSnippet";
import {
  breadcrumbSchema,
  faqSchema,
  softwareAppSchema,
} from "@lib/utils/jsonLd";

const faqs = [
  {
    question: "How does this Bitcoin investment calculator work?",
    answer:
      "Enter an amount and a past date. The calculator finds Bitcoin's closing price on that date, works out how much BTC that sum would have bought, and values that holding at the most recent daily close. It assumes a single lump-sum purchase held without selling.",
  },
  {
    question: "Does it include fees and taxes?",
    answer:
      "No. Results ignore exchange fees, spreads, withdrawal costs and any tax on gains. Real-world returns would be lower, and in some jurisdictions a disposal creates a taxable event. Treat the figures as a simplified illustration rather than a statement of what you would have kept.",
  },
  {
    question: "How far back does the price data go?",
    answer:
      "Daily price history starts in late 2012. Bitcoin traded before then, but early prices were thin and inconsistent across the few venues that existed, so calculations from that period would be unreliable.",
  },
  {
    question: "What does the annualised return (CAGR) mean?",
    answer:
      "Compound annual growth rate expresses the total return as a smoothed yearly rate. It is useful for comparing holding periods of different lengths, but it hides volatility: Bitcoin has had drawdowns of more than 70% inside periods that still show a strong CAGR.",
  },
  {
    question: "Does a past return predict future returns?",
    answer:
      "No. This tool is a historical lookup, not a forecast. Bitcoin's early returns came from an extremely small starting base that cannot repeat at its current size, and past performance is not indicative of future results. Nothing here is investment advice.",
  },
];

const RoiPage = ({ isApp }) => {
  const url = `${config.site.base_url}/tools/bitcoin-roi-calculator`;

  const jsonLd = [
    softwareAppSchema({
      name: "Bitcoin Investment Calculator",
      description:
        "Calculate what a past Bitcoin investment would be worth today, including profit, return multiple and annualised return.",
      url,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: "Bitcoin Investment Calculator", path: "/tools/bitcoin-roi-calculator" },
    ]),
    faqSchema(faqs),
  ];

  return (
    <Base
      title="Bitcoin Investment Calculator | If You Had Invested - Crypto Wiki"
      meta_title="Bitcoin Investment Calculator | If You Had Invested - Crypto Wiki"
      description="Find out what a Bitcoin investment made on any past date would be worth today. Shows profit, return multiple and annualised return, using daily prices back to 2012."
      image="/images/meta-image.png"
      canonical={url}
      isApp={isApp}
      jsonLd={jsonLd}
    >
      <section className="section pt-10">
        <div className="container">
          <GoBackLink option="tools" />
          <h1 className="h1 mb-4 text-center">Bitcoin Investment Calculator</h1>
          <p className="mb-8 text-center text-lg">
            See what a <strong>Bitcoin investment</strong> made on any past date
            would be worth today. Enter an amount and a date to get the profit
            or loss, the return multiple, and the annualised return, based on
            daily closing prices going back to 2012.
          </p>
        </div>

        <div className="container mb-8">
          <BitcoinRoiCalculator />
        </div>

        <div className="container">
          <DisclaimerBanner />

          <div className="content prose mt-8 max-w-none lg:prose-lg dark:prose-invert">
            <h2 className="h3 my-4">How the Calculation Works</h2>
            <p>
              The calculator divides your investment by Bitcoin&apos;s closing
              price on your chosen date to get a quantity of BTC, then values
              that quantity at the latest available daily close. If the exact
              date has no data, for example a gap in early history, it uses the
              nearest close before it.
            </p>
            <p>
              It models a <strong>single lump-sum purchase held to today</strong>
              . That is deliberately simple, and it is not how most people
              actually invest. Spreading purchases over time changes the outcome
              substantially, usually reducing both the best and the worst
              results.
            </p>

            <div className="container mt-5 text-center">
              {!isApp && <LayoutAd />}
            </div>

            <h2 className="h3 my-4 text-red-700 dark:text-red-500">
              ⚠️ Why Big Historical Returns Are Misleading
            </h2>
            <p>
              Bitcoin&apos;s largest returns came from a starting point where
              the entire network was worth a rounding error. Those multiples
              cannot repeat from today&apos;s market size, and quoting them says
              nothing about what happens next.
            </p>
            <ul>
              <li>
                <strong>Survivorship and hindsight:</strong> picking a date after
                the fact is easy. Nobody knew at the time which dates would look
                good.
              </li>
              <li>
                <strong>Volatility is hidden:</strong> most of these holding
                periods contain drawdowns of 50 to 80 percent. A number on this
                page does not convey what holding through that felt like.
              </li>
              <li>
                <strong>Costs are excluded:</strong> fees, spreads and tax all
                reduce real returns.
              </li>
            </ul>
            <p>
              If you are considering investing, our guides on{" "}
              <Link className="text-primary" href="/posts/crypto-volatility">
                crypto volatility
              </Link>{" "}
              and{" "}
              <Link className="text-primary" href="/posts/do-your-own-research">
                doing your own research
              </Link>{" "}
              are more useful than any historical multiple.
            </p>

            <ExchangeFaq title="Bitcoin Investment Calculator" faqs={faqs} />
          </div>

          <EmbedSnippet slug="bitcoin-roi-calculator" />

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

export default RoiPage;
