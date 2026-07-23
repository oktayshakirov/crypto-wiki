// Data for per-coin staking calculator pages (/tools/staking-calculator/[coin]).
//
// `apy` is a representative, approximate figure used only to pre-fill the
// calculator — real staking yields are variable and change constantly. Every
// page states clearly that the number is an editable estimate, not a promise.
// Coin selection is driven by real Search Console demand ("<coin> staking
// calculator") plus the most widely staked Proof-of-Stake networks.

const stakingCoins = [
  {
    slug: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    apy: 3.2,
    apyRange: "3% – 5%",
    lockup:
      "No fixed lock-up, but stake and withdrawals pass through a network entry/exit queue that can take days when demand is high.",
    intro:
      "Ethereum moved to Proof-of-Stake with The Merge in 2022. You can stake by running a validator (32 ETH), joining a staking pool, or using a liquid staking token. Yields come from issuance plus priority fees and are shared across all validators, so they drift down as more ETH is staked.",
  },
  {
    slug: "solana",
    name: "Solana",
    symbol: "SOL",
    apy: 7,
    apyRange: "6% – 8%",
    lockup:
      "Stake is delegated to a validator and unbonds at the end of an epoch (roughly 2–3 days).",
    intro:
      "Solana staking is done by delegating SOL to a validator directly from most wallets. Rewards depend on validator performance and commission, and the network's inflation schedule gradually decreases over time.",
  },
  {
    slug: "cardano",
    name: "Cardano",
    symbol: "ADA",
    apy: 3,
    apyRange: "2.5% – 4%",
    lockup:
      "None. ADA never leaves your wallet and stays fully liquid while delegated.",
    intro:
      "Cardano uses the Ouroboros Proof-of-Stake protocol. You delegate ADA to a stake pool without locking or transferring it, and rewards are distributed every epoch (about 5 days).",
  },
  {
    slug: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    apy: 11,
    apyRange: "10% – 14%",
    lockup: "28-day unbonding period before staked DOT becomes transferable.",
    intro:
      "Polkadot uses Nominated Proof-of-Stake, where you nominate trusted validators with your DOT. Rewards are competitive but the 28-day unbonding period means your funds are illiquid while unstaking.",
  },
  {
    slug: "cosmos",
    name: "Cosmos",
    symbol: "ATOM",
    apy: 15,
    apyRange: "13% – 19%",
    lockup: "21-day unbonding period during which no rewards accrue.",
    intro:
      "Cosmos (ATOM) is secured by delegators who bond tokens to validators. Headline APY is high, but it is partly offset by ATOM's inflation, and the 21-day unbonding period locks your funds while unstaking.",
  },
  {
    slug: "polygon",
    name: "Polygon",
    symbol: "POL",
    apy: 4,
    apyRange: "3% – 5%",
    lockup:
      "Short unbonding period (typically a few days) after you unstake from a validator.",
    intro:
      "Polygon's POL token (formerly MATIC) is staked to validators that secure the network. Staking is done through the official staking interface, and rewards come from network emissions and fees.",
  },
  {
    slug: "tezos",
    name: "Tezos",
    symbol: "XTZ",
    apy: 6,
    apyRange: "5% – 7%",
    lockup:
      "No hard lock-up when delegating; rewards begin after a short activation delay of a few cycles.",
    intro:
      "Tezos calls its staking 'baking'. Most holders delegate XTZ to a baker without giving up custody, and rewards are paid in XTZ roughly every few days once activated.",
  },
  {
    slug: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    apy: 7,
    apyRange: "6% – 9%",
    lockup:
      "Chosen at staking time — a minimum of about 2 weeks, up to 1 year. Funds are fully locked for that duration.",
    intro:
      "Avalanche lets you stake AVAX to a validator for a fixed period you choose. Longer commitments earn more, but your AVAX is completely locked until the staking term ends.",
  },
  {
    slug: "near",
    name: "NEAR Protocol",
    symbol: "NEAR",
    apy: 8,
    apyRange: "7% – 10%",
    lockup: "Unstaking takes roughly 2–3 days (a few epochs) to complete.",
    intro:
      "NEAR uses Proof-of-Stake with validator delegation. Rewards target a set annual inflation rate that is partly offset by burned transaction fees.",
  },
  {
    slug: "algorand",
    name: "Algorand",
    symbol: "ALGO",
    apy: 5,
    apyRange: "4% – 7%",
    lockup:
      "Flexible. ALGO staking rewards are earned through participation and governance without a hard lock-up.",
    intro:
      "Algorand uses Pure Proof-of-Stake. Rewards are tied to network participation and periodic governance programs, and ALGO generally stays liquid.",
  },
  {
    slug: "tron",
    name: "TRON",
    symbol: "TRX",
    apy: 4,
    apyRange: "3% – 6%",
    lockup: "14-day unfreeze period after you unstake TRX.",
    intro:
      "TRON staking involves freezing TRX to gain resources and vote for Super Representatives, who share block rewards with voters.",
  },
  {
    slug: "sui",
    name: "Sui",
    symbol: "SUI",
    apy: 2.5,
    apyRange: "2% – 4%",
    lockup: "Stake unbonds at the end of the current epoch (about 24 hours).",
    intro:
      "Sui uses a delegated Proof-of-Stake model. You delegate SUI to a validator, and rewards are distributed each epoch based on validator performance.",
  },
  {
    slug: "aptos",
    name: "Aptos",
    symbol: "APT",
    apy: 7,
    apyRange: "6% – 8%",
    lockup:
      "Stake follows a lock-up cycle (around 30 days) after which you can unlock and withdraw.",
    intro:
      "Aptos secures its network with delegated staking. Rewards accrue each epoch, and unlocking follows a recurring lock-up cycle set by the protocol.",
  },
  {
    slug: "injective",
    name: "Injective",
    symbol: "INJ",
    apy: 10,
    apyRange: "9% – 13%",
    lockup: "21-day unbonding period, standard for Cosmos-based chains.",
    intro:
      "Injective (INJ) is a Cosmos-SDK chain, so staking works through validator delegation with a 21-day unbonding period. INJ also has a burn mechanism that can offset inflation.",
  },
  {
    slug: "celestia",
    name: "Celestia",
    symbol: "TIA",
    apy: 12,
    apyRange: "10% – 15%",
    lockup: "21-day unbonding period.",
    intro:
      "Celestia (TIA) is a modular data-availability network built with the Cosmos SDK. Staking is done by delegating TIA to validators, with a 21-day unbonding period.",
  },
  {
    slug: "zilliqa",
    name: "Zilliqa",
    symbol: "ZIL",
    apy: 5,
    apyRange: "4% – 7%",
    lockup:
      "Short unbonding period (typically around 2 weeks) after unstaking from a validator.",
    intro:
      "Zilliqa (ZIL) offers staking through validators and its official staking portal. Rewards come from block rewards shared with delegators.",
  },
  {
    slug: "icon",
    name: "ICON",
    symbol: "ICX",
    apy: 7,
    apyRange: "6% – 9%",
    lockup:
      "Unstaking period scales with network conditions and can take up to around 20 days.",
    intro:
      "ICON (ICX) uses delegated Proof-of-Contribution. You vote for P-Reps (representatives) with staked ICX and earn rewards for participating.",
  },
  {
    slug: "qtum",
    name: "Qtum",
    symbol: "QTUM",
    apy: 5,
    apyRange: "4% – 6%",
    lockup:
      "No fixed lock-up. Rewards depend on running or delegating to a staking node.",
    intro:
      "Qtum (QTUM) uses a Proof-of-Stake consensus with a UTXO model. Holders can stake by running a node or joining a staking pool to earn block rewards.",
  },
];

export const getStakingCoin = (slug) =>
  stakingCoins.find((c) => c.slug === slug);

export default stakingCoins;
