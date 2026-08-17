import Link from "next/link";

// `label` is what the tile shows; `name` stays the full title for the tooltip
// and for anyone reading the data. The tiles are three across on a phone, which
// leaves each one about 110px wide - at that width the full names wrap to three
// lines and a six-tile bar grows taller than the posts it sits above.
const defaultTools = [
  {
    name: "Bitcoin Rainbow Chart",
    label: "Rainbow Chart",
    path: "/tools/bitcoin-rainbow-chart",
    description:
      "Track Bitcoin's price movements with the popular rainbow chart visualization.",
    icon: "🌈",
  },
  {
    name: "Crypto Heatmap",
    label: "Heatmap",
    path: "/tools/crypto-heatmap",
    description:
      "Visualize cryptocurrency market performance with an interactive heatmap.",
    icon: "🔥",
  },
  {
    name: "Fear and Greed Index",
    label: "Fear & Greed",
    path: "/tools/fear-and-greed-index",
    description:
      "Monitor market sentiment with the crypto fear and greed index.",
    icon: "📊",
  },
  {
    name: "Random Coin Generator",
    label: "Random Coin",
    path: "/tools/random-coin-generator",
    description: "Generate random cryptocurrency suggestions for research.",
    icon: "🎲",
  },
  {
    name: "Staking Calculator",
    label: "Staking Calc",
    path: "/tools/staking-calculator",
    description: "Calculate potential returns from crypto staking investments.",
    icon: "💰",
  },
  {
    name: "All Crypto Tools",
    label: "All Tools",
    path: "/tools",
    description: "Explore the full collection of free crypto tools.",
    icon: "🧰",
  },
];

// Compact tiles rather than full cards: this is a shortcut bar under the hero,
// not something to read, and at card size the six of them ran three screens
// deep on a phone. The description survives as the link title.
const Tools = ({ tools = defaultTools }) => {
  return (
    <div className="row justify-center">
      {tools.map((tool, i) => (
        <div className="col-4 mb-3 md:col-2" key={`tool-${i}`}>
          <Link
            href={tool.path}
            title={tool.description}
            // Screen readers get the full name. It contains the visible label
            // word for word, which is what WCAG 2.5.3 asks of a shortened
            // label, so speaking the tile and reading it never disagree.
            aria-label={tool.name}
            className="card flex h-full cursor-pointer flex-col items-center justify-start gap-1.5 p-2.5 text-center sm:gap-2 sm:p-3"
          >
            <span
              className="text-2xl leading-none sm:text-3xl"
              aria-hidden="true"
            >
              {tool.icon}
            </span>
            <span className="text-xs font-medium leading-tight sm:text-sm">
              {tool.label ?? tool.name}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Tools;
