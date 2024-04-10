
const axios = require('axios');
const Crypto = require('./src/Models/CryptoModels');

const CoingeckoService = {
  async ping() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/ping');
      return response.data;
    } catch (error) {
      throw new Error('Error pinging Coingecko API');
    }
  },

  async fetchCryptoData() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          per_page: 10,
          page: 1,
        },
      });

      const cryptoData = response.data.map(crypto => ({
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.current_price,
        marketCap: crypto.market_cap,
        volume: crypto.total_volume,
      }));


      await Crypto.deleteMany({});


      await Crypto.insertMany(cryptoData);
      console.log('Cryptocurrency data saved to MongoDB.');
    } catch (error) {
      throw new Error('Error fetching cryptocurrency data from Coingecko API');
    }
  },
};

module.exports = CoingeckoService;
