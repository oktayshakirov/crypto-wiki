import { useEffect, useState } from "react";

// Loads daily BTC close prices: the bundled JSON (from 2012-11-28) topped up
// with recent daily candles from Binance. Same approach the rainbow chart
// uses, extracted so calculators can share it.
//
// Returns { history, isLoading, error } where history is an ascending array of
// { date: "YYYY-MM-DD", ts: epochMs, price: number }.

const DAY_MS = 86400000;

const toKey = (ts) => new Date(ts).toISOString().slice(0, 10);

const useBitcoinHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/data/bitcoin_data.json");
        if (!res.ok) throw new Error(`Price history unavailable (${res.status})`);
        const raw = await res.json();
        if (!Array.isArray(raw) || raw.length === 0) {
          throw new Error("Price history is empty.");
        }

        const base = raw
          .filter((r) => r && r.Date && Number.isFinite(Number(r.Value)))
          .map((r) => ({
            date: r.Date,
            ts: new Date(`${r.Date}T00:00:00Z`).getTime(),
            price: Number(r.Value),
          }))
          .sort((a, b) => a.ts - b.ts);

        // Top up from Binance so the tool stays current between data refreshes.
        // Binance caps at 1000 candles per call, so page through until we reach
        // today. A failure here is non-fatal: we still have the bundled data.
        const merged = new Map(base.map((d) => [d.date, d]));
        try {
          let cursor = base[base.length - 1].ts + DAY_MS;
          const now = Date.now();
          for (let i = 0; i < 5 && cursor < now; i++) {
            const url =
              `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d` +
              `&startTime=${cursor}&endTime=${now}&limit=1000`;
            const apiRes = await fetch(url);
            if (!apiRes.ok) break;
            const candles = await apiRes.json();
            if (!Array.isArray(candles) || candles.length === 0) break;
            for (const c of candles) {
              const ts = c[0];
              const price = parseFloat(c[4]);
              if (!Number.isFinite(price)) continue;
              const date = toKey(ts);
              merged.set(date, { date, ts: new Date(`${date}T00:00:00Z`).getTime(), price });
            }
            cursor = candles[candles.length - 1][0] + DAY_MS;
          }
        } catch {
          // Offline or blocked: fall back to the bundled history.
        }

        if (cancelled) return;
        setHistory([...merged.values()].sort((a, b) => a.ts - b.ts));
      } catch (e) {
        if (!cancelled) setError(e.message || "Could not load price history.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { history, isLoading, error };
};

export default useBitcoinHistory;
