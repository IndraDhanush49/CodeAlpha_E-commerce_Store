function renderHeader() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const session = JSON.parse(sessionStorage.getItem("session"));

  document.getElementById("header").innerHTML = `
    <div class="header">
      <h1>MyShop</h1>
      <nav>
        <a href="index.html">Home</a>
        <a href="cart.html" class="cart-icon" data-count="${itemCount}">🛒</a>
        ${session ? `<span>Welcome, ${session.user}</span>` : ''}
        <a href="#" onclick="logout()">Logout</a>
      </nav>
    </div>
  `;
}

function renderFooter() {
  document.getElementById("footer").innerHTML = `
    <div class="footer">
      <p>© ${new Date().getFullYear()} MyShop. All rights reserved.</p>
    </div>
  `;
}

function renderSidebar() {
  document.getElementById("sidebar").innerHTML = `
    <div class="sidebar">
      <h3>Categories</h3>
      <ul>
        <li onclick="filterByCategory('electronics')">Electronics</li>
        <li onclick="filterByCategory('jewelery')">Jewelery</li>
        <li onclick="filterByCategory('men\'s clothing')">Men's Clothing</li>
        <li onclick="filterByCategory('women\'s clothing')">Women's Clothing</li>
        <li onclick="filterByCategory('')">All Categories</li>
      </ul>
    </div>
  `;
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("session");
    window.location.href = "login.html";
  }
}