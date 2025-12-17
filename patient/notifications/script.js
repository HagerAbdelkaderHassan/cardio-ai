// Mobile Menu Toggle
const mobileMenuToggle = document.createElement('div');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';

const headerLeft = document.querySelector('.header-left');
headerLeft.appendChild(mobileMenuToggle);

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



// Show Notification Details Function
function showNotificationDetails(title, description) {
    const detailModal = document.createElement('div');
    detailModal.className = 'notification-detail-modal';
    detailModal.innerHTML = `
        <div class="notification-detail-content">
            <div class="notification-detail-header">
                <h3>${title}</h3>
                <button class="close-detail-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-detail-body">
                <p>${description}</p>
            </div>
            <div class="notification-detail-footer">
                <button class="detail-action-btn">
                    <i class="fas fa-check"></i>
                    Mark as Read
                </button>
                <button class="detail-action-btn">
                    <i class="fas fa-share"></i>
                    Share
                </button>
            </div>
        </div>
    `;
    
    // Add styles
    detailModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1002;
        padding: 20px;
        font-family: 'Manrope', sans-serif;
    `;
    
    const detailContent = detailModal.querySelector('.notification-detail-content');
    detailContent.style.cssText = `
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    `;
    
    const detailHeader = detailModal.querySelector('.notification-detail-header');
    detailHeader.style.cssText = `
        padding: 20px;
        background: #003785;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    
    detailHeader.querySelector('h3').style.cssText = `
        margin: 0;
        font-size: 20px;
        font-weight: 600;
    `;
    
    const closeBtn = detailModal.querySelector('.close-detail-btn');
    closeBtn.style.cssText = `
        background: transparent;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'transparent';
    });
    
    const detailBody = detailModal.querySelector('.notification-detail-body');
    detailBody.style.cssText = `
        padding: 20px;
        flex: 1;
        overflow-y: auto;
    `;
    
    detailBody.querySelector('p').style.cssText = `
        color: #565e6c;
        line-height: 1.6;
        font-size: 16px;
        margin: 0;
    `;
    
    const detailFooter = detailModal.querySelector('.notification-detail-footer');
    detailFooter.style.cssText = `
        padding: 20px;
        background: #f8f9fa;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        border-top: 1px solid #dee1e6;
    `;
    
    const actionBtns = detailModal.querySelectorAll('.detail-action-btn');
    actionBtns.forEach(btn => {
        btn.style.cssText = `
            padding: 10px 20px;
            border-radius: 6px;
            border: 1px solid #dee1e6;
            background: white;
            color: #171a1f;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
        `;
        
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#f3f4f6';
            btn.style.borderColor = '#003785';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'white';
            btn.style.borderColor = '#dee1e6';
        });
        
        btn.addEventListener('click', () => {
            const action = btn.textContent.trim();
            showToast(`${action} for: ${title}`);
            detailModal.remove();
        });
    });
    
    document.body.appendChild(detailModal);
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        detailModal.remove();
    });
    
    // Close on overlay click
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.remove();
        }
    });
}

// Initialize page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    console.log('Notifications page loaded successfully');
    
    // Check for new notifications
    checkNewNotifications();
});

function checkNewNotifications() {
    // Simulate checking for new notifications
    const newNotifications = document.querySelectorAll('.notification-tag.new');
    
    if (newNotifications.length > 0) {
        console.log(`You have ${newNotifications.length} new notifications`);
    }
}

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
});