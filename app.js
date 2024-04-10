const express = require('express');
const axios = require('axios');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define the API endpoint
app.post('/api/price', async (req, res) => {
  try {
    // Extract data from request body
    const { fromCurrency, toCurrency, date } = req.body;

    // Format date as required by Coingecko API
    const formattedDate = new Date(date).toISOString().slice(0, 10);

    // Fetch price from Coingecko API
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${formattedDate}`);
    const priceData = response.data.market_data.current_price[toCurrency];

    // Send response
    res.json({ price: priceData });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
