// Navigation and Profile functionality
function initNavigation() {
  // Create navigation bar
  const navBar = document.createElement('div');
  navBar.className = 'nav-bar';
  navBar.innerHTML = `
    <button class="nav-home" onclick="goHome()" title="Home">🏠</button>
    <button class="nav-profile" onclick="toggleProfile()" title="Profile">👤</button>
  `;
  
  // Create profile sidebar
  const profileSidebar = document.createElement('div');
  profileSidebar.className = 'profile-sidebar';
  profileSidebar.id = 'profileSidebar';
  
  const profileOverlay = document.createElement('div');
  profileOverlay.className = 'profile-overlay';
  profileOverlay.id = 'profileOverlay';
  profileOverlay.onclick = closeProfile;
  
  // Insert at beginning of body
  document.body.insertBefore(navBar, document.body.firstChild);
  document.body.appendChild(profileOverlay);
  document.body.appendChild(profileSidebar);
  
  // Load profile content
  loadProfileContent();
}

function goHome() {
  const currentPath = window.location.pathname;
  if (currentPath.includes('/admin/')) {
    window.location.href = 'admin_home.html';
  } else if (currentPath.includes('/student/')) {
    window.location.href = 'student_home.html';
  } else {
    window.location.href = 'login.html';
  }
}

function toggleProfile() {
  const sidebar = document.getElementById('profileSidebar');
  const overlay = document.getElementById('profileOverlay');
  
  if (sidebar.classList.contains('open')) {
    closeProfile();
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
}

function closeProfile() {
  const sidebar = document.getElementById('profileSidebar');
  const overlay = document.getElementById('profileOverlay');
  
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}

function loadProfileContent() {
  const sidebar = document.getElementById('profileSidebar');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  let userType = 'Guest';
  let userName = 'User';
  let userEmail = 'user@campuslink.edu';
  let avatar = '👤';
  
  if (currentUser.email) {
    userName = currentUser.name || currentUser.email.split('@')[0];
    userEmail = currentUser.email;
    
    if (currentUser.role === 'admin') {
      userType = 'Administrator';
      avatar = '👨‍💼';
    } else if (currentUser.role === 'student') {
      userType = 'Student';
      avatar = '👨‍🎓';
    }
  }
  
  sidebar.innerHTML = `
    <button class="profile-close" onclick="closeProfile()">×</button>
    <div class="profile-header">
      <div class="profile-avatar">${avatar}</div>
      <div class="profile-name">${userName}</div>
      <div class="profile-role">${userType}</div>
    </div>
    <div class="profile-content">
      <div class="profile-section">
        <h3>Account Information</h3>
        <div class="profile-item">
          <div class="profile-item-icon">📧</div>
          <div class="profile-item-content">
            <div class="profile-item-title">${userEmail}</div>
            <div class="profile-item-subtitle">Email Address</div>
          </div>
        </div>
        <div class="profile-item">
          <div class="profile-item-icon">🎓</div>
          <div class="profile-item-content">
            <div class="profile-item-title">${userType}</div>
            <div class="profile-item-subtitle">Role</div>
          </div>
        </div>
      </div>
      
      <div class="profile-section">
        <h3>Quick Actions</h3>
        <div class="profile-item" onclick="goHome()" style="cursor: pointer;">
          <div class="profile-item-icon">🏠</div>
          <div class="profile-item-content">
            <div class="profile-item-title">Dashboard</div>
            <div class="profile-item-subtitle">Go to home page</div>
          </div>
        </div>
        <div class="profile-item" onclick="logout()" style="cursor: pointer;">
          <div class="profile-item-icon">🚪</div>
          <div class="profile-item-content">
            <div class="profile-item-title">Logout</div>
            <div class="profile-item-subtitle">Sign out of account</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('rememberedEmail');
  localStorage.removeItem('rememberedPassword');
  localStorage.removeItem('rememberedRole');
  const currentPath = window.location.pathname;
  const loginPath = currentPath.includes('/admin/') || currentPath.includes('/student/') ? '../login.html' : 'login.html';
  window.location.href = loginPath;
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);