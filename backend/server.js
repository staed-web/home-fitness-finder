require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { searchAmazon } = require('./amazon-paapi');
const { searchFlipkart } = require('./flipkart-api');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend')); // Serve frontend

app.get('/api/products', async (req, res) => {
  const { query = 'home fitness equipment', category = '', maxPrice = 5000, minRating = 0, page = 1, source = 'both' } = req.query;
  let amazonData = [], flipkartData = [];
  
  if (source === 'both' || source === 'amazon') amazonData = await searchAmazon(query, category, maxPrice, minRating, page);
  if (source === 'both' || source === 'flipkart') flipkartData = await searchFlipkart(query, category, maxPrice, minRating, page);
  
  // Merge & dedupe by name (simple)
  const merged = [...amazonData, ...flipkartData].filter((p, i, arr) => arr.findIndex(q => q.name === p.name) === i);
  
  res.json({ products: merged.slice(0, 10 * page), total: merged.length }); // Pagination
});

app.get('/api/compare', async (req, res) => {
  const { ids } = req.query; // Comma-separated ASINs/ProductIDs
  // Fetch details for each ID from respective APIs
  // Simplified: Return mock for now; expand with GetItem calls
  res.json({ compared: ids.split(',').map(id => ({ id, details: 'Live data here' })) });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT}`));