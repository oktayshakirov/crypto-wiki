const axios = require("axios");

// Function to fetch historical data
async function getHistoricalData(symbol, interval, startDate) {
  const baseUrl = "https://api.binance.com/api/v3/klines";
  const endTime = new Date().getTime(); // Current timestamp

  // Convert startDate to a timestamp in milliseconds
  const startTime = new Date(startDate).getTime();

  const params = {
    symbol: symbol,
    interval: interval, // '1d' for daily data
    startTime: startTime, // Starting from the specified date
    endTime: endTime, // Up until today
  };

  try {
    const response = await axios.get(baseUrl, { params });

    // Transforming the response data into the required format
    const transformedData = response.data.map((candle) => {
      const date = new Date(candle[0]); // Convert timestamp to date
      const closePrice = parseFloat(candle[4]); // Get closing price

      return {
        Date: date.toISOString().split("T")[0], // Format date as 'YYYY-MM-DD'
        Value: closePrice, // Closing price as the value
      };
    });

    console.log(transformedData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the function to get historical data
getHistoricalData("BTCUSDT", "1d", "2024-05-23");
