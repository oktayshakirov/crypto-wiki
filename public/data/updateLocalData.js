const axios = require("axios");
const fs = require("fs");

const bitcoinDataFile = "./bitcoin_data.json";

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
    return transformedData;
  } catch (error) {
    console.error("Error fetching new data:", error);
    return [];
  }
}

async function updateBitcoinData() {
  fs.readFile(bitcoinDataFile, "utf8", async (err, fileData) => {
    let existingData = [];
    let lastDate = null;

    if (err && err.code === "ENOENT") {
      console.log("bitcoin_data.json not found. Will create a new file.");
      lastDate = new Date("2012-11-27");
    } else if (err) {
      console.error("Error reading bitcoin_data.json:", err);
      return;
    } else {
      try {
        existingData = JSON.parse(fileData);
        if (existingData.length > 0) {
          existingData.sort((a, b) => new Date(a.Date) - new Date(b.Date));
          const lastEntry = existingData[existingData.length - 1];
          lastDate = new Date(lastEntry.Date);
        } else {
          lastDate = new Date("2012-11-27");
        }
      } catch (parseErr) {
        console.error("Error parsing JSON from bitcoin_data.json:", parseErr);
        return;
      }
    }

    const nextFetchDate = new Date(lastDate);
    nextFetchDate.setDate(nextFetchDate.getDate() + 1);
    const startDateString = nextFetchDate.toISOString().split("T")[0];

    if (new Date(startDateString) > new Date()) {
      console.log("Bitcoin data is already up to date.");
      return;
    }

    console.log(`Workspaceing new Bitcoin data from ${startDateString}...`);
    const newData = await getHistoricalData("BTCUSDT", "1d", startDateString);

    if (newData.length > 0) {
      const uniqueNewData = newData.filter(
        (newItem) =>
          !existingData.some((oldItem) => oldItem.Date === newItem.Date)
      );

      const updatedData = existingData.concat(uniqueNewData);
      updatedData.sort((a, b) => new Date(a.Date) - new Date(b.Date));

      fs.writeFile(
        bitcoinDataFile,
        JSON.stringify(updatedData, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error(
              "Error writing updated data to bitcoin_data.json:",
              writeErr
            );
          } else {
            console.log(
              "Successfully updated bitcoin_data.json with new prices."
            );
          }
        }
      );
    } else {
      console.log(
        "No new data fetched. The file is likely up to date or the API returned no data for the period."
      );
    }
  });
}

updateBitcoinData();
