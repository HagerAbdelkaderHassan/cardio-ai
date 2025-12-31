/**
 * Schedule Page JavaScript
 * Handles tab switching and other interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Tab Switching
    const tabButtons = document.querySelectorAll('.tabs__btn');
    const viewSections = document.querySelectorAll('.view-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.dataset.tab;

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('tabs__btn--active'));

            // Add active class to clicked button
            this.classList.add('tabs__btn--active');

            // Hide all view sections
            viewSections.forEach(section => section.classList.remove('view-section--active'));

            // Show selected view section
            const targetSection = document.getElementById(tabName + '-view');
            if (targetSection) {
                targetSection.classList.add('view-section--active');
            }
        });
    });

    // Date Picker (placeholder for future implementation)
    const datePicker = document.querySelector('.date-picker');
    if (datePicker) {
        datePicker.addEventListener('click', function () {
            // TODO: Implement date picker modal
            console.log('Date picker clicked');
        });
    }

    // New Appointment Button
    const newAppointmentBtns = document.querySelectorAll('.btn--primary');
    newAppointmentBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Navigate to add schedule page
            window.location.href = './add-schedule.html';
        });
    });

    // Calendar Slot Click
    const slotCells = document.querySelectorAll('.slot-cell');
    slotCells.forEach(cell => {
        cell.addEventListener('click', function () {
            // TODO: Implement slot selection
            this.classList.toggle('slot-cell--selected');
            console.log('Slot clicked');
        });
    });

    // Sidebar Navigation
    const navItems = document.querySelectorAll('.sidebar__nav-item');
    navItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the text content to determine which page to navigate to
            const navText = this.querySelector('span')?.textContent.trim() || '';
            
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('sidebar__nav-item--active'));
            // Add active to clicked
            this.classList.add('sidebar__nav-item--active');
            
            // Navigate based on text
            if (navText === 'Dashboard') {
                window.location.href = '../dashboadrd/dashboard.html';
            } else if (navText === 'Patient Search') {
                window.location.href = '../patient-search/patient-search/patient-search.html';
            } else if (navText === 'My Patients') {
                window.location.href = '../my-patients/my-patients.html';
            } else if (navText === 'Requests') {
                window.location.href = '../my-requests/my-requests.html';
            } else if (navText === 'Schedule') {
                // Already on schedule page
                return;
            }
        });
    });
});
