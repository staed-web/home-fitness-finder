const { AmazonPaapi } = require('amazon-paapi');
const fetch = require('node-fetch'); // For non-SDK fallback if needed

const paapi = new AmazonPaapi({
  accessKey: process.env.AMAZON_ACCESS_KEY,
  secretKey: process.env.AMAZON_SECRET_KEY,
  partnerTag: process.env.AMAZON_ASSOCIATE_TAG,
  host: 'webservices.amazon.in', // Or .com for US
  region: 'us-east-1' // Adjust for IN: ap-south-1
});

async function searchAmazon(query, category = 'Electronics', maxPrice = 5000, minRating = 0, page = 1) {
  try {
    const params = {
      Keywords: query || 'home fitness equipment',
      SearchIndex: category === 'Cardio' ? 'Sports' : category === 'Strength' ? 'Sports' : 'All',
      Resources: ['ItemInfo.Title', 'Offers.Listings.Price', 'Images.Primary.Medium', 'ItemInfo.ByLineInfo', 'CustomerReviews.StarRating'],
      ItemCount: 10,
      ItemPage: page
    };
    const response = await paapi.call('SearchItems', params);
    return response.SearchResult.Items.filter(item => {
      const price = parseFloat(item.Offers?.Listings?.[0]?.Price?.Amount || 0);
      const rating = parseFloat(item.CustomerReviews?.StarRating?.Value || 0);
      return price <= maxPrice && rating >= minRating;
    }).map(item => ({
      id: item.ASIN,
      name: item.ItemInfo.Title.DisplayValue,
      price: item.Offers?.Listings?.[0]?.Price?.Amount || 0,
      rating: parseFloat(item.CustomerReviews?.StarRating?.Value || 0),
      image: item.Images.Primary.Medium.URL,
      brand: item.ItemInfo.ByLineInfo?.Brand || 'Unknown',
      desc: item.ItemInfo.Title.DisplayValue, // Expand with more resources if needed
      affiliate: `https://amazon.in/dp/${item.ASIN}?tag=${process.env.AMAZON_ASSOCIATE_TAG}`
    }));
  } catch (error) {
    console.error('Amazon API Error:', error);
    return [];
  }
}

module.exports = { searchAmazon };