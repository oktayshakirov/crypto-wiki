import React, { useEffect, useState, useCallback } from "react";
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

const COEFFICIENTS_BTC_RAINBOW = [
  { name: "Maximum Bubble Territory", b_value: -15.7, color: "#c00200" },
  { name: "Sell. Seriously, SELL!", b_value: -16.0, color: "#d64515" },
  { name: "FOMO intensifies", b_value: -16.3, color: "#f7931a" },
  { name: "Is this a bubble?", b_value: -16.6, color: "#f3ca4d" },
  { name: "HODL!", b_value: -16.9, color: "#a7d54c" },
  { name: "Still cheap", b_value: -17.2, color: "#63be7b" },
  { name: "Accumulate", b_value: -17.5, color: "#56909f" },
  { name: "BUY!", b_value: -17.8, color: "#4a75c4" },
  { name: "Basically a Fire Sale", b_value: -18.1, color: "#9b59b6" },
];

const REGRESSION_MODEL_THEORETICAL_START_DATE = new Date(
  "2009-01-03"
).getTime();

const halvingDates = [
  new Date("2012-11-28").getTime(),
  new Date("2016-07-09").getTime(),
  new Date("2020-05-11").getTime(),
  new Date("2024-04-20").getTime(),
  new Date("2028-04-17").getTime(),
];

const BitcoinRainbowChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualChartStartDate, setActualChartStartDate] = useState(null);
  const [maxChartYValue, setMaxChartYValue] = useState(1000000);

  const calculateLogRegression = useCallback(
    (daysFromTheoreticalStart, bandSpecificIntercept) => {
      const SLOPE_M = 5.8;
      const adjustedDays = Math.max(daysFromTheoreticalStart, 1);
      const exponent =
        SLOPE_M * Math.log10(adjustedDays) + bandSpecificIntercept;
      return Math.pow(10, exponent);
    },
    []
  );

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resJson = await fetch("/data/bitcoin_data.json");
        if (!resJson.ok)
          throw new Error(`JSON fetch error: ${resJson.statusText}`);
        const rawJsonData = await resJson.json();

        if (!rawJsonData || rawJsonData.length === 0) {
          throw new Error("bitcoin_data.json is empty or could not be loaded.");
        }

        const firstDataPointDate = new Date(rawJsonData[0].Date).getTime();
        setActualChartStartDate(firstDataPointDate);

        const historicalDataProcessed = rawJsonData.map((entry) => {
          const entryDate = new Date(entry.Date).getTime();
          const daysForRegressionCalc =
            (entryDate - REGRESSION_MODEL_THEORETICAL_START_DATE) /
            (1000 * 3600 * 24);

          return {
            date: entryDate,
            price: entry.Value,
            daysForRegression: daysForRegressionCalc,
          };
        });

        const lastJsonDate =
          historicalDataProcessed[historicalDataProcessed.length - 1].date;
        const apiResponse = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&startTime=${
            lastJsonDate + 86400000
          }&endTime=${new Date().getTime()}&limit=1000`
        );
        let additionalApiDataProcessed = [];
        if (apiResponse.ok) {
          const apiDataRaw = await apiResponse.json();
          additionalApiDataProcessed = apiDataRaw.map((kline) => {
            const entryDate = kline[0];
            const daysForRegressionCalc =
              (entryDate - REGRESSION_MODEL_THEORETICAL_START_DATE) /
              (1000 * 3600 * 24);
            return {
              date: entryDate,
              price: parseFloat(kline[4]),
              daysForRegression: daysForRegressionCalc,
            };
          });
        } else {
          console.warn(
            "Binance API fetch failed. Chart may not be up-to-date."
          );
        }

        const combinedDataMap = new Map();
        historicalDataProcessed.forEach((item) =>
          combinedDataMap.set(item.date, item)
        );
        additionalApiDataProcessed.forEach((item) =>
          combinedDataMap.set(item.date, item)
        );

        let completeHistoricalData = Array.from(combinedDataMap.values()).sort(
          (a, b) => a.date - b.date
        );

        let currentMaxY = 10;
        const dataWithBands = completeHistoricalData.map((entry) => {
          const bands = COEFFICIENTS_BTC_RAINBOW.reduce(
            (acc, { name, b_value }) => {
              const bandVal = calculateLogRegression(
                entry.daysForRegression,
                b_value
              );
              acc[name] = bandVal;
              if (bandVal > currentMaxY) currentMaxY = bandVal;
              return acc;
            },
            {}
          );
          if (entry.price && entry.price > currentMaxY)
            currentMaxY = entry.price;
          return { ...entry, ...bands };
        });

        const msPerDay = 86400000;
        const lastEntryForFuture = dataWithBands[dataWithBands.length - 1];
        const futureYearsToProject = 4;
        const futureDaysCount = futureYearsToProject * 365;
        let lastDateForFuture = lastEntryForFuture.date;
        let lastDaysForRegression = lastEntryForFuture.daysForRegression;

        const futureDataWithBands = Array.from(
          { length: futureDaysCount },
          (_, i) => {
            const futureDate = lastDateForFuture + (i + 1) * msPerDay;
            lastDaysForRegression += 1;

            const rainbowBands = COEFFICIENTS_BTC_RAINBOW.reduce(
              (acc, { name, b_value }) => {
                const bandVal = calculateLogRegression(
                  lastDaysForRegression,
                  b_value
                );
                acc[name] = bandVal;
                if (bandVal > currentMaxY) currentMaxY = bandVal;
                return acc;
              },
              {}
            );
            return {
              date: futureDate,
              price: null,
              daysForRegression: lastDaysForRegression,
              ...rainbowBands,
            };
          }
        );

        setMaxChartYValue(Math.max(currentMaxY * 1.1, 1000000));
        setChartData([...dataWithBands, ...futureDataWithBands]);
      } catch (e) {
        console.error("Error loading chart data:", e);
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadChartData();
  }, [calculateLogRegression]);

  if (isLoading) return <Loading />;
  if (error)
    return <div style={{ color: "red", padding: "20px" }}>Error: {error}</div>;
  if (!chartData || chartData.length === 0 || !actualChartStartDate) {
    return <div style={{ padding: "20px" }}>Preparing chart data...</div>;
  }

  const xDomain = [actualChartStartDate, chartData[chartData.length - 1].date];

  let xTicksToShow = [actualChartStartDate];
  halvingDates.forEach((hd) => {
    if (
      hd > actualChartStartDate &&
      hd < chartData[chartData.length - 1].date
    ) {
      if (
        !xTicksToShow.some(
          (existingTick) => Math.abs(existingTick - hd) < 86400000 * 180
        )
      ) {
        xTicksToShow.push(hd);
      }
    }
  });
  xTicksToShow.push(chartData[chartData.length - 1].date);
  xTicksToShow = Array.from(new Set(xTicksToShow)).sort((a, b) => a - b);

  const finalXTicks = xTicksToShow.reduce((acc, currentTick) => {
    if (
      acc.length === 0 ||
      currentTick - acc[acc.length - 1] > 86400000 * 365 * 1.5
    ) {
      acc.push(currentTick);
    } else if (
      currentTick === xTicksToShow[xTicksToShow.length - 1] &&
      acc[acc.length - 1] !== currentTick
    ) {
      acc.push(currentTick);
    }
    return acc;
  }, []);
  if (finalXTicks.length === 0 && xTicksToShow.length > 0)
    finalXTicks.push(xTicksToShow[0]);
  else if (xTicksToShow.length > 0 && finalXTicks[0] !== xTicksToShow[0]) {
    finalXTicks.unshift(xTicksToShow[0]);
  }

  return (
    <ResponsiveContainer height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 35, right: 20, left: 30, bottom: 5 }}
      >
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => new Date(tick).getFullYear().toString()}
          type="number"
          domain={xDomain}
          scale="time"
          stroke="#ccc"
          ticks={finalXTicks}
          interval="preserveStartEnd"
          fontSize={12}
        />
        <YAxis
          type="number"
          domain={[10, (dataMax) => Math.max(dataMax, maxChartYValue)]}
          orientation="right"
          stroke="#ccc"
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          scale="log"
          fontSize={12}
          allowDataOverflow={false}
        />
        {COEFFICIENTS_BTC_RAINBOW.map(({ name, color }) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={color}
            strokeWidth="20"
            dot={false}
            isAnimationActive={false}
            name={name}
          />
        ))}
        <Tooltip
          formatter={(value, name, props) => {
            const formattedValue =
              typeof value === "number"
                ? `$${Math.round(value).toLocaleString()}`
                : String(value);
            const itemColor =
              props.color ||
              COEFFICIENTS_BTC_RAINBOW.find((c) => c.name === name)?.color ||
              "#FFFFFF";
            return [
              <span
                key={`${name}-tooltip-${value}`}
                style={{ color: itemColor }}
              >
                {formattedValue}
              </span>,
              name,
            ];
          }}
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
          isAnimationActive={false}
          connectNulls={false}
        />
        {halvingDates.map((date) => {
          if (
            !actualChartStartDate ||
            date < actualChartStartDate ||
            date > chartData[chartData.length - 1].date
          ) {
            return null;
          }
          return (
            <ReferenceLine
              key={`halving-${date}`}
              x={date}
              stroke="white"
              strokeDasharray="3 3"
              label={{
                position: "top",
                value: "Halving",
                fill: "white",
                fontSize: 12,
                dy: -12,
              }}
            />
          );
        })}
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: "40px" }}
          iconType="circle"
          formatter={(value, entry) => (
            <span key={value} style={{ color: entry.color }}>
              {value}
            </span>
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BitcoinRainbowChart);
