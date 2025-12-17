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

// Appointment Tabs Functionality
const appointmentTabs = document.querySelectorAll('.appointment-tab');
const appointmentsLists = document.querySelectorAll('.appointments-list');

appointmentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and lists
        appointmentTabs.forEach(t => t.classList.remove('active'));
        appointmentsLists.forEach(list => list.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Show corresponding list
        const tabType = tab.dataset.tab;
        const targetList = document.getElementById(`${tabType}-appointments`);
        if (targetList) {
            targetList.classList.add('active');
        }
        
        // Update tab focus indicator
        updateTabIndicator();
    });
});

function updateTabIndicator() {
    const activeTab = document.querySelector('.appointment-tab.active');
    if (activeTab) {
        const tabsContainer = document.querySelector('.appointments-tabs');
        // This can be extended for visual indicator animation
    }
}

// Time Slot Selection
const timeSlots = document.querySelectorAll('.time-slot');
timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        // Remove active class from all time slots
        timeSlots.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked slot
        slot.classList.add('active');
        
        // Update selected time in form
        updateSelectedTime(slot.textContent);
    });
});

function updateSelectedTime(time) {
    // Store selected time for form submission
    sessionStorage.setItem('selectedAppointmentTime', time);
    
    // Show visual feedback
    showToast(`Time slot selected: ${time}`);
}

// Appointment Booking Form
const confirmBookingBtn = document.querySelector('.confirm-booking-btn');
const specialtySelect = document.getElementById('specialty');
const doctorSelect = document.getElementById('doctor');
const hospitalSelect = document.getElementById('hospital');
const typeSelect = document.getElementById('appointment-type');
const dateInput = document.getElementById('date');

// Populate doctors based on specialty
specialtySelect.addEventListener('change', (e) => {
    const specialty = e.target.value;
    updateDoctorsBySpecialty(specialty);
});

function updateDoctorsBySpecialty(specialty) {
    // Clear current options except first
    while (doctorSelect.options.length > 1) {
        doctorSelect.remove(1);
    }
    
    // Add doctors based on specialty
    const doctors = {
        'cardiology': [
            { value: 'dr_emily', name: 'Dr. Emily White (Cardiology)' },
            { value: 'dr_michael', name: 'Dr. Michael Brown (Cardiology)' }
        ],
        'dermatology': [
            { value: 'dr_david', name: 'Dr. David Lee (Dermatology)' },
            { value: 'dr_lisa', name: 'Dr. Lisa Wang (Dermatology)' }
        ],
        'pediatrics': [
            { value: 'dr_sarah', name: 'Dr. Sarah Chen (Pediatrics)' },
            { value: 'dr_james', name: 'Dr. James Wilson (Pediatrics)' }
        ],
        'neurology': [
            { value: 'dr_robert', name: 'Dr. Robert Johnson (Neurology)' }
        ],
        'orthopedics': [
            { value: 'dr_thomas', name: 'Dr. Thomas Anderson (Orthopedics)' }
        ]
    };
    
    if (doctors[specialty]) {
        doctors[specialty].forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.value;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }
}

// Form Validation and Submission
confirmBookingBtn.addEventListener('click', () => {
    // Validate form
    if (validateBookingForm()) {
        // Show loading state
        confirmBookingBtn.classList.add('loading');
        confirmBookingBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
        
        // Simulate API call
        setTimeout(() => {
            bookAppointment();
            confirmBookingBtn.classList.remove('loading');
            confirmBookingBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Booking';
        }, 1500);
    }
});

