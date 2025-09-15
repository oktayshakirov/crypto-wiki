# Exchange Review Guidelines

## Duplicate Prevention

- **Check content-database.json** before creating any exchange review
- **DO NOT DUPLICATE** any existing exchanges listed in the database
- **Verify uniqueness** by checking both exchange names and slugs

## Content Structure (EXACT ORDER)

1. **Opening Section** (## **[Exchange]: [Specific Descriptor]**): Founding year, founder(s) ONLY if in database, headquarters, key positioning
2. **Core Services** (## **Core [Platform/Services/Offerings]**): Trading platform, spot/derivatives/margin, staking, DeFi features
3. **Security Measures** (## **Security Measures**): Account security, platform security, historical incidents, custodial disclaimers
4. **User Experience** (## **User Experience**): Interface, educational resources, customer support
5. **Regulatory Compliance** (## **Regulatory Compliance**): Licenses, challenges, geographic restrictions
6. **Points to Consider** (## **Points to Consider**): 4-5 specific points: Fee structures, risks, complexity, target users
7. **Conclusion** (## **Conclusion**): Market position, ideal users, balanced summary

## Content Requirements

- **Length**: 1,500-2,500 words (minimum 1,200)
- **Internal Links**: 15-20 total using content database
- **Images**: 1-2 with descriptive alt text
- **Formatting**: Use ## for ALL main headings, **bold** for all sub-categories in bullet points
- **Tone**: Professional, balanced, expert-level, E-E-A-T compliant

## Internal Linking Rules

- **Founders**: [Name](/crypto-ogs/{slug}) - ONLY if founder exists in content database
- **Concepts**: [Title](/posts/{slug})
- **Exchanges**: **[Exchange](/exchanges/{slug})**
- **Tools**: **[Tool](/tools/{slug})**
- **Security Links**: Always include `**[How To Store Crypto](/posts/how-to-store-crypto)**` and `**[How to Avoid Crypto Scams](/posts/how-to-avoid-crypto-scams)**`

## Writing Standards

- **Specific Numbers**: Use concrete data (e.g., "200+ cryptocurrencies", "700+ trading pairs")
- **Historical Context**: Include founding story, major incidents, regulatory milestones
- **Risk Warnings**: Always mention custodial risks, regulatory uncertainties, derivatives risks
- **Balanced Tone**: Acknowledge both strengths and limitations objectively
- **Actionable Advice**: "Points to Consider" must be specific and actionable

## Content Patterns from High-Quality Examples

### **Opening Section Structure**

- **Header**: ## **[Exchange Name]: [Specific Descriptor]** (NOT "Brief Description")
- **Descriptor Examples**:
  - "A Publicly Traded US-Based Crypto Exchange" (Coinbase)
  - "Global Leader in Cryptocurrency Services" (Binance)
  - "A Global Hub for Altcoin Trading" (KuCoin)
  - "Global Crypto Exchange with Extensive Trading and Web3 Features" (OKX)
- **Format**: "Founded in [YEAR] [by FOUNDER(S) with internal links if in database], [EXCHANGE] is [POSITIONING]..."
- **Include**: Founding year, founder(s) with links ONLY if in content database, headquarters location, key differentiator
- **Length**: 2-3 sentences maximum
- **Tone**: Professional, informative, sets context

### **Section Header Variations**

- **Centralized Exchanges**: "Core Trading Platform", "Core Offerings", "Core Services"
- **DEX/Protocols**: "Core Protocol", "How [Name] Works", "Protocol Features"
- **Multi-Product**: "Core Components", "Ecosystem Services", "Platform Features"

### **Bullet Point Structure**

- **Main Category**: **Bold** with colon
- **Sub-categories**: **Bold** with detailed description
- **Consistent Format**: Always use **bold** for sub-categories
- **Descriptive**: Include specific details, numbers, and context

### **Image Placement & Alt Text**

- **Placement**: After main service descriptions, before security section
- **Alt Text Format**: `![Exchange name interface showing [specific feature]](/images/exchanges/exchange-name.png)`
- **Descriptive**: Focus on what the image shows, not just "logo" or "interface"
- **Required**: At least 1 image must be included within the content body (not just frontmatter)

### **Internal Linking Patterns**

- **Founders**: Always link in opening paragraph: `[Name](/crypto-ogs/slug)`
- **Concepts**: Link throughout content: `[Bitcoin](/posts/what-is-bitcoin)`, `[DeFi](/posts/what-is-defi)`
- **Exchanges**: Use for comparisons: `**[Coinbase](/exchanges/coinbase)**`, `**[Binance](/exchanges/binance)**`
- **Tools**: Link when relevant: `**[Fear and Greed Index](/tools/fear-and-greed-index)**`

### **Regulatory Context Requirements**

- **Specific Details**: Mention exact settlements, fines, regulatory status
- **Timeline**: Include dates for major regulatory events
- **Impact**: Explain how regulatory issues affect users
- **Geographic**: Specify which regions are affected

### **Risk Warning Standards**

- **Derivatives**: "Trading derivatives, especially with high leverage, carries extreme risk..."
- **Custodial**: "Assets held on [exchange] are under [exchange]'s custody..."
- **Regulatory**: "Users must verify the legality and availability of [exchange] in their country..."
- **Complexity**: "The platform's complexity may be overwhelming for beginners..."

### **Conclusion Structure**

- **Market Position**: Where the exchange stands in the market
- **Ideal Users**: Who should use this exchange
- **Key Considerations**: Main pros and cons
- **Length**: 2-3 sentences maximum

## Frontmatter Standards

### **Required Fields**

- **title**: Official exchange name (proper capitalization)
- **image**: `/images/exchanges/{exchange-slug}.png`
- **description**: 100-150 characters, highlight key features
- **date**: YYYY-MM-DD format (not ISO string)
- **order**: Sequential number from content-database.json
- **authors**: `["Crypto Wiki Team"]`
- **social**: Include website and all available social media links (REQUIRED)
  - Must include: website, twitter, youtube, linkedin, facebook, instagram
  - Optional but recommended: tiktok, telegram, reddit, discord, wikipedia
  - Only include platforms that actually exist for the exchange
- **draft**: `true` for new exchanges

### **Social Media Priority Order**

1. **website** (required)
2. **twitter** (most important)
3. **youtube**, **linkedin**, **telegram**
4. **facebook**, **instagram**, **tiktok**
5. **discord**, **reddit**, **github** (if applicable)
6. **wikipedia** (if available)

### **Automation Requirements**

- **AI Prompt**: Must request social media links as JSON object
- **Frontmatter Generation**: Must parse and include all social media links from AI response
- **Validation**: Only include platforms that actually exist for the exchange

## Content Quality Standards

### **Opening Section Requirements**

- **Header**: ## **[Exchange Name]: [Specific Descriptor]** (NOT "Brief Description")
- **Founding Details**: Year, founder(s) with internal links ONLY if in content database, headquarters
- **Key Positioning**: What makes this exchange unique
- **Context**: Market position or regulatory status
- **Length**: Exactly 2-3 sentences

### **Section Content Requirements**

- **Core Services**: 3-5 main service categories with sub-categories
- **Security**: Specific technical details, historical incidents, disclaimers
- **User Experience**: Interface options, educational resources, support quality
- **Regulatory**: Specific licenses, challenges, geographic restrictions
- **Points to Consider**: 4-5 specific, actionable considerations

### **Internal Linking Requirements**

- **Minimum**: 15 internal links
- **Maximum**: 20 internal links
- **Founders**: Must link in opening paragraph
- **Concepts**: Link Bitcoin, Ethereum, DeFi, Staking, etc.
- **Exchanges**: Use for comparisons and context
- **Security**: Always include storage and scam prevention links

## Quality Checklist

- [ ] All 7 sections included in correct order with ## headers
- [ ] Opening header: ## **[Exchange Name]: [Specific Descriptor]** (NOT "Brief Description")
- [ ] All main sections use ## heading format
- [ ] 15-20 internal links using content database
- [ ] Founders only linked if they exist in content database
- [ ] 1-2 images with descriptive alt text placed within content body
- [ ] 1,200+ words, professional tone
- [ ] Risk warnings for derivatives/custodial risks
- [ ] Specific, actionable "Points to Consider"
- [ ] Balanced conclusion with clear user guidance
- [ ] Frontmatter includes: title, image, description, date (YYYY-MM-DD), order, authors, social, draft
- [ ] Social media links included in frontmatter (REQUIRED)
- [ ] Website included in social section (not separate field)
- [ ] Section headers match exchange type (Trading Platform vs Protocol)
- [ ] Bullet points use consistent **bold** formatting
- [ ] Regulatory context includes specific details and dates
- [ ] Images placed after main services, before security
- [ ] NO "Additional resources" section at the end
