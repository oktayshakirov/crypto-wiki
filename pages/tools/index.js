import Base from "@layouts/Baseof";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import config from "@config/config.json";

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
      title="Crypto Tools: Charts, Fear and Greed Index, Calculators and more"
      meta_title="Explore Crypto Tools – Bitcoin Rainbow, Fear & Greed Index, Staking Calculator & More"
      description="Discover a comprehensive suite of crypto tools on Crypto Wiki. From Bitcoin Rainbow charts and the Fear & Greed Index to advanced staking calculators, access the insights you need to navigate the digital currency market confidently."
      image="/images/meta-image.png"
      canonical={`${config.site.base_url}/tools`}
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