function validateBookingForm() {
    const errors = [];
    
    if (!specialtySelect.value) {
        errors.push('Please select a specialty');
        highlightError(specialtySelect);
    }
    
    if (!doctorSelect.value) {
        errors.push('Please select a doctor');
        highlightError(doctorSelect);
    }
    
    if (!hospitalSelect.value) {
        errors.push('Please select a hospital');
        highlightError(hospitalSelect);
    }
    
    if (!typeSelect.value) {
        errors.push('Please select appointment type');
        highlightError(typeSelect);
    }
    
    if (!dateInput.value) {
        errors.push('Please select a date');
        highlightError(dateInput);
    }
    
    const selectedTime = document.querySelector('.time-slot.active');
    if (!selectedTime) {
        errors.push('Please select a time slot');
        showToast('Please select a time slot', 'error');
    }
    
    if (errors.length > 0) {
        showToast(`Please fix the following: ${errors.join(', ')}`, 'error');
        return false;
    }
    
    return true;
}

function highlightError(element) {
    element.style.borderColor = '#de3b4e';
    element.style.boxShadow = '0 0 0 2px rgba(222, 59, 78, 0.2)';
    
    setTimeout(() => {
        element.style.borderColor = '#dee1e6';
        element.style.boxShadow = 'none';
    }, 3000);
}

function bookAppointment() {
    // Collect form data
    const appointmentData = {
        specialty: specialtySelect.options[specialtySelect.selectedIndex].text,
        doctor: doctorSelect.options[doctorSelect.selectedIndex].text,
        hospital: hospitalSelect.options[hospitalSelect.selectedIndex].text,
        type: typeSelect.options[typeSelect.selectedIndex].text,
        date: dateInput.value,
        time: document.querySelector('.time-slot.active')?.textContent || 'Not selected'
    };
    
    // Generate appointment ID
    const appointmentId = 'APT-' + Date.now().toString().slice(-6);
    
    // Create new appointment card
    const newAppointment = createAppointmentCard({
        id: appointmentId,
        date: formatAppointmentDate(appointmentData.date, appointmentData.time),
        doctor: appointmentData.doctor,
        specialty: appointmentData.specialty.split('(')[1]?.replace(')', '') || 'General',
        location: appointmentData.hospital,
        type: appointmentData.type,
        status: 'upcoming'
    });
    
    // Add to upcoming appointments
    const upcomingList = document.getElementById('upcoming-appointments');
    if (upcomingList) {
        upcomingList.insertBefore(newAppointment, upcomingList.firstChild);
    }
    
    // Show success message
    showToast(`Appointment booked successfully! ID: ${appointmentId}`, 'success');
    
    // Reset form
    resetBookingForm();
    
    // Switch to upcoming tab
    document.querySelector('[data-tab="upcoming"]').click();
}

