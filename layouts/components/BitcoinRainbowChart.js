import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  ReferenceLine,
} from "recharts";
import Loading from "@components/Loading";

const COEFFICIENTS = [
  { name: "Everyone is Rich!", factor: 0.257, color: "#c00200" },
  { name: "Bubble territory", factor: 0.245, color: "#d64515" },
  { name: "SELL!", factor: 0.231, color: "#f7931a" },
  { name: "HODL", factor: 0.217, color: "#f3ca4d" },
  { name: "BUY!", factor: 0.204, color: "#a7d54c" },
  { name: "Accumulate", factor: 0.187, color: "#63be7b" },
  { name: "Fire Sale", factor: 0.17, color: "#56909f" },
  { name: "Market Apocalypse", factor: 0.155, color: "#4a75c4" },
  { name: "Regret Zone", factor: 0.138, color: "#9b59b6" },
];

const fetchJSONData = async () => {
  const res = await fetch("/data/bitcoin_data.json");
  const data = await res.json();
  const startDate = new Date(data[0].Date);
  return data.map((entry) => ({
    date: new Date(entry.Date).getTime(),
    price: entry.Value,
    daysSinceStart: (new Date(entry.Date) - startDate) / (1000 * 3600 * 24),
  }));
};

const fetchHistoricalData = async (lastDate, firstDate) => {
  const startTime = lastDate + 86400000;
  const res = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=${startTime}`
  );
  const data = await res.json();
  return data.map((kline) => ({
    date: kline[0],
    price: parseFloat(kline[4]),
    daysSinceStart: (kline[0] - firstDate) / (1000 * 3600 * 24),
  }));
};

const addFutureData = (data, years, calculateLogRegression) => {
  const msPerDay = 86400000;
  const lastDate = data[data.length - 1].date;
  const startDate = data[0].date;
  const futureDays = years * 365;

  return Array.from({ length: futureDays }, (_, i) => {
    const futureDate = lastDate + (i + 1) * msPerDay;
    const daysSinceStart = (futureDate - startDate) / msPerDay;

    const rainbowBands = COEFFICIENTS.reduce((acc, { name, factor }) => {
      acc[name] = calculateLogRegression(daysSinceStart, factor);
      return acc;
    }, {});

    return { date: futureDate, price: null, ...rainbowBands };
  });
};

const halvingDates = [
  new Date("2012-11-28").getTime(), // First halving
  new Date("2016-07-09").getTime(), // Second halving
  new Date("2020-05-11").getTime(), // Third halving
  new Date("2024-04-20").getTime(), // Fourth halving
  new Date("2028-04-17").getTime(), // Fifth halving
];

const BitcoinRainbowChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateLogRegression = useCallback(
    (days, factor) => Math.pow(30, 4 * factor * Math.log10(days + 10)),
    []
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const historicalData = await fetchJSONData();
        const lastDate = historicalData[historicalData.length - 1].date;
        const firstDate = historicalData[0].date;
        const additionalData = await fetchHistoricalData(lastDate, firstDate);

        const completeData = [...historicalData, ...additionalData].map(
          (entry) => ({
            ...entry,
            ...COEFFICIENTS.reduce((acc, { name, factor }) => {
              acc[name] = calculateLogRegression(entry.daysSinceStart, factor);
              return acc;
            }, {}),
          })
        );

        setData([
          ...completeData,
          ...addFutureData(completeData, 4, calculateLogRegression),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [calculateLogRegression]);

  if (loading) return <Loading />;

  return (
    <ResponsiveContainer height={500}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
      >
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => new Date(tick).getFullYear()}
          type="number"
          domain={["auto", "auto"]}
          scale="time"
          stroke="#ccc"
          ticks={[
            new Date(data[0].date).getTime(),
            new Date("2016-07-09").getTime(),
            new Date("2020-05-11").getTime(),
            new Date("2024-04-20").getTime(),
            new Date(data[data.length - 1].date).getTime(),
          ]}
        />

        <YAxis
          type="number"
          domain={[10, (dataMax) => Math.max(dataMax, 1000000)]}
          orientation="right"
          stroke="#ccc"
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          scale="log"
          fontSize={12}
        />
        {COEFFICIENTS.map(({ name, color }) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={color}
            strokeWidth="30"
            dot={false}
          />
        ))}
        <Tooltip
          formatter={(value, name) => [
            `$${Math.round(value).toLocaleString()}`,
            name,
          ]}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
          contentStyle={{ backgroundColor: "black" }}
        />
        <Line
          type="monotone"
          dataKey="price"
          name="Bitcoin Price"
          stroke="white"
          strokeWidth={1.5}
          dot={false}
        />
        {halvingDates.map((date) => (
          <ReferenceLine
            key={date}
            x={date}
            stroke="white"
            strokeDasharray="3 3"
            label={{
              position: "top",
              value: "Halving",
              fill: "white",
              fontSize: 12,
            }}
          />
        ))}
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: "40px" }}
          iconType="circle"
          formatter={(value, entry) => (
            <span style={{ color: entry.color }}>{value}</span>
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BitcoinRainbowChart);
