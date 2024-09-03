import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaExclamationTriangle } from "react-icons/fa";
import Loading from "@components/Loading";

const CACHE_TIMEOUT = 60 * 60 * 1000; // Cache for 1 hour
let cache = null;
let lastFetchTime = 0;

const FearAndGreedIndexChart = () => {
  const [indexValue, setIndexValue] = useState(null);

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

  const getBackgroundColor = (value) => {
    if (value <= 24) return { color: "red", icon: <FaArrowDown /> };
    if (value <= 49)
      return { color: "orange", icon: <FaExclamationTriangle /> };
    if (value <= 74)
      return { color: "yellow", icon: <FaExclamationTriangle /> };
    return { color: "green", icon: <FaArrowUp /> };
  };

  return (
    <div className="fear-and-greed-index-chart" style={{ paddingTop: "20px" }}>
      {indexValue ? (
        <div
          style={{
            backgroundColor: getBackgroundColor(indexValue.value).color,
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "50px" }}>
            {getBackgroundColor(indexValue.value).icon}
          </div>
          <h2 className="h3 my-4">
            Current Index: {indexValue.value} -{" "}
            {indexValue.value_classification}
          </h2>
          <p style={{ fontSize: "14px" }}>
            Last updated:{" "}
            {new Date(indexValue.timestamp * 1000).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default FearAndGreedIndexChart;