function createAppointmentCard(data) {
    const card = document.createElement('div');
    card.className = `appointment-card ${data.status}`;
    card.dataset.appointmentId = data.id;
    
    const formattedDate = data.date;
    const doctorName = data.doctor.split('(')[0].trim();
    const specialty = data.specialty;
    
    card.innerHTML = `
        <div class="appointment-header">
            <h3 class="appointment-title">${formattedDate}</h3>
            <span class="appointment-status ${data.status}">${data.status.charAt(0).toUpperCase() + data.status.slice(1)}</span>
        </div>
        <div class="appointment-details">
            <div class="appointment-info">
                <i class="fas fa-user-md"></i>
                <div>
                    <p class="doctor-name">${doctorName}</p>
                    <p class="specialty">${specialty}</p>
                </div>
            </div>
            <div class="appointment-info">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <p class="location">${data.location}</p>
                    <p class="address">123 Medical Center Dr</p>
                </div>
            </div>
            <div class="appointment-info">
                <i class="fas fa-notes-medical"></i>
                <div>
                    <p class="appointment-type">${data.type}</p>
                    <p class="appointment-id">#${data.id}</p>
                </div>
            </div>
        </div>
        <div class="appointment-actions">
            <div class="reminder-toggle">
                <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-slider"></span>
                </label>
                <span>SMS Reminder</span>
            </div>
            <div class="action-buttons">
                <button class="action-btn reschedule">
                    <i class="fas fa-calendar-alt"></i>
                    Reschedule
                </button>
                <button class="action-btn cancel">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to new buttons
    const rescheduleBtn = card.querySelector('.reschedule');
    const cancelBtn = card.querySelector('.cancel');
    const toggleSwitch = card.querySelector('.toggle-switch input');
    
    rescheduleBtn.addEventListener('click', () => rescheduleAppointment(data.id, card));
    cancelBtn.addEventListener('click', () => cancelAppointment(data.id, card));
    toggleSwitch.addEventListener('change', (e) => toggleReminder(data.id, e.target.checked));
    
    return card;
}

function formatAppointmentDate(dateString, timeString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `${formattedDate}, ${timeString}`;
}

function resetBookingForm() {
    specialtySelect.value = '';
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    hospitalSelect.value = '';
    typeSelect.value = '';
    dateInput.value = '2025-09-19';
    
    // Reset time slots
    timeSlots.forEach(slot => slot.classList.remove('active'));
    if (timeSlots[1]) timeSlots[1].classList.add('active'); // Default to 10:00 AM
}

// Appointment Actions
function rescheduleAppointment(appointmentId, card) {
    // Show reschedule modal
    showRescheduleModal(appointmentId, card);
}

function cancelAppointment(appointmentId, card) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        // Add cancelled class
        card.classList.add('cancelled');
        card.classList.remove('upcoming');
        
        // Update status
        const statusElement = card.querySelector('.appointment-status');
        statusElement.textContent = 'Cancelled';
        statusElement.className = 'appointment-status cancelled';
        
        // Change action buttons
        const actionsDiv = card.querySelector('.appointment-actions');
        actionsDiv.innerHTML = `
            <div class="action-buttons" style="width: 100%;">
                <button class="action-btn book-again" style="flex: 1;">
                    <i class="fas fa-calendar-plus"></i>
                    Book Again
                </button>
                <button class="action-btn view-reason" style="flex: 1;">
                    <i class="fas fa-info-circle"></i>
                    View Reason
                </button>
            </div>
        `;
        
        // Add event listeners to new buttons
        const bookAgainBtn = actionsDiv.querySelector('.book-again');
        const viewReasonBtn = actionsDiv.querySelector('.view-reason');
        
        bookAgainBtn.addEventListener('click', () => {
            showToast('Redirecting to booking form...');
            // You could pre-fill the booking form here
        });
        
        viewReasonBtn.addEventListener('click', () => {
            showAppointmentDetails(appointmentId, 'cancelled');
        });
        
        // Move to past appointments after 2 seconds
        setTimeout(() => {
            const pastList = document.getElementById('past-appointments');
            if (pastList) {
                pastList.appendChild(card);
                
                // Switch to past tab if not already there
                const pastTab = document.querySelector('[data-tab="past"]');
                if (!pastTab.classList.contains('active')) {
                    pastTab.click();
                }
            }
        }, 2000);
        
        showToast('Appointment cancelled successfully', 'success');
    }
}

function toggleReminder(appointmentId, enabled) {
    const status = enabled ? 'enabled' : 'disabled';
    showToast(`SMS reminders ${status} for appointment #${appointmentId}`);
}

// Modal Functions
const modal = document.getElementById('appointment-modal');
const closeModalBtn = document.querySelector('.close-modal');

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

function showAppointmentDetails(appointmentId, status = 'upcoming') {
    // This would typically fetch from an API
    const appointmentDetails = {
        'APT-2025-001': {
            id: 'APT-2025-001',
            date: 'Jan 25, 2025, 10:00 AM',
            doctor: 'Dr. Emily White',
            specialty: 'Cardiology',
            location: 'Cardio Clinic, Suite 101',
            address: '123 Medical Center Dr, Medical City',
            type: 'General Check-up',
            reason: 'Routine annual checkup',
            notes: 'Patient to fast for 12 hours before appointment. Bring previous medical records.',
            duration: '30 minutes',
            insurance: 'Covered by BlueCross (80%)'
        },
        'APT-2025-002': {
            id: 'APT-2025-002',
            date: 'Feb 10, 2025, 02:30 PM',
            doctor: 'Dr. David Lee',
            specialty: 'Dermatology',
            location: 'Skin Health Center',
            address: '456 Skin Care Ave, Dermatology District',
            type: 'Consultation',
            reason: 'Skin rash evaluation',
            notes: 'Bring photos of rash progression if available.',
            duration: '45 minutes',
            insurance: 'Covered by Aetna (90%)'
        }
    };
    
    const details = appointmentDetails[appointmentId] || {
        id: appointmentId,
        date: 'Date not available',
        doctor: 'Doctor not specified',
        specialty: 'General',
        location: 'Location not specified',
        address: 'Address not available',
        type: 'Appointment',
        reason: 'No reason provided',
        notes: 'No additional notes',
        duration: '30 minutes',
        insurance: 'Check with provider'
    };
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="appointment-details-modal">
            <div class="detail-item">
                <strong>Appointment ID:</strong>
                <span>#${details.id}</span>
            </div>
            <div class="detail-item">
                <strong>Date & Time:</strong>
                <span>${details.date}</span>
            </div>
            <div class="detail-item">
                <strong>Doctor:</strong>
                <span>${details.doctor} (${details.specialty})</span>
            </div>
            <div class="detail-item">
                <strong>Location:</strong>
                <span>${details.location}</span>
            </div>
            <div class="detail-item">
                <strong>Address:</strong>
                <span>${details.address}</span>
            </div>
            <div class="detail-item">
                <strong>Appointment Type:</strong>
                <span>${details.type}</span>
            </div>
            <div class="detail-item">
                <strong>Reason:</strong>
                <span>${details.reason}</span>
            </div>
            <div class="detail-item">
                <strong>Duration:</strong>
                <span>${details.duration}</span>
            </div>
            <div class="detail-item">
                <strong>Insurance Coverage:</strong>
                <span>${details.insurance}</span>
            </div>
            <div class="detail-item full-width">
                <strong>Additional Notes:</strong>
                <p>${details.notes}</p>
            </div>
            ${status === 'cancelled' ? `
            <div class="cancellation-reason">
                <strong>Cancellation Reason:</strong>
                <p>Patient requested rescheduling due to conflicting schedule.</p>
                <small>Cancelled on: ${new Date().toLocaleDateString()}</small>
            </div>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

function showRescheduleModal(appointmentId, card) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div class="reschedule-modal">
            <h4>Reschedule Appointment #${appointmentId}</h4>
            <p>Select new date and time for your appointment:</p>
            
            <div class="form-group">
                <label for="new-date">New Date</label>
                <input type="date" id="new-date" class="form-control" min="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label>New Time Slot</label>
                <div class="time-slots-modal">
                    <button class="time-slot-modal">09:00 AM</button>
                    <button class="time-slot-modal">10:00 AM</button>
                    <button class="time-slot-modal">11:00 AM</button>
                    <button class="time-slot-modal">02:00 PM</button>
                    <button class="time-slot-modal">03:00 PM</button>
                    <button class="time-slot-modal">04:00 PM</button>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="action-btn cancel-reschedule">Cancel</button>
                <button class="action-btn confirm-reschedule">Confirm Reschedule</button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Add event listeners for modal
    const timeSlotButtons = modalBody.querySelectorAll('.time-slot-modal');
    timeSlotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeSlotButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    const cancelBtn = modalBody.querySelector('.cancel-reschedule');
    const confirmBtn = modalBody.querySelector('.confirm-reschedule');
    
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    confirmBtn.addEventListener('click', () => {
        const newDate = modalBody.querySelector('#new-date').value;
        const selectedTime = modalBody.querySelector('.time-slot-modal.active');
        
        if (!newDate || !selectedTime) {
            showToast('Please select both date and time', 'error');
            return;
        }
        
        // Update appointment card
        const newDateTime = formatAppointmentDate(newDate, selectedTime.textContent);
        const titleElement = card.querySelector('.appointment-title');
        titleElement.textContent = newDateTime;
        
        showToast('Appointment rescheduled successfully!', 'success');
        modal.classList.remove('active');
    });
}

// Toast Notification Function
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#779f00' : type === 'error' ? '#de3b4e' : '#003785'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        font-family: 'Manrope', sans-serif;
        font-size: 14px;
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
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
    
    .appointment-details-modal {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .detail-item.full-width {
        flex-direction: column;
        gap: 4px;
    }
    
    .detail-item strong {
        color: #171a1f;
        font-weight: 600;
        min-width: 150px;
    }
    
    .detail-item span, .detail-item p {
        color: #565e6c;
        text-align: right;
        flex: 1;
    }
    
    .detail-item p {
        margin: 0;
        text-align: left;
    }
    
    .cancellation-reason {
        background: #fff5f5;
        border: 1px solid #ffcccc;
        border-radius: 6px;
        padding: 12px;
        margin-top: 16px;
    }
    
    .reschedule-modal {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .time-slots-modal {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 8px;
    }
    
    .time-slot-modal {
        padding: 8px;
        border: 1px solid #dee1e6;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .time-slot-modal:hover,
    .time-slot-modal.active {
        background: #003785;
        color: white;
        border-color: #003785;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;
    }
    
    .modal-actions .action-btn {
        flex: 1;
        justify-content: center;
    }
    
    .cancel-reschedule {
        background: #f3f4f6;
        color: #171a1f;
    }
    
    .confirm-reschedule {
        background: #003785;
        color: white;
    }
`;
document.head.appendChild(style);

// Initialize page with sample data
document.addEventListener('DOMContentLoaded', () => {
    console.log('Appointments page loaded successfully');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Initialize with some sample appointments
    initializeSampleAppointments();
    
    // Add event listeners for view details buttons
    const viewDetailsBtns = document.querySelectorAll('.view-details');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.appointment-card');
            const appointmentId = card.querySelector('.appointment-id')?.textContent.replace('#', '') || 'unknown';
            showAppointmentDetails(appointmentId);
        });
    });
    
    // Add event listeners for download report buttons
    const downloadBtns = document.querySelectorAll('.download-report');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.appointment-card');
            const appointmentId = card.querySelector('.appointment-id')?.textContent.replace('#', '') || 'unknown';
            downloadAppointmentReport(appointmentId);
        });
    });
});

