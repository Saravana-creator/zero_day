// Global Profile Manager for CampusLink
class ProfileManager {
    constructor() {
        this.userProfile = {
            name: "Student",
            email: "student@example.com",
            role: "Student",
            avatar: "👨‍🎓"
        };
        this.loadCredentials();
    }

    // Load credentials from login
    loadCredentials() {
        const savedEmail = localStorage.getItem('currentUserEmail') || localStorage.getItem('rememberedEmail');
        const savedRole = localStorage.getItem('currentUserRole') || localStorage.getItem('rememberedRole');
        
        if (savedEmail) {
            this.userProfile.email = savedEmail;
            const emailName = savedEmail.split('@')[0];
            const formattedName = emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            this.userProfile.name = formattedName || 'Student';
        }
        
        if (savedRole === 'student') {
            this.userProfile.avatar = "👨‍🎓";
            this.userProfile.role = "Student";
        } else if (savedRole === 'admin') {
            this.userProfile.avatar = "👨‍💼";
            this.userProfile.role = "Administrator";
        }

        // Load custom avatar if exists
        const saved = localStorage.getItem('userProfile');
        if (saved) {
            const savedProfile = JSON.parse(saved);
            if (savedProfile.avatar) {
                this.userProfile.avatar = savedProfile.avatar;
            }
        }
    }

    // Get current profile
    getProfile() {
        this.loadCredentials(); // Always get fresh data
        return this.userProfile;
    }

    // Show profile modal
    showProfile() {
        const profile = this.getProfile();
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.onclick = () => this.closeProfile();
        
        const profileModal = document.createElement('div');
        profileModal.className = 'profile-modal';
        profileModal.innerHTML = `
            <h3>✨ User Profile</h3>
            
            <div class="profile-info">
                <div class="profile-avatar">${profile.avatar}</div>
                <div class="profile-name">${profile.name}</div>
                <div class="profile-email">${profile.email}</div>
                <div class="profile-role">${profile.role}</div>
            </div>
            
            <div class="form-group">
                <label for="profileName">📝 Full Name</label>
                <input type="text" id="profileName" value="${profile.name}" readonly style="background: #f5f5f5;" />
            </div>
            
            <div class="form-group">
                <label for="profileEmail">📧 Email Address</label>
                <input type="email" id="profileEmail" value="${profile.email}" readonly style="background: #f5f5f5;" />
            </div>
            
            <div class="form-group">
                <label for="profileRole">👤 Role</label>
                <input type="text" id="profileRole" value="${profile.role}" readonly style="background: #f5f5f5;" />
            </div>
            
            <div class="form-group">
                <label for="profileAvatar">🎨 Choose Avatar</label>
                <select id="profileAvatar">
                    <option value="👨‍🎓" ${profile.avatar === '👨‍🎓' ? 'selected' : ''}>👨‍🎓 Student (Male)</option>
                    <option value="👩‍🎓" ${profile.avatar === '👩‍🎓' ? 'selected' : ''}>👩‍🎓 Student (Female)</option>
                    <option value="👨‍💼" ${profile.avatar === '👨‍💼' ? 'selected' : ''}>👨‍💼 Professional (Male)</option>
                    <option value="👩‍💼" ${profile.avatar === '👩‍💼' ? 'selected' : ''}>👩‍💼 Professional (Female)</option>
                    <option value="👨‍💻" ${profile.avatar === '👨‍💻' ? 'selected' : ''}>👨‍💻 Developer</option>
                    <option value="👩‍🔬" ${profile.avatar === '👩‍🔬' ? 'selected' : ''}>👩‍🔬 Scientist</option>
                </select>
            </div>
            
            <div class="button-group">
                <button class="save-btn" onclick="profileManager.saveProfile()">Update Avatar</button>
                <button class="cancel-btn" onclick="profileManager.closeProfile()">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(profileModal);
    }

    // Save profile
    saveProfile() {
        const profileData = {
            avatar: document.getElementById('profileAvatar').value
        };
        
        this.userProfile.avatar = profileData.avatar;
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        this.closeProfile();
    }

    // Close profile
    closeProfile() {
        document.querySelector('.overlay')?.remove();
        document.querySelector('.profile-modal')?.remove();
    }
}

// Create global instance
const profileManager = new ProfileManager();

// Global functions for backward compatibility
window.showProfile = () => profileManager.showProfile();
window.saveProfile = () => profileManager.saveProfile();
window.closeProfile = () => profileManager.closeProfile();
window.profileManager = profileManager;