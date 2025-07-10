let products = [];
let filteredProducts = [];

async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=20");
    if (!res.ok) throw new Error("Failed to load products");
    products = await res.json();
    // Convert prices to INR and add formatted title
    products = products.map(p => ({
      ...p,
      priceINR: Math.round(p.price * 80),
      shortTitle: p.title.length > 30 ? p.title.substring(0, 30) + "..." : p.title
    }));
    filteredProducts = [...products];
    renderProducts();
    renderCategoryFilter();
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("product-list").innerHTML = `
      <div class="error-message">
        <p>Failed to load products. Please try again later.</p>
        <button onclick="loadProducts()">Retry</button>
      </div>
    `;
  }
}

function renderProducts() {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>No products found matching your criteria.</p>
        <button onclick="resetFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  filteredProducts.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.image}" alt="${p.title}"
             style="width: 100%; height: 200px; object-fit: contain; background: #fff; padding: 10px; border-radius: 5px;">
        <h3 title="${p.title}">${p.shortTitle}</h3>
        <p>Price: ₹${p.priceINR}</p>
        <div class="product-actions">
          <button onclick="addToCart(${p.id})">Add to Cart</button>
          <button class="view-details" onclick="showProductDetails(${p.id})">Details</button>
        </div>
      </div>
    `;
  });
}

function renderCategoryFilter() {
  const categories = [...new Set(products.map(p => p.category))];
  const filterContainer = document.getElementById("category-filter");
  
  if (filterContainer) {
    filterContainer.innerHTML = `
      <select onchange="filterByCategory(this.value)">
        <option value="">All Categories</option>
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      </select>
    `;
  }
}

function filterByCategory(category) {
  if (!category) {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(p => p.category === category);
  }
  renderProducts();
}

function searchProducts() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm) || 
    p.description.toLowerCase().includes(searchTerm)
  );
  renderProducts();
}

function resetFilters() {
  document.getElementById("search-input").value = "";
  document.getElementById("category-filter").querySelector("select").value = "";
  filteredProducts = [...products];
  renderProducts();
}

function showProductDetails(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <div class="modal-body">
        <div class="modal-image">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-details">
          <h2>${product.title}</h2>
          <p class="price">₹${product.priceINR}</p>
          <p>${product.description}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
          <button onclick="addToCart(${product.id}); this.parentElement.parentElement.parentElement.remove()">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id,
      name: item.title,
      price: item.priceINR,
      quantity: 1,
      image: item.image
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Added to cart!");
  if (typeof renderHeader === "function") renderHeader();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }, 10);
}

// Load products when the page loads
loadProducts();