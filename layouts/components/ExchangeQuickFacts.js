import React from "react";

// Wikipedia-style "at a glance" infobox for exchange pages.
//
// Exists because a large share of search demand is encyclopedia intent
// ("trade republic wiki", "binance wikipedia") landing on pages that only
// offered a long-form review. This gives those visitors the scannable facts
// they came for, and feeds the Review schema's itemReviewed node.
//
// Driven entirely by the `quickFacts` frontmatter object; any field left out
// is simply skipped, so partial data is fine.

const FIELDS = [
  ["founded", "Founded"],
  ["headquarters", "Headquarters"],
  ["founder", "Founder(s)"],
  ["owner", "Owner / Operator"],
  ["ceo", "CEO"],
  ["type", "Type"],
  ["custody", "Custody"],
  ["regulation", "Regulation"],
  ["token", "Native token"],
  ["availability", "Availability"],
];

const ExchangeQuickFacts = ({ facts, title }) => {
  if (!facts) return null;
  const rows = FIELDS.filter(([key]) => facts[key]);
  if (!rows.length) return null;

  // Dividers separate rows, so the bottom row must not draw one. The grid is
  // 1 column on mobile and 2 from `sm` up, so which items sit in that bottom
  // row differs by breakpoint: on mobile only the final item, and on desktop
  // the final one or two depending on whether the count is even.
  const lastRowStart = rows.length % 2 === 0 ? rows.length - 2 : rows.length - 1;

  return (
    <div className="mb-10 rounded-lg border border-gray-300 p-5 text-start dark:border-gray-700">
      <h2 className="h4 mb-4 mt-0">
        {title ? `${title}: Quick Facts` : "Quick Facts"}
      </h2>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {rows.map(([key, label], i) => (
          <div
            key={key}
            className={`flex flex-col border-b border-gray-200 pb-2 last:border-b-0 last:pb-0 dark:border-gray-800 sm:flex-row sm:items-baseline ${
              i >= lastRowStart ? "sm:border-b-0 sm:pb-0" : ""
            }`}
          >
            <dt className="min-w-[8.5rem] text-sm font-semibold opacity-80">
              {label}
            </dt>
            <dd className="m-0 text-sm">{facts[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ExchangeQuickFacts;
