// Global state
let currentUser = null;
let skills = [];
let sessions = [];
let currentSkillForSession = null;
let currentView = 'grid';
let confirmCallback = null;

// DOM elements
const elements = {
    // Auth
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    authModal: document.getElementById('authModal'),
    closeModal: document.getElementById('closeModal'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    loginFormElement: document.getElementById('loginFormElement'),
    registerFormElement: document.getElementById('registerFormElement'),
    
    // Navigation
    authButtons: document.getElementById('authButtons'),
    userMenu: document.getElementById('userMenu'),
    userName: document.getElementById('userName'),
    profileTrigger: document.getElementById('profileTrigger'),
    profileDropdown: document.getElementById('profileDropdown'),
    profileName: document.getElementById('profileName'),
    profileEmail: document.getElementById('profileEmail'),
    logoutBtn: document.getElementById('logoutBtn'),
    editProfileBtn: document.getElementById('editProfileBtn'),
    changePasswordBtn: document.getElementById('changePasswordBtn'),
    
    // Hero
    getStartedBtn: document.getElementById('getStartedBtn'),
    watchDemoBtn: document.getElementById('watchDemoBtn'),
    
    // Dashboard
    dashboard: document.getElementById('dashboard'),
    
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Browse
    categoryFilter: document.getElementById('categoryFilter'),
    levelFilter: document.getElementById('levelFilter'),
    searchInput: document.getElementById('searchInput'),
    skillsCount: document.getElementById('skillsCount'),
    skillsGrid: document.getElementById('skillsGrid'),
    noResults: document.getElementById('noResults'),
    
    // Create Skill
    createSkillForm: document.getElementById('createSkillForm'),
    skillTitle: document.getElementById('skillTitle'),
    skillDescription: document.getElementById('skillDescription'),
    skillTitleCounter: document.getElementById('skillTitleCounter'),
    skillDescCounter: document.getElementById('skillDescCounter'),
    
    // My Skills
    mySkillsContainer: document.getElementById('mySkillsContainer'),
    
    // Ratings
    skillRatingsContainer: document.getElementById('skillRatingsContainer'),
    sessionRatingsContainer: document.getElementById('sessionRatingsContainer'),
    
    // Sessions
    createSessionForm: document.getElementById('createSessionForm'),
    sessionsContainer: document.getElementById('sessionsContainer'),
    sessionsStats: document.getElementById('sessionsStats'),
    sessionStatusFilter: document.getElementById('sessionStatusFilter'),
    
    // Modals
    userValidationModal: document.getElementById('userValidationModal'),
    closeValidationModal: document.getElementById('closeValidationModal'),
    userValidationForm: document.getElementById('userValidationForm'),
    editProfileModal: document.getElementById('editProfileModal'),
    closeEditProfileModal: document.getElementById('closeEditProfileModal'),
    editProfileForm: document.getElementById('editProfileForm'),
    changePasswordModal: document.getElementById('changePasswordModal'),
    closeChangePasswordModal: document.getElementById('closeChangePasswordModal'),
    changePasswordForm: document.getElementById('changePasswordForm'),
    editSkillModal: document.getElementById('editSkillModal'),
    closeEditSkillModal: document.getElementById('closeEditSkillModal'),
    editSkillForm: document.getElementById('editSkillForm'),
    helpModal: document.getElementById('helpModal'),
    closeHelpModal: document.getElementById('closeHelpModal'),
    termsModal: document.getElementById('termsModal'),
    closeTermsModal: document.getElementById('closeTermsModal'),
    privacyModal: document.getElementById('privacyModal'),
    closePrivacyModal: document.getElementById('closePrivacyModal'),
    confirmModal: document.getElementById('confirmModal'),
    confirmOk: document.getElementById('confirmOk'),
    confirmCancel: document.getElementById('confirmCancel'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    
    // Rating Modal
    ratingModal: document.getElementById('ratingModal'),
    closeRatingModal: document.getElementById('closeRatingModal'),
    ratingForm: document.getElementById('ratingForm'),
    ratingDescription: document.getElementById('ratingDescription'),
    starRating: document.getElementById('starRating'),
    
    // Utility
    notificationContainer: document.getElementById('notificationContainer'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    loadingText: document.getElementById('loadingText'),
    floatingHelpBtn: document.getElementById('floatingHelpBtn')
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

function initializeApp() {
    // Check for saved user
    const savedUser = localStorage.getItem('campuslink_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    // Always show dashboard
    showDashboard();
    
    // Load saved data
    const savedSkills = localStorage.getItem('campuslink_skills');
    if (savedSkills) {
        skills = JSON.parse(savedSkills);
    }
    
    const savedSessions = localStorage.getItem('campuslink_sessions');
    if (savedSessions) {
        sessions = JSON.parse(savedSessions);
    }
}

function setupEventListeners() {
    // Auth buttons
    elements.loginBtn?.addEventListener('click', () => showAuthModal('login'));
    elements.registerBtn?.addEventListener('click', () => showAuthModal('register'));
    elements.getStartedBtn?.addEventListener('click', () => showAuthModal('register'));
    elements.watchDemoBtn?.addEventListener('click', () => showNotification('Demo feature coming soon! 🎬', 'info'));
    
    // Modal controls
    elements.closeModal?.addEventListener('click', hideAuthModal);
    elements.showRegister?.addEventListener('click', () => switchAuthForm('register'));
    elements.showLogin?.addEventListener('click', () => switchAuthForm('login'));
    
    // Forms
    elements.loginFormElement?.addEventListener('submit', handleLogin);
    elements.registerFormElement?.addEventListener('submit', handleRegister);
    elements.createSkillForm?.addEventListener('submit', handleCreateSkill);
    elements.createSessionForm?.addEventListener('submit', handleCreateSession);
    elements.userValidationForm?.addEventListener('submit', handleUserValidation);
    elements.editProfileForm?.addEventListener('submit', handleEditProfile);
    elements.changePasswordForm?.addEventListener('submit', handleChangePassword);
    elements.editSkillForm?.addEventListener('submit', handleEditSkill);
    
    // Profile dropdown
    elements.profileTrigger?.addEventListener('click', toggleProfileDropdown);
    elements.logoutBtn?.addEventListener('click', handleLogout);
    elements.editProfileBtn?.addEventListener('click', showEditProfileModal);
    elements.changePasswordBtn?.addEventListener('click', showChangePasswordModal);
    
    // Modal close buttons
    elements.closeValidationModal?.addEventListener('click', () => hideModal('userValidationModal'));
    elements.closeEditProfileModal?.addEventListener('click', () => hideModal('editProfileModal'));
    elements.closeChangePasswordModal?.addEventListener('click', () => hideModal('changePasswordModal'));
    elements.closeEditSkillModal?.addEventListener('click', () => hideModal('editSkillModal'));
    elements.closeHelpModal?.addEventListener('click', () => hideModal('helpModal'));
    elements.closeTermsModal?.addEventListener('click', () => hideModal('termsModal'));
    elements.closePrivacyModal?.addEventListener('click', () => hideModal('privacyModal'));
    elements.closeRatingModal?.addEventListener('click', () => hideModal('ratingModal'));
    elements.ratingForm?.addEventListener('submit', handleRatingSubmit);
    
    // Help and info
    elements.floatingHelpBtn?.addEventListener('click', () => showModal('helpModal'));
    
    // Confirm modal
    elements.confirmOk?.addEventListener('click', handleConfirmOk);
    elements.confirmCancel?.addEventListener('click', hideConfirmModal);
    
    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Filters
    elements.categoryFilter?.addEventListener('change', filterSkills);
    elements.levelFilter?.addEventListener('change', filterSkills);
    elements.searchInput?.addEventListener('input', debounce(filterSkills, 300));
    elements.sessionStatusFilter?.addEventListener('change', filterSessions);
    
    // View controls
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    
    // Character counters
    elements.skillTitle?.addEventListener('input', updateCharCounter);
    elements.skillDescription?.addEventListener('input', updateCharCounter);
    
    // Password strength
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', updatePasswordStrength);
    }
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
        
        // Close profile dropdown when clicking outside
        if (elements.profileTrigger && elements.profileDropdown) {
            if (!elements.profileTrigger.contains(e.target) && !elements.profileDropdown.contains(e.target)) {
                elements.profileDropdown.classList.add('hidden');
            }
        }
    });
    
    // Set minimum date for session scheduling
    const sessionDate = document.getElementById('sessionDate');
    if (sessionDate) {
        sessionDate.min = new Date().toISOString().split('T')[0];
    }
    
    // Dynamic star rating functionality
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            const stars = e.target.parentElement.querySelectorAll('.star');
            stars.forEach((star, index) => {
                star.textContent = index < rating ? '⭐' : '☆';
                star.style.transform = index < rating ? 'scale(1.2)' : 'scale(1)';
            });
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('star')) {
            const container = e.target.parentElement;
            const selectedRating = container.dataset.selectedRating || 0;
            const stars = container.querySelectorAll('.star');
            stars.forEach((star, index) => {
                star.textContent = index < selectedRating ? '⭐' : '☆';
                star.style.transform = 'scale(1)';
            });
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            const container = e.target.parentElement;
            container.dataset.selectedRating = rating;
            const stars = container.querySelectorAll('.star');
            stars.forEach((star, index) => {
                star.textContent = index < rating ? '⭐' : '☆';
            });
            
            // Show professional feedback
            const feedback = ['Needs Improvement', 'Below Average', 'Satisfactory', 'Good Quality', 'Outstanding'];
            const ratingText = document.getElementById('ratingText');
            if (ratingText) {
                ratingText.textContent = `${feedback[rating-1]} (${rating}/5)`;
            }
        }
    });
}

