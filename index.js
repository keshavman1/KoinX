const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');

const app = express();


app.use(express.json());

const mongoURI = 'mongodb+srv://keshav123:keshav123@cluster0.z7fqdy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const cryptoSchema = new mongoose.Schema({
    name: String,
    symbol: String,
    price: Number,
    marketCap: Number,
    volume: Number,
});

const Crypto = mongoose.model('Crypto', cryptoSchema);

mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB database');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

async function fetchCryptoData() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                per_page: 10,
                page: 1,
            },
        });

        const cryptoData = response.data.map((crypto) => ({
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
}


fetchCryptoData();

cron.schedule('0 * * * *', async () => {
    try {
        await fetchCryptoData();
    } catch (error) {
        console.error('Error:', error.message);
    }
});

app.post('/simple/prices', async (req, res) => {
    try {
        const { fromCurrency, toCurrency, date } = req.body;

      
        const currentPriceResponse = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}`);
        const currentPrice = currentPriceResponse.data[fromCurrency][toCurrency];

     
        const formattedDate = formatDate(date);
        const historicalPriceFromCurrencyResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${formattedDate}`);
        const historicalPriceToCurrencyResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${toCurrency}/history?date=${formattedDate}`);
        const historicalPriceFromCurrency = historicalPriceFromCurrencyResponse.data.market_data.current_price.usd;
        const historicalPriceToCurrency = historicalPriceToCurrencyResponse.data.market_data.current_price.usd;

       
        const calculatedPrice = historicalPriceFromCurrency / historicalPriceToCurrency;

        res.json({ 
            currentPrice: currentPrice,
            historicalPriceFromCurrency: historicalPriceFromCurrency,
            historicalPriceToCurrency: historicalPriceToCurrency,
            calculatedPrice: calculatedPrice 
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
}


app.get('/companies', async (req, res) => {
    try {
        const { currency } = req.query;

     
        if (!['bitcoin', 'ethereum'].includes(currency)) {
            return res.status(400).json({ error: 'Invalid currency parameter. Only bitcoin or ethereum are allowed.' });
        }

     
        const response = await axios.get(`https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`);
        const companies = response.data.companies;

     
        const formattedResponse = `Companies holding ${currency}:\n` +
            `Total Holdings: ${response.data.total_holdings}\n` +
            `Total Value (USD): ${response.data.total_value_usd}\n` +
            `Market Cap Dominance: ${response.data.market_cap_dominance}\n` +
            `List of Companies:\n`;

        const companiesList = companies.map((company, index) => {
            return `Company ${index + 1}:\n` +
                `Name: ${company.name}\n` +
                `Symbol: ${company.symbol}\n` +
                `Country: ${company.country}\n` +
                `Total Holdings: ${company.total_holdings}\n` +
                `Total Entry Value (USD): ${company.total_entry_value_usd}\n` +
                `Total Current Value (USD): ${company.total_current_value_usd}\n` +
                `Percentage of Total Supply: ${company.percentage_of_total_supply}\n` +
                `--------------------------\n`;
        });

        const finalResponse = formattedResponse + companiesList.join('');


        res.send(finalResponse);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the cryptocurrency price API!');
});

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});