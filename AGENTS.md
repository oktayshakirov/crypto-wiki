# AGENTS.md — crypto-wiki (thecrypto.wiki)

Guidance for coding agents. Humans: this doubles as an onboarding note.

## What this is

A Next.js **pages-router** site (Emotion + Tailwind). Content is MDX. Deploys
automatically from `main` (Netlify — see `netlify.toml`). There is no staging;
**a push to `main` is a production deploy.**

## Commands

| Task | Command | Notes |
| --- | --- | --- |
| Dev server | `npm run dev` | port 3000 (auto-bumps to 3001+). Regenerates JSON + content index + views first. |
| Production build | `npm run build` | Must pass before any commit that touches rendered output. Runs `clean`, the generators, `next build`, `next-sitemap`. |
| Lint | `npm run lint` | |

Node deps via **npm** (`package-lock.json`). No `engines` pin; use current LTS.

## Content model

| Type | Files | Renders at | Layout |
| --- | --- | --- | --- |
| Exchange review | `content/exchanges/*.mdx` | `/exchanges/<slug>` | `layouts/ExchangeSingle.js` |
| Crypto OG bio | `content/crypto-ogs/*.mdx` | `/crypto-ogs/<slug>` | `layouts/CryptoOgSingle.js` |
| Blog post | `content/posts/*.mdx` | `/posts/<slug>` | `layouts/PostSingle.js` |
| Tools | `pages/tools/*.js` | `/tools/<slug>` | hand-written React |

- **Entity pages (exchanges + OGs) require frontmatter `meta_title`, `quickFacts`, `faqs`.**
  `meta_title` is per-page and overrides a shared boilerplate title; wiki-frame it
  where the page has "<entity> wiki" search demand, otherwise name what's
  distinctive. Max ~60 chars. Never put "Wikipedia" (a trademark) in a title.
- Structured data is built in `lib/utils/jsonLd.js` and passed via the layout's
  `jsonLd` prop. `faqSchema(faqs)` needs a `faqs`/`faq` array — if a page renders
  a visible FAQ it must also emit the schema (see `bitcoin-roi-calculator.js`).
- Every figure in an infobox or FAQ must carry its own date/source in the value
  string (`"~EUR 12.5 billion (Dec 2025 secondary sale)"`), because these pages
  go stale silently. Omit rather than guess — YMYL finance + living people.
- **Answer-first openings:** the first body paragraph states a plain one-sentence
  definition of the entity before any marketing prose.

## The quality gate

```
python3 ~/.claude/skills/publish-content-crypto/scripts/quality_gate.py --type exchange|og|post <file>.mdx
```

Enforces: `meta_title`/`quickFacts`/`faqs` present, no "Wikipedia" in the title,
no em/en dashes or `--`, **no curly quotes** (`'` `'` `"` `"` → straight, body
AND frontmatter description), exactly 2 body images, bold internal links
`**[text](/path)**`, each internal target linked at most once, valid slugs, no
trailing metadata JSON, no `## References` heading, author `Oktay Shakirov`.

Run it on any entity/post file you touch. The gate is the source of truth for
these rules — the SKILL.md at that path has the reasoning.

## Conventions that bite

- **No em/en dashes (`—` `–`) or `--` anywhere in content.** Plain `-`.
- **No curly quotes anywhere in content**, including the frontmatter `description`.
- `json/views.json`, `public/sitemap-0.xml`, `public/content-index.json` are
  **build-generated but committed** on this repo. Include them in structural/SEO
  commits (the build regenerates them); don't hand-edit them.
- Some older exchange pages use `## **Bold Heading**`, newer ones `## Heading` —
  both pass. Match the file you're in.
- `crypto-wiki-automation` is the throwaway generation repo (`.claude/skills/`
  there is symlinked and canonical for the publish skill + gate). Its
  `content-database.json` is the slug registry: when you rename a content slug
  here, update the matching key there too, and add a 301 in
  `next.config.js` (`redirects()`).

## Verifying a change

1. `npm run build` — must pass.
2. Gate any `.mdx` you edited.
3. If it's visible in the browser: `npm run dev`, load the page, check the
   rendered `<title>`, the first paragraph, and the JSON-LD (`FAQPage`, `Review`,
   `BreadcrumbList`) via the page's `<script type="application/ld+json">`.

## Git

- Trunk-based. Work on `main`. A push deploys.
- **Never add `Co-Authored-By: Claude` or any AI attribution to a commit.**
- Commit or push only when asked. Show the plan first.
