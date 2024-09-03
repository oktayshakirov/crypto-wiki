import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
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

const addFutureData = (data, daysToAdd) => {
  const lastDate = new Date(data[data.length - 1].date);
  const futureData = [];

  for (let i = 1; i <= daysToAdd; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(lastDate.getDate() + i);

    const daysSinceStart =
      (futureDate - new Date(data[0].date)) / (1000 * 3600 * 24);

    const rainbowBands = COEFFICIENTS.reduce((acc, { name, factor }) => {
      acc[name] = calculateLogRegression(daysSinceStart, factor);
      return acc;
    }, {});

    futureData.push({
      date: futureDate.getTime(),
      ...rainbowBands,
    });
  }

  return [...data, ...futureData];
};

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
        {payload.map((entry) => {
          const color =
            COEFFICIENTS.find(({ name }) => name === entry.name)?.color ||
            "white";
          return (
            <p
              key={entry.dataKey}
              className="price"
              style={{ display: "flex", alignItems: "center" }}
            >
              <span
                style={{
                  backgroundColor: color,
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
              ></span>
              {`${entry.name}: $${entry.value.toLocaleString()}`}
            </p>
          );
        })}
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

        const extendedData = addFutureData(formattedData, 730);
        setData(extendedData);
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    };

    loadData();
  }, []);

  const memoizedData = useMemo(() => data, [data]);

  const CustomXAxisTick = ({ x, y, payload }) => {
    const year = new Date(payload.value).getFullYear();
    return (
      <text x={x} y={y + 15} fill="#ccc" textAnchor="middle" fontSize={12}>
        {year}
      </text>
    );
  };

  return !memoizedData.length ? (
    <Loading />
  ) : (
    <ResponsiveContainer height={600}>
      <LineChart
        data={memoizedData}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
      >
        <YAxis
          type="number"
          domain={["auto", "auto"]}
          orientation="right"
          stroke="#ccc"
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          scale="log"
          fontSize={12}
        />
        <XAxis
          dataKey="date"
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
          tick={<CustomXAxisTick />}
        />

        <Tooltip content={<CustomTooltip />} />
        {COEFFICIENTS.map(({ name, color }) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={color}
            strokeWidth={40}
            dot={false}
          />
        ))}
        <Line
          type="monotone"
          dataKey="price"
          name="Bitcoin Price"
          stroke="white"
          strokeWidth={2}
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

export default React.memo(BitcoinRainbowChart);
