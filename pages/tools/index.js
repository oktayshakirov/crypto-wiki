import Base from "@layouts/Baseof";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";

const Tools = () => {
  const tools = [
    {
      name: "Bitcoin Rainbow Chart",
      path: "/tools/bitcoin-rainbow-chart",
    },
    {
      name: "Crypto Heatmap",
      path: "/tools/crypto-heatmap",
    },
    {
      name: "Fear and Greed Index",
      path: "/tools/fear-and-greed-index",
    },
    {
      name: "Random Coin Generator",
      path: "/tools/random-coin-generator",
    },
    {
      name: "Staking Calculator",
      path: "/tools/staking-calculator",
    },
  ];

  return (
    <Base
      title={"Crypto Tools: Charts, Fear and Greed Index, Calculators and more"}
    >
      <section className="section">
        <div className="container max-w-6xl text-center">
          {markdownify("TOOLS", "h1", "h2 mb-16")}
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {tools.map((tool, i) => (
              <li key={`tool-${i}`} className="mb-4">
                <Link
                  href={tool.path}
                  className="btn-categories flex w-full items-center justify-center px-8 py-10 text-2xl font-semibold"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Base>
  );
};

export default Tools;
