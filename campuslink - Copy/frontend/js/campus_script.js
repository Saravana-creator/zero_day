document.addEventListener('DOMContentLoaded', function() {
    const adminPanel = document.getElementById('adminPanel');
    const adminManagement = document.getElementById('adminManagement');
    const toggleAdmin = document.getElementById('toggleAdmin');
    const toggleManage = document.getElementById('toggleManage');
    const toggleProfile = document.getElementById('toggleProfile');
    const announcementForm = document.getElementById('announcementForm');
    const profileSidebar = document.getElementById('profileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminFormSection = document.getElementById('adminFormSection');
    const loginForm = document.getElementById('loginForm');
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const passwordModal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('passwordForm');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminTable = document.getElementById('adminTable');
    const categoryFilter = document.getElementById('categoryFilter');
    const announcementsContainer = document.getElementById('announcements');
    const imageUpload = document.getElementById('imageUpload');
    const imageInput = document.getElementById('imageInput');
    const browseImages = document.getElementById('browseImages');
    const imagePreview = document.getElementById('imagePreview');
    
    let uploadedImages = [];
    let adminCredentials = {
        username: 'admin',
        password: 'admin123',
        name: 'Administrator',
        email: 'admin@campus.edu'
    };
    
    let isLoggedIn = false;
    
    // Local Storage functions
    function initializeLocalStorage() {
        // Initialize announcements if empty
        if (!localStorage.getItem('announcements')) {
            const sampleAnnouncements = [
                {
                    id: 1,
                    title: 'Welcome to Campus Portal',
                    content: 'This is a sample announcement to demonstrate the system.',
                    category: 'General',
                    admin_name: 'Administrator',
                    date_posted: new Date().toISOString(),
                    images: []
                },
                {
                    id: 2,
                    title: 'System Features',
                    content: 'You can now create, edit, and delete announcements locally without a database.',
                    category: 'Technology',
                    admin_name: 'Administrator',
                    date_posted: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                    images: []
                }
            ];
            localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
        }
        
        // Initialize categories if empty
        if (!localStorage.getItem('categories')) {
            const categories = ['General', 'Academic', 'Events', 'Technology', 'Sports', 'News'];
            localStorage.setItem('categories', JSON.stringify(categories));
        }
        
        // Initialize admin credentials if changed
        const storedCredentials = localStorage.getItem('adminCredentials');
        if (storedCredentials) {
            adminCredentials = JSON.parse(storedCredentials);
        } else {
            localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
        }
    }
    
    function getAnnouncements() {
        return JSON.parse(localStorage.getItem('announcements') || '[]');
    }
    
    function saveAnnouncements(announcements) {
        localStorage.setItem('announcements', JSON.stringify(announcements));
    }
    
    function getCategories() {
        return JSON.parse(localStorage.getItem('categories') || '[]');
    }
    
    function saveCategories(categories) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }
    
    function generateId() {
        const announcements = getAnnouncements();
        return announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
    }
    
    // Initialize local storage on page load
    initializeLocalStorage();
    browseImages.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    imageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUpload.classList.add('dragover');
    });
    
    imageUpload.addEventListener('dragleave', () => {
        imageUpload.classList.remove('dragover');
    });
    
    imageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUpload.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // Clipboard paste
    document.addEventListener('paste', (e) => {
        if (adminPanel.classList.contains('hidden')) return;
        const items = e.clipboardData.items;
        for (let item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                handleFiles([file]);
            }
        }
    });
    
    function handleFiles(files) {
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                compressImage(file, (compressedDataUrl) => {
                    uploadedImages.push(compressedDataUrl);
                    displayImagePreview();
                });
            }
        }
    }
    
    function compressImage(file, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            const maxWidth = 800;
            const maxHeight = 600;
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            
            ctx.drawImage(img, 0, 0, width, height);
            callback(canvas.toDataURL('image/jpeg', 0.7));
        };
        
        const reader = new FileReader();
        reader.onload = (e) => img.src = e.target.result;
        reader.readAsDataURL(file);
    }
    
    function displayImagePreview() {
        imagePreview.innerHTML = uploadedImages.map((img, index) => 
            `<div class="preview-item">
                <img src="${img}" alt="Preview">
                <button type="button" onclick="removeImage(${index})">×</button>
            </div>`
        ).join('');
    }
    
    window.removeImage = (index) => {
        uploadedImages.splice(index, 1);
        displayImagePreview();
    };

    function checkAdminAccess(callback) {
        const username = prompt('Enter username (admin):');
        const password = prompt('Enter password (admin123):');
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            callback();
        } else {
            alert('Access denied. Use: admin / admin123');
        }
    }

    if (toggleAdmin) {
        toggleAdmin.addEventListener('click', () => {
            adminPanel.classList.toggle('hidden');
            adminManagement.classList.add('hidden');
            
            if (!isLoggedIn && !adminPanel.classList.contains('hidden')) {
                adminLoginSection.classList.remove('hidden');
                adminFormSection.classList.add('hidden');
            } else if (isLoggedIn && !adminPanel.classList.contains('hidden')) {
                adminLoginSection.classList.add('hidden');
                adminFormSection.classList.remove('hidden');
            }
        });
    }

    if (toggleManage) {
        toggleManage.addEventListener('click', () => {
            if (!isLoggedIn) {
                alert('Please login first through Admin Panel');
                return;
            }
            adminManagement.classList.toggle('hidden');
            adminPanel.classList.add('hidden');
            if (!adminManagement.classList.contains('hidden')) {
                loadAdminTable();
            }
        });
    }

    if (toggleProfile) {
        toggleProfile.addEventListener('click', () => {
            if (isLoggedIn) {
                openProfileSidebar();
            }
        });
    }
    
    const showCredentials = document.getElementById('showCredentials');
    const credentialsHelp = document.getElementById('credentialsHelp');
    
    if (showCredentials && credentialsHelp) {
        showCredentials.addEventListener('click', () => {
            credentialsHelp.classList.toggle('hidden');
            if (credentialsHelp.classList.contains('hidden')) {
                showCredentials.textContent = 'Need help? Click for default credentials';
            } else {
                showCredentials.textContent = 'Hide credentials';
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login attempt:', { username, email, password });
            console.log('Expected:', adminCredentials);
            
            if (username === adminCredentials.username && password === adminCredentials.password) {
                
                adminCredentials.email = email;
                adminCredentials.name = username;
                
                isLoggedIn = true;
                
                adminLoginSection.classList.add('hidden');
                adminFormSection.classList.remove('hidden');
                
                alert('Login successful!');
            } else {
                alert('Invalid credentials! Use: admin / admin123');
            }
        });
    }
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            document.getElementById('editName').value = adminCredentials.name;
            document.getElementById('editEmail').value = adminCredentials.email;
            closeProfileSidebar();
            editProfileModal.classList.remove('hidden');
        });
    }
    
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newName = document.getElementById('editName').value;
            const newEmail = document.getElementById('editEmail').value;
            
            adminCredentials.name = newName;
            adminCredentials.email = newEmail;
            
            updateProfileDisplay();
            editProfileForm.reset();
            editProfileModal.classList.add('hidden');
            alert('Profile updated successfully!');
        });
    }
    
    function openProfileSidebar() {
        if (profileSidebar && sidebarOverlay) {
            updateProfileStats();
            profileSidebar.classList.remove('hidden');
            profileSidebar.classList.add('active');
            sidebarOverlay.classList.remove('hidden');
        }
    }
    
    function closeProfileSidebar() {
        if (profileSidebar && sidebarOverlay) {
            profileSidebar.classList.remove('active');
            setTimeout(() => {
                profileSidebar.classList.add('hidden');
                sidebarOverlay.classList.add('hidden');
            }, 300);
        }
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeProfileSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeProfileSidebar);
    }
    
    function updateProfileDisplay() {
        document.getElementById('profileName').textContent = adminCredentials.name;
        document.getElementById('profileUsername').textContent = adminCredentials.username;
        document.getElementById('profileEmail').textContent = adminCredentials.email;
        document.getElementById('lastLogin').textContent = new Date().toLocaleDateString();
        
        const avatarCircle = document.querySelector('.avatar-circle');
        if (avatarCircle) {
            avatarCircle.textContent = adminCredentials.name.charAt(0).toUpperCase();
        }
    }
    
    function updateProfileStats() {
        try {
            const announcements = getAnnouncements();
            
            const totalPosts = announcements.length;
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            const thisMonthPosts = announcements.filter(announcement => {
                const postDate = new Date(announcement.date_posted);
                return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
            }).length;
            
            document.getElementById('totalPosts').textContent = totalPosts;
            document.getElementById('thisMonth').textContent = thisMonthPosts;
            
            updateProfileDisplay();
            
        } catch (error) {
            console.error('Error updating profile stats:', error);
        }
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            closeProfileSidebar();
            if (passwordModal) passwordModal.classList.remove('hidden');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                isLoggedIn = false;
                closeProfileSidebar();
                adminPanel.classList.add('hidden');
                adminManagement.classList.add('hidden');
                
                adminLoginSection.classList.remove('hidden');
                adminFormSection.classList.add('hidden');
                
                alert('Logged out successfully!');
            }
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (currentPassword !== adminCredentials.password) {
                alert('Current password is incorrect!');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match!');
                return;
            }
            
            if (newPassword.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }
            
            adminCredentials.password = newPassword;
            passwordForm.reset();
            passwordModal.classList.add('hidden');
            alert('Password changed successfully!');
        });
    }

    // Load categories for filter
    function loadCategories() {
        try {
            const categories = getCategories();
            
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Load announcements
    function loadAnnouncements(category = '') {
        try {
            let announcements = getAnnouncements();
            
            // Filter by category if specified
            if (category) {
                announcements = announcements.filter(announcement => announcement.category === category);
            }
            
            // Sort by date (newest first)
            announcements.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
            
            const tbody = announcementsContainer.querySelector('tbody');
            tbody.innerHTML = '';
            
            // Update filter stats
            const filterStats = document.getElementById('filterStats');
            if (filterStats) {
                filterStats.textContent = `Total: ${announcements.length} announcements`;
            }
            
            if (announcements.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #999;">📭 No announcements found.</td></tr>';
                return;
            }

            announcements.forEach((announcement, index) => {
                const date = new Date(announcement.date_posted).toLocaleDateString();
                const categoryClass = `category-${announcement.category.toLowerCase()}`;
                const timeAgo = getTimeAgo(new Date(announcement.date_posted));
                
                const row = `
                    <tr style="animation: fadeIn 0.5s ease ${index * 0.1}s both;">
                        <td class="title" onclick="showTaskDetail(${announcement.id})" title="Click to view details">${announcement.title}</td>
                        <td><span class="category-badge ${categoryClass}">${announcement.category}</span></td>
                        <td style="font-weight: 600; color: #3949ab;">${announcement.admin_name}</td>
                        <td style="color: #666;" title="${date}">${timeAgo}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
            
            window.openImage = (src) => {
                window.open(src, '_blank');
            };
        } catch (error) {
            console.error('Error loading announcements:', error);
            const tbody = announcementsContainer.querySelector('tbody');
            tbody.innerHTML = '<tr><td colspan="6">Error loading announcements.</td></tr>';
        }
    }

    // Handle form submission
    announcementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            category: document.getElementById('category').value,
            admin_name: document.getElementById('adminName').value,
            images: JSON.stringify(uploadedImages),
            date_posted: new Date().toISOString()
        };

        const editId = announcementForm.dataset.editId;
        const isEdit = !!editId;
        
        const announcements = getAnnouncements();
        
        if (isEdit) {
            const index = announcements.findIndex(a => a.id === parseInt(editId));
            if (index !== -1) {
                announcements[index] = { ...announcements[index], ...formData };
            }
        } else {
            formData.id = generateId();
            announcements.push(formData);
        }
        
        saveAnnouncements(announcements);
        
        announcementForm.reset();
        delete announcementForm.dataset.editId;
        uploadedImages = [];
        displayImagePreview();
        adminPanel.classList.add('hidden');
        loadAnnouncements();
        loadCategories();
        if (isEdit) loadAdminTable();
        alert(isEdit ? 'Announcement updated successfully!' : 'Announcement posted successfully!');
    });

    // Handle category filter
    categoryFilter.addEventListener('change', (e) => {
        loadAnnouncements(e.target.value);
    });

    function loadAdminTable() {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        
        const tbody = adminTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        announcements.forEach((announcement, index) => {
            const date = new Date(announcement.date_posted).toLocaleDateString();
            const categoryClass = `category-${announcement.category.toLowerCase()}`;
            const timeAgo = getTimeAgo(new Date(announcement.date_posted));
            
            const row = `
                <tr style="animation: slideIn 0.5s ease ${index * 0.1}s both;">
                    <td class="title">${announcement.title}</td>
                    <td><span class="category-badge ${categoryClass}">${announcement.category}</span></td>
                    <td style="font-weight: 600; color: #3949ab;">${announcement.admin_name}</td>
                    <td style="color: #666;" title="${date}">${timeAgo}</td>
                    <td>
                        <button class="edit-btn" data-id="${announcement.id}" title="Edit announcement">Edit</button>
                        <button class="delete-btn" data-id="${announcement.id}" title="Delete announcement">Delete</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    }

    // Event delegation for edit and delete buttons
    adminTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = parseInt(e.target.dataset.id);
            editAnnouncement(id);
        } else if (e.target.classList.contains('delete-btn')) {
            const id = parseInt(e.target.dataset.id);
            deleteAnnouncement(id);
        }
    });

    function editAnnouncement(id) {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const announcement = announcements.find(a => a.id === id);
        
        if (announcement) {
            document.getElementById('title').value = announcement.title;
            document.getElementById('content').value = announcement.content;
            document.getElementById('category').value = announcement.category;
            document.getElementById('adminName').value = announcement.admin_name;
            
            if (announcement.images) {
                uploadedImages = JSON.parse(announcement.images);
                displayImagePreview();
            }
            
            announcementForm.dataset.editId = id;
            adminManagement.classList.add('hidden');
            adminPanel.classList.remove('hidden');
        }
    }

    function deleteAnnouncement(id) {
        if (confirm('Are you sure you want to delete this announcement?')) {
            const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const filteredAnnouncements = announcements.filter(a => a.id !== id);
            localStorage.setItem('announcements', JSON.stringify(filteredAnnouncements));
            
            loadAdminTable();
            loadAnnouncements();
            alert('Announcement deleted successfully!');
        }
    }

    function getTimeAgo(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    }

    // Add loading animation
    function showLoading(element) {
        element.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">🔄 Loading...</td></tr>';
    }

    // Enhanced load functions with loading states
    const originalLoadAnnouncements = loadAnnouncements;
    loadAnnouncements = function(category = '') {
        const tbody = announcementsContainer.querySelector('tbody');
        showLoading(tbody);
        originalLoadAnnouncements(category);
    };

    const originalLoadAdminTable = loadAdminTable;
    loadAdminTable = function() {
        const tbody = adminTable.querySelector('tbody');
        showLoading(tbody);
        originalLoadAdminTable();
    };

    // Modal functionality
    const modal = document.getElementById('taskModal');
    const closeModals = document.querySelectorAll('.close');
    
    closeModals.forEach(closeBtn => {
        closeBtn.onclick = () => {
            closeBtn.closest('.modal').classList.add('hidden');
        };
    });
    
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.add('hidden');
        }
    };
    
    window.showTaskDetail = (id) => {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const announcement = announcements.find(a => a.id === id);
        
        if (announcement) {
            const modalTitle = document.getElementById('modalTitle');
            const modalCategory = document.getElementById('modalCategory');
            const modalAdmin = document.getElementById('modalAdmin');
            const modalDate = document.getElementById('modalDate');
            const modalContent = document.getElementById('modalContent');
            const modalImages = document.getElementById('modalImages');
            
            if (modalTitle) modalTitle.textContent = announcement.title;
            if (modalCategory) {
                modalCategory.textContent = announcement.category;
                modalCategory.className = `category-badge category-${announcement.category.toLowerCase()}`;
            }
            if (modalAdmin) modalAdmin.textContent = `${announcement.admin_name}`;
            if (modalDate) modalDate.textContent = `${new Date(announcement.date_posted).toLocaleDateString()}`;
            if (modalContent) modalContent.textContent = announcement.content;
            
            if (modalImages) {
                if (announcement.images) {
                    const images = JSON.parse(announcement.images);
                    modalImages.innerHTML = images.map(img => 
                        `<img src="${img}" onclick="openImage('${img}')" title="Click to view full size"/>`
                    ).join('');
                } else {
                    modalImages.innerHTML = '';
                }
            }
            
            if (modal) {
                modal.classList.remove('hidden');
            }
        }
    };
    


    // Initial load
    loadAnnouncements();
    loadCategories();
});