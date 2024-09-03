import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import {
  LineChart,
  Line,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
} from "recharts";
import Loading from "@components/Loading";

const COEFFICIENTS = [
  { name: "Maximum Bubble Territory", factor: 1.1, color: "#c00200" },
  { name: "Sell. Seriously, SELL!", factor: 1, color: "#d64018" },
  { name: "FOMO Intensifies", factor: 0.9, color: "#ed7d31" },
  { name: "Is this a bubble?", factor: 0.8, color: "#f6b45a" },
  { name: "HODL!", factor: 0.7, color: "#feeb84" },
  { name: "Still cheap", factor: 0.6, color: "#b1d580" },
  { name: "Accumulate", factor: 0.5, color: "#63be7b" },
  { name: "BUY!", factor: 0.4, color: "#54989f" },
  { name: "Fire sale!", factor: 0.35, color: "#4472c4" },
];

const calculateLogRegression = (daysSinceStart, factor) => {
  const scalingFactor = 2;
  return Math.pow(10, scalingFactor * factor * Math.log10(daysSinceStart + 2));
};

// eslint-disable-next-line react/display-name
const CustomTooltip = React.memo(({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Date(label).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        {payload.map((entry) => (
          <p key={entry.dataKey} className="price">
            {`${entry.name}: $${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
});

const fetchCSVData = async () => {
  const response = await fetch("/data/bitcoin_data.csv");
  const text = await response.text();
  const parsedData = Papa.parse(text, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  }).data;

  return parsedData
    .filter((entry) => entry.Value > 0)
    .map((entry) => ({
      time: new Date(entry.Date),
      price: entry.Value,
      daysSinceStart:
        (new Date(entry.Date) - new Date(parsedData[0].Date)) /
        (1000 * 3600 * 24),
    }));
};

const BitcoinRainbowChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await fetchCSVData();
        const formattedData = csvData.map((entry) => {
          const rainbowBands = COEFFICIENTS.reduce((acc, { name, factor }) => {
            acc[name] = calculateLogRegression(entry.daysSinceStart, factor);
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

  return !data.length ? (
    <Loading />
  ) : (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <YAxis
          type="number"
          domain={["auto", "auto"]}
          orientation="right"
          stroke="#ccc"
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          scale="log"
        />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          stroke="#ccc"
          tickFormatter={(tick) => new Date(tick).getFullYear()}
        />
        <Tooltip content={<CustomTooltip />} />
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
          formatter={(value, entry) => {
            return <span style={{ color: entry.color }}>{value}</span>;
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BitcoinRainbowChart;
