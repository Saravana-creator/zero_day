// Authentication check for protected pages
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('authToken');
  const currentUser = localStorage.getItem('currentUser');
  
  if (!token || !currentUser) {
    window.location.href = '/login.html';
    return;
  }
  
  // Verify token is still valid
  fetch('http://localhost:5000/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login.html';
    }
  })
  .catch(error => {
    console.error('Auth check failed:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
  });
});