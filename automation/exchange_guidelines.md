# Crypto Exchange Post Guidelines

## Overview

This document provides comprehensive guidelines for creating automated crypto exchange posts using n8n. The system ensures consistent formatting, proper internal linking, and prevents duplicate entries.

## Existing Exchanges (DO NOT DUPLICATE)

- Binance
- Bitpanda
- Bybit
- Coinbase
- CoinEx
- Crypto.com
- Kraken
- KuCoin
- Nexo
- OKX
- Trade Republic
- Uniswap
- WhiteBIT

## File Structure Requirements

### File Naming Convention

- Format: `{exchange-name}.mdx` (lowercase, hyphens for spaces)
- Examples: `gate-io.mdx`, `gemini.mdx`, `ftx.mdx`

### Required Directory

- All exchange files must be placed in: `/content/exchanges/`

## Frontmatter Schema

```yaml
---
title: "{Exchange Name}"
image: "/images/exchanges/{exchange-name}.{ext}"
description: "{Brief description (max 150 characters)}"
date: { YYYY-MM-DD }
order: { next_available_number }
authors: ["Crypto Wiki Team"]
social:
  android: { Android app URL if available }
  apple: { iOS app URL if available }
  bitcoin: { Bitcoin address or related URL if available }
  facebook: { Facebook URL if available }
  twitter: { Twitter/X URL if available }
  instagram: { Instagram URL if available }
  youtube: { YouTube URL if available }
  linkedin: { LinkedIn URL if available }
  github: { GitHub URL if available }
  medium: { Medium URL if available }
  bitbucket: { Bitbucket URL if available }
  reddit: { Reddit URL if available }
  vk: { VKontakte URL if available }
  whatsapp: { WhatsApp URL if available }
  tiktok: { TikTok URL if available }
  telegram: { Telegram URL if available }
  website: { Official website URL - REQUIRED }
  email: { Contact email if available }
  phone: { Phone number if available }
  address: { Physical address if available }
  wallet: { Wallet address or related URL if available }
  wikipedia: { Wikipedia URL if available }
---
```

### Frontmatter Rules

