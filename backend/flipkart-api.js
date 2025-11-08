const fetch = require('node-fetch');

async function searchFlipkart(query, category = 'Sports', maxPrice = 5000, minRating = 0, page = 1) {
  try {
    const url = `http://affiliate-api.flipkart.com/affiliate/search/json?query=${encodeURIComponent(query || 'home fitness equipment')}&${category ? `&category=${category}` : ''}&${page > 1 ? `&start=${(page-1)*10}` : ''}&token=${process.env.FLIPKART_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    return (data.productInfoList || []).filter(product => {
      const price = parseFloat(product.sellingPrice || 0);
      const rating = parseFloat(product.inStock || 0); // Flipkart ratings via additional call if needed; mock for now
      return price <= maxPrice && rating >= minRating;
    }).map(product => ({
      id: product.productId || product.url.split('/').pop(),
      name: product.title || product.productInfo.title,
      price: product.sellingPrice || 0,
      rating: product.categorySpecificInfo?.rating || 4.0, // Fetch real if API supports
      image: product.imageUrls[0] || '',
      brand: product.categorySpecificInfo?.brand || 'Unknown',
      desc: product.description || product.title,
      affiliate: product.affiliateUrl || `https://www.flipkart.com${product.url}`
    }));
  } catch (error) {
    console.error('Flipkart API Error:', error);
    return [];
  }
}

module.exports = { searchFlipkart };