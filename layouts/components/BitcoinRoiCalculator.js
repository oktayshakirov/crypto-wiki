import React, { useMemo, useState } from "react";
import useBitcoinHistory from "@hooks/useBitcoinHistory";

// "If you had invested $X in Bitcoin on [date]" calculator.
// Runs entirely on the shared BTC price history, so no per-query API calls.

const money = (n) =>
  Number(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Math.abs(n) < 10 ? 2 : 0,
  });

const pct = (n) =>
  `${n >= 0 ? "+" : ""}${Number(n).toLocaleString("en-US", {
    maximumFractionDigits: n > 1000 ? 0 : 2,
  })}%`;

// Nearest available close on or before the requested date, so weekends and
// gaps resolve sensibly instead of failing.
const priceOn = (history, dateStr) => {
  const target = new Date(`${dateStr}T00:00:00Z`).getTime();
  let match = null;
  for (const row of history) {
    if (row.ts <= target) match = row;
    else break;
  }
  return match;
};

const BitcoinRoiCalculator = ({ compact = false }) => {
  const { history, isLoading, error } = useBitcoinHistory();
  const [amount, setAmount] = useState("1000");
  const [date, setDate] = useState("2020-01-01");

  const bounds = useMemo(() => {
    if (!history.length) return { min: "2012-11-28", max: "" };
    return {
      min: history[0].date,
      max: history[history.length - 1].date,
    };
  }, [history]);

  const result = useMemo(() => {
    const invested = parseFloat(amount);
    if (!history.length || !Number.isFinite(invested) || invested <= 0) return null;

    const entry = priceOn(history, date);
    if (!entry) return { tooEarly: true };

    const latest = history[history.length - 1];
    const btc = invested / entry.price;
    const value = btc * latest.price;
    const profit = value - invested;
    const roi = (profit / invested) * 100;
    const multiple = value / invested;

    const years =
      (latest.ts - entry.ts) / (365.25 * 24 * 3600 * 1000);
    const cagr =
      years > 0.08 ? (Math.pow(multiple, 1 / years) - 1) * 100 : null;

    return { entry, latest, btc, value, profit, roi, multiple, cagr, invested, years };
  }, [history, amount, date]);

  if (isLoading) {
    return <div className="py-10 text-center opacity-70">Loading price history…</div>;
  }
  if (error) {
    return <div className="py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="roi-amount" className="mb-1 block text-sm font-semibold">
            Amount invested (USD)
          </label>
          <input
            id="roi-amount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"
          />
        </div>
        <div>
          <label htmlFor="roi-date" className="mb-1 block text-sm font-semibold">
            Purchase date
          </label>
          <input
            id="roi-date"
            type="date"
            value={date}
            min={bounds.min}
            max={bounds.max}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"
          />
        </div>
      </div>

      {result?.tooEarly && (
        <p className="mt-6 text-center text-sm text-red-500">
          No price data before {bounds.min}. Bitcoin had no consistent market
          price before then.
        </p>
      )}

      {result && !result.tooEarly && (
        <>
          <div className="mt-6 rounded-lg border border-gray-300 p-5 text-center dark:border-gray-700">
            <div className="text-sm opacity-70">Value today</div>
            <div
              className={`text-3xl font-bold sm:text-4xl ${
                result.profit >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {money(result.value)}
            </div>
            <div className="mt-1 text-sm">
              {result.profit >= 0 ? "Profit" : "Loss"} of{" "}
              <strong>{money(Math.abs(result.profit))}</strong> ({pct(result.roi)})
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {[
              ["Bitcoin bought", `${result.btc.toLocaleString("en-US", { maximumFractionDigits: 8 })} BTC`],
              ["Price on that date", money(result.entry.price)],
              ["Price now", money(result.latest.price)],
              ["Return multiple", `${result.multiple.toLocaleString("en-US", { maximumFractionDigits: 2 })}x`],
              ...(result.cagr !== null
                ? [["Annualised return (CAGR)", pct(result.cagr)]]
                : []),
              ["Holding period", `${result.years.toFixed(1)} years`],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className={`flex justify-between border-b border-gray-200 pb-2 last:border-b-0 last:pb-0 dark:border-gray-800 ${
                  i >= (arr.length % 2 === 0 ? arr.length - 2 : arr.length - 1)
                    ? "sm:border-b-0 sm:pb-0"
                    : ""
                }`}
              >
                <dt className="text-sm font-semibold opacity-80">{label}</dt>
                <dd className="m-0 text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          {!compact && (
            <p className="mt-5 text-center text-xs opacity-70">
              Based on daily closing prices, using the nearest close on or
              before your chosen date. Ignores fees, spreads and taxes, and
              assumes a single lump-sum purchase held without selling. Past
              performance says nothing about future results.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BitcoinRoiCalculator;