1. **title**: Official exchange name (proper capitalization)
2. **image**: Use placeholder `/images/exchanges/{exchange-name}.png` (you'll add manually)
3. **description**: 100-150 characters, highlight key features
4. **date**: Current date in YYYY-MM-DD format
5. **order**: Use next available number (check existing exchanges)
6. **social**: Include all available social media links
7. **website**: Always required, must be official domain

## Content Structure Template

```markdown
## **{Exchange Name}: {Brief Tagline}**

{Opening paragraph introducing the exchange, founding details, and key positioning. Mention founder(s) with internal links if they exist in crypto-ogs.}

## **Core Offerings and Services**

{Exchange's main features and services:}

- **Trading Platform:**
  - **Spot Trading:** {Description with internal links to relevant posts}
  - **Derivatives/Futures:** {If available}
  - **Margin Trading:** {If available}
- **Additional Services:**
  - **{Service Name}:** {Description}
  - **{Service Name}:** {Description}

![{Alt text description}]({image_placeholder})

## **Security Measures and User Protection**

{Security features, certifications, insurance, user protection measures}

- **Account Security:** {2FA, security features}
- **Platform Security:** {Technical security measures}
- **{Other security aspects}**

_Note: Standard security disclaimer about custodial risks and link to storage guide_

## **User Experience and Features**

{Interface, mobile apps, educational resources, customer support}

- **Interface:** {Description of UI/UX}
- **Educational Resources:** {If available}
- **Customer Support:** {Support channels and quality}

## **Regulatory Compliance and Licensing**

{Regulatory status, licenses, jurisdictional information}

- **Licensing:** {Regulatory licenses and jurisdictions}
- **Compliance:** {KYC/AML procedures}
- **Geographic Restrictions:** {Availability limitations}

## **Fees and Pricing**

{Fee structure, trading fees, withdrawal fees, deposit methods}

- **Trading Fees:** {Maker/taker structure}
- **Deposit/Withdrawal Fees:** {Various methods}
- **Premium Features:** {If applicable}

## **Points to Consider Before Using {Exchange Name}**

- **{Consideration 1}:** {Description}
- **{Consideration 2}:** {Description}
- **{Consideration 3}:** {Description}
- **{Consideration 4}:** {Description}

## **Conclusion**

{Summary paragraph highlighting the exchange's position in the market, ideal user types, strengths, and considerations. Should be balanced and informative.}
```

## Internal Linking Rules

### Automatic Internal Links

The system should automatically detect and link the following:

#### Crypto OGs (founders/personalities) - Format: `[Name](/crypto-ogs/slug)`

#### Educational Posts - Format: `[Title](/posts/slug)`

#### Other Exchanges - Format: `**[Exchange Name](/exchanges/slug)**`

#### Tools - Format: `**[Tool Name](/tools/slug)**`

**Available Tools:**

- Bitcoin Rainbow Chart → `**[Bitcoin Rainbow Chart](/tools/bitcoin-rainbow-chart)**`
- Crypto Heatmap → `**[Crypto Heatmap](/tools/crypto-heatmap)**`
- Fear and Greed Index → `**[Fear and Greed Index](/tools/fear-and-greed-index)**`
- Random Coin Generator → `**[Random Coin Generator](/tools/random-coin-generator)**`
- Staking Calculator → `**[Staking Calculator](/tools/staking-calculator)**`

### Link Detection Keywords

The system should scan for these terms and auto-link:

**Cryptocurrencies:**

- Bitcoin, BTC → link to Bitcoin post
- Ethereum, ETH → link to Ethereum post
- Solana, SOL → link to Solana post

**Concepts:**

- blockchain, Blockchain → link to blockchain post
- DeFi, decentralized finance → link to DeFi post
- staking, crypto staking → link to staking post
- NFT, NFTs, non-fungible tokens → link to NFTs post
- smart contracts → link to smart contracts post

**People (if mentioned):**

- Satoshi Nakamoto, Satoshi → link to Satoshi OG
- Changpeng Zhao, CZ → link to CZ OG
- Vitalik Buterin, Vitalik → link to Vitalik OG

**Tools (if mentioned):**

- Bitcoin Rainbow Chart, rainbow chart → link to Bitcoin Rainbow Chart tool
- Crypto Heatmap, heatmap → link to Crypto Heatmap tool
- Fear and Greed Index, fear & greed → link to Fear and Greed Index tool
- Random Coin Generator, random coin → link to Random Coin Generator tool
- Staking Calculator, staking calculator → link to Staking Calculator tool

### Security-Related Standard Links

Always include these in security sections:

- `**[How To Store Crypto](/posts/how-to-store-crypto)**`
- `**[How to Avoid Crypto Scams](/posts/how-to-avoid-crypto-scams)**`

## Image Placeholders

### Required Images

1. **Main Exchange Logo**: `/images/exchanges/{exchange-name}.png`
2. **Feature Screenshots**: `/images/posts/{exchange-name}-{feature}.{ext}`
3. **Generic Images**: Use existing images from `/images/posts/` when relevant

### Image Alt Text

- Always include descriptive alt text
- Format: `![Exchange name interface showing trading features](/images/exchanges/exchange-name.png)`

## Content Guidelines

### Tone and Style

- Professional but accessible
- Balanced (acknowledge both strengths and limitations)
- Educational focus
- Factual and well-researched

### Required Disclaimers

- Security risks of custodial platforms
- Regulatory considerations
- Geographic restrictions
- Fee transparency

### Word Count

- Target: 1,500-2,500 words
- Minimum: 1,200 words
- Focus on comprehensive coverage

## Quality Checklist

### Pre-Publication Review

- [ ] Frontmatter complete and accurate
- [ ] All required sections included
- [ ] Internal links properly formatted
- [ ] Image placeholders in place
- [ ] No duplicate exchange entry
- [ ] Security disclaimers included
- [ ] Regulatory information accurate
- [ ] Fee information current
- [ ] Conclusion balances pros/cons

### Technical Validation

- [ ] Valid MDX syntax
- [ ] Proper heading hierarchy (##, ###)
- [ ] Correct internal link format
- [ ] Image paths use placeholders
- [ ] Date format correct (YYYY-MM-DD)
- [ ] Order number sequential

## n8n Automation Requirements

### Data Sources Needed

1. Exchange basic information (name, website, founding date)
2. Social media links
3. Feature list and descriptions
4. Security measures
5. Regulatory status
6. Fee structure

### Validation Steps

1. Check against existing exchange list
2. Validate social media URLs
3. Verify official website
4. Check for required information completeness

### Output Requirements

1. Complete MDX file with proper frontmatter
2. Structured content following template
3. Internal links automatically inserted
4. Image placeholders properly formatted
5. File saved in correct directory with proper naming
