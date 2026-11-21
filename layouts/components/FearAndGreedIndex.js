import React, { useEffect, useState } from "react";
import Loading from "@components/Loading";

const CACHE_TIMEOUT = 240 * 60 * 1000; // Cache for 4 hours
let cache = null;
let lastFetchTime = 0;

// initialValue is the API reading baked in at build time (see
// pages/tools/fear-and-greed-index.js), so the score is in the static HTML
// that Google indexes. The client fetch below still refreshes it on load.
const FearAndGreedIndexChart = ({ initialValue = null }) => {
  const [indexValue, setIndexValue] = useState(initialValue);

  useEffect(() => {
    const fetchIndexData = async () => {
      const now = new Date().getTime();
      if (cache && now - lastFetchTime < CACHE_TIMEOUT) {
        setIndexValue(cache);
        return;
      }

      try {
        const response = await fetch("https://api.alternative.me/fng/?limit=1");
        const data = await response.json();
        cache = data.data[0];
        lastFetchTime = now;
        setIndexValue(cache);
      } catch (error) {
        console.error("Error fetching Fear and Greed Index data:", error);
      }
    };

    fetchIndexData();

    const interval = setInterval(fetchIndexData, CACHE_TIMEOUT);

    return () => clearInterval(interval);
  }, []);

  // Bands match alternative.me's classification and the legend on the tool
  // page (0-24 / 25-49 / 50-54 / 55-74 / 75-100).
  const getSmileyAndBackgroundGradient = (value) => {
    if (value <= 24)
      return {
        label: "Extreme Fear",
        smiley: "😱",
        background: "linear-gradient(to right, #f85032, #e73827)",
      };
    if (value <= 49)
      return {
        label: "Fear",
        smiley: "😢",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
      };
    if (value <= 54)
      return {
        label: "Neutral",
        smiley: "😐",
        background: "linear-gradient(to right, #f2c94c, #f2994a)",
      };
    if (value <= 74)
      return {
        label: "Greed",
        smiley: "🙂",
        background: "linear-gradient(to right, #a8ff78, #78ffd6)",
      };
    return {
      label: "Extreme Greed",
      smiley: "😁",
      background: "linear-gradient(to right, #56ab2f, #a8e063)",
    };
  };

  if (!indexValue) {
    return <Loading />;
  }

  const numericValue = parseInt(indexValue.value, 10);
  const { smiley, background, label } =
    getSmileyAndBackgroundGradient(numericValue);

  return (
    <div className="fear-and-greed-index-chart" style={{ paddingTop: "20px" }}>
      <div
        style={{
          background: background,
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          color: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "50px", color: "black" }}>{smiley}</div>
        <h2 className="h3 my-4" style={{ color: "black" }}>
          Current Index: {numericValue} - {label}
        </h2>
        <p style={{ fontSize: "14px", color: "black" }}>
          Last updated:{" "}
          {/* Fixed locale and zone so the build-time HTML and the hydrated
              client render the same string. */}
          {new Date(indexValue.timestamp * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </p>
      </div>
    </div>
  );
};

export default FearAndGreedIndexChart;
