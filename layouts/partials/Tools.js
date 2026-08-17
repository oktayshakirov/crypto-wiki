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
// One row on a desktop, two rows of four on a phone.
//
// Flex rather than the theme's twelve-column grid: eight across is 12.5% of a
// row, which no `col-*` can express. The widths subtract the gap so a row still
// adds up to 100%, and `justify-center` means the web's seven tiles centre
// themselves instead of leaving a hole where the eighth would be.
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
    <div className="flex flex-wrap justify-center gap-2">
      {items.map((tool, i) => (
        <div
          className="w-[calc(25%-0.5rem)] md:w-[calc(12.5%-0.5rem)]"
          key={`tool-${i}`}
        >
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
