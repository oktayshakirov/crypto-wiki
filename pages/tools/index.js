import Base from "@layouts/Baseof";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import config from "@config/config.json";

const Tools = () => {
  const tools = [
    {
      name: "Bitcoin Rainbow Chart",
      path: "/tools/bitcoin-rainbow-chart",
      description:
        "Track Bitcoin's price movements with the popular rainbow chart visualization",
      icon: "🌈",
    },
    {
      name: "Crypto Heatmap",
      path: "/tools/crypto-heatmap",
      description:
        "Visualize cryptocurrency market performance with an interactive heatmap",
      icon: "🔥",
    },
    {
      name: "Fear and Greed Index",
      path: "/tools/fear-and-greed-index",
      description:
        "Monitor market sentiment with the crypto fear and greed index",
      icon: "📊",
    },
    {
      name: "Random Coin Generator",
      path: "/tools/random-coin-generator",
      description: "Generate random cryptocurrency suggestions for research",
      icon: "🎲",
    },
    {
      name: "Staking Calculator",
      path: "/tools/staking-calculator",
      description:
        "Calculate potential returns from crypto staking investments",
      icon: "💰",
    },
  ];

  return (
    <Base
      title="CRYPTO TOOLS: Charts, Fear and Greed Index, Calculators and more"
      meta_title="CRYPTO TOOLS – Bitcoin Rainbow, Staking Calculator, Fear & Greed Index & More"
      description="Discover a comprehensive suite of crypto tools on Crypto Wiki. From Bitcoin Rainbow charts and the Fear & Greed Index to advanced staking calculators, access the insights you need to navigate the digital currency market confidently."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools`}
    >
      <section className="section">
        <div className="container max-w-6xl">
          <div className="mb-16 text-center">
            {markdownify("CRYPTO TOOLS", "h1", "h2 mb-4")}
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Access the insights you need to navigate the digital currency
              market confidently
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <Link
                key={`tool-${i}`}
                href={tool.path}
                className="group relative overflow-hidden rounded-xl bg-gray-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-gray-700/50 dark:to-gray-600/50"></div>
                <div className="relative">
                  <div className="mb-4 text-4xl">{tool.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 p-4">
                  <svg
                    className="h-5 w-5 transform text-primary transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Base>
  );
};

export default Tools;
