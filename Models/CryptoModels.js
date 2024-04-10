// cryptoModel.js
const mongoose = require('mongoose');
// const Crypto = require('./Models/CryptoModel'); // Use relative path to the Models folder

const cryptoSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  marketCap: Number,
  volume: Number,
});

module.exports = mongoose.model('Crypto', cryptoSchema);
