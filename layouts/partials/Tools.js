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
    description:
      "Calculate potential returns from crypto staking investments.",
    icon: "💰",
  },
  {
    name: "All Crypto Tools",
    path: "/tools",
    description:
      "Browse every tool, including the Bitcoin halving countdown and investment calculator.",
    icon: "🧰",
  },
];

const Tools = ({ tools = defaultTools }) => {
  return (
    <div className="row">
      {tools.map((tool, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`tool-${i}`}>
          <Link
            href={tool.path}
            className="card flex h-full cursor-pointer flex-col justify-between"
          >
            <div className="mb-4 flex h-36 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-black/20 to-transparent">
              <span className="text-6xl">{tool.icon}</span>
            </div>
            <h3 className="h4 mb-2 text-center">{tool.name}</h3>
            <p>{tool.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Tools;