function handleCreateSkill(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to create skills', 'error');
        return;
    }
    
    const title = document.getElementById('skillTitle').value.trim();
    const description = document.getElementById('skillDescription').value.trim();
    const category = document.getElementById('skillCategory').value;
    const level = document.getElementById('skillLevel').value;
    
    if (!title || !description || !category || !level) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showLoading('Adding your skill...');
    
    setTimeout(() => {
        const skillData = {
            id: Date.now(),
            title: title,
            description: description,
            category: category,
            level: level,
            teacherId: currentUser.id,
            teacherName: currentUser.name,
            createdAt: new Date().toISOString(),
            views: 0,
            requests: 0,
            ratings: []
        };
        
        skills.push(skillData);
        localStorage.setItem('skillshare_skills', JSON.stringify(skills));
        
        // Reset form
        elements.createSkillForm.reset();
        if (elements.skillTitleCounter) elements.skillTitleCounter.textContent = '0';
        if (elements.skillDescCounter) elements.skillDescCounter.textContent = '0';
        
        hideLoading();
        showNotification('Skill added successfully! ✨', 'success');
        
        // Switch to My Skills tab and refresh
        setTimeout(() => {
            switchTab('my-skills');
        }, 100);
    }, 1000);
}

// Enhanced Auth functions
function showAuthModal(type) {
    elements.authModal.style.display = 'block';
    switchAuthForm(type);
    
    // Focus first input
    setTimeout(() => {
        const firstInput = elements.authModal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 100);
}

function hideAuthModal() {
    elements.authModal.style.display = 'none';
}

function switchAuthForm(type) {
    if (type === 'login') {
        elements.loginForm.classList.remove('hidden');
        elements.registerForm.classList.add('hidden');
    } else {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.remove('hidden');
    }
}

function handleLogin(e) {
    e.preventDefault();
    showLoading('Signing you in...');
    
    setTimeout(() => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const users = JSON.parse(localStorage.getItem('skillshare_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('skillshare_user', JSON.stringify(user));
            
            hideLoading();
            hideAuthModal();
            showDashboard();
            showNotification(`Welcome back, ${user.name}! 🎉`, 'success');
        } else {
            hideLoading();
            showNotification('Invalid email or password', 'error');
        }
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    if (!agreeTerms) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    showLoading('Creating your account...');
    
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('skillshare_users') || '[]');
        if (users.find(u => u.email === email)) {
            hideLoading();
            showNotification('User already exists with this email', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            isNewUser: true
        };
        
        users.push(newUser);
        localStorage.setItem('skillshare_users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('skillshare_user', JSON.stringify(newUser));
        
        hideLoading();
        hideAuthModal();
        showDashboard();
        showNotification(`Welcome to SkillShare, ${name}! 🎉`, 'success');
    }, 1500);
}

function handleLogout() {
    showConfirm('Logout', 'Are you sure you want to logout?', () => {
        currentUser = null;
        localStorage.removeItem('skillshare_user');
        hideDashboard();
        showNotification('Logged out successfully', 'info');
    });
}

// Dashboard functions
function showDashboard() {
    if (currentUser) {
        elements.authButtons.classList.add('hidden');
        elements.userMenu.classList.remove('hidden');
        
        // Update user info in profile
        elements.userName.textContent = currentUser.name;
        elements.profileName.textContent = currentUser.name;
        elements.profileEmail.textContent = currentUser.email;
        
        // Update user initials
        const initial = currentUser.name.charAt(0).toUpperCase();
        const userInitial = document.getElementById('userInitial');
        const userInitialLarge = document.getElementById('userInitialLarge');
        if (userInitial) userInitial.textContent = initial;
        if (userInitialLarge) userInitialLarge.textContent = initial;
    } else {
        elements.authButtons.classList.remove('hidden');
        elements.userMenu.classList.add('hidden');
    }
    
    elements.dashboard.classList.remove('hidden');
    
    loadSkills();
    loadMySkills();
    loadSessions();
}

function hideDashboard() {
    elements.authButtons.classList.remove('hidden');
    elements.userMenu.classList.add('hidden');
    // Keep dashboard visible, just show auth buttons
}

function switchTab(tabName) {
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabName + 'Tab');
    });
    
    if (tabName === 'browse') {
        loadSkills();
    } else if (tabName === 'my-skills') {
        loadMySkills();
    } else if (tabName === 'sessions') {
        loadSessions();
    } else if (tabName === 'ratings') {
        loadRatings();
    }
}

// Skills functions
function loadSkills() {
    const filteredSkills = getFilteredSkills();
    elements.skillsCount.textContent = `${filteredSkills.length} skill${filteredSkills.length !== 1 ? 's' : ''} found`;
    
    if (filteredSkills.length === 0) {
        elements.skillsGrid.classList.add('hidden');
        if (elements.noResults) elements.noResults.classList.remove('hidden');
        return;
    }
    
    elements.skillsGrid.classList.remove('hidden');
    if (elements.noResults) elements.noResults.classList.add('hidden');
    
    elements.skillsGrid.innerHTML = filteredSkills.map(skill => `
        <div class="skill-card" data-skill-id="${skill.id}">
            <div class="skill-header">
                <div>
                    <div class="skill-title">${skill.title}</div>
                    <div class="skill-teacher">by ${skill.teacherName}</div>
                </div>
                <div class="skill-badges">
                    <span class="skill-category">${getCategoryIcon(skill.category)} ${skill.category}</span>
                    <span class="skill-level">${getLevelIcon(skill.level)} ${skill.level}</span>
                </div>
            </div>
            <div class="skill-description">${skill.description}</div>
            <div class="skill-stats">
                <span class="skill-stat">👁️ ${skill.views || 0} views</span>
                <span class="skill-stat">📝 ${skill.requests || 0} requests</span>
                <span class="skill-stat" id="rating-${skill.id}">⭐ ${calculateAverageRating(skill.ratings || []).toFixed(1)} (${(skill.ratings || []).length} reviews)</span>
            </div>
            <div class="skill-actions">
                <button class="btn btn-gradient btn-small" onclick="requestSkillSession('${skill.id}')">
                    <span class="btn-icon">🎯</span>
                    Request Session
                </button>
                <button class="btn btn-outline btn-small" onclick="showRatingModal('${skill.id}', 'skill', '${skill.title}')">
                    <span class="btn-icon">📝</span>
                    Evaluate
                </button>
            </div>
        </div>
    `).join('');
}

