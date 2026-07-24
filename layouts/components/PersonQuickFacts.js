import React from "react";

// Wikipedia-style "at a glance" infobox for crypto OG (person) pages.
//
// Same rationale as ExchangeQuickFacts: a large share of search demand for
// these pages is encyclopedia intent ("michael saylor wiki", "gavin wood net
// worth", "brian armstrong age", "changpeng zhao education"). Those are
// literally infobox fields, so answering them in a scannable block is what
// wins the click against Wikipedia.
//
// Deliberately no `netWorth` field: wealth figures for living people go stale
// within days and a wrong one is both a maintenance treadmill and a complaint
// risk. Where there is real demand, it is answered in an FAQ instead, with
// hedged, dated, attributed wording.

const FIELDS = [
  ["born", "Born"],
  ["birthplace", "Birthplace"],
  ["nationality", "Nationality"],
  ["education", "Education"],
  ["knownFor", "Known for"],
  ["role", "Current role"],
  ["founded", "Founded"],
  ["status", "Status"],
];

const PersonQuickFacts = ({ facts, title }) => {
  if (!facts) return null;
  const rows = FIELDS.filter(([key]) => facts[key]);
  if (!rows.length) return null;

  // Dividers separate rows, so the bottom row must not draw one. The grid is
  // 1 column on mobile and 2 from `sm` up, so the bottom row differs by
  // breakpoint: the final item on mobile, the final one or two on desktop.
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

export default PersonQuickFacts;
