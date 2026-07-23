import config from "@config/config.json";
import { plainify } from "@lib/utils/textConverter";

const { base_url, title: siteName, logo } = config.site;

const abs = (pathOrUrl) => {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${base_url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
};

// Stable @id for the site's Organization / Person so other nodes can reference it.
const ORG_ID = `${base_url}/#organization`;
const AUTHOR_ID = `${base_url}/authors/oktay-shakirov#person`;

// The site is authored and run by one person. Expose them as both the
// publishing Organization's founder and the default author for E-E-A-T.
export const authorPerson = () => ({
  "@type": "Person",
  "@id": AUTHOR_ID,
  name: "Oktay Shakirov",
  url: `${base_url}/authors/oktay-shakirov`,
  jobTitle: "Founder & Lead Researcher",
  description:
    "Founder and lead writer of The Crypto Wiki, covering cryptocurrency, blockchain technology and digital assets since 2016.",
  sameAs: [
    "https://x.com/oktayshakirov",
    "https://www.linkedin.com/in/oktayshakirov/",
    "https://oktayshakirov.com",
  ],
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: siteName,
  url: base_url,
  logo: {
    "@type": "ImageObject",
    url: abs(logo),
  },
  founder: authorPerson(),
  sameAs: [
    "https://x.com/oktayshakirov",
    "https://www.linkedin.com/in/oktayshakirov/",
  ],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${base_url}/#website`,
  name: siteName,
  url: base_url,
  publisher: { "@id": ORG_ID },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${base_url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

// items: [{ name, path }] — path relative or absolute; last item is the current page.
export const breadcrumbSchema = (items = []) => {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
};

// faqs: [{ question, answer }] — answer may contain light HTML/markdown; it is plainified.
export const faqSchema = (faqs = []) => {
  const clean = (faqs || []).filter((f) => f && f.question && f.answer);
  if (!clean.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: clean.map((f) => ({
      "@type": "Question",
      name: plainify(f.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: plainify(f.answer),
      },
    })),
  };
};

export const articleSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  type = "Article",
}) => ({
  "@context": "https://schema.org",
  "@type": type,
  headline: plainify(title),
  description: plainify(description),
  image: image ? abs(image) : abs(config.metadata.meta_image),
  datePublished: datePublished || undefined,
  dateModified: dateModified || datePublished || undefined,
  author: { "@id": AUTHOR_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": abs(url),
  },
});

// Exchange review pages. A bare Review with no `itemReviewed` is incomplete
// schema, so the quickFacts frontmatter doubles as the reviewed entity's data.
export const exchangeReviewSchema = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  url,
  quickFacts = {},
  website,
}) => {
  const itemReviewed = {
    "@type": "Organization",
    name: title,
    url: website || undefined,
    image: image ? abs(image) : undefined,
    foundingDate: quickFacts.founded || undefined,
    founder: quickFacts.founder || undefined,
    address: quickFacts.headquarters || undefined,
    areaServed: quickFacts.availability || undefined,
  };

  Object.keys(itemReviewed).forEach(
    (k) => itemReviewed[k] === undefined && delete itemReviewed[k]
  );

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: plainify(`${title} Review`),
    description: plainify(description),
    image: image ? abs(image) : abs(config.metadata.meta_image),
    datePublished: datePublished || undefined,
    dateModified: dateModified || datePublished || undefined,
    author: { "@id": AUTHOR_ID },
    publisher: { "@id": ORG_ID },
    itemReviewed,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": abs(url),
    },
  };
};

export const personSchema = ({ name, description, image, url, sameAs }) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name,
  description: plainify(description),
  image: image ? abs(image) : undefined,
  url: abs(url),
  sameAs: (sameAs || []).filter(Boolean),
});

// For interactive tools (calculators, charts, generators).
export const softwareAppSchema = ({ name, description, url }) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: plainify(name),
  description: plainify(description),
  url: abs(url),
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: { "@id": ORG_ID },
});
