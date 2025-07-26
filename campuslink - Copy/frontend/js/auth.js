// Authentication utilities
const API_BASE = 'http://localhost:5000/api';

// Get token from localStorage
function getToken() {
  return localStorage.getItem('authToken');
}

// Set token in localStorage
function setToken(token) {
  localStorage.setItem('authToken', token);
}

// Remove token from localStorage
function removeToken() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = '/login.html';
    return;
  }

  return response;
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getToken();
}

// Get current user info
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Set current user info
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Logout
function logout() {
  removeToken();
  window.location.href = '/login.html';
}