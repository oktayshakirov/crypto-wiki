const axios = require("axios");

async function getHistoricalData(symbol, interval, startDate) {
  const baseUrl = "https://api.binance.com/api/v3/klines";
  const endTime = new Date().getTime();
  const startTime = new Date(startDate).getTime();

  const params = {
    symbol: symbol,
    interval: interval,
    startTime: startTime,
    endTime: endTime,
  };

  try {
    const response = await axios.get(baseUrl, { params });
    const transformedData = response.data.map((candle) => {
      const date = new Date(candle[0]);
      const closePrice = parseFloat(candle[4]);

      return {
        Date: date.toISOString().split("T")[0],
        Value: closePrice,
      };
    });

    console.log(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getHistoricalData("BTCUSDT", "1d", "2025-05-13");