function loadMySkills() {
    if (!currentUser) {
        elements.mySkillsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3rem; margin-bottom: 16px;">🔐</div>
                <h3>Please login to view your skills</h3>
            </div>
        `;
        return;
    }
    
    const mySkills = skills.filter(skill => skill.teacherId == currentUser.id);
    
    if (mySkills.length === 0) {
        elements.mySkillsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3rem; margin-bottom: 16px;">📚</div>
                <h3>No skills added yet</h3>
                <p>Start by adding your first skill to share with others!</p>
                <button class="btn btn-gradient" onclick="switchTab('create')" style="margin-top: 20px;">
                    <span class="btn-icon">✨</span>
                    Add Your First Skill
                </button>
            </div>
        `;
        return;
    }
    
    elements.mySkillsContainer.innerHTML = mySkills.map(skill => `
        <div class="my-skill-card" data-skill-id="${skill.id}">
            <div class="skill-header">
                <div>
                    <div class="skill-title">${skill.title}</div>
                    <div class="skill-teacher">Created ${formatDate(skill.createdAt)}</div>
                </div>
                <div class="skill-badges">
                    <span class="skill-category">${getCategoryIcon(skill.category)} ${skill.category}</span>
                    <span class="skill-level">${getLevelIcon(skill.level)} ${skill.level}</span>
                </div>
            </div>
            <div class="skill-description">${skill.description}</div>
            <div class="my-skill-actions">
                <button class="btn btn-edit btn-small" onclick="editSkill('${skill.id}')">
                    <span class="btn-icon">✏</span>
                    Edit
                </button>
                <button class="btn btn-delete btn-small" onclick="deleteSkill('${skill.id}')">
                    <span class="btn-icon">🗑</span>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function getFilteredSkills() {
    let filtered = [...skills];
    
    const category = elements.categoryFilter?.value;
    const level = elements.levelFilter?.value;
    const search = elements.searchInput?.value.toLowerCase();
    
    if (category) {
        filtered = filtered.filter(skill => skill.category === category);
    }
    
    if (level) {
        filtered = filtered.filter(skill => skill.level === level);
    }
    
    if (search) {
        filtered = filtered.filter(skill => 
            skill.title.toLowerCase().includes(search) ||
            skill.description.toLowerCase().includes(search) ||
            skill.teacherName.toLowerCase().includes(search)
        );
    }
    
    return filtered;
}

function filterSkills() {
    loadSkills();
}

function requestSkillSession(skillId) {
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;
    
    skill.views = (skill.views || 0) + 1;
    localStorage.setItem('skillshare_skills', JSON.stringify(skills));
    
    showNotification(`Viewing "${skill.title}" by ${skill.teacherName}`, 'info');
}

function editSkill(skillId) {
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;
    
    // Populate edit form with current skill data
    document.getElementById('editSkillId').value = skill.id;
    document.getElementById('editSkillTitle').value = skill.title;
    document.getElementById('editSkillDescription').value = skill.description;
    document.getElementById('editSkillCategory').value = skill.category;
    document.getElementById('editSkillLevel').value = skill.level;
    
    showModal('editSkillModal');
}

function deleteSkill(skillId) {
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;
    
    showConfirm(
        'Delete Skill',
        `Are you sure you want to delete "${skill.title}"?`,
        () => {
            skills = skills.filter(s => s.id != skillId);
            localStorage.setItem('skillshare_skills', JSON.stringify(skills));
            loadMySkills();
            showNotification('Skill deleted successfully', 'info');
        }
    );
}

// Utility functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showConfirm(title, message, callback) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    confirmCallback = callback;
    showModal('confirmModal');
}

function hideConfirmModal() {
    hideModal('confirmModal');
    confirmCallback = null;
}

function handleConfirmOk() {
    if (confirmCallback) {
        confirmCallback();
    }
    hideConfirmModal();
}

function toggleProfileDropdown(e) {
    e.stopPropagation();
    elements.profileDropdown.classList.toggle('hidden');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    elements.notificationContainer.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function showLoading(text = 'Loading...') {
    elements.loadingText.textContent = text;
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getCategoryIcon(category) {
    const icons = {
        'Technology': '💻',
        'Design': '🎨',
        'Business': '💼',
        'Arts': '🎭',
        'Language': '🗣',
        'Other': '📋'
    };
    return icons[category] || '📋';
}

function getLevelIcon(level) {
    const icons = {
        'Beginner': '🌱',
        'Intermediate': '🌿',
        'Advanced': '🌳'
    };
    return icons[level] || '🌱';
}

function updateCharCounter(e) {
    const input = e.target;
    const maxLength = input.getAttribute('maxlength');
    const currentLength = input.value.length;
    
    let counterId;
    if (input.id === 'skillTitle') {
        counterId = 'skillTitleCounter';
    } else if (input.id === 'skillDescription') {
        counterId = 'skillDescCounter';
    }
    
    if (counterId) {
        const counter = document.getElementById(counterId);
        if (counter) {
            counter.textContent = currentLength;
        }
    }
}

function updatePasswordStrength(e) {
    // Simple password strength logic
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleCreateSession(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to create sessions', 'error');
        return;
    }
    
    const skillName = document.getElementById('sessionSkill').value.trim();
    const date = document.getElementById('sessionDate').value;
    const time = document.getElementById('sessionTime').value;
    const maxParticipants = document.getElementById('maxParticipants').value;
    const meetingLink = document.getElementById('meetingLink').value.trim();
    
    if (!skillName || !date || !time || !maxParticipants || !meetingLink) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showLoading('Creating session...');
    
    setTimeout(() => {
        const sessionData = {
            id: Date.now(),
            skillName: skillName,
            date: date,
            time: time,
            maxParticipants: parseInt(maxParticipants),
            meetingLink: meetingLink,
            teacherId: currentUser.id,
            teacherName: currentUser.name,
            participants: [],
            status: getSessionStatus(date, time),
            createdAt: new Date().toISOString(),
            ratings: []
        };
        
        sessions.push(sessionData);
        localStorage.setItem('skillshare_sessions', JSON.stringify(sessions));
        
        // Reset form
        elements.createSessionForm.reset();
        
        hideLoading();
        loadSessions();
        showNotification('Session created successfully! 🚀', 'success');
        
        // If session is live or starting soon, offer to join immediately
        if (sessionData.status === 'live' || sessionData.status === 'upcoming') {
            setTimeout(() => {
                showConfirm(
                    'Join Session Now?',
                    `Your session "${skillName}" is ready. Would you like to join the meeting now?`,
                    () => {
                        window.open(meetingLink, '_blank');
                        showNotification('Opening meeting in new tab...', 'info');
                    }
                );
            }, 1000);
        }
    }, 1000);
}

function loadSessions() {
    if (!currentUser) return;
    
    const mySessions = sessions.filter(session => session.teacherId === currentUser.id);
    
    // Update stats
    const upcomingSessions = mySessions.filter(s => s.status === 'upcoming').length;
    const liveSessions = mySessions.filter(s => s.status === 'live').length;
    elements.sessionsStats.textContent = `${mySessions.length} total, ${upcomingSessions} upcoming, ${liveSessions} live`;
    
    if (mySessions.length === 0) {
        elements.sessionsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3rem; margin-bottom: 16px;">🎥</div>
                <h3>No sessions scheduled</h3>
                <p>Create your first live session to start teaching!</p>
            </div>
        `;
        return;
    }
    
    elements.sessionsContainer.innerHTML = mySessions.map(session => `
        <div class="session-item ${session.status}" data-session-id="${session.id}">
            <div class="session-item-header">
                <div class="session-skill-name">${session.skillName}</div>
                <span class="session-status ${session.status}">${session.status.toUpperCase()}</span>
            </div>
            <div class="session-details">
                <div class="session-detail">
                    <span>📅</span>
                    <span>${formatDate(session.date)}</span>
                </div>
                <div class="session-detail">
                    <span>⏰</span>
                    <span>${formatTime(session.time)}</span>
                </div>
                <div class="session-detail">
                    <span>👥</span>
                    <span>${session.participants.length}/${session.maxParticipants} participants</span>
                </div>
            </div>
            <div class="session-actions">
                <button class="btn btn-outline btn-small" onclick="copyMeetingLink('${session.meetingLink}')">
                    <span class="btn-icon">📋</span>
                    Copy Link
                </button>
                <button class="btn btn-gradient btn-small" onclick="startSession('${session.id}')">
                    <span class="btn-icon">🎥</span>
                    ${session.status === 'live' ? 'Join Live' : 'Start Session'}
                </button>
                <button class="btn btn-delete btn-small" onclick="deleteSession('${session.id}')">
                    <span class="btn-icon">🗑</span>
                    Cancel
                </button>
                <button class="btn btn-outline btn-small" onclick="showRatingModal('${session.id}', 'session', '${session.skillName}')">
                    <span class="btn-icon">📝</span>
                    Provide Feedback
                </button>
            </div>
        </div>
    `).join('');
}

