/**
 * Patient Records Navigation System
 * Handles internal navigation between sections without page reload
 */

(function () {
  'use strict';

  // Navigation configuration
  const sections = {
    'overview': {
      id: 'overview-section',
      buttonSelector: '.overview-records__button2'
    },
    'visit-history': {
      id: 'visit-history-section',
      buttonSelector: '.overview-records__button3'
    },
    'lab-results': {
      id: 'lab-results-section',
      buttonSelector: '.overview-records__button4'
    },
    'medications': {
      id: 'medications-section',
      buttonSelector: '.overview-records__button5'
    },
    'clinical-notes': {
      id: 'clinical-notes-section',
      buttonSelector: '.overview-records__button6'
    }
  };

  /**
   * Initialize navigation system
   */
  function initNavigation() {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');

    // Add click event listeners to all navigation buttons
    navButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const sectionName = this.getAttribute('data-section');
        if (sectionName && sections[sectionName]) {
          switchSection(sectionName);
        }
      });
    });

    // Set initial active section
    switchSection('overview');
  }

  /**
   * Switch to a specific section
   * @param {string} sectionName - Name of the section to show
   */
  function switchSection(sectionName) {
    if (!sections[sectionName]) {
      console.error('Invalid section:', sectionName);
      return;
    }

    // Hide all sections
    const allSections = document.querySelectorAll('.section-content');
    allSections.forEach(function (section) {
      section.classList.remove('active');
    });

    // Remove active class from all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(function (button) {
      button.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sections[sectionName].id);
    if (selectedSection) {
      selectedSection.classList.add('active');
    }

    // Add active class to selected navigation button
    const selectedButton = document.querySelector(
      '.nav-button[data-section="' + sectionName + '"]'
    );
    if (selectedButton) {
      selectedButton.classList.add('active');
    }

    // Update button styles based on active state
    updateButtonStyles(sectionName);
  }

  /**
   * Update button styles to show active state
   * @param {string} sectionName - Name of the active section
   */
  function updateButtonStyles(sectionName) {
    // Reset all buttons to inactive style
    const button2 = document.querySelector('.overview-records__button2');
    const button3 = document.querySelector('.overview-records__button3');
    const button4 = document.querySelector('.overview-records__button4');
    const button5 = document.querySelector('.overview-records__button5');
    const button6 = document.querySelector('.overview-records__button6');

    // Remove active background from all
    [button2, button3, button4, button5, button6].forEach(function (btn) {
      if (btn) {
        btn.style.background = 'rgba(0, 0, 0, 0)';
        btn.style.boxShadow = 'none';
      }
    });

    // Apply active style to selected button
    const activeButtonMap = {
      'overview': button2,
      'visit-history': button3,
      'lab-results': button4,
      'medications': button5,
      'clinical-notes': button6
    };

    const activeButton = activeButtonMap[sectionName];
    if (activeButton) {
      activeButton.style.background = '#ffffff';
      activeButton.style.boxShadow = '0px 0px 1px 0px rgba(23, 26, 31, 0.15), 0px 0px 2px 0px rgba(23, 26, 31, 0.2)';
    }
  }

  /**
   * Clinical Notes View Toggle System
   * Controls switching between overview and form views
   */

  // Clinical Notes DOM elements
  var clinicalNotesOverview = null;
  var clinicalNotesForm = null;
  var addNotesButton = null;
  var cancelButton = null;
  var saveButton = null;

  /**
   * Initialize Clinical Notes toggle functionality
   */
  function initClinicalNotes() {
    // Get Clinical Notes elements
    clinicalNotesOverview = document.getElementById('clinical-notes-overview');
    clinicalNotesForm = document.getElementById('clinical-notes-form');

    // Get action buttons
    addNotesButton = document.querySelector('.add-clinical-notes__button8');
    cancelButton = document.querySelector('.add-clinical-notes__button9');
    saveButton = document.querySelector('.add-clinical-notes__button10');

    // Add event listeners
    if (addNotesButton) {
      addNotesButton.addEventListener('click', showClinicalNotesForm);
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', showClinicalNotesOverview);
    }

    if (saveButton) {
      saveButton.addEventListener('click', handleSaveClinicalNotes);
    }

    // Ensure initial state: overview visible, form hidden
    resetClinicalNotesView();
  }

  /**
   * Show the Clinical Notes form view
   * Hides the overview and displays the form
   */
  function showClinicalNotesForm() {
    if (clinicalNotesOverview) {
      clinicalNotesOverview.classList.add('clinical-notes-hidden');
    }
    if (clinicalNotesForm) {
      clinicalNotesForm.classList.remove('clinical-notes-hidden');
    }
  }

  /**
   * Show the Clinical Notes overview view
   * Hides the form and displays the overview
   */
  function showClinicalNotesOverview() {
    if (clinicalNotesForm) {
      clinicalNotesForm.classList.add('clinical-notes-hidden');
    }
    if (clinicalNotesOverview) {
      clinicalNotesOverview.classList.remove('clinical-notes-hidden');
    }
  }

  /**
   * Handle Save button click
   * Returns to overview (no backend logic required)
   */
  function handleSaveClinicalNotes() {
    // Return to overview view
    showClinicalNotesOverview();
  }

  /**
   * Reset Clinical Notes to initial state
   * Shows overview, hides form
   */
  function resetClinicalNotesView() {
    if (clinicalNotesOverview) {
      clinicalNotesOverview.classList.remove('clinical-notes-hidden');
    }
    if (clinicalNotesForm) {
      clinicalNotesForm.classList.add('clinical-notes-hidden');
    }
  }

  /**
   * Initialize sidebar navigation to other pages
   */
  function initSidebarNavigation() {
    // Dashboard Button
    const dashboardBtn = document.querySelector('.overview-records__button11');
    if (dashboardBtn) {
      dashboardBtn.style.cursor = 'pointer';
      dashboardBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '../../../dashboadrd/dashboard.html';
      });
      dashboardBtn.querySelectorAll('*').forEach(child => {
        child.style.pointerEvents = 'none';
      });
    }

    // Patient Search Button
    const patientSearchBtn = document.querySelector('.overview-records__button7');
    if (patientSearchBtn) {
      patientSearchBtn.style.cursor = 'pointer';
      patientSearchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '../../../patient-search/patient-search/patient-search.html';
      });
      patientSearchBtn.querySelectorAll('*').forEach(child => {
        child.style.pointerEvents = 'none';
      });
    }

    // My Patients Button
    const myPatientsBtn = document.querySelector('.overview-records__button8');
    if (myPatientsBtn) {
      myPatientsBtn.style.cursor = 'pointer';
      myPatientsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '../../../my-patients/my-patients.html';
      });
      myPatientsBtn.querySelectorAll('*').forEach(child => {
        child.style.pointerEvents = 'none';
      });
    }

    // Requests Button
    const requestsBtn = document.querySelector('.overview-records__button9');
    if (requestsBtn) {
      requestsBtn.style.cursor = 'pointer';
      requestsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '../../../my-requests/my-requests.html';
      });
      requestsBtn.querySelectorAll('*').forEach(child => {
        child.style.pointerEvents = 'none';
      });
    }

    // Schedule Button (in sidebar)
    const scheduleBtn = document.querySelector('.overview-records__button10');
    if (scheduleBtn) {
      scheduleBtn.style.cursor = 'pointer';
      scheduleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '../../../schedule/schedule.html';
      });
      scheduleBtn.querySelectorAll('*').forEach(child => {
        child.style.pointerEvents = 'none';
      });
    }

    // Schedule Button (in patient info header)
    const scheduleHeaderBtn = document.querySelector('.overview-records__button');
    if (scheduleHeaderBtn) {
      scheduleHeaderBtn.style.cursor = 'pointer';
      scheduleHeaderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '../../../schedule/schedule.html';
      });
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initNavigation();
      initClinicalNotes();
      initSidebarNavigation();
    });
  } else {
    initNavigation();
    initClinicalNotes();
    initSidebarNavigation();
  }

})();

