import Link from "next/link";

// `label` is what the tile shows; `name` stays the full title for the tooltip
// and the accessible name. The tiles are three across on a phone, which leaves
// each one about 110px wide - at that width the full names wrap to three lines
// and the bar grows taller than the posts it sits above.
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
    name: "Bitcoin Halving Countdown",
    label: "Halving",
    path: "/tools/bitcoin-halving-countdown",
    description: "Count down to the next Bitcoin halving, block by block.",
    icon: "⏳",
  },
  {
    name: "Bitcoin Investment Calculator",
    label: "ROI Calc",
    path: "/tools/bitcoin-roi-calculator",
    description:
      "Work out what a Bitcoin investment would be worth if you had bought earlier.",
    icon: "📈",
  },
  {
    name: "Staking Calculator",
    label: "Staking Calc",
    path: "/tools/staking-calculator",
    description: "Calculate potential returns from crypto staking investments.",
    icon: "💰",
  },
  {
    name: "Random Coin Generator",
    label: "Random Coin",
    path: "/tools/random-coin-generator",
    description: "Generate random cryptocurrency suggestions for research.",
    icon: "🎲",
  },
  // Every tool is on this row already, so this is not a way in - it is the
  // page that describes them, and the only link the home page gives /tools.
  // It also makes the counts land: eight tiles on the web, nine in the apps.
  {
    name: "All Crypto Tools",
    label: "All Tools",
    path: "/tools",
    description: "Explore the full collection of free crypto tools.",
    icon: "🧰",
  },
];

// There is no web portfolio, so this tile exists only in the apps. It carries no
// usable href: the app answers the NAVIGATE message by pushing its own native
// screen, the same handshake /tools already uses.
const portfolioTool = {
  name: "Portfolio Tracker",
  label: "Portfolio",
  path: "/portfolio",
  description: "Track the real-time value and performance of all your assets.",
  icon: "💼",
  isAppOnly: true,
};

// Compact tiles rather than full cards: this is a shortcut bar under the hero,
// not something to read, and at card size they ran three screens deep on a
// phone. The description survives as the link title.
//
// Four across on a desktop and three on a phone, which is what the counts are
// built around: the web's eight tiles fill two desktop rows exactly, and the
// apps' nine - the portfolio tile makes the ninth - fill three phone rows,
// which is the only shape an app is ever seen in.
const Tools = ({ tools, isApp = false }) => {
  const items = tools ?? (isApp ? [portfolioTool, ...defaultTools] : defaultTools);

  const handleClick = (tool) => (event) => {
    if (!tool.isAppOnly) return;
    event.preventDefault();
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "NAVIGATE", path: tool.path })
    );
  };

  return (
    <div className="row justify-center">
      {items.map((tool, i) => (
        <div className="col-4 mb-3 md:col-3" key={`tool-${i}`}>
          <Link
            href={tool.path}
            title={tool.description}
            onClick={handleClick(tool)}
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
