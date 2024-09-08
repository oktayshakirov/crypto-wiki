import React, { useEffect, useState } from "react";
import Loading from "@components/Loading";

const Heatmap = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadHeatmapWidget = () => {
      const script = document.createElement("script");
      script.src = "https://widgets.coingecko.com/gecko-coin-heatmap-widget.js";
      script.async = true;

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = (error) => {
        console.error("Failed to load CoinGecko Heatmap widget script:", error);
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadHeatmapWidget();
  }, []);

  return (
    <div className="crypto-heatmap-widget" style={{ paddingTop: "20px" }}>
      {isLoaded ? (
        <div>
          <gecko-coin-heatmap-widget
            locale="en"
            dark-mode="true"
            transparent-background="true"
            top="25"
          ></gecko-coin-heatmap-widget>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Heatmap;
