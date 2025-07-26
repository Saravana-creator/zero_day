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
    
    // Sessions
    createSessionForm: document.getElementById('createSessionForm'),
    sessionsContainer: document.getElementById('sessionsContainer'),
    sessionsStats: document.getElementById('sessionsStats'),
    sessionStatusFilter: document.getElementById('sessionStatusFilter'),
    
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
    // Check for current logged-in user
    const loggedUser = localStorage.getItem('currentUser');
    if (loggedUser) {
        const userData = JSON.parse(loggedUser);
        currentUser = {
            id: userData.email,
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            role: userData.role
        };
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
    // Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Filters
    elements.categoryFilter?.addEventListener('change', filterSkills);
    elements.levelFilter?.addEventListener('change', filterSkills);
    elements.searchInput?.addEventListener('input', debounce(filterSkills, 300));
    elements.sessionStatusFilter?.addEventListener('change', filterSessions);
    
    // Forms
    elements.createSkillForm?.addEventListener('submit', handleCreateSkill);
    elements.createSessionForm?.addEventListener('submit', handleCreateSession);
    
    // Character counters
    elements.skillTitle?.addEventListener('input', updateCharCounter);
    elements.skillDescription?.addEventListener('input', updateCharCounter);
    
    // Set minimum date for session scheduling
    const sessionDate = document.getElementById('sessionDate');
    if (sessionDate) {
        sessionDate.min = new Date().toISOString().split('T')[0];
    }
}

function handleCreateSkill(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Please login to create sessions', 'error');
        return;
    }
    
    const title = document.getElementById('skillTitle').value.trim();
    const description = document.getElementById('skillDescription').value.trim();
    const category = document.getElementById('skillCategory').value;
    const level = document.getElementById('skillLevel').value;
    const meetingLink = document.getElementById('meetingLink')?.value.trim() || null;
    
    if (!title || !description || !category || !level) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    showLoading('Creating session...');
    
    setTimeout(() => {
        const skillData = {
            id: Date.now(),
            title: title,
            description: description,
            category: category,
            level: level,
            teacherId: currentUser.id || currentUser.email,
            teacherName: currentUser.name,
            createdAt: new Date().toISOString(),
            views: 0,
            requests: 0,
            ratings: [],
            meetingLink: meetingLink
        };
        
        skills.push(skillData);
        localStorage.setItem('campuslink_skills', JSON.stringify(skills));
        
        // Reset form
        elements.createSkillForm.reset();
        if (elements.skillTitleCounter) elements.skillTitleCounter.textContent = '0';
        if (elements.skillDescCounter) elements.skillDescCounter.textContent = '0';
        
        hideLoading();
        showNotification('Specialty session created! Now create a live session with Google Meet link.', 'success');
        
        // Switch to Live Sessions tab to add meeting link
        setTimeout(() => {
            switchTab('sessions');
        }, 100);
    }, 1000);
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
            teacherId: currentUser.id || currentUser.email,
            teacherName: currentUser.name,
            participants: [],
            status: getSessionStatus(date, time),
            createdAt: new Date().toISOString(),
            ratings: []
        };
        
        sessions.push(sessionData);
        localStorage.setItem('campuslink_sessions', JSON.stringify(sessions));
        
        // Reset form
        elements.createSessionForm.reset();
        
        hideLoading();
        loadSessions();
        showNotification('Session created successfully! 🚀', 'success');
    }, 1000);
}

// Dashboard functions
function showDashboard() {
    if (currentUser) {
        elements.authButtons?.classList.add('hidden');
        elements.userMenu?.classList.remove('hidden');
        
        // Update user info in profile
        if (elements.userName) elements.userName.textContent = currentUser.name;
        if (elements.profileName) elements.profileName.textContent = currentUser.name;
        if (elements.profileEmail) elements.profileEmail.textContent = currentUser.email;
        
        // Update user initials
        const initial = currentUser.name.charAt(0).toUpperCase();
        const userInitial = document.getElementById('userInitial');
        const userInitialLarge = document.getElementById('userInitialLarge');
        if (userInitial) userInitial.textContent = initial;
        if (userInitialLarge) userInitialLarge.textContent = initial;
    } else {
        elements.authButtons?.classList.remove('hidden');
        elements.userMenu?.classList.add('hidden');
    }
    
    elements.dashboard?.classList.remove('hidden');
    
    loadSkills();
    loadMySkills();
    loadSessions();
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
    } else if (tabName === 'my-sessions') {
        loadMySkills();
    } else if (tabName === 'sessions') {
        loadSessions();
    }
}

// Skills functions
function loadSkills() {
    const filteredSkills = getFilteredSkills();
    if (elements.skillsCount) {
        elements.skillsCount.textContent = `${filteredSkills.length} session${filteredSkills.length !== 1 ? 's' : ''} found`;
    }
    
    if (filteredSkills.length === 0) {
        elements.skillsGrid?.classList.add('hidden');
        elements.noResults?.classList.remove('hidden');
        return;
    }
    
    elements.skillsGrid?.classList.remove('hidden');
    elements.noResults?.classList.add('hidden');
    
    if (elements.skillsGrid) {
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
                </div>
                <div class="skill-actions">
                    <button class="btn btn-gradient btn-small" onclick="joinSession('${skill.id}')">
                        <span class="btn-icon">🎯</span>
                        Join Session
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function loadMySkills() {
    if (!currentUser) {
        if (elements.mySkillsContainer) {
            elements.mySkillsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🔐</div>
                    <h3>Please login to view your sessions</h3>
                </div>
            `;
        }
        return;
    }
    
    const mySkills = skills.filter(skill => skill.teacherId == (currentUser.id || currentUser.email));
    
    if (mySkills.length === 0) {
        if (elements.mySkillsContainer) {
            elements.mySkillsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">📚</div>
                    <h3>No sessions created yet</h3>
                    <p>Start by creating your first session!</p>
                    <button class="btn btn-gradient" onclick="switchTab('create')" style="margin-top: 20px;">
                        <span class="btn-icon">✨</span>
                        Create First Session
                    </button>
                </div>
            `;
        }
        return;
    }
    
    if (elements.mySkillsContainer) {
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
}

function loadSessions() {
    if (!currentUser) return;
    
    const mySessions = sessions.filter(session => session.teacherId === (currentUser.id || currentUser.email));
    
    // Update stats
    const upcomingSessions = mySessions.filter(s => s.status === 'upcoming').length;
    const liveSessions = mySessions.filter(s => s.status === 'live').length;
    if (elements.sessionsStats) {
        elements.sessionsStats.textContent = `${mySessions.length} total, ${upcomingSessions} upcoming, ${liveSessions} live`;
    }
    
    if (mySessions.length === 0) {
        if (elements.sessionsContainer) {
            elements.sessionsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🎥</div>
                    <h3>No sessions scheduled</h3>
                    <p>Create your first live session!</p>
                </div>
            `;
        }
        return;
    }
    
    if (elements.sessionsContainer) {
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
                </div>
            </div>
        `).join('');
    }
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

function joinSession(skillId) {
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;
    
    if (skill.meetingLink) {
        // Open Google Meet link from skill
        window.open(skill.meetingLink, '_blank');
        showNotification(`Joining "${skill.title}" session!`, 'success');
    } else {
        showNotification('No meeting link available for this session', 'error');
    }
    
    // Update view count
    skill.views = (skill.views || 0) + 1;
    localStorage.setItem('campuslink_skills', JSON.stringify(skills));
}

function startSession(sessionId) {
    const session = sessions.find(s => s.id == sessionId);
    if (!session) return;
    
    // Update session status to live
    session.status = 'live';
    localStorage.setItem('campuslink_sessions', JSON.stringify(sessions));
    
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
    
    if (confirm(`Are you sure you want to cancel "${session.skillName}"?`)) {
        sessions = sessions.filter(s => s.id != sessionId);
        localStorage.setItem('campuslink_sessions', JSON.stringify(sessions));
        loadSessions();
        showNotification('Session cancelled successfully', 'info');
    }
}

function editSkill(skillId) {
    showNotification('Edit functionality coming soon!', 'info');
}

function deleteSkill(skillId) {
    const skill = skills.find(s => s.id == skillId);
    if (!skill) return;
    
    if (confirm(`Are you sure you want to delete "${skill.title}"?`)) {
        skills = skills.filter(s => s.id != skillId);
        localStorage.setItem('campuslink_skills', JSON.stringify(skills));
        loadMySkills();
        showNotification('Session deleted successfully', 'info');
    }
}

function getSessionStatus(date, time) {
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const diffInMinutes = (sessionDateTime - now) / (1000 * 60);
    
    if (diffInMinutes < -60) return 'completed';
    if (diffInMinutes <= 15 && diffInMinutes >= -15) return 'live';
    return 'upcoming';
}

// Utility functions
function showNotification(message, type = 'info') {
    if (!elements.notificationContainer) return;
    
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
    if (elements.loadingText) elements.loadingText.textContent = text;
    elements.loadingOverlay?.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay?.classList.add('hidden');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function getCategoryIcon(category) {
    const icons = {
        'Mathematics': '🔢',
        'Science': '🔬',
        'Literature': '📖',
        'History': '🏛️',
        'Technology': '💻',
        'Languages': '🗣️',
        'Academic': '📚',
        'Workshop': '🔧',
        'Seminar': '🎤',
        'Training': '💪',
        'Meeting': '🤝',
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

function clearFilters() {
    if (elements.categoryFilter) elements.categoryFilter.value = '';
    if (elements.levelFilter) elements.levelFilter.value = '';
    if (elements.searchInput) elements.searchInput.value = '';
    filterSkills();
}

// Placeholder functions
function filterSessions() {}

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