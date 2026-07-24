import React, { useEffect, useMemo, useState } from "react";

// Bitcoin halving countdown.
//
// Block height comes from mempool.space (CORS-friendly, no key). If that call
// fails the component still works: it estimates the current height from the
// last known halving and the 10-minute target block time, and says so.

const HALVING_INTERVAL = 210000;
const TARGET_BLOCK_MINUTES = 10;

// Block 840,000 was mined on 2024-04-20 UTC, the fourth halving.
const KNOWN_HALVING_HEIGHT = 840000;
const KNOWN_HALVING_TS = Date.parse("2024-04-20T00:09:00Z");

const subsidyAtHeight = (height) => {
  const epoch = Math.floor(height / HALVING_INTERVAL);
  return 50 / Math.pow(2, epoch);
};

const estimateHeightFromClock = () =>
  KNOWN_HALVING_HEIGHT +
  Math.floor(
    (Date.now() - KNOWN_HALVING_TS) / (TARGET_BLOCK_MINUTES * 60 * 1000)
  );

const fmt = (n, digits = 0) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const Unit = ({ value, label }) => (
  <div className="rounded-lg border border-gray-300 px-3 py-3 text-center dark:border-gray-700">
    <div className="text-2xl font-bold leading-none sm:text-3xl">{value}</div>
    <div className="mt-1 text-xs uppercase tracking-wide opacity-70">{label}</div>
  </div>
);

const HalvingCountdown = ({ compact = false }) => {
  const [height, setHeight] = useState(null);
  const [estimated, setEstimated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("https://mempool.space/api/blocks/tip/height");
        if (!res.ok) throw new Error("bad status");
        const h = parseInt(await res.text(), 10);
        if (!Number.isFinite(h)) throw new Error("bad height");
        if (!cancelled) {
          setHeight(h);
          setEstimated(false);
        }
      } catch {
        if (!cancelled) {
          setHeight(estimateHeightFromClock());
          setEstimated(true);
        }
      }
    };
    load();
    const poll = setInterval(load, 120000);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const data = useMemo(() => {
    if (height == null) return null;
    const nextHeight =
      (Math.floor(height / HALVING_INTERVAL) + 1) * HALVING_INTERVAL;
    const blocksRemaining = nextHeight - height;
    const msRemaining = blocksRemaining * TARGET_BLOCK_MINUTES * 60 * 1000;
    const eta = new Date(now + msRemaining);

    const epochStart = nextHeight - HALVING_INTERVAL;
    const progress = ((height - epochStart) / HALVING_INTERVAL) * 100;

    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    return {
      nextHeight,
      blocksRemaining,
      eta,
      progress,
      current: subsidyAtHeight(height),
      next: subsidyAtHeight(nextHeight),
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }, [height, now]);

  if (!data) {
    return (
      <div className="py-10 text-center opacity-70">
        Loading current block height…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        <Unit value={fmt(data.days)} label="Days" />
        <Unit value={String(data.hours).padStart(2, "0")} label="Hours" />
        <Unit value={String(data.minutes).padStart(2, "0")} label="Minutes" />
        <Unit value={String(data.seconds).padStart(2, "0")} label="Seconds" />
      </div>

      <div className="mt-5">
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
          role="progressbar"
          aria-valuenow={Math.round(data.progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress through the current halving epoch"
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, Math.max(0, data.progress))}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs opacity-70">
          {data.progress.toFixed(2)}% through the current halving epoch
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        {[
          ["Current block height", fmt(height)],
          ["Halving block", fmt(data.nextHeight)],
          ["Blocks remaining", fmt(data.blocksRemaining)],
          [
            "Estimated date",
            data.eta.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          ],
          ["Current block reward", `${fmt(data.current, 3)} BTC`],
          ["Reward after halving", `${fmt(data.next, 3)} BTC`],
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
          The countdown assumes the 10-minute target block time, so the date
          shifts as network hash rate changes. The halving itself triggers on
          block {fmt(data.nextHeight)}, not on a calendar date.
          {estimated &&
            " Live block height is currently unavailable, so the height shown is estimated from the last halving."}
        </p>
      )}
    </div>
  );
};

export default HalvingCountdown;
