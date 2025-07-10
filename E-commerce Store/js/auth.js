// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  // Basic validation
  if (!user || !pass) {
    showError("Please enter both username and password");
    return;
  }

  // In a real app, this would be hashed and compared with stored hash
  // For demo purposes, we'll use a simple check
  const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
  
  if (storedUsers[user] && storedUsers[user].password === simpleHash(pass)) {
    // Create session
    const session = {
      user: user,
      loggedIn: true,
      lastActivity: new Date().getTime()
    };
    sessionStorage.setItem("session", JSON.stringify(session));
    
    // Redirect to home
    window.location.href = "index.html";
  } else {
    showError("Invalid username or password");
  }
}

function checkLogin() {
  const session = JSON.parse(sessionStorage.getItem("session"));
  
  // Check if session exists and is valid
  if (!session || !session.loggedIn || 
      (new Date().getTime() - session.lastActivity) > SESSION_TIMEOUT) {
    logout();
    return;
  }
  
  // Update last activity time
  session.lastActivity = new Date().getTime();
  sessionStorage.setItem("session", JSON.stringify(session));
}

function logout() {
  sessionStorage.removeItem("session");
  window.location.href = "login.html";
}

// Helper function for demo password hashing
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

function showError(message) {
  const errorElement = document.getElementById("error-message") || 
                       document.createElement("div");
  errorElement.id = "error-message";
  errorElement.style.color = "red";
  errorElement.style.margin = "10px 0";
  errorElement.textContent = message;
  
  const container = document.querySelector(".container");
  const button = document.querySelector(".container button");
  if (button && !document.getElementById("error-message")) {
    container.insertBefore(errorElement, button);
  } else if (errorElement.parentNode) {
    errorElement.textContent = message;
  }
}

// Register function for new users
function register() {
  const user = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  const confirmPass = document.getElementById('confirm-password').value.trim();

  if (!user || !pass) {
    showError("Please enter both username and password");
    return;
  }

  if (pass !== confirmPass) {
    showError("Passwords do not match");
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
  
  if (storedUsers[user]) {
    showError("Username already exists");
    return;
  }

  // Store hashed password
  storedUsers[user] = {
    password: simpleHash(pass),
    createdAt: new Date().toISOString()
  };
  
  localStorage.setItem("users", JSON.stringify(storedUsers));
  alert("Registration successful! Please login.");
  showLoginForm();
}

function showRegisterForm() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "block";
}

function showLoginForm() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
}