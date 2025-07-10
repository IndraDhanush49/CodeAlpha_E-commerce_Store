function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart");
  container.innerHTML = "<h2>Your Cart</h2>";

  if (cart.length === 0) {
    container.innerHTML += `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <a href="index.html" class="continue-shopping">Continue Shopping</a>
      </div>
    `;
    return;
  }

  let total = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    container.innerHTML += `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>₹${item.price} each</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${item.id}, -1)">−</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <p>₹${itemTotal.toFixed(2)}</p>
          <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </div>
      </div>
    `;
  });

  container.innerHTML += `
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>FREE</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>₹${total.toFixed(2)}</span>
      </div>
      <button onclick="goToPayment()" class="checkout-btn">Proceed to Checkout</button>
    </div>
  `;
}

function updateQuantity(id, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity += change;
    
    // Remove item if quantity is 0 or less
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== id);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    renderHeader();
  }
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderHeader();
  showToast("Item removed from cart");
}

function goToPayment() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }
  window.location.href = "payment.html";
}