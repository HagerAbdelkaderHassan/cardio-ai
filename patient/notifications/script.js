// Mobile Menu Toggle
const mobileMenuToggle = document.createElement('div');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';

const headerLeft = document.querySelector('.header-left');
headerLeft.insertBefore(mobileMenuToggle, headerLeft.firstChild);

const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.createElement('div');
sidebarOverlay.className = 'sidebar-overlay';
document.body.appendChild(sidebarOverlay);

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
});

// Mark All as Read Functionality
const markAllBtn = document.querySelector('.mark-all-btn');
const notificationBadge = document.querySelector('.notification-badge');
const notificationCards = document.querySelectorAll('.notification-card');

markAllBtn.addEventListener('click', () => {
    // Mark all notifications as read
    notificationCards.forEach(card => {
        card.classList.add('read-notification');
    });
    
    // Reset badge counter
    if (notificationBadge) {
        notificationBadge.style.display = 'none';
    }
    
    // Show success message
    showToast('All notifications marked as read');
});

// Filter notifications by type
function filterNotifications(filterType) {
    const cards = document.querySelectorAll('.notification-card');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    // Update active tab
    filterTabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter cards
    cards.forEach(card => {
        const cardType = card.getAttribute('data-type');
        
        if (filterType === 'all' || cardType === filterType) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Show notification details (for detailed view when clicked)
function showNotificationDetails(card) {
    const title = card.querySelector('.notification-title').textContent;
    const description = card.querySelector('.notification-desc').textContent;
    const time = card.querySelector('.notification-time').textContent;
    const type = card.getAttribute('data-type');
    
    // Create modal content based on notification type
    let detailedContent = '';
    
    switch(type) {
        case 'critical':
            detailedContent = `
                <h4>Urgent Health Alert Details</h4>
                <p>This alert was triggered by unusual patterns detected in your cardiac monitoring data.</p>
                <div class="detail-section">
                    <h5>Immediate Actions Recommended:</h5>
                    <ul>
                        <li>Contact your doctor immediately</li>
                        <li>If experiencing chest pain, dizziness, or shortness of breath, seek emergency care</li>
                        <li>Rest and avoid physical exertion</li>
                        <li>Your care team has been automatically notified</li>
                    </ul>
                </div>
                <div class="reassurance">
                    <p><strong>Remember:</strong> Our system is designed to catch potential issues early. Prompt action can prevent complications.</p>
                </div>
            `;
            break;
            
        case 'warning':
            detailedContent = `
                <h4>AI Health Warning Details</h4>
                <p>This is a preventive alert based on predictive analysis of your health data.</p>
                <div class="detail-section">
                    <h5>Why this alert was generated:</h5>
                    <ul>
                        <li>Analysis of recent trends in your vital signs</li>
                        <li>Comparison with your personal health baseline</li>
                        <li>Identification of patterns that may indicate early issues</li>
                    </ul>
                </div>
                <div class="reassurance">
                    <p><strong>This is not an emergency.</strong> This alert allows you to take preventive action before a situation becomes urgent.</p>
                </div>
            `;
            break;
            
        default:
            detailedContent = `
                <h4>Notification Details</h4>
                <p>${description}</p>
                <div class="detail-section">
                    <h5>Additional Information:</h5>
                    <p>Your health and safety are our top priority. This notification is part of our continuous monitoring system designed to keep you informed and protected.</p>
                </div>
            `;
    }
    
    // Show detailed view (in practice, this would open a modal or new view)
    alert(`Detailed View: ${title}\n\n${detailedContent}\n\nReceived: ${time}`);
    
    // Mark as read after viewing
    card.classList.add('read-notification');
}

// Add click handlers to notification cards
notificationCards.forEach(card => {
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking on action buttons
        if (!e.target.closest('.notification-action-btn')) {
            showNotificationDetails(this);
        }
    });
});

// Toast notification function
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideIn 0.3s ease;
        font-family: 'Manrope', sans-serif;
        max-width: 400px;
    `;
    
    // Add keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Emergency contact functionality
const emergencyBtn = document.querySelector('.emergency-btn');
if (emergencyBtn) {
    emergencyBtn.addEventListener('click', () => {
        const confirmed = confirm('This will connect you to emergency services. Continue?');
        if (confirmed) {
            // In a real application, this would initiate an emergency call
            showToast('Emergency services have been notified. Stay calm, help is on the way.', 'warning');
            
            // Simulate notification to emergency contacts
            setTimeout(() => {
                showToast('Your emergency contacts have been notified of the situation.');
            }, 1500);
        }
    });
}

// Search functionality
const searchBox = document.querySelector('.search-box input');
if (searchBox) {
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.notification-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.notification-title').textContent.toLowerCase();
            const desc = card.querySelector('.notification-desc').textContent.toLowerCase();
            const tag = card.querySelector('.notification-tag').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || desc.includes(searchTerm) || tag.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('CardioAI Notifications page initialized');
    
    // Add any initialization code here
    const unreadCount = document.querySelectorAll('.notification-card:not(.read-notification)').length;
    if (unreadCount > 0 && notificationBadge) {
        notificationBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    }
    
    // Initialize filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            filterNotifications(filterType);
        });
    });
});

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
});

// Export functions for use in HTML
window.showNotificationDetail = function(type) {
    // This function is defined in the HTML for simplicity
    console.log('Showing notification detail for:', type);
};

window.closeNotificationDetail = function() {
    console.log('Closing notification detail');
};

window.markAsRead = function() {
    console.log('Marking as read');
};

window.takeAction = function() {
    console.log('Taking action');
};