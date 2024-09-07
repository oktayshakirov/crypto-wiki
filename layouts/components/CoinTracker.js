import { useEffect, useState } from "react";
import axios from "axios";

const CoinTicker = () => {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchCoins = async () => {
      const storedData = localStorage.getItem("coinData");
      const storedTime = localStorage.getItem("coinDataTime");
      const currentTime = new Date().getTime();
      if (
        storedData &&
        storedTime &&
        currentTime - storedTime < 12 * 60 * 60 * 1000
      ) {
        setCoins(JSON.parse(storedData));
      } else {
        try {
          const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            {
              params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 10,
                page: 1,
              },
            }
          );
          setCoins(response.data);
          localStorage.setItem("coinData", JSON.stringify(response.data));
          localStorage.setItem("coinDataTime", currentTime.toString());
        } catch (error) {
          console.error("Error fetching coin data:", error);
        }
      }
    };

    fetchCoins();
  }, []);

  return (
    <div className="tickerContainer">
      <div className="tickerWrapper">
        <ul className="tickerList">
          {coins.map((coin) => (
            <li key={coin.id} className="tickerItem">
              <span className="coinName">{coin.name}</span>
              <span
                className={`coinPrice ${
                  coin.price_change_percentage_24h > 0 ? "green" : "red"
                }`}
              >
                ${coin.current_price.toFixed(2)}
              </span>
            </li>
          ))}
          {coins.map((coin) => (
            <li key={`${coin.id}-duplicate`} className="tickerItem">
              <span className="coinName">{coin.name}</span>
              <span
                className={`coinPrice ${
                  coin.price_change_percentage_24h > 0 ? "green" : "red"
                }`}
              >
                ${coin.current_price.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoinTicker;
