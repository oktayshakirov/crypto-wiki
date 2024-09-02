import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import axios from "axios";
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
} from "recharts";
import Loading from "@components/Loading";

const COEFFICIENTS = [
  { name: "Maximum Bubble Territory", factor: 1.475, color: "#c00200" },
  { name: "Sell. Seriously, SELL!", factor: 1.45, color: "#d64018" },
  { name: "FOMO Intensifies", factor: 1.425, color: "#ed7d31" },
  { name: "Is this a bubble?", factor: 1.4, color: "#f6b45a" },
  { name: "HODL!", factor: 1.375, color: "#feeb84" },
  { name: "Still cheap", factor: 1.35, color: "#b1d580" },
  { name: "Accumulate", factor: 1.3, color: "#63be7b" },
  { name: "BUY!", factor: 1.2, color: "#54989f" },
  { name: "Fire sale!", factor: 1.1, color: "#4472c4" },
];

const calculateLogRegression = (daysSinceStart, factor) => {
  return Math.pow(10, factor * Math.log10(daysSinceStart));
};

const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Date(label).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const priceData = payload.find((item) => item.dataKey === "price");
    const otherData = payload.filter((item) => item.dataKey !== "price");

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#333",
          padding: "10px",
          borderRadius: "5px",
          color: "#fff",
        }}
      >
        <p className="label">{`Date: ${formattedDate}`}</p>
        {priceData && (
          <p className="price">
            {`${priceData.name}: $${priceData.value.toLocaleString()}`}
          </p>
        )}
        {otherData.map((entry) => (
          <p key={entry.dataKey} className="price">
            {`${entry.name}: $${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
});

CustomTooltip.displayName = "CustomTooltip";

const fetchCSVData = async () => {
  const response = await fetch("/data/bitcoin_data.csv");
  const text = await response.text();
  const parsedData = Papa.parse(text, {
    header: false,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => results.data,
  });
  return parsedData.data
    .map((entry) => ({
      time: new Date(entry[0]),
      price: parseFloat(entry[1]),
    }))
    .filter(
      (entry) =>
        entry.time && !isNaN(entry.time.getTime()) && !isNaN(entry.price)
    );
};

const fetchAPIData = async (startTime) => {
  const response = await axios.get("https://api.binance.com/api/v3/klines", {
    params: {
      symbol: "BTCUSDT",
      interval: "1w",
      startTime,
      limit: 1000,
    },
  });
  return response.data.map((kline) => ({
    time: new Date(kline[0]),
    price: parseFloat(kline[4]),
  }));
};

const BitcoinRainbowChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await fetchCSVData();
        const lastCsvDate = csvData[csvData.length - 1].time;
        const apiData = await fetchAPIData(lastCsvDate.getTime() + 86400000);
        const combinedData = [...csvData, ...apiData];

        const formattedData = combinedData.map((entry) => {
          const daysSinceStart = Math.max(
            1,
            (entry.time - combinedData[0].time) / (1000 * 3600 * 24)
          );
          const rainbowBands = COEFFICIENTS.reduce((acc, { name, factor }) => {
            acc[name] = calculateLogRegression(daysSinceStart, factor);
            return acc;
          }, {});
          return {
            date: entry.time.getTime(),
            price: entry.price,
            ...rainbowBands,
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    };

    loadData();
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  return !memoizedData.length ? (
    <Loading />
  ) : (
    <ResponsiveContainer width="100%" height={600}>
      <AreaChart
        data={memoizedData}
        margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
      >
        <YAxis
          type="number"
          domain={["auto", "auto"]}
          orientation="right"
          stroke="#ccc"
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />

        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          stroke="#ccc"
          tickFormatter={(tick) => new Date(tick).getFullYear()}
          ticks={Array.from(
            new Set(data.map((item) => new Date(item.date).setMonth(0, 1)))
          )}
        />

        <Tooltip content={<CustomTooltip />} />
        {COEFFICIENTS.map(({ name, color }) => (
          <Area
            key={name}
            type="monotone"
            dataKey={name}
            stroke={color}
            fill={color}
          />
        ))}
        <Area
          type="monotone"
          dataKey="price"
          name="Price"
          stroke="#171717"
          fill="transparent"
          strokeWidth={2}
          activeDot={{ r: 5 }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: "10px" }}
          iconType="circle"
          formatter={(value, entry) => {
            if (value === "Price") return null;
            return <span style={{ color: entry.color }}>{value}</span>;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BitcoinRainbowChart;
