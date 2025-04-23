import React, { useEffect, useState } from "react";
import Loading from "@components/Loading";

const RandomCoinGenerator = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadRandomCoinWidget = () => {
      const script = document.createElement("script");
      script.src = "https://widgets.coingecko.com/gecko-random-coin-widget.js";
      script.async = true;

      script.onload = () => {
        setIsLoaded(true);
      };

      script.onerror = (error) => {
        console.error(
          "Failed to load CoinGecko Random Coin widget script:",
          error
        );
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadRandomCoinWidget();
  }, []);

  return (
    <div
      className="random-coin-widget"
      style={{
        paddingTop: "20px",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {isLoaded ? (
        <div>
          <gecko-random-coin-widget
            locale="en"
            dark-mode="true"
            transparent-background="true"
          ></gecko-random-coin-widget>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default RandomCoinGenerator;