function initializeSampleAppointments() {
    // This would typically fetch from an API
    console.log('Initialized with sample appointment data');
    
    // Set default time slot
    if (timeSlots[1]) {
        timeSlots[1].classList.add('active');
    }
}

function downloadAppointmentReport(appointmentId) {
    showToast(`Downloading report for appointment #${appointmentId}...`, 'info');
    
    // Simulate download
    setTimeout(() => {
        showToast('Report downloaded successfully!', 'success');
    }, 1500);
}

// Chatbot Button Hover Effect
const chatbotBtn = document.querySelector('.chatbot-float');
chatbotBtn.addEventListener('mouseenter', () => {
    chatbotBtn.style.transform = 'scale(1.1) rotate(5deg)';
});

chatbotBtn.addEventListener('mouseleave', () => {
    chatbotBtn.style.transform = 'scale(1) rotate(0deg)';
});

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    }
});

// Emergency Call Button
const emergencyBtn = document.querySelector('.emergency-btn');
emergencyBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to make an emergency call? This will call emergency services immediately.')) {
        // Simulate emergency call
        showToast('Connecting to emergency services...', 'error');
        
        // You could integrate with actual calling functionality here
        setTimeout(() => {
            showToast('Emergency call connected. Please stay on the line.', 'success');
        }, 2000);
    }
});