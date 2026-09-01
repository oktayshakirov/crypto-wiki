import React from "react";
import Link from "next/link";

// Internal links from exchange pages into the tools section.
//
// Exchange pages previously almost never linked to /tools (4 of 25 did), even
// though queries like "crypto.com staking calculator" show real crossover
// demand. Keeps link equity flowing to the tool pages, which are the site's
// best-performing content.

const DEFAULT_TOOLS = [
  {
    href: "/tools/staking-calculator",
    label: "Staking Calculator",
    blurb: "Estimate staking rewards by amount, APY and duration",
  },
  {
    href: "/tools/crypto-heatmap",
    label: "Crypto Heatmap",
    blurb: "See live market performance at a glance",
  },
  {
    href: "/tools/fear-and-greed-index",
    label: "Fear & Greed Index",
    blurb: "Track current crypto market sentiment",
  },
  {
    href: "/tools/bitcoin-rainbow-chart",
    label: "Bitcoin Rainbow Chart",
    blurb: "Visualize BTC long-term price cycles",
  },
];

const RelatedTools = ({
  tools = DEFAULT_TOOLS,
  heading = "Free Crypto Tools",
  // The sidebar rail is ~320px wide, but `sm:` is a viewport query, not a
  // container query - inside the rail the two-column track would render a pair
  // of ~150px tiles. `compact` keeps it single-column and tightens the heading.
  compact = false,
}) => {
  if (!tools || !tools.length) return null;

  return (
    <div className={compact ? "text-start" : "mt-12 text-start"}>
      <h2
        className={
          compact
            ? "mb-3 text-sm font-bold uppercase tracking-wide opacity-70"
            : "h3 mb-4"
        }
      >
        {heading}
      </h2>
      <div
        className={`grid gap-4 ${
          compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-lg border border-gray-300 p-4 transition-colors hover:border-primary dark:border-gray-700"
          >
            <span className="block font-semibold">{tool.label}</span>
            <span className="block text-sm opacity-80">{tool.blurb}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedTools;
