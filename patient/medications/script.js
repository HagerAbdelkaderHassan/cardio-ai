// Medications Management Page Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addNewMedicationBtn = document.getElementById('addNewMedicationBtn');
    const tabs = document.querySelectorAll('.tab');
    const searchMedications = document.getElementById('searchMedications');
    const filterStatus = document.getElementById('filterStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const viewFullHistoryBtn = document.getElementById('viewFullHistoryBtn');
    
    // Modal Elements
    const medicationModal = document.getElementById('medicationModal');
    const modalTitle = document.getElementById('modalTitle');
    const medicationForm = document.getElementById('medicationForm');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const medicationId = document.getElementById('medicationId');
    
    const detailsModal = document.getElementById('detailsModal');
    const detailsTitle = document.getElementById('detailsTitle');
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');
    
    const reminderModal = document.getElementById('reminderModal');
    const reminderForm = document.getElementById('reminderForm');
    const closeReminderBtn = document.getElementById('closeReminderBtn');
    const cancelReminderBtn = document.getElementById('cancelReminderBtn');
    const reminderMedicationId = document.getElementById('reminderMedicationId');
    
    // Image Upload
    const imageUploadArea = document.getElementById('imageUploadArea');
    const medicationImage = document.getElementById('medicationImage');
    const imagePreview = document.getElementById('imagePreview');
    
    // Count Elements
    const activeCount = document.getElementById('activeCount');
    const pastCount = document.getElementById('pastCount');
    const refillCount = document.getElementById('refillCount');
    const allCount = document.getElementById('allCount');
    
    // Grid Elements
    const activeMedicationsGrid = document.getElementById('activeMedicationsGrid');
    const pastMedicationsBody = document.getElementById('pastMedicationsBody');
    const refillDueGrid = document.getElementById('refillDueGrid');
    const allMedicationsGrid = document.getElementById('allMedicationsGrid');
    
    // Sample data
    const medicationsData = [
        {
            id: 1,
            name: "Enertrop",
            dosage: "5 mg",
            frequency: "once-daily",
            timeOfDay: "morning",
            startDate: "2006-01-01",
            endDate: "",
            instructions: "Take with or without food. Do not chew or crush.",
            doctor: "Dr. Emily White",
            status: "active",
            image: "",
            refillDate: "2023-12-15"
        },
        {
            id: 2,
            name: "Atorvastatin",
            dosage: "20 mg",
            frequency: "once-daily",
            timeOfDay: "bedtime",
            startDate: "2006-01-01",
            endDate: "2006-02-02",
            instructions: "Take at night. Avoid grapefruit juice.",
            doctor: "Dr. John Smith",
            status: "refill-due",
            image: "",
            refillDate: "2023-11-30"
        },
        {
            id: 3,
            name: "Amoxicillin",
            dosage: "500 mg, 2 times daily",
            frequency: "twice-daily",
            timeOfDay: "",
            startDate: "2023-09-15",
            endDate: "2023-09-30",
            instructions: "Take with food to avoid stomach upset.",
            doctor: "Dr. Emily White",
            status: "past",
            image: "",
            refillDate: ""
        },
        {
            id: 4,
            name: "Ibuprofen",
            dosage: "200 mg, as needed",
            frequency: "as-needed",
            timeOfDay: "",
            startDate: "2023-07-20",
            endDate: "2023-08-20",
            instructions: "Take with food. Do not exceed 1200mg per day.",
            doctor: "Dr. John Smith",
            status: "past",
            image: "",
            refillDate: ""
        },
        {
            id: 5,
            name: "Lisinopril",
            dosage: "10 mg, once daily",
            frequency: "once-daily",
            timeOfDay: "morning",
            startDate: "2023-05-10",
            endDate: "2023-08-10",
            instructions: "Take in the morning with or without food.",
            doctor: "Dr. Anya Sharma",
            status: "past",
            image: "",
            refillDate: ""
        },
        {
            id: 6,
            name: "Simvastatin",
            dosage: "20 mg, once daily",
            frequency: "once-daily",
            timeOfDay: "bedtime",
            startDate: "2023-03-01",
            endDate: "2023-06-01",
            instructions: "Take at bedtime for best results.",
            doctor: "Dr. Emily White",
            status: "past",
            image: "",
            refillDate: ""
        },
        {
            id: 7,
            name: "Metformin",
            dosage: "500 mg, 2 times daily",
            frequency: "twice-daily",
            timeOfDay: "morning,evening",
            startDate: "2023-01-25",
            endDate: "2023-04-25",
            instructions: "Take with meals to reduce side effects.",
            doctor: "Dr. John Smith",
            status: "past",
            image: "",
            refillDate: ""
        },
        {
            id: 8,
            name: "Vitamin D",
            dosage: "1000 IU",
            frequency: "once-daily",
            timeOfDay: "morning",
            startDate: "2023-10-01",
            endDate: "",
            instructions: "Take with breakfast.",
            doctor: "Dr. Sarah Johnson",
            status: "active",
            image: "",
            refillDate: "2023-12-01"
        }
    ];

    // Current state
    let currentMedications = [];
    let selectedMedication = null;
    let selectedImage = null;

    // 1. Initialize page
    function initPage() {
        loadMedications();
        setupEventListeners();
        renderAllSections();
        setupDate();
    }

    // 2. Load medications from localStorage
    function loadMedications() {
        const savedMedications = localStorage.getItem('userMedications');
        if (savedMedications && JSON.parse(savedMedications).length > 0) {
            currentMedications = JSON.parse(savedMedications);
        } else {
            currentMedications = [...medicationsData];
            saveMedications();
        }
    }

    // 3. Save medications to localStorage
    function saveMedications() {
        localStorage.setItem('userMedications', JSON.stringify(currentMedications));
        updateCounts();
    }

    // 4. Setup current date for forms
    function setupDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').value = today;
        document.getElementById('startDate').min = '2000-01-01';
        document.getElementById('endDate').min = today;
    }

    // 5. Setup event listeners
    function setupEventListeners() {
        // Add new medication button
        addNewMedicationBtn.addEventListener('click', openAddModal);
        
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                switchTab(this.dataset.tab);
            });
        });
        
        // Search and filter
        searchMedications.addEventListener('input', filterMedications);
        filterStatus.addEventListener('change', filterMedications);
        
        // Image upload
        imageUploadArea.addEventListener('click', () => medicationImage.click());
        medicationImage.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                selectedImage = file;
                showImagePreview(file);
            }
        });
        
        // Form submission
        medicationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveMedication();
        });
        
        // Modal controls
        closeModalBtn.addEventListener('click', closeMedicationModal);
        cancelBtn.addEventListener('click', closeMedicationModal);
        closeDetailsBtn.addEventListener('click', closeDetailsModal);
        closeReminderBtn.addEventListener('click', closeReminderModal);
        cancelReminderBtn.addEventListener('click', closeReminderModal);
        
        // Reminder form
        reminderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveReminder();
        });
        
        // Navigation buttons
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = 'logout.html';
            }
        });
        
        notificationsBtn.addEventListener('click', function() {
            window.location.href = 'notifications.html';
        });
        
        settingsBtn.addEventListener('click', function() {
            window.location.href = 'settings.html';
        });
        
        viewFullHistoryBtn.addEventListener('click', function() {
            switchTab('past');
            document.querySelector('.tab[data-tab="past"]').click();
        });
        
        // Click outside modals to close
        medicationModal.addEventListener('click', function(e) {
            if (e.target === medicationModal) {
                closeMedicationModal();
            }
        });
        
        detailsModal.addEventListener('click', function(e) {
            if (e.target === detailsModal) {
                closeDetailsModal();
            }
        });
        
        reminderModal.addEventListener('click', function(e) {
            if (e.target === reminderModal) {
                closeReminderModal();
            }
        });
    }

    // 6. Switch between tabs
    function switchTab(tabName) {
        // Hide all sections
        document.querySelectorAll('.medications-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const activeSection = document.getElementById(tabName + 'Medications');
        if (activeSection) {
            activeSection.style.display = 'block';
        } else if (tabName === 'refill-due') {
            document.getElementById('refillDue').style.display = 'block';
        } else if (tabName === 'all') {
            document.getElementById('allMedications').style.display = 'block';
        }
        
        // Render section content
        renderSection(tabName);
    }

    // 7. Render all sections
    function renderAllSections() {
        renderSection('active');
        renderSection('past');
        renderSection('refill-due');
        renderSection('all');
        updateCounts();
    }

    // 8. Render specific section
    function renderSection(section) {
        let filteredMedications = [];
        
        switch(section) {
            case 'active':
                filteredMedications = currentMedications.filter(m => m.status === 'active');
                renderMedicationCards(filteredMedications, activeMedicationsGrid);
                break;
                
            case 'past':
                filteredMedications = currentMedications.filter(m => m.status === 'past');
                renderMedicationTable(filteredMedications, pastMedicationsBody);
                break;
                
            case 'refill-due':
                filteredMedications = currentMedications.filter(m => m.status === 'refill-due');
                renderMedicationCards(filteredMedications, refillDueGrid);
                break;
                
            case 'all':
                filteredMedications = [...currentMedications];
                renderMedicationCards(filteredMedications, allMedicationsGrid);
                break;
        }
    }

    // 9. Render medication cards
    function renderMedicationCards(medications, container) {
        container.innerHTML = '';
        
        if (medications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-pills"></i>
                    <h4>No medications found</h4>
                    <p>Click "Add New Medication" to get started</p>
                </div>
            `;
            return;
        }
        
        medications.forEach(medication => {
            const card = createMedicationCard(medication);
            container.appendChild(card);
        });
    }

    // 10. Create medication card element
    function createMedicationCard(medication) {
        const card = document.createElement('div');
        card.className = 'medication-card';
        card.dataset.id = medication.id;
        
        const frequencyText = getFrequencyText(medication.frequency, medication.timeOfDay);
        const statusClass = medication.status;
        const statusText = medication.status === 'refill-due' ? 'Refill Due' : 
                          medication.status.charAt(0).toUpperCase() + medication.status.slice(1);
        
        card.innerHTML = `
            <div class="medication-header">
                <h3 class="medication-name">${medication.name}</h3>
                <div class="status-badge ${statusClass}">
                    <span>${statusText}</span>
                </div>
            </div>
            
            <div class="medication-info">
                <div class="info-item">
                    <i class="fas fa-capsules"></i>
                    <span>Dosage: ${medication.dosage}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-clock"></i>
                    <span>${frequencyText}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Start: ${formatDate(medication.startDate)}</span>
                </div>
                ${medication.endDate ? `
                <div class="info-item">
                    <i class="fas fa-calendar-times"></i>
                    <span>End: ${formatDate(medication.endDate)}</span>
                </div>
                ` : ''}
                <div class="info-item">
                    <i class="fas fa-user-md"></i>
                    <span>${medication.doctor || 'No doctor specified'}</span>
                </div>
            </div>
            
            <div class="medication-image">
                ${medication.image ? `
                    <img src="${medication.image}" alt="${medication.name}">
                ` : `
                    <div class="default-image">
                        <i class="fas fa-pills"></i>
                        <p>No image uploaded</p>
                    </div>
                `}
            </div>
            
            <div class="medication-actions">
                <button class="action-btn view" data-action="view">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit" data-action="edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete" data-action="delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
                ${medication.status === 'active' ? `
                <button class="action-btn set-reminder" data-action="reminder">
                    <i class="fas fa-bell"></i> Reminder
                </button>
                ` : ''}
                ${!medication.image ? `
                <button class="action-btn upload" data-action="upload">
                    <i class="fas fa-upload"></i> Upload Image
                </button>
                ` : ''}
            </div>
        `;
        
        // Add event listeners to action buttons
        const actionButtons = card.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.dataset.action;
                handleMedicationAction(action, medication);
            });
        });
        
        return card;
    }

    // 11. Render medication table
    function renderMedicationTable(medications, container) {
        container.innerHTML = '';
        
        if (medications.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-table">
                        <i class="fas fa-pills"></i>
                        <p>No past medications found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        medications.forEach(medication => {
            const row = document.createElement('tr');
            row.dataset.id = medication.id;
            
            row.innerHTML = `
                <td>${medication.name}</td>
                <td>${medication.dosage}</td>
                <td>${formatDate(medication.startDate)}</td>
                <td>${medication.doctor || 'N/A'}</td>
                <td>
                    <div class="status-badge past">
                        <span>Past</span>
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="table-btn view" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="table-btn edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="table-btn delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Add event listeners to action buttons
            const viewBtn = row.querySelector('.table-btn.view');
            const editBtn = row.querySelector('.table-btn.edit');
            const deleteBtn = row.querySelector('.table-btn.delete');
            
            viewBtn.addEventListener('click', () => viewMedicationDetails(medication));
            editBtn.addEventListener('click', () => editMedication(medication));
            deleteBtn.addEventListener('click', () => deleteMedication(medication.id));
            
            container.appendChild(row);
        });
    }

    // 12. Handle medication actions
    function handleMedicationAction(action, medication) {
        switch(action) {
            case 'view':
                viewMedicationDetails(medication);
                break;
            case 'edit':
                editMedication(medication);
                break;
            case 'delete':
                deleteMedication(medication.id);
                break;
            case 'reminder':
                setReminder(medication);
                break;
            case 'upload':
                uploadImage(medication);
                break;
        }
    }

    // 13. View medication details
    function viewMedicationDetails(medication) {
        selectedMedication = medication;
        
        // Update modal content
        detailsTitle.textContent = medication.name;
        document.getElementById('detailsName').textContent = medication.name;
        document.getElementById('detailsDosage').textContent = medication.dosage;
        document.getElementById('detailsFrequency').textContent = getFrequencyText(medication.frequency, medication.timeOfDay);
        document.getElementById('detailsStartDate').textContent = formatDate(medication.startDate);
        document.getElementById('detailsEndDate').textContent = medication.endDate ? formatDate(medication.endDate) : '-';
        document.getElementById('detailsDoctor').textContent = medication.doctor || 'N/A';
        document.getElementById('detailsInstructions').textContent = medication.instructions || 'No instructions provided';
        
        // Update status badge
        const statusBadge = document.getElementById('detailsStatus');
        statusBadge.className = 'status-badge ' + medication.status;
        statusBadge.innerHTML = `<span>${medication.status === 'refill-due' ? 'Refill Due' : 
            medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}</span>`;
        
        // Update image
        const detailsImage = document.getElementById('detailsImage');
        if (medication.image) {
            detailsImage.innerHTML = `<img src="${medication.image}" alt="${medication.name}">`;
        } else {
            detailsImage.innerHTML = `
                <div class="default-image">
                    <i class="fas fa-pills"></i>
                    <p>No image</p>
                </div>
            `;
        }
        
        // Add event listeners to action buttons
        document.getElementById('setReminderBtn').onclick = () => setReminder(medication);
        document.getElementById('requestRefillBtn').onclick = () => requestRefill(medication);
        
        // Show modal
        detailsModal.classList.add('active');
    }

    // 14. Edit medication
    function editMedication(medication) {
        selectedMedication = medication;
        
        // Update modal title
        modalTitle.textContent = 'Edit Medication';
        
        // Fill form with medication data
        document.getElementById('medicationName').value = medication.name;
        document.getElementById('dosage').value = medication.dosage;
        document.getElementById('frequency').value = medication.frequency;
        document.getElementById('timeOfDay').value = medication.timeOfDay || '';
        document.getElementById('startDate').value = medication.startDate;
        document.getElementById('endDate').value = medication.endDate || '';
        document.getElementById('instructions').value = medication.instructions || '';
        document.getElementById('prescribingDoctor').value = medication.doctor || '';
        document.getElementById('status').value = medication.status;
        medicationId.value = medication.id;
        
        // Update image preview if exists
        if (medication.image) {
            imagePreview.innerHTML = `<img src="${medication.image}" alt="${medication.name}">`;
            imagePreview.classList.add('active');
        } else {
            imagePreview.innerHTML = '';
            imagePreview.classList.remove('active');
        }
        
        // Show modal
        medicationModal.classList.add('active');
    }

    // 15. Delete medication
    function deleteMedication(id) {
        if (confirm('Are you sure you want to delete this medication?')) {
            currentMedications = currentMedications.filter(m => m.id !== id);
            saveMedications();
            renderAllSections();
            showMessage('Medication deleted successfully', 'success');
        }
    }

    // 16. Set reminder
    function setReminder(medication) {
        selectedMedication = medication;
        reminderMedicationId.value = medication.id;
        reminderModal.classList.add('active');
    }

    // 17. Upload image
    function uploadImage(medication) {
        selectedMedication = medication;
        openAddModal();
        medicationId.value = medication.id;
        document.getElementById('medicationName').value = medication.name;
        // Focus on image upload
        imageUploadArea.scrollIntoView({ behavior: 'smooth' });
    }

    // 18. Open add modal
    function openAddModal() {
        modalTitle.textContent = 'Add New Medication';
        medicationForm.reset();
        medicationId.value = '';
        selectedImage = null;
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
        medicationModal.classList.add('active');
        setupDate();
    }

    // 19. Save medication
    function saveMedication() {
        const id = medicationId.value ? parseInt(medicationId.value) : Date.now();
        const existingIndex = currentMedications.findIndex(m => m.id === id);
        
        const medicationData = {
            id: id,
            name: document.getElementById('medicationName').value,
            dosage: document.getElementById('dosage').value,
            frequency: document.getElementById('frequency').value,
            timeOfDay: document.getElementById('timeOfDay').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value || '',
            instructions: document.getElementById('instructions').value,
            doctor: document.getElementById('prescribingDoctor').value,
            status: document.getElementById('status').value,
            image: existingIndex !== -1 ? currentMedications[existingIndex].image : '',
            refillDate: existingIndex !== -1 ? currentMedications[existingIndex].refillDate : ''
        };
        
        // Handle image upload
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                medicationData.image = e.target.result;
                saveMedicationData(medicationData, existingIndex);
            };
            reader.readAsDataURL(selectedImage);
        } else {
            saveMedicationData(medicationData, existingIndex);
        }
    }

    // 20. Save medication data
    function saveMedicationData(data, existingIndex) {
        if (existingIndex !== -1) {
            currentMedications[existingIndex] = data;
            showMessage('Medication updated successfully', 'success');
        } else {
            currentMedications.unshift(data);
            showMessage('Medication added successfully', 'success');
        }
        
        saveMedications();
        renderAllSections();
        closeMedicationModal();
    }

    // 21. Save reminder
    function saveReminder() {
        const medicationId = reminderMedicationId.value;
        const reminderTime = document.getElementById('reminderTime').value;
        const selectedDays = Array.from(document.querySelectorAll('.day-checkbox input:checked'))
            .map(cb => cb.value);
        
        if (!reminderTime) {
            showMessage('Please select a reminder time', 'error');
            return;
        }
        
        if (selectedDays.length === 0) {
            showMessage('Please select at least one day', 'error');
            return;
        }
        
        // Save reminder to localStorage
        const reminders = JSON.parse(localStorage.getItem('medicationReminders') || '{}');
        reminders[medicationId] = {
            time: reminderTime,
            days: selectedDays,
            sound: document.getElementById('reminderSound').value
        };
        
        localStorage.setItem('medicationReminders', JSON.stringify(reminders));
        
        showMessage('Reminder set successfully', 'success');
        closeReminderModal();
        reminderForm.reset();
    }

    // 22. Request refill
    function requestRefill(medication) {
        if (confirm(`Request refill for ${medication.name}?`)) {
            showMessage('Refill request sent to pharmacy', 'success');
        }
    }

    // 23. Show image preview
    function showImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Medication image">`;
            imagePreview.classList.add('active');
        };
        reader.readAsDataURL(file);
    }

    // 24. Filter medications
    function filterMedications() {
        const searchTerm = searchMedications.value.toLowerCase();
        const statusFilter = filterStatus.value;
        
        // Filter based on active tab
        const activeTab = document.querySelector('.tab.active').dataset.tab;
        
        let filteredMedications = currentMedications.filter(medication => {
            // Status filter
            if (statusFilter !== 'all' && medication.status !== statusFilter) {
                return false;
            }
            
            // Search filter
            if (searchTerm) {
                const searchFields = [
                    medication.name,
                    medication.dosage,
                    medication.doctor,
                    medication.instructions
                ];
                return searchFields.some(field => 
                    field && field.toLowerCase().includes(searchTerm)
                );
            }
            
            return true;
        });
        
        // Render filtered results
        switch(activeTab) {
            case 'active':
                renderMedicationCards(
                    filteredMedications.filter(m => m.status === 'active'),
                    activeMedicationsGrid
                );
                break;
            case 'past':
                renderMedicationTable(
                    filteredMedications.filter(m => m.status === 'past'),
                    pastMedicationsBody
                );
                break;
            case 'refill-due':
                renderMedicationCards(
                    filteredMedications.filter(m => m.status === 'refill-due'),
                    refillDueGrid
                );
                break;
            case 'all':
                renderMedicationCards(filteredMedications, allMedicationsGrid);
                break;
        }
    }

    // 25. Update counts
    function updateCounts() {
        const active = currentMedications.filter(m => m.status === 'active').length;
        const past = currentMedications.filter(m => m.status === 'past').length;
        const refillDue = currentMedications.filter(m => m.status === 'refill-due').length;
        const all = currentMedications.length;
        
        activeCount.textContent = active;
        pastCount.textContent = past;
        refillCount.textContent = refillDue;
        allCount.textContent = all;
    }

    // 26. Close modals
    function closeMedicationModal() {
        medicationModal.classList.remove('active');
        medicationForm.reset();
        selectedImage = null;
        imagePreview.innerHTML = '';
        imagePreview.classList.remove('active');
    }
    
    function closeDetailsModal() {
        detailsModal.classList.remove('active');
        selectedMedication = null;
    }
    
    function closeReminderModal() {
        reminderModal.classList.remove('active');
        reminderForm.reset();
    }

    // 27. Helper functions
    function getFrequencyText(frequency, timeOfDay) {
        const frequencyMap = {
            'once-daily': 'Once daily',
            'twice-daily': 'Twice daily',
            'thrice-daily': 'Three times daily',
            'as-needed': 'As needed',
            'weekly': 'Weekly',
            'monthly': 'Monthly'
        };
        
        const timeMap = {
            'morning': 'in the morning',
            'afternoon': 'in the afternoon',
            'evening': 'in the evening',
            'bedtime': 'at bedtime'
        };
        
        let text = frequencyMap[frequency] || frequency;
        if (timeOfDay && timeMap[timeOfDay]) {
            text += ' ' + timeMap[timeOfDay];
        }
        
        return text;
    }
    
    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Initialize the page
    initPage();
});