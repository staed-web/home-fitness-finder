let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const PAGE_SIZE = 10;
const API_BASE = 'http://localhost:3000'; // Change to your deployed URL

async function fetchProducts(query = '', source = 'both', page = 1) {
  document.querySelector('.loading').style.display = 'block';
  try {
    const params = new URLSearchParams({ query, source, page, maxPrice: document.getElementById('priceFilter').value, minRating: document.getElementById('ratingFilter').value || 0 });
    const response = await fetch(`${API_BASE}/api/products?${params}`);
    const data = await response.json();
    allProducts = data.products;
    renderProducts(allProducts.slice(0, PAGE_SIZE));
    renderPagination(data.total);
  } catch (error) {
    console.error('Fetch Error:', error);
    document.querySelector('.loading').textContent = 'Error loading data. Check API keys.';
  }
  document.querySelector('.loading').style.display = 'none';
}

function renderProducts(products) {
  const grid = document.getElementById('products');
  grid.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <div class="rating">⭐ ${product.rating}</div>
        <p class="brand">${product.brand} | <a href="${product.affiliate}" target="_blank">Buy</a></p>
        <button class="compare-btn" onclick="toggleCompare('${product.id}')">Compare</button>
        <button onclick="openModal('${product.id}')">Details</button>
        <button onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function renderPagination(total) {
  const nav = document.getElementById('pagination');
  const pages = Math.ceil(total / PAGE_SIZE);
  nav.innerHTML = Array.from({length: pages}, (_, i) => `<button onclick="fetchProducts('', '${document.getElementById('sourceFilter').value}', ${i+1})" ${i+1 === currentPage ? 'class=active' : ''}>${i+1}</button>`).join('');
}

async function applyFilters() {
  const source = document.getElementById('sourceFilter').value;
  currentPage = 1;
  await fetchProducts(document.getElementById('searchInput').value, source, 1);
}

function clearFilters() {
  // Reset form values
  currentPage = 1;
  fetchProducts();
}

async function searchProducts() {
  const query = document.getElementById('searchInput').value;
  const source = document.getElementById('sourceSelect').value;
  currentPage = 1;
  await fetchProducts(query, source, 1);
}

// Comparison (fetch details)
async function toggleCompare(id) {
  // Similar to before, but fetch `/api/compare?id=${id}`
  const response = await fetch(`${API_BASE}/api/compare?ids=${id}`);
  const data = await response.json();
  // Update table with data.compared
  renderCompareTable(data.compared); // Adapt previous function
}

// Modal (enhanced with live fetch if needed)
async function openModal(id) {
  // Fetch full details if not in local
  const product = allProducts.find(p => p.id === id) || { name: 'Loading...', price: 0 };
  // Render as before, but add: await fetch(`${API_BASE}/api/product/${id}`) for more
}

// Cart (localStorage)
function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(allProducts.find(p => p.id === id));
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  // Other listeners: hamburger, search enter, etc. (unchanged)
});

// Debounce for search
let debounceTimer;
document.getElementById('searchInput').addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(searchProducts, 500);
});