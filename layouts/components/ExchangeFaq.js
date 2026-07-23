import React from "react";
import { markdownify } from "@lib/utils/textConverter";

// Visible FAQ block for exchange (and other review) pages.
// The matching FAQPage JSON-LD is emitted separately via the page's jsonLd prop,
// so the on-page content and the structured data stay in sync from one source.
const ExchangeFaq = ({ faqs = [], title = "" }) => {
  const clean = (faqs || []).filter((f) => f && f.question && f.answer);
  if (!clean.length) return null;

  return (
    <div className="mt-12 text-start">
      <h2 className="h3 mb-4">
        {title ? `${title}: Frequently Asked Questions` : "Frequently Asked Questions"}
      </h2>
      <div className="border-t border-gray-200 dark:border-gray-700">
        {clean.map((faq, i) => (
          <div
            key={`faq-${i}`}
            className={`py-5 ${
              i < clean.length - 1
                ? "border-b border-gray-200 dark:border-gray-700"
                : ""
            }`}
          >
            <h3 className="h4 mb-2 mt-0 font-semibold">{faq.question}</h3>
            {markdownify(faq.answer, "div", "mb-0")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeFaq;