function startSession(sessionId) {
    const session = sessions.find(s => s.id == sessionId);
    if (!session) return;
    
    // Update session status to live
    session.status = 'live';
    localStorage.setItem('skillshare_sessions', JSON.stringify(sessions));
    
    // Open meeting link
    window.open(session.meetingLink, '_blank');
    
    // Update UI
    loadSessions();
    
    showNotification(`Session "${session.skillName}" started! Meeting opened in new tab.`, 'success');
}

function copyMeetingLink(link) {
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Meeting link copied to clipboard! 📋', 'success');
    }).catch(() => {
        showNotification('Failed to copy link', 'error');
    });
}

function deleteSession(sessionId) {
    const session = sessions.find(s => s.id == sessionId);
    if (!session) return;
    
    showConfirm(
        'Cancel Session',
        `Are you sure you want to cancel "${session.skillName}"?`,
        () => {
            sessions = sessions.filter(s => s.id != sessionId);
            localStorage.setItem('skillshare_sessions', JSON.stringify(sessions));
            loadSessions();
            showNotification('Session cancelled successfully', 'info');
        }
    );
}

function getSessionStatus(date, time) {
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffInMinutes = (sessionDateTime - now) / (1000 * 60);
    
    if (diffInMinutes < -60) return 'completed';
    if (diffInMinutes <= 15 && diffInMinutes >= -15) return 'live';
    return 'upcoming';
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function handleEditSkill(e) {
    e.preventDefault();
    
    const skillId = document.getElementById('editSkillId').value;
    const title = document.getElementById('editSkillTitle').value.trim();
    const description = document.getElementById('editSkillDescription').value.trim();
    const category = document.getElementById('editSkillCategory').value;
    const level = document.getElementById('editSkillLevel').value;
    
    if (!title || !description || !category || !level) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showLoading('Updating skill...');
    
    setTimeout(() => {
        const skillIndex = skills.findIndex(s => s.id == skillId);
        
        if (skillIndex !== -1) {
            skills[skillIndex] = {
                ...skills[skillIndex],
                title: title,
                description: description,
                category: category,
                level: level,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('skillshare_skills', JSON.stringify(skills));
            
            hideLoading();
            hideModal('editSkillModal');
            loadMySkills();
            loadSkills(); // Refresh browse skills if visible
            showNotification('Skill updated successfully! ✨', 'success');
        } else {
            hideLoading();
            showNotification('Skill not found', 'error');
        }
    }, 800);
}

function showEditProfileModal() {
    document.getElementById('editName').value = currentUser.name;
    document.getElementById('editEmail').value = currentUser.email;
    showModal('editProfileModal');
    elements.profileDropdown.classList.add('hidden');
}

function showChangePasswordModal() {
    showModal('changePasswordModal');
    elements.profileDropdown.classList.add('hidden');
}

function handleEditProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    
    if (!name || !email) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading('Updating profile...');
    
    setTimeout(() => {
        // Check if email is already taken by another user
        const users = JSON.parse(localStorage.getItem('skillshare_users') || '[]');
        const existingUser = users.find(u => u.email === email && u.id !== currentUser.id);
        
        if (existingUser) {
            hideLoading();
            showNotification('Email is already taken by another user', 'error');
            return;
        }
        
        // Update current user
        currentUser.name = name;
        currentUser.email = email;
        currentUser.updatedAt = new Date().toISOString();
        
        // Update in localStorage
        localStorage.setItem('skillshare_user', JSON.stringify(currentUser));
        
        // Update users array
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('skillshare_users', JSON.stringify(users));
        }
        
        // Update skills with new teacher name
        skills.forEach(skill => {
            if (skill.teacherId === currentUser.id) {
                skill.teacherName = currentUser.name;
            }
        });
        localStorage.setItem('skillshare_skills', JSON.stringify(skills));
        
        // Update sessions with new teacher name
        sessions.forEach(session => {
            if (session.teacherId === currentUser.id) {
                session.teacherName = currentUser.name;
            }
        });
        localStorage.setItem('skillshare_sessions', JSON.stringify(sessions));
        
        // Update UI
        elements.userName.textContent = currentUser.name;
        elements.profileName.textContent = currentUser.name;
        elements.profileEmail.textContent = currentUser.email;
        
        // Update user initials
        const initial = currentUser.name.charAt(0).toUpperCase();
        const userInitial = document.getElementById('userInitial');
        const userInitialLarge = document.getElementById('userInitialLarge');
        if (userInitial) userInitial.textContent = initial;
        if (userInitialLarge) userInitialLarge.textContent = initial;
        
        // Refresh views
        loadSkills();
        loadMySkills();
        loadSessions();
        
        hideLoading();
        hideModal('editProfileModal');
        showNotification('Profile updated successfully! ✨', 'success');
    }, 800);
}

