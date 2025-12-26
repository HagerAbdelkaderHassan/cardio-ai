// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Calendar Elements
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const selectedDateInput = document.getElementById('selectedDate');
    const timeSlotsGrid = document.getElementById('timeSlotsGrid');
    const selectedTimeInput = document.getElementById('selectedTime');
    
    // Form Elements
    const appointmentForm = document.getElementById('appointmentForm');
    const confirmationSection = document.getElementById('confirmationSection');
    const submitBookingBtn = document.getElementById('submitBookingBtn');
    const cancelBookingBtn = document.getElementById('cancelBookingBtn');
    const formTitle = document.getElementById('formTitle');
    const bookingSection = document.getElementById('bookingSection');
    
    // Confirmation Actions
    const backToBookingBtn = document.getElementById('backToBookingBtn');
    const viewAppointmentsBtn = document.getElementById('viewAppointmentsBtn');
    
    // Appointment Tabs
    const appointmentTabs = document.querySelectorAll('.appointment-tab');
    const appointmentsLists = document.querySelectorAll('.appointments-list');
    
    // Modals
    const successModal = document.getElementById('successModal');
    const cancelModal = document.getElementById('cancelModal');
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const closeCancelModal = document.getElementById('closeCancelModal');
    const okBtn = document.getElementById('okBtn');
    const cancelNoBtn = document.getElementById('cancelNoBtn');
    const cancelYesBtn = document.getElementById('cancelYesBtn');
    const cancelMessage = document.getElementById('cancelMessage');
    
    // Calendar Variables
    let currentDate = new Date(2025, 0, 1); // January 2025
    let selectedDate = null;
    let selectedTimeSlot = null;
    
    // Editing Variables
    let isEditingAppointment = false;
    let editingAppointmentId = null;
    
    // Cancel Variables
    let cancelAppointmentId = null;
    
    // Sample Data
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM'
    ];
    
    // Initialize Calendar
    function initCalendar() {
        renderCalendar();
        generateTimeSlots();
        setupEventListeners();
    }
    
    // Setup Event Listeners for appointment buttons
    function setupEventListeners() {
        // Handle View button click
        document.addEventListener('click', function(e) {
            if (e.target.closest('.view-btn')) {
                const appointmentId = e.target.closest('.view-btn').getAttribute('data-id');
                viewAppointmentDetails(appointmentId);
            }
            
            // Handle Update button click
            if (e.target.closest('.update-btn')) {
                const appointmentId = e.target.closest('.update-btn').getAttribute('data-id');
                updateAppointment(appointmentId);
            }
            
            // Handle Cancel button click on appointment card
            if (e.target.closest('.cancel-appointment-btn')) {
                const appointmentId = e.target.closest('.cancel-appointment-btn').getAttribute('data-id');
                cancelAppointment(appointmentId);
            }
        });
        
        // Appointment Tabs
        appointmentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Update active tab
                appointmentTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding list
                appointmentsLists.forEach(list => {
                    list.classList.remove('active');
                    if (list.id === `${tabId}Appointments`) {
                        list.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Parse date string to Date object
    function parseDateString(dateStr) {
        const parts = dateStr.split(' ');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames.indexOf(parts[0]);
        const day = parseInt(parts[1].replace(',', ''));
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }
    
    // Render Calendar
    function renderCalendar() {
        calendarDays.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        currentMonthElement.textContent = `${currentDate.toLocaleDateString('en-US', { month: 'long' })} ${year}`;
        
        // Get first day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const firstDayIndex = firstDay.getDay();
        
        // Get previous month's last days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        
        // Previous month days
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day disabled';
            day.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(day);
        }
        
        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = i;
            
            // Create date object for this day
            const dayDate = new Date(year, month, i);
            
            // Mark today
            if (dayDate.toDateString() === today.toDateString()) {
                day.classList.add('today');
                day.style.backgroundColor = 'rgba(135, 175, 18, 0.2)';
                day.style.borderColor = 'var(--accent-green)';
            }
            
            // Mark selected date
            if (selectedDate && dayDate.toDateString() === selectedDate.toDateString()) {
                day.classList.add('selected');
            }
            
            // Mark available dates (every weekday)
            const dayOfWeek = dayDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
                day.classList.add('available');
            }
            
            // Add click event
            day.addEventListener('click', () => {
                if (!day.classList.contains('disabled')) {
                    // Remove selected from all days
                    document.querySelectorAll('.calendar-day.selected').forEach(d => {
                        d.classList.remove('selected');
                    });
                    
                    // Add selected to clicked day
                    day.classList.add('selected');
                    
                    // Update selected date
                    selectedDate = new Date(year, month, i);
                    selectedDateInput.value = selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    // Clear selected time
                    selectedTimeSlot = null;
                    selectedTimeInput.value = '';
                    updateTimeSlots();
                }
            });
            
            calendarDays.appendChild(day);
        }
        
        // Next month days (to fill the grid)
        const totalCells = 42; // 6 rows * 7 columns
        const nextDays = totalCells - (firstDayIndex + daysInMonth);
        
        for (let i = 1; i <= nextDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day disabled';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    // Generate Time Slots
    function generateTimeSlots() {
        timeSlotsGrid.innerHTML = '';
        
        timeSlots.forEach(slot => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'time-slot-btn';
            button.textContent = slot;
            
            // Mark as disabled if it's past the current time for today
            if (selectedDate) {
                const today = new Date();
                if (selectedDate.toDateString() === today.toDateString()) {
                    const slotTime = getTimeFromString(slot);
                    if (slotTime < today.getHours() * 60 + today.getMinutes()) {
                        button.classList.add('disabled');
                    }
                }
            }
            
            // Mark as selected if it matches the selected time
            if (selectedTimeSlot === slot) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', () => {
                if (!button.classList.contains('disabled')) {
                    // Remove selected from all time slots
                    document.querySelectorAll('.time-slot-btn.selected').forEach(btn => {
                        btn.classList.remove('selected');
                    });
                    
                    // Add selected to clicked time slot
                    button.classList.add('selected');
                    selectedTimeSlot = slot;
                    selectedTimeInput.value = slot;
                }
            });
            
            timeSlotsGrid.appendChild(button);
        });
    }
    
    // Helper function to convert time string to minutes
    function getTimeFromString(timeString) {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
        
        hours = parseInt(hours);
        minutes = minutes ? parseInt(minutes) : 0;
        
        if (modifier === 'PM' && hours < 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        
        return hours * 60 + minutes;
    }
    
    // Update time slots when date changes
    function updateTimeSlots() {
        generateTimeSlots();
    }
    
    // View appointment details
    function viewAppointmentDetails(appointmentId) {
        // Find the appointment card
        const appointmentCard = document.querySelector(`.appointment-card[data-id="${appointmentId}"]`);
        if (appointmentCard) {
            const date = appointmentCard.querySelector('.appointment-card-date').textContent;
            const doctor = appointmentCard.querySelector('.appointment-card-detail:nth-child(1) span').textContent;
            const type = appointmentCard.querySelector('.appointment-card-detail:nth-child(2) span').textContent;
            const reason = appointmentCard.querySelector('.appointment-card-reason span').textContent;
            const status = appointmentCard.querySelector('.status-badge').textContent;
            
            alert(`Appointment Details:\n\nID: ${appointmentId}\nDate: ${date}\nDoctor: ${doctor}\nType: ${type}\nStatus: ${status}\nReason: ${reason}`);
        }
    }
    
    // Update an appointment
    function updateAppointment(appointmentId) {
        // Find the appointment card
        const appointmentCard = document.querySelector(`.appointment-card[data-id="${appointmentId}"]`);
        if (appointmentCard) {
            // Set form to edit mode
            isEditingAppointment = true;
            editingAppointmentId = appointmentId;
            
            // Update form title
            formTitle.textContent = 'Update Appointment';
            
            // Update submit button text
            submitBookingBtn.innerHTML = '<i class="fas fa-save"></i> Update Appointment';
            
            // Get appointment data
            const dateText = appointmentCard.querySelector('.appointment-card-date').textContent;
            const doctor = appointmentCard.querySelector('.appointment-card-detail:nth-child(1) span').textContent;
            const type = appointmentCard.querySelector('.appointment-card-detail:nth-child(2) span').textContent;
            const reason = appointmentCard.querySelector('.appointment-card-reason span').textContent;
            
            // Parse date from text (format: "January 25, 2025 • 10:00 AM")
            const dateParts = dateText.split('•')[0].trim();
            selectedDate = new Date(dateParts);
            
            // Parse time from text
            const timeParts = dateText.split('•')[1].trim();
            selectedTimeSlot = timeParts;
            
            // Fill doctor select
            const doctorSelect = document.getElementById('doctorSelect');
            for (let i = 0; i < doctorSelect.options.length; i++) {
                if (doctorSelect.options[i].text === doctor) {
                    doctorSelect.selectedIndex = i;
                    break;
                }
            }
            
            // Fill visit type
            const visitType = document.getElementById('visitType');
            for (let i = 0; i < visitType.options.length; i++) {
                if (visitType.options[i].text === type) {
                    visitType.selectedIndex = i;
                    break;
                }
            }
            
            // Update calendar to show the appointment month
            currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            renderCalendar();
            
            // Update selected date input
            selectedDateInput.value = selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Set time slot
            selectedTimeInput.value = selectedTimeSlot;
            updateTimeSlots();
            
            // Fill reason
            document.getElementById('reason').value = reason;
            
            // Scroll to booking form
            bookingSection.scrollIntoView({ behavior: 'smooth' });
            
            // Hide confirmation section if visible
            confirmationSection.style.display = 'none';
        }
    }
    
    // Cancel an appointment
    function cancelAppointment(appointmentId) {
        // Store appointment ID for modal
        cancelAppointmentId = appointmentId;
        
        // Find the appointment
        const appointmentCard = document.querySelector(`.appointment-card[data-id="${appointmentId}"]`);
        if (appointmentCard) {
            const doctor = appointmentCard.querySelector('.appointment-card-detail:nth-child(1) span').textContent;
            const date = appointmentCard.querySelector('.appointment-card-date').textContent;
            
            // Update modal message
            cancelMessage.textContent = `Are you sure you want to cancel appointment ${appointmentId} with ${doctor} on ${date}?`;
            
            // Show confirmation modal
            cancelModal.style.display = 'block';
        }
    }
    
    // Form Submission
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!selectedDate || !selectedTimeSlot) {
            alert('Please select a date and time for your appointment.');
            return;
        }
        
        // Get form values
        const doctorSelect = document.getElementById('doctorSelect');
        const visitType = document.getElementById('visitType');
        const reason = document.getElementById('reason').value;
        const selectedDoctor = doctorSelect.options[doctorSelect.selectedIndex].text;
        const selectedVisitType = visitType.options[visitType.selectedIndex].text;
        
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        if (isEditingAppointment && editingAppointmentId) {
            // Update existing appointment
            const appointmentCard = document.querySelector(`.appointment-card[data-id="${editingAppointmentId}"]`);
            if (appointmentCard) {
                // Update appointment card
                appointmentCard.querySelector('.appointment-card-date').textContent = `${formattedDate} • ${selectedTimeSlot}`;
                appointmentCard.querySelector('.appointment-card-detail:nth-child(1) span').textContent = selectedDoctor;
                appointmentCard.querySelector('.appointment-card-detail:nth-child(2) span').textContent = selectedVisitType;
                appointmentCard.querySelector('.appointment-card-reason span').textContent = reason;
                
                showSuccessModal('Appointment updated successfully!');
                resetFormToBookingMode();
            }
        } else {
            // Create new appointment
            const appointmentId = `APT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            
            // Create new appointment card
            const newAppointmentCard = document.createElement('div');
            newAppointmentCard.className = 'appointment-card';
            newAppointmentCard.dataset.id = appointmentId;
            newAppointmentCard.innerHTML = `
                <div class="appointment-card-header">
                    <span class="appointment-card-id">${appointmentId}</span>
                    <span class="status-badge confirmed">Confirmed</span>
                </div>
                <div class="appointment-card-date">${formattedDate} • ${selectedTimeSlot}</div>
                
                <div class="appointment-card-details">
                    <div class="appointment-card-detail">
                        <label>Doctor</label>
                        <span>${selectedDoctor}</span>
                    </div>
                    <div class="appointment-card-detail">
                        <label>Visit Type</label>
                        <span>${selectedVisitType}</span>
                    </div>
                    <div class="appointment-card-detail">
                        <label>Duration</label>
                        <span>30 minutes</span>
                    </div>
                </div>
                
                <div class="appointment-card-reason">
                    <label>Reason:</label>
                    <span>${reason || 'Not specified'}</span>
                </div>
                
                <!-- الأزرار الثلاثة -->
                <div class="appointment-card-actions">
                    <button class="action-btn small cancel-appointment-btn" data-id="${appointmentId}">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                    <button class="action-btn small view-btn" data-id="${appointmentId}">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="action-btn small update-btn" data-id="${appointmentId}">
                        <i class="fas fa-edit"></i>
                        Update
                    </button>
                </div>
            `;
            
            // Add to upcoming appointments
            const upcomingList = document.getElementById('upcomingAppointments');
            upcomingList.prepend(newAppointmentCard);
            
            // Update confirmation details
            document.getElementById('summaryId').textContent = appointmentId;
            document.getElementById('summaryDate').textContent = selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            document.getElementById('summaryTime').textContent = selectedTimeSlot;
            document.getElementById('summaryDoctor').textContent = selectedDoctor;
            document.getElementById('summaryType').textContent = selectedVisitType;
            
            // Show confirmation section
            confirmationSection.style.display = 'block';
            
            // Scroll to confirmation section
            confirmationSection.scrollIntoView({ behavior: 'smooth' });
            
            // Show success modal
            showSuccessModal('Appointment booked successfully!');
            
            // Reset form
            resetFormToBookingMode();
        }
    });
    
    // Cancel Booking button
    cancelBookingBtn.addEventListener('click', () => {
        if (isEditingAppointment) {
            // If editing, just reset to normal booking mode
            resetFormToBookingMode();
        } else {
            // If new booking, clear everything
            if (confirm('Are you sure you want to cancel this booking?')) {
                resetFormToBookingMode();
            }
        }
    });
    
    // Back to Booking button
    backToBookingBtn.addEventListener('click', () => {
        // Hide confirmation section
        confirmationSection.style.display = 'none';
        
        // Scroll to booking form
        bookingSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // View Appointments button
    viewAppointmentsBtn.addEventListener('click', () => {
        // Hide confirmation section
        confirmationSection.style.display = 'none';
        
        // Scroll to appointments section
        document.querySelector('.appointments-tabs').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Reset form to normal booking mode
    function resetFormToBookingMode() {
        isEditingAppointment = false;
        editingAppointmentId = null;
        
        // Reset form title
        formTitle.textContent = 'Book New Appointment';
        
        // Reset submit button text
        submitBookingBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Booking';
        
        // Reset form
        appointmentForm.reset();
        selectedDate = null;
        selectedTimeSlot = null;
        selectedDateInput.value = '';
        selectedTimeInput.value = '';
        
        // Reset calendar selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Reset time slots selection
        document.querySelectorAll('.time-slot-btn.selected').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset to current month
        currentDate = new Date(2025, 0, 1);
        renderCalendar();
        updateTimeSlots();
    }
    
    // Calendar navigation
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    // Modal Events
    closeSuccessModal.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
    
    okBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
    
    closeCancelModal.addEventListener('click', () => {
        cancelModal.style.display = 'none';
        cancelAppointmentId = null;
    });
    
    cancelNoBtn.addEventListener('click', () => {
        cancelModal.style.display = 'none';
        cancelAppointmentId = null;
    });
    
    cancelYesBtn.addEventListener('click', () => {
        if (cancelAppointmentId) {
            // Find and remove the appointment
            const appointmentCard = document.querySelector(`.appointment-card[data-id="${cancelAppointmentId}"]`);
            if (appointmentCard) {
                // Remove from upcoming
                appointmentCard.remove();
                
                // Show success message
                showSuccessModal('Appointment cancelled successfully!');
            }
        }
        
        // Close modal
        cancelModal.style.display = 'none';
        cancelAppointmentId = null;
    });
    
    // Show Success Modal
    function showSuccessModal(message) {
        document.getElementById('successMessage').textContent = message;
        successModal.style.display = 'block';
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
        if (e.target === cancelModal) {
            cancelModal.style.display = 'none';
            cancelAppointmentId = null;
        }
    });
    
    // Initialize the page
    initCalendar();
});