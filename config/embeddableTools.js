// Tools we built ourselves and therefore allow other sites to embed.
//
// Deliberately excludes the crypto heatmap and random coin generator: those
// render third-party CoinGecko widgets, so re-publishing them as our own
// embeddable tools would be passing off someone else's work.
//
// Each embed renders at /embed/<slug> and carries a followed attribution link
// back to the canonical tool page, which is the point of offering them.

const embeddableTools = [
  {
    slug: "bitcoin-halving-countdown",
    name: "Bitcoin Halving Countdown",
    toolPath: "/tools/bitcoin-halving-countdown",
    height: 460,
  },
  {
    slug: "bitcoin-roi-calculator",
    name: "Bitcoin Investment Calculator",
    toolPath: "/tools/bitcoin-roi-calculator",
    height: 560,
  },
  {
    slug: "bitcoin-rainbow-chart",
    name: "Bitcoin Rainbow Chart",
    toolPath: "/tools/bitcoin-rainbow-chart",
    height: 620,
  },
  {
    slug: "fear-and-greed-index",
    name: "Crypto Fear & Greed Index",
    toolPath: "/tools/fear-and-greed-index",
    height: 460,
  },
  {
    slug: "staking-calculator",
    name: "Crypto Staking Calculator",
    toolPath: "/tools/staking-calculator",
    height: 520,
  },
];

export const getEmbeddableTool = (slug) =>
  embeddableTools.find((t) => t.slug === slug);

export default embeddableTools;