function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (currentPassword !== currentUser.password) {
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (newPassword === currentPassword) {
        showNotification('New password must be different from current password', 'error');
        return;
    }
    
    showLoading('Updating password...');
    
    setTimeout(() => {
        // Update password
        currentUser.password = newPassword;
        currentUser.updatedAt = new Date().toISOString();
        localStorage.setItem('skillshare_user', JSON.stringify(currentUser));
        
        // Update users array
        const users = JSON.parse(localStorage.getItem('skillshare_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('skillshare_users', JSON.stringify(users));
        }
        
        hideLoading();
        hideModal('changePasswordModal');
        elements.changePasswordForm.reset();
        showNotification('Password updated successfully! 🔒', 'success');
    }, 800);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function loadRatings() {
    if (!currentUser) {
        elements.skillRatingsContainer.innerHTML = `
            <div class="auth-required">
                <div class="auth-icon">🔐</div>
                <h3>Authentication Required</h3>
                <p>Please login to view your performance analytics</p>
            </div>
        `;
        elements.sessionRatingsContainer.innerHTML = '';
        return;
    }
    
    loadRatingsOverview();
    loadSkillRatings();
    loadSessionRatings();
}

function loadRatingsOverview() {
    const mySkills = skills.filter(skill => skill.teacherId == currentUser.id);
    const mySessions = sessions.filter(session => session.teacherId == currentUser.id);
    
    const skillRatings = mySkills.flatMap(skill => skill.ratings || []);
    const sessionRatings = mySessions.flatMap(session => session.ratings || []);
    const allRatings = [...skillRatings, ...sessionRatings];
    
    const avgSkillRating = skillRatings.length > 0 ? skillRatings.reduce((sum, r) => sum + r.rating, 0) / skillRatings.length : 0;
    const avgSessionRating = sessionRatings.length > 0 ? sessionRatings.reduce((sum, r) => sum + r.rating, 0) / sessionRatings.length : 0;
    const overallAvg = allRatings.length > 0 ? allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length : 0;
    
    const overviewContainer = document.getElementById('ratingsOverview');
    if (overviewContainer) {
        overviewContainer.innerHTML = `
            <div class="clean-stats-grid">
                <div class="clean-stat-card primary">
                    <div class="stat-header">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-title">Overall Rating</div>
                    </div>
                    <div class="stat-value">${overallAvg.toFixed(1)}</div>
                    <div class="stat-stars">${generateStars(overallAvg)}</div>
                </div>
                <div class="clean-stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">📚</div>
                        <div class="stat-title">Skill Evaluations</div>
                    </div>
                    <div class="stat-value">${skillRatings.length}</div>
                    <div class="stat-detail">Avg: ${avgSkillRating.toFixed(1)}</div>
                </div>
                <div class="clean-stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">🎥</div>
                        <div class="stat-title">Session Feedback</div>
                    </div>
                    <div class="stat-value">${sessionRatings.length}</div>
                    <div class="stat-detail">Avg: ${avgSessionRating.toFixed(1)}</div>
                </div>
                <div class="clean-stat-card">
                    <div class="stat-header">
                        <div class="stat-icon">📈</div>
                        <div class="stat-title">Satisfaction Rate</div>
                    </div>
                    <div class="stat-value">${((allRatings.filter(r => r.rating >= 4).length / allRatings.length) * 100 || 0).toFixed(0)}%</div>
                    <div class="stat-detail">4+ star ratings</div>
                </div>
            </div>
        `;
    }
}

function loadSkillRatings() {
    const mySkills = skills.filter(skill => skill.teacherId == currentUser.id);
    
    if (mySkills.length === 0) {
        elements.skillRatingsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h4>No Skill Evaluations Yet</h4>
                <p>Start by adding skills to receive learner feedback and ratings</p>
            </div>
        `;
        return;
    }
    
    const allSkillRatings = [];
    mySkills.forEach(skill => {
        (skill.ratings || []).forEach(rating => {
            allSkillRatings.push({
                ...rating,
                skillTitle: skill.title,
                skillCategory: skill.category,
                skillLevel: skill.level,
                skillId: skill.id
            });
        });
    });
    
    if (allSkillRatings.length === 0) {
        elements.skillRatingsContainer.innerHTML = `
            <tr>
                <td colspan="7" class="empty-table-cell">
                    <div class="empty-table-state">
                        <div class="empty-icon">📊</div>
                        <h3>No Skill Evaluations Yet</h3>
                        <p>Start by adding skills to receive learner feedback and ratings</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    elements.skillRatingsContainer.innerHTML = allSkillRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(rating => `
        <tr class="rating-row">
            <td class="skill-cell">
                <div class="skill-info">
                    <span class="skill-icon">${getCategoryIcon(rating.skillCategory)}</span>
                    <span class="skill-title">${rating.skillTitle}</span>
                </div>
            </td>
            <td class="category-cell">
                <span class="category-badge">${rating.skillCategory}</span>
            </td>
            <td class="level-cell">
                <span class="level-badge level-${rating.skillLevel.toLowerCase()}">${rating.skillLevel}</span>
            </td>
            <td class="rating-cell">
                <div class="rating-display">
                    <span class="rating-number">${rating.rating}.0</span>
                    <div class="rating-stars">${generateStars(rating.rating)}</div>
                </div>
            </td>
            <td class="reviewer-cell">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${rating.reviewerName.charAt(0)}</div>
                    <span class="reviewer-name">${rating.reviewerName}</span>
                </div>
            </td>
            <td class="date-cell">
                <span class="review-date">${formatDate(rating.createdAt)}</span>
            </td>
            <td class="feedback-cell">
                ${rating.comment ? `
                    <div class="feedback-text">${rating.comment}</div>
                ` : `
                    <div class="no-feedback"><em>No feedback</em></div>
                `}
            </td>
        </tr>
    `).join('');
}

function loadSessionRatings() {
    const mySessions = sessions.filter(session => session.teacherId == currentUser.id);
    
    if (mySessions.length === 0) {
        elements.sessionRatingsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎥</div>
                <h4>No Session Feedback Yet</h4>
                <p>Conduct live sessions to receive participant feedback and improve your teaching delivery.</p>
            </div>
        `;
        return;
    }
    
    const allSessionRatings = [];
    mySessions.forEach(session => {
        (session.ratings || []).forEach(rating => {
            allSessionRatings.push({
                ...rating,
                sessionTitle: session.skillName,
                sessionDate: session.date,
                sessionTime: session.time,
                sessionStatus: session.status,
                sessionId: session.id
            });
        });
    });
    
    if (allSessionRatings.length === 0) {
        elements.sessionRatingsContainer.innerHTML = `
            <tr>
                <td colspan="8" class="empty-table-cell">
                    <div class="empty-table-state">
                        <div class="empty-icon">🎥</div>
                        <h3>No Session Feedback Yet</h3>
                        <p>Conduct live sessions to receive participant feedback</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    elements.sessionRatingsContainer.innerHTML = allSessionRatings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(rating => `
        <tr class="rating-row">
            <td class="session-cell">
                <div class="session-info">
                    <span class="session-icon">🎥</span>
                    <span class="session-title">${rating.sessionTitle}</span>
                </div>
            </td>
            <td class="date-cell">
                <span class="session-date">${formatDate(rating.sessionDate)}</span>
            </td>
            <td class="time-cell">
                <span class="session-time">${formatTime(rating.sessionTime)}</span>
            </td>
            <td class="status-cell">
                <span class="status-badge status-${rating.sessionStatus}">${rating.sessionStatus}</span>
            </td>
            <td class="rating-cell">
                <div class="rating-display">
                    <span class="rating-number">${rating.rating}.0</span>
                    <div class="rating-stars">${generateStars(rating.rating)}</div>
                </div>
            </td>
            <td class="participant-cell">
                <div class="participant-info">
                    <div class="participant-avatar">${rating.reviewerName.charAt(0)}</div>
                    <span class="participant-name">${rating.reviewerName}</span>
                </div>
            </td>
            <td class="feedback-date-cell">
                <span class="feedback-date">${formatDate(rating.createdAt)}</span>
            </td>
            <td class="feedback-cell">
                ${rating.comment ? `
                    <div class="feedback-text">${rating.comment}</div>
                ` : `
                    <div class="no-feedback"><em>No feedback</em></div>
                `}
            </td>
        </tr>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'upcoming': '#2196F3',
        'live': '#4CAF50',
        'completed': '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
}

function viewSkillDetails(skillId) {
    switchTab('my-skills');
    showNotification('Navigated to My Skills section', 'info');
}

function viewSessionDetails(sessionId) {
    switchTab('sessions');
    showNotification('Navigated to Sessions section', 'info');
}

function calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / ratings.length;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '⭐'.repeat(fullStars) + 
           (hasHalfStar ? '🌟' : '') + 
           '☆'.repeat(emptyStars);
}

function calculateRatingDistribution(ratings) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
        distribution[rating.rating] = (distribution[rating.rating] || 0) + 1;
    });
    return distribution;
}

function getProgressColor(rating) {
    const colors = {
        5: '#4CAF50',
        4: '#8BC34A', 
        3: '#FFC107',
        2: '#FF9800',
        1: '#F44336'
    };
    return colors[rating] || '#ddd';
}

function showRatingModal(itemId, type, title) {
    if (!currentUser) {
        showNotification('Please login to provide feedback', 'error');
        return;
    }
    
    document.getElementById('ratingItemId').value = itemId;
    document.getElementById('ratingType').value = type;
    elements.ratingDescription.textContent = `Evaluate: ${title}`;
    
    // Reset stars and rating container
    const starContainer = document.getElementById('starRating');
    starContainer.dataset.selectedRating = 0;
    const stars = starContainer.querySelectorAll('.star');
    stars.forEach(star => {
        star.textContent = '☆';
        star.style.transform = 'scale(1)';
    });
    
    // Reset comment and counter
    document.getElementById('ratingComment').value = '';
    document.getElementById('reviewCounter').textContent = '0';
    document.getElementById('ratingText').textContent = 'Click to rate';
    
    showModal('ratingModal');
}

function updateReviewCounter() {
    const comment = document.getElementById('ratingComment').value;
    const counter = document.getElementById('reviewCounter');
    const preview = document.getElementById('reviewPreview');
    const previewText = document.getElementById('previewText');
    
    counter.textContent = comment.length;
    
    if (comment.length > 0) {
        preview.style.display = 'block';
        previewText.textContent = comment;
    } else {
        preview.style.display = 'none';
    }
    
    // Dynamic color feedback
    if (comment.length > 400) {
        counter.style.color = '#ff6b6b';
    } else if (comment.length > 300) {
        counter.style.color = '#ffa726';
    } else {
        counter.style.color = '#666';
    }
}

function handleRatingSubmit(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('ratingItemId').value;
    const type = document.getElementById('ratingType').value;
    const comment = document.getElementById('ratingComment').value.trim();
    
    // Get selected rating from container
    const starContainer = document.getElementById('starRating');
    const rating = parseInt(starContainer.dataset.selectedRating || 0);
    
    if (rating === 0) {
        showNotification('Please select a rating by clicking on the stars', 'error');
        return;
    }
    
    // Check for duplicate rating from same user
    const existingRating = checkExistingRating(itemId, type, currentUser.id);
    if (existingRating) {
        showNotification('You have already rated this ' + type, 'error');
        return;
    }
    
    showLoading('Submitting your rating...');
    
    setTimeout(() => {
        const ratingData = {
            rating: rating,
            comment: comment,
            reviewerName: currentUser.name,
            reviewerId: currentUser.id,
            createdAt: new Date().toISOString()
        };
        
        let updated = false;
        if (type === 'skill') {
            const skill = skills.find(s => s.id == itemId);
            if (skill) {
                if (!skill.ratings) skill.ratings = [];
                skill.ratings.push(ratingData);
                localStorage.setItem('skillshare_skills', JSON.stringify(skills));
                updated = true;
            }
        } else if (type === 'session') {
            const session = sessions.find(s => s.id == itemId);
            if (session) {
                if (!session.ratings) session.ratings = [];
                session.ratings.push(ratingData);
                localStorage.setItem('skillshare_sessions', JSON.stringify(sessions));
                updated = true;
            }
        }
        
        hideLoading();
        hideModal('ratingModal');
        
        if (updated) {
            const feedback = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
            showNotification(`${feedback[rating-1]} rating submitted! Thank you for your feedback ⭐`, 'success');
            
            // Dynamically update displays
            loadSkills();
            loadSessions();
            if (document.querySelector('.tab-btn[data-tab="ratings"]').classList.contains('active')) {
                loadRatings();
            }
        } else {
            showNotification('Error submitting rating. Please try again.', 'error');
        }
    }, 800);
}

function checkExistingRating(itemId, type, userId) {
    if (type === 'skill') {
        const skill = skills.find(s => s.id == itemId);
        return skill && skill.ratings && skill.ratings.find(r => r.reviewerId == userId);
    } else if (type === 'session') {
        const session = sessions.find(s => s.id == itemId);
        return session && session.ratings && session.ratings.find(r => r.reviewerId == userId);
    }
    return false;
}

// Missing functions
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('.password-toggle-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

function showTerms() {
    showModal('termsModal');
}

function showPrivacy() {
    showModal('privacyModal');
}

function clearFilters() {
    if (elements.categoryFilter) elements.categoryFilter.value = '';
    if (elements.levelFilter) elements.levelFilter.value = '';
    if (elements.searchInput) elements.searchInput.value = '';
    filterSkills();
}

// Placeholder functions
function filterSessions() {}
function switchView() {}
function handleUserValidation() {}

// Sample data loader
function loadSampleData() {
    if (skills.length === 0) {
        const sampleSkills = [
            {
                id: 1,
                title: "Mathematics Study Group",
                description: "Join our calculus study group. We meet weekly to solve problems and prepare for exams.",
                category: "Mathematics",
                level: "Intermediate",
                teacherId: 999,
                teacherName: "Prof. Johnson",
                createdAt: new Date().toISOString(),
                views: 156,
                requests: 23
            },
            {
                id: 2,
                title: "Chemistry Lab Preparation",
                description: "Get ready for chemistry lab sessions with hands-on practice and safety guidelines.",
                category: "Science",
                level: "Beginner",
                teacherId: 998,
                teacherName: "Dr. Smith",
                createdAt: new Date().toISOString(),
                views: 234,
                requests: 45
            }
        ];
        
        skills = sampleSkills;
        localStorage.setItem('campuslink_skills', JSON.stringify(skills));
    }
}