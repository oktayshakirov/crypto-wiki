import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
} from "recharts";
import Loading from "@components/Loading";

const COEFFICIENTS = [
  { name: "Maximum Bubble Territory", factor: 0.7, color: "#c00200" },
  { name: "Sell. Seriously, SELL!", factor: 0.65, color: "#d64018" },
  { name: "FOMO Intensifies", factor: 0.6, color: "#ed7d31" },
  { name: "Is this a bubble?", factor: 0.55, color: "#f6b45a" },
  { name: "HODL!", factor: 0.5, color: "#feeb84" },
  { name: "Still cheap", factor: 0.45, color: "#b1d580" },
  { name: "Accumulate", factor: 0.4, color: "#63be7b" },
  { name: "BUY!", factor: 0.35, color: "#54989f" },
  { name: "Fire sale!", factor: 0.3, color: "#4472c4" },
];

const calculateLogRegression = (daysSinceStart, factor) => {
  const scalingFactor = 3.8;
  return Math.pow(5, scalingFactor * factor * Math.log10(daysSinceStart + 2));
};

const fetchJSONData = async () => {
  const response = await fetch("/data/bitcoin_data.json");
  const jsonData = await response.json();
  return jsonData.map((entry) => ({
    date: new Date(entry.Date).getTime(),
    price: entry.Value,
    daysSinceStart:
      (new Date(entry.Date) - new Date(jsonData[0].Date)) / (1000 * 3600 * 24),
  }));
};

const fetchHistoricalData = async (lastDate, firstDate) => {
  const startTime = lastDate + 86400000;
  const endTime = new Date().getTime();
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=${startTime}&endTime=${endTime}`
  );
  const data = await response.json();
  return data.map((kline) => ({
    date: kline[0],
    price: parseFloat(kline[4]),
    daysSinceStart: (kline[0] - firstDate) / (1000 * 3600 * 24),
  }));
};

const BitcoinRainbowChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const historicalData = await fetchJSONData();
        const lastDataDate = historicalData[historicalData.length - 1].date;
        const firstDataDate = historicalData[0].date;
        const additionalData = await fetchHistoricalData(
          lastDataDate,
          firstDataDate
        );

        const completeData = [...historicalData, ...additionalData].map(
          (entry) => ({
            ...entry,
            ...COEFFICIENTS.reduce((acc, { name, factor }) => {
              acc[name] = calculateLogRegression(entry.daysSinceStart, factor);
              return acc;
            }, {}),
          })
        );

        setData(completeData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ResponsiveContainer height={600}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
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
            new Date(data[data.length - 1].date).getTime(),
          ]}
        />

        <YAxis
          type="number"
          domain={["auto", "auto"]}
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
            strokeWidth={50}
            dot={false}
          />
        ))}
        <Tooltip
          formatter={(value, name) => {
            const formattedValue = `$${Math.round(value).toLocaleString()}`;
            return [formattedValue, name];
          }}
          labelFormatter={(label) => {
            const date = new Date(label).toLocaleDateString();
            return date;
          }}
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

        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: "10px" }}
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
