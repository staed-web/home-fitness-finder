// Mock Product Data (2025 Trends: Foldable, Smart, Budget-Friendly)
const products = [
    { id: 1, name: 'Compact Treadmill Pro', category: 'Cardio', price: 799, rating: 4.5, image: 'https://source.unsplash.com/random/300x200/?treadmill', specs: { speed: '12 mph', foldable: true, app: true }, desc: 'Foldable for apartments, Bluetooth tracking.', affiliate: 'https://amazon.com/treadmill' },
    { id: 2, name: 'Adjustable Dumbbells Set', category: 'Strength', price: 149, rating: 4.8, image: 'https://source.unsplash.com/random/300x200/?dumbbells', specs: { weight: '5-50 lbs', material: 'Cast Iron' }, desc: 'Quick-adjust for full-body workouts.', affiliate: 'https://amazon.com/dumbbells' },
    { id: 3, name: 'Premium Yoga Mat', category: 'Accessories', price: 29, rating: 4.9, image: 'https://source.unsplash.com/random/300x200/?yoga-mat', specs: { thickness: '6mm', grip: 'Non-slip' }, desc: 'Eco-friendly, extra cushion for joints.', affiliate: 'https://amazon.com/yoga-mat' },
    { id: 4, name: 'Resistance Bands Kit', category: 'Strength', price: 39, rating: 4.2, image: 'https://source.unsplash.com/random/300x200/?resistance-bands', specs: { levels: '5', portable: true }, desc: 'Travel-friendly full resistance set.', affiliate: 'https://amazon.com/resistance-bands' },
    { id: 5, name: 'Elliptical Trainer Mini', category: 'Cardio', price: 199, rating: 4.3, image: 'https://source.unsplash.com/random/300x200/?elliptical', specs: { stride: '14in', quiet: true }, desc: 'Low-impact for knees, under-desk use.', affiliate: 'https://amazon.com/elliptical' },
    { id: 6, name: 'Kettlebell Swing Set', category: 'Strength', price: 89, rating: 4.6, image: 'https://source.unsplash.com/random/300x200/?kettlebell', specs: { weight: '20 lbs', handle: 'Ergonomic' }, desc: 'Versatile for HIIT and core.', affiliate: 'https://amazon.com/kettlebell' },
    { id: 7, name: 'Foam Roller Pro', category: 'Accessories', price: 25, rating: 4.4, image: 'https://source.unsplash.com/random/300x200/?foam-roller', specs: { length: '36in', density: 'High' }, desc: 'Recovery tool for muscle relief.', affiliate: 'https://amazon.com/foam-roller' },
    { id: 8, name: 'Rowing Machine Foldable', category: 'Cardio', price: 599, rating: 4.7, image: 'https://source.unsplash.com/random/300x200/?rowing-machine', specs: { resistance: 'Magnetic', foldable: true }, desc: 'Full-body cardio with app sync.', affiliate: 'https://amazon.com/rowing' },
    { id: 9, name: 'Pull-Up Bar Doorway', category: 'Strength', price: 35, rating: 4.1, image: 'https://source.unsplash.com/random/300x200/?pull-up-bar', specs: { weight: '300 lbs capacity', install: 'No tools' }, desc: 'Easy setup for upper body.', affiliate: 'https://amazon.com/pull-up-bar' },
    { id: 10, name: 'Jump Rope Smart', category: 'Cardio', price: 45, rating: 4.5, image: 'https://source.unsplash.com/random/300x200/?jump-rope', specs: { counter: 'Digital', adjustable: true }, desc: 'Tracks calories for cardio bursts.', affiliate: 'https://amazon.com/jump-rope' },
    { id: 11, name: 'Ab Wheel Roller', category: 'Strength', price: 19, rating: 4.0, image: 'https://source.unsplash.com/random/300x200/?ab-roller', specs: { grip: 'Dual', stable: true }, desc: 'Core builder for beginners.', affiliate: 'https://amazon.com/ab-roller' },
    { id: 12, name: 'Fitness Tracker Bands', category: 'Accessories', price: 79, rating: 4.6, image: 'https://source.unsplash.com/random/300x200/?fitness-tracker', specs: { battery: '7 days', water: 'Resistant' }, desc: 'Monitor workouts and heart rate.', affiliate: 'https://amazon.com/fitness-tracker' }
];

let filteredProducts = [...products];
let comparedProducts = [];

// Render Products
function renderProducts(productsToShow) {
    const grid = document.getElementById('products');
    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-rating="${product.rating}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">$${product.price}</p>
                <div class="rating">⭐ ${product.rating}</div>
                <button class="compare-btn" onclick="toggleCompare(${product.id})">Compare</button>
                <button onclick="openModal(${product.id})">View Details</button>
            </div>
        </div>
    `).join('');
}

// Filters
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = parseInt(document.getElementById('priceFilter').value);
    const minRating = parseInt(document.getElementById('ratingFilter').value) || 0;

    filteredProducts = products.filter(p => 
        (!category || p.category === category) &&
        p.price <= maxPrice &&
        p.rating >= minRating
    );
    renderProducts(filteredProducts);
    updatePriceDisplay(maxPrice);
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = 1000;
    document.getElementById('ratingFilter').value = '';
    filteredProducts = [...products];
    renderProducts(filteredProducts);
    updatePriceDisplay(1000);
}

function updatePriceDisplay(value) {
    document.getElementById('priceValue').textContent = `0 - $${value}`;
}

document.getElementById('priceFilter').addEventListener('input', (e) => updatePriceDisplay(e.target.value));

// Search
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filteredProducts);
}

// Comparison
function toggleCompare(id) {
    const index = comparedProducts.indexOf(id);
    if (index > -1) {
        comparedProducts.splice(index, 1);
    } else if (comparedProducts.length < 3) {
        comparedProducts.push(id);
    }
    renderCompareTable();
}

function renderCompareTable() {
    const tableBody = document.querySelector('#compareTable tbody');
    const headers = document.querySelectorAll('#comp1, #comp2, #comp3');
    headers.forEach((h, i) => h.textContent = comparedProducts[i] ? products.find(p => p.id === comparedProducts[i]).name : 'Product ' + (i+1));

    if (comparedProducts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Select products to compare</td></tr>';
        return;
    }

    const features = ['Price', 'Rating', 'Category', 'Key Specs'];
    tableBody.innerHTML = features.map(feature => {
        const row = `<tr><td>${feature}</td>`;
        return comparedProducts.reduce((acc, id) => {
            const p = products.find(prod => prod.id === id);
            let cell = p ? (feature === 'Price' ? `$${p.price}` : feature === 'Rating' ? `⭐ ${p.rating}` : feature === 'Category' ? p.category : JSON.stringify(p.specs)) : '';
            return acc + `<td>${cell}</td>`;
        }, row) + '</tr>';
    }).join('');
}

// Modal
function openModal(id) {
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('modal');
    document.getElementById('modalBody').innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:8px;">
        <h3>${product.name}</h3>
        <p>$${product.price} | ⭐ ${product.rating} | ${product.category}</p>
        <p>${product.desc}</p>
        <ul><li>${Object.entries(product.specs).map(([k,v]) => `${k}: ${v}`).join('</li><li>')}</li></ul>
        <a href="${product.affiliate}" target="_blank" class="buy-btn" style="display:block; background:#27ae60; color:white; padding:1rem; text-align:center; text-decoration:none; border-radius:4px;">Buy on Amazon</a>
    `;
    modal.style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => document.getElementById('modal').style.display = 'none');
window.onclick = (e) => { if (e.target.id === 'modal') e.target.style.display = 'none'; };

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    renderCompareTable();
});
