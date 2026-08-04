import Link from "next/link";

const defaultTools = [
  {
    name: "Bitcoin Rainbow Chart",
    path: "/tools/bitcoin-rainbow-chart",
    description:
      "Track Bitcoin's price movements with the popular rainbow chart visualization.",
    icon: "🌈",
  },
  {
    name: "Crypto Heatmap",
    path: "/tools/crypto-heatmap",
    description:
      "Visualize cryptocurrency market performance with an interactive heatmap.",
    icon: "🔥",
  },
  {
    name: "Fear and Greed Index",
    path: "/tools/fear-and-greed-index",
    description:
      "Monitor market sentiment with the crypto fear and greed index.",
    icon: "📊",
  },
  {
    name: "Random Coin Generator",
    path: "/tools/random-coin-generator",
    description: "Generate random cryptocurrency suggestions for research.",
    icon: "🎲",
  },
  {
    name: "Staking Calculator",
    path: "/tools/staking-calculator",
    description: "Calculate potential returns from crypto staking investments.",
    icon: "💰",
  },
  {
    name: "All Crypto Tools",
    path: "/tools",
    description: "Explore the full collection of free crypto tools.",
    icon: "🧰",
  },
];

// Compact tiles rather than full cards: on the homepage these are a shortcut
// bar, not something to read, and at card size the six of them ran three
// screens deep on a phone. The description survives as the link title.
const Tools = ({ tools = defaultTools }) => {
  return (
    <div className="row justify-center">
      {tools.map((tool, i) => (
        <div className="col-4 mb-4 md:col-2" key={`tool-${i}`}>
          <Link
            href={tool.path}
            title={tool.description}
            className="card flex h-full cursor-pointer flex-col items-center justify-start gap-2 p-3 text-center"
          >
            <span className="text-3xl leading-none" aria-hidden="true">
              {tool.icon}
            </span>
            <span className="text-xs font-medium leading-tight sm:text-sm">
              {tool.name}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Tools;
