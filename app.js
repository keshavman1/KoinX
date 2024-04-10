const express = require('express');
const axios = require('axios');
const app = express();


app.use(express.json());

app.post('/api/price', async (req, res) => {
  try {

    const { fromCurrency, toCurrency, date } = req.body;

    const formattedDate = new Date(date).toISOString().slice(0, 10);

    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${formattedDate}`);
    const priceData = response.data.market_data.current_price[toCurrency];


    res.json({ price: priceData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
