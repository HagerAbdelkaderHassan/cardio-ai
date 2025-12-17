// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== AVATAR UPLOAD FUNCTIONALITY ==========
    
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    const largeAvatarContainer = document.getElementById('largeAvatarContainer');
    
    // Function to handle avatar image display
    function displayAvatarImage(element, imageUrl) {
        const icon = element.querySelector('i');
        if (icon) {
            icon.style.display = 'none';
        }
        
        // Check if img element already exists
        let img = element.querySelector('img');
        if (!img) {
            img = document.createElement('img');
            img.alt = 'User Avatar';
            element.appendChild(img);
        }
        img.src = imageUrl;
        img.style.display = 'block';
    }
    
    // Function to handle file upload
    function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                
                // Display in both avatars
                displayAvatarImage(profileAvatar, imageUrl);
                displayAvatarImage(largeAvatarContainer, imageUrl);
                
                // Save to localStorage
                localStorage.setItem('userAvatar', imageUrl);
                
                // Show success message
                showToast('Avatar updated successfully!', 'success');
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    // Set up avatar upload
    if (avatarUpload && profileAvatar) {
        // Click on avatar to trigger file input
        profileAvatar.addEventListener('click', function(e) {
            if (e.target !== avatarUpload) {
                avatarUpload.click();
            }
        });
        
        // Click on large avatar to trigger file input
        largeAvatarContainer.addEventListener('click', function(e) {
            avatarUpload.click();
        });
        
        // Handle file selection
        avatarUpload.addEventListener('change', handleAvatarUpload);
        
        // Load saved avatar from localStorage
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            displayAvatarImage(profileAvatar, savedAvatar);
            displayAvatarImage(largeAvatarContainer, savedAvatar);
        }
    }
    
    // ========== SIDEBAR NAVIGATION (DIRECT REDIRECT - NO CONFIRMATION) ==========
    
    // Function to handle sidebar navigation
    function setupSidebarNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const page = this.getAttribute('data-page');
                if (page) {
                    // Direct redirect without confirmation
                    window.location.href = page;
                }
            });
        });
    }
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // ========== STAT CARDS CLICK EVENTS (DIRECT REDIRECT) ==========
    
    // Function to handle stat cards navigation
    function setupStatCardsNavigation() {
        const statCards = document.querySelectorAll('.stat-card[data-page]');
        
        statCards.forEach(card => {
            card.addEventListener('click', function() {
                const page = this.getAttribute('data-page');
                if (page) {
                    // Direct redirect without confirmation
                    window.location.href = page;
                }
            });
        });
    }
    
    // Setup stat cards navigation
    setupStatCardsNavigation();
    
    // ========== HEADER ACTIONS ==========
    
    // Notifications Button
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            window.location.href = "/patient/notifications/notification.html";
        });
    }
    
    // Settings Button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            window.location.href = "/patient/profile/profile.html";
        });
    }
    
    // Quick Notifications Button
    const quickNotifications = document.getElementById('quickNotifications');
    if (quickNotifications) {
        quickNotifications.addEventListener('click', function() {
            window.location.href = "/patient/notifications/notification.html";
        });
    }
    
    // ========== QUICK LINKS FOOTER ==========
    
    // Home Link (Footer)
    const homeLinks = document.querySelectorAll('a[href="dashboard.html"]');
    homeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    });
    
    // Features Link
    const featuresLinks = document.querySelectorAll('a[href="features.html"]');
    featuresLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'features.html';
        });
    });
    
    // About Link
    const aboutLinks = document.querySelectorAll('a[href="about.html"]');
    aboutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'about.html';
        });
    });
    
    // Chatbot Link
    const chatbotLinks = document.querySelectorAll('a[href="chat-bot.html"]');
    chatbotLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'chat-bot.html';
        });
    });
    
    // ========== LOGOUT BUTTON ==========
    
    // Footer Logout Button
    const footerLogoutBtn = document.getElementById('footerLogoutBtn');
    if (footerLogoutBtn) {
        footerLogoutBtn.addEventListener('click', function() {
            // Ask for confirmation only on logout
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = "/registeration/doctor/patient/logout.html";
            }
        });
    }
    
    // ========== CHAT BOT ==========
    
    // Chat Bot Icon - صورة مباشرة
    const chatBotBtn = document.getElementById('chatBotBtn');
    if (chatBotBtn) {
        chatBotBtn.addEventListener('click', function() {
            // Redirect مباشر بدون تأكيد
            window.location.href = '/chatbot/mainpage.html';
        });
    }
    
    // ========== SEARCH FUNCTIONALITY ==========
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }
    
    // ========== KEYBOARD SHORTCUTS ==========
    
    document.addEventListener('keydown', function(e) {
        // Ctrl + L for Logout
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            if (footerLogoutBtn) footerLogoutBtn.click();
        }
        
        // Ctrl + H for Home
        if (e.ctrlKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        }
        
        // Ctrl + P for Profile
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.location.href = 'profile.html';
        }
        
        // Ctrl + C for Chat Bot
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            if (chatBotBtn) chatBotBtn.click();
        }
        
        // Escape key to focus search
        if (e.key === 'Escape' && searchInput) {
            searchInput.focus();
        }
    });
    
    // ========== ACTIVE NAV ITEM HIGHLIGHTING ==========
    
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            
            // Mark home as active by default for main page
            if (currentPage === 'index.html' || currentPage.includes('dashboard')) {
                if (item.id === 'homeNav') item.classList.add('active');
            }
        });
    }
    
    // Call once on load
    setActiveNavItem();
    
    // ========== DEMO DATA FOR TESTING ==========
    
    // Set demo user data in localStorage for testing
    if (!localStorage.getItem('userData')) {
        const demoUser = {
            name: "Sarah Johnson",
            age: 34,
            email: "sarah.johnson@example.com"
        };
        localStorage.setItem('userData', JSON.stringify(demoUser));
    }
    
    // Set demo notifications
    if (!localStorage.getItem('notifications')) {
        const demoNotifications = [
            { id: 1, message: "Appointment reminder: Dr. Smith tomorrow at 10 AM", read: false, time: "2 hours ago" },
            { id: 2, message: "Your lab results are ready", read: false, time: "1 day ago" },
            { id: 3, message: "Medication refill reminder", read: true, time: "2 days ago" }
        ];
        localStorage.setItem('notifications', JSON.stringify(demoNotifications));
    }
    
    // ========== LOAD USER DATA ==========
    
    function loadUserData() {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (userData.name) {
            const welcomeHeading = document.querySelector('.user-details h1');
            if (welcomeHeading) {
                welcomeHeading.textContent = `Hello, ${userData.name}!`;
            }
            
            if (userData.age) {
                const ageElement = document.querySelector('.user-age');
                if (ageElement) {
                    ageElement.textContent = `${userData.age} years old`;
                }
            }
        }
    }
    
    // Load user data
    loadUserData();
    
    // ========== NOTIFICATIONS BADGE ==========
    
    function updateNotificationsBadge() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const unreadCount = notifications.filter(n => !n.read).length;
        
        const notificationBadge = document.querySelector('.notifications-btn span');
        if (notificationBadge && unreadCount > 0) {
            notificationBadge.textContent = `${unreadCount} New Notification${unreadCount > 1 ? 's' : ''}`;
        }
    }
    
    // Update badge on load
    updateNotificationsBadge();
    
    console.log('✅ Dashboard loaded successfully!');
    
    // ========== TOAST NOTIFICATION FUNCTION ==========
    
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#003785'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: 'Manrope', sans-serif;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Add animation styles for toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Show welcome toast after 1 second
    setTimeout(() => {
        showToast('Welcome to Cardio AI Dashboard!', 'info');
    }, 1000);
});