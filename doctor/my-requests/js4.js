/**
 * Patient Requests Page - Tab Navigation
 * Handles switching between Pending, Urgent, In Review, and Completed sections
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function () {

        // Define all request sections
        const sections = {
            pending: document.querySelector('.my-requests'),
            completed: document.querySelector('.my-requests-completed'),
            inReview: document.querySelector('.my-requests-in-review'),
            urgent: document.querySelector('.my-requests-urgent')
        };

        // Initially hide all sections except pending
        function initializeSections() {
            Object.values(sections).forEach(section => {
                if (section) {
                    section.style.display = 'none';
                }
            });
            // Show pending by default
            if (sections.pending) {
                sections.pending.style.display = 'block';
            }
        }

        // Show specific section and hide others
        function showSection(sectionName) {
            Object.entries(sections).forEach(([name, section]) => {
                if (section) {
                    section.style.display = name === sectionName ? 'block' : 'none';
                }
            });
            updateActiveButtons(sectionName);
        }

        // Update active state on all filter buttons
        function updateActiveButtons(activeSection) {
            // Remove active class from all buttons
            document.querySelectorAll('[class*="__button"]').forEach(btn => {
                btn.classList.remove('filter-active');
            });

            // Add active class to clicked button based on section
            const buttonSelectors = {
                pending: '[class*="pending-3"]',
                urgent: '[class*="urgent-1"]',
                inReview: '[class*="in-review-1"]',
                completed: '[class*="completed-1"]'
            };

            const activeSelector = buttonSelectors[activeSection];
            if (activeSelector) {
                document.querySelectorAll(activeSelector).forEach(btn => {
                    const parentBtn = btn.closest('[class*="__button"]');
                    if (parentBtn) {
                        parentBtn.classList.add('filter-active');
                    }
                });
            }
        }

        // Add click handlers to filter buttons
        function setupFilterButtons() {
            // Pending buttons
            document.querySelectorAll('[class*="pending-3"]').forEach(btn => {
                const parentBtn = btn.closest('[class*="__button"]');
                if (parentBtn) {
                    parentBtn.style.cursor = 'pointer';
                    parentBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        showSection('pending');
                    });
                }
            });

            // Urgent buttons
            document.querySelectorAll('[class*="urgent-1"]').forEach(btn => {
                const parentBtn = btn.closest('[class*="__button"]');
                if (parentBtn) {
                    parentBtn.style.cursor = 'pointer';
                    parentBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        showSection('urgent');
                    });
                }
            });

            // In Review buttons
            document.querySelectorAll('[class*="in-review-1"]').forEach(btn => {
                const parentBtn = btn.closest('[class*="__button"]');
                if (parentBtn) {
                    parentBtn.style.cursor = 'pointer';
                    parentBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        showSection('inReview');
                    });
                }
            });

            // Completed buttons
            document.querySelectorAll('[class*="completed-1"]').forEach(btn => {
                const parentBtn = btn.closest('[class*="__button"]');
                if (parentBtn) {
                    parentBtn.style.cursor = 'pointer';
                    parentBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        showSection('completed');
                    });
                }
            });
        }

        // Setup Review buttons to open modal
        function setupReviewButtons() {
            document.querySelectorAll('[class*="__review"]').forEach(btn => {
                const parentBtn = btn.closest('[class*="__button"]');
                if (parentBtn && !parentBtn.classList.contains('filter-btn')) {
                    parentBtn.style.cursor = 'pointer';
                    parentBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (typeof window.showRefillModal === 'function') {
                            window.showRefillModal();
                        }
                    });
                }
            });

            // Continue Review button
            document.querySelectorAll('[class*="continue-review"]').forEach(btn => {
                const parentBtn = btn.closest('[class*="__button"]');
                if (parentBtn) {
                    parentBtn.style.cursor = 'pointer';
                    parentBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        if (typeof window.showRefillModal === 'function') {
                            window.showRefillModal();
                        }
                    });
                }
            });
        }

        // Add CSS for active button state
        function addActiveButtonStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .filter-active {
                    background: #003785 !important;
                    color: #ffffff !important;
                    border-radius: 6px;
                }
                .filter-active * {
                    color: #ffffff !important;
                }
                [class*="__button"]:hover {
                    opacity: 0.8;
                    transition: opacity 0.2s ease;
                }
            `;
            document.head.appendChild(style);
        }

        // Navigation handlers
        function initNavigation() {
            // Dashboard Button
            const dashboardBtn = document.querySelector('.my-requests__button11');
            if (dashboardBtn) {
                dashboardBtn.style.cursor = 'pointer';
                dashboardBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '../dashboadrd/dashboard.html';
                });
                dashboardBtn.querySelectorAll('*').forEach(child => {
                    child.style.pointerEvents = 'none';
                });
            }

            // Patient Search Button
            const patientSearchBtn = document.querySelector('.my-requests__button7');
            if (patientSearchBtn) {
                patientSearchBtn.style.cursor = 'pointer';
                patientSearchBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '../patient-search/patient-search/patient-search.html';
                });
                patientSearchBtn.querySelectorAll('*').forEach(child => {
                    child.style.pointerEvents = 'none';
                });
            }

            // My Patients Button
            const myPatientsBtn = document.querySelector('.my-requests__button8');
            if (myPatientsBtn) {
                myPatientsBtn.style.cursor = 'pointer';
                myPatientsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '../my-patients/my-patients.html';
                });
                myPatientsBtn.querySelectorAll('*').forEach(child => {
                    child.style.pointerEvents = 'none';
                });
            }

            // Requests Button (current page - no action needed)

            // Schedule Button
            const scheduleBtn = document.querySelector('.my-requests__button10');
            if (scheduleBtn) {
                scheduleBtn.style.cursor = 'pointer';
                scheduleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = '../schedule/schedule.html';
                });
                scheduleBtn.querySelectorAll('*').forEach(child => {
                    child.style.pointerEvents = 'none';
                });
            }
        }

        // Initialize everything
        addActiveButtonStyles();
        initializeSections();
        setupFilterButtons();
        setupReviewButtons();
        updateActiveButtons('pending');
        initNavigation();

        // Make functions globally available
        window.showSection = showSection;
    });
})();
