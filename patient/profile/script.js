// Profile Page Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileForm = document.getElementById('profileForm');
    const cancelChangesBtn = document.getElementById('cancelChangesBtn');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const editFieldBtns = document.querySelectorAll('.edit-field-btn');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profileAvatar = document.getElementById('profileAvatar');
    const userAvatarLarge = document.getElementById('userAvatarLarge');
    const avatarImage = document.getElementById('avatarImage');
    const largeAvatarImage = document.getElementById('largeAvatarImage');
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    const twoFactorStatus = document.getElementById('twoFactorStatus');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const notificationsBtn = document.getElementById('notificationsBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const viewMedicalHistoryBtn = document.getElementById('viewMedicalHistoryBtn');
    const manageMedicationsBtn = document.getElementById('manageMedicationsBtn');
    
    // Modal Elements
    const addItemModal = document.getElementById('addItemModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalInputContainer = document.getElementById('modalInputContainer');
    const modalAdditionalFieldContainer = document.getElementById('modalAdditionalFieldContainer');
    const modalAdditionalInfo = document.getElementById('modalAdditionalInfo');
    const modalItemCategory = document.getElementById('modalItemCategory');
    const addItemForm = document.getElementById('addItemForm');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const submitAddBtn = document.getElementById('submitAddBtn');
    
    const passwordModal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('passwordForm');
    const closePasswordBtn = document.getElementById('closePasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    
    // Medical data for dropdowns
    const medicalData = {
        allergies: [
            "Penicillin", "Dust Mites", "Pollen", "Peanuts", 
            "Shellfish", "Latex", "Animal Dander", "Mold",
            "Eggs", "Milk", "Soy", "Wheat", "Tree Nuts", "Fish"
        ],
        chronicDiseases: [
            "Hypertension", "Type 1 Diabetes", "Type 2 Diabetes",
            "Asthma", "Arthritis", "Heart Disease", "Chronic Kidney Disease",
            "COPD", "Epilepsy", "Multiple Sclerosis", "Cancer",
            "HIV/AIDS", "Alzheimer's", "Parkinson's", "Osteoporosis"
        ],
        commonSurgeries: [
            "Appendectomy", "Cataract Surgery", "Gallbladder Removal",
            "Hernia Repair", "Hip Replacement", "Knee Replacement",
            "Heart Bypass", "Cesarean Section", "Tonsillectomy"
        ],
        commonMedications: [
            "Lisinopril 10mg", "Metformin 500mg", "Atorvastatin 20mg",
            "Levothyroxine 50mcg", "Metoprolol 25mg", "Amlodipine 5mg",
            "Omeprazole 20mg", "Albuterol Inhaler", "Warfarin 5mg"
        ]
    };
    
    // Original form data for cancel functionality
    let originalFormData = {};
    let isEditing = false;
    let currentModalInput = null;
    let currentModalCustomInput = null;

    // 1. Initialize page
    function initPage() {
        saveOriginalFormData();
        setupEventListeners();
        setupMedicalEventListeners();
        loadUserData();
        loadMedicalData();
    }

    // 2. Save original form data
    function saveOriginalFormData() {
        const form = document.getElementById('profileForm');
        const formData = new FormData(form);
        originalFormData = Object.fromEntries(formData);
        
        // Save medical data
        originalFormData.chronicDiseases = Array.from(document.querySelectorAll('#chronicDiseasesContainer .tag span')).map(tag => tag.textContent);
        originalFormData.allergies = Array.from(document.querySelectorAll('#allergiesContainer .tag span')).map(tag => tag.textContent);
        originalFormData.surgeries = Array.from(document.querySelectorAll('#surgeriesContainer .list-item span')).map(item => item.textContent);
        originalFormData.medications = Array.from(document.querySelectorAll('#medicationsContainer .list-item span')).map(item => item.textContent);
    }

    // 3. Load user data from localStorage
    function loadUserData() {
        const savedData = localStorage.getItem('userProfile');
        if (savedData) {
            const userData = JSON.parse(savedData);
            
            // Update form fields
            document.getElementById('fullName').value = userData.fullName || 'Jane Doe';
            document.getElementById('dateOfBirth').value = userData.dateOfBirth || '1990-05-15';
            document.getElementById('nationalId').value = userData.nationalId || '89123456789';
            document.getElementById('gender').value = userData.gender || 'female';
            document.getElementById('phoneNumber').value = userData.phoneNumber || '+1 (555) 123-4567';
            document.getElementById('bloodType').value = userData.bloodType || 'A+';
            document.getElementById('email').value = userData.email || 'jane.doe@example.com';
            document.getElementById('address').value = userData.address || '123 Health Ave, Medical City';
            
            // Update user name display
            document.getElementById('userFullName').textContent = userData.fullName || 'Jane Doe';
            
            // Update avatar if exists
            if (userData.avatar) {
                avatarImage.src = userData.avatar;
                largeAvatarImage.src = userData.avatar;
            }
            
            // Update 2FA status
            if (userData.twoFactorEnabled) {
                twoFactorToggle.checked = true;
                updateTwoFactorStatus(true);
            }
        }
    }

    // 4. Load medical data from localStorage
    function loadMedicalData() {
        const savedData = localStorage.getItem('userMedicalData');
        if (savedData) {
            const medicalData = JSON.parse(savedData);
            
            // Load each category
            ['chronicDiseases', 'allergies', 'surgeries', 'medications'].forEach(category => {
                if (medicalData[category] && medicalData[category].length > 0) {
                    const container = document.getElementById(category + 'Container');
                    if (container) {
                        // Clear existing items (except add button)
                        const items = container.querySelectorAll('.tag, .list-item');
                        items.forEach(item => item.remove());
                        
                        // Add saved items
                        medicalData[category].forEach(item => {
                            if (category === 'chronicDiseases' || category === 'allergies') {
                                addTagToContainer(container, item);
                            } else {
                                addListItemToContainer(container, item);
                            }
                        });
                    }
                }
            });
        }
    }

    // 5. Add tag to container
    function addTagToContainer(container, text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${text}</span>
            <button type="button" class="remove-tag">&times;</button>
        `;
        
        // Add remove event
        const removeBtn = tag.querySelector('.remove-tag');
        removeBtn.addEventListener('click', function() {
            tag.remove();
            saveMedicalData();
            showMessage('Item removed', 'success');
        });
        
        // Insert before the add button
        const addBtn = container.querySelector('.add-tag-btn, .add-item-btn');
        if (addBtn) {
            container.insertBefore(tag, addBtn);
        } else {
            container.appendChild(tag);
        }
    }

    // 6. Add list item to container
    function addListItemToContainer(container, text) {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>${text}</span>
            <button type="button" class="remove-item">&times;</button>
        `;
        
        // Add remove event
        const removeBtn = item.querySelector('.remove-item');
        removeBtn.addEventListener('click', function() {
            item.remove();
            saveMedicalData();
            showMessage('Item removed', 'success');
        });
        
        // Insert before the add button
        const addBtn = container.querySelector('.add-tag-btn, .add-item-btn');
        if (addBtn) {
            container.insertBefore(item, addBtn);
        } else {
            container.appendChild(item);
        }
    }

    // 7. Setup event listeners
    function setupEventListeners() {
        // Edit field buttons
        editFieldBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const fieldId = this.getAttribute('data-field');
                const field = document.getElementById(fieldId);
                field.focus();
                field.select();
                isEditing = true;
            });
        });
        
        // Field focus events
        const editableFields = document.querySelectorAll('.editable-field');
        editableFields.forEach(field => {
            field.addEventListener('focus', function() {
                isEditing = true;
            });
            
            field.addEventListener('blur', function() {
                if (isEditing) {
                    saveUserData();
                    isEditing = false;
                }
            });
        });
        
        // Avatar upload
        changePhotoBtn.addEventListener('click', () => avatarUpload.click());
        avatarUploadBtn.addEventListener('click', () => avatarUpload.click());
        profileAvatar.addEventListener('click', () => avatarUpload.click());
        userAvatarLarge.addEventListener('click', () => avatarUpload.click());
        
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.match('image.*')) {
                    showMessage('Please select an image file', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showMessage('Image size should be less than 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageUrl = e.target.result;
                    avatarImage.src = imageUrl;
                    largeAvatarImage.src = imageUrl;
                    
                    // Save to user data
                    const userData = JSON.parse(localStorage.getItem('userProfile') || '{}');
                    userData.avatar = imageUrl;
                    localStorage.setItem('userProfile', JSON.stringify(userData));
                    
                    showMessage('Profile photo updated successfully', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Two-factor authentication toggle
        twoFactorToggle.addEventListener('change', function() {
            updateTwoFactorStatus(this.checked);
            
            const userData = JSON.parse(localStorage.getItem('userProfile') || '{}');
            userData.twoFactorEnabled = this.checked;
            localStorage.setItem('userProfile', JSON.stringify(userData));
            
            showMessage(`Two-factor authentication ${this.checked ? 'enabled' : 'disabled'}`, 'success');
        });
        
        // Form submission
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserData();
            showMessage('Profile updated successfully', 'success');
            saveOriginalFormData();
            isEditing = false;
        });
        
        // Cancel changes
        cancelChangesBtn.addEventListener('click', function() {
            if (isEditing) {
                if (confirm('Discard all changes?')) {
                    resetFormToOriginal();
                    showMessage('Changes discarded', 'success');
                    isEditing = false;
                }
            } else {
                showMessage('No changes to discard', 'error');
            }
        });
        
        // Change password
        changePasswordBtn.addEventListener('click', function() {
            passwordModal.classList.add('active');
            document.getElementById('currentPassword').focus();
        });
        
        // Password form submission
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                showMessage('Please fill all password fields', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            
            // In real app, verify current password with server
            // For demo, we'll just save it
            const userData = JSON.parse(localStorage.getItem('userProfile') || '{}');
            userData.password = newPassword; // Note: In real app, hash this!
            localStorage.setItem('userProfile', JSON.stringify(userData));
            
            passwordModal.classList.remove('active');
            passwordForm.reset();
            showMessage('Password updated successfully', 'success');
        });
        
        // Navigation buttons
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                // Clear sensitive data from localStorage
                localStorage.removeItem('currentPassword');
                window.location.href = "/registeration/doctor/patient/logout.html";
            }
        });
        
        notificationsBtn.addEventListener('click', function() {
            window.location.href = '/patient/notifications/notification.html';
        });
        
        settingsBtn.addEventListener('click', function() {
            window.location.href = '/patient/profile/profile.html';
        });
        
        viewMedicalHistoryBtn.addEventListener('click', function() {
            window.location.href = '/patient/Medical Records/medicalrecords1.html';
        });
        
        manageMedicationsBtn.addEventListener('click', function() {
            window.location.href = '/patient/medications/medications.html';
        });
        
        // Modal controls
        closeModalBtn.addEventListener('click', closeAddModal);
        cancelAddBtn.addEventListener('click', closeAddModal);
        closePasswordBtn.addEventListener('click', closePasswordModal);
        cancelPasswordBtn.addEventListener('click', closePasswordModal);
        
        // Click outside modals to close
        addItemModal.addEventListener('click', function(e) {
            if (e.target === addItemModal) {
                closeAddModal();
            }
        });
        
        passwordModal.addEventListener('click', function(e) {
            if (e.target === passwordModal) {
                closePasswordModal();
            }
        });
        
        // Add item form submission
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddItem();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Escape key closes modals
            if (e.key === 'Escape') {
                if (addItemModal.classList.contains('active')) {
                    closeAddModal();
                }
                if (passwordModal.classList.contains('active')) {
                    closePasswordModal();
                }
            }
            
            // Ctrl+S to save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveUserData();
                showMessage('Profile saved', 'success');
            }
        });
    }

    // 8. Setup medical event listeners
    function setupMedicalEventListeners() {
        // Add tag/item buttons - Event delegation for dynamically added buttons
        document.addEventListener('click', function(e) {
            if (e.target.matches('.add-tag-btn, .add-item-btn') || 
                e.target.closest('.add-tag-btn, .add-item-btn')) {
                
                const btn = e.target.matches('.add-tag-btn, .add-item-btn') 
                    ? e.target 
                    : e.target.closest('.add-tag-btn, .add-item-btn');
                
                if (btn) {
                    const category = btn.getAttribute('data-category');
                    const type = btn.getAttribute('data-type');
                    openAddModal(category, type);
                }
            }
        });
        
        // Remove tag/item buttons - Event delegation
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-tag')) {
                const tag = e.target.closest('.tag');
                if (tag) {
                    tag.remove();
                    saveMedicalData();
                    showMessage('Item removed', 'success');
                }
            }
            
            if (e.target.classList.contains('remove-item')) {
                const item = e.target.closest('.list-item');
                if (item) {
                    item.remove();
                    saveMedicalData();
                    showMessage('Item removed', 'success');
                }
            }
        });
    }

    // 9. Open add modal
    function openAddModal(category, type) {
        const titles = {
            'chronicDiseases': 'Add Chronic Disease',
            'allergies': 'Add Allergy',
            'surgeries': 'Add Surgery',
            'medications': 'Add Medication'
        };
        
        modalTitle.textContent = titles[category] || 'Add New Item';
        modalItemCategory.value = category;
        
        // Clear modal input container
        modalInputContainer.innerHTML = '';
        
        // Reset additional info
        modalAdditionalInfo.value = '';
        modalAdditionalFieldContainer.style.display = 'none';
        
        // Setup fields based on category
        if (category === 'allergies' || category === 'chronicDiseases') {
            // Create dropdown for allergies and diseases
            createDropdownForCategory(category);
        } else {
            // Create text input for surgeries and medications
            createTextInputForCategory(category);
        }
        
        // Show additional field for surgeries and medications
        if (category === 'surgeries' || category === 'medications') {
            modalAdditionalFieldContainer.style.display = 'block';
            modalAdditionalInfo.placeholder = category === 'surgeries' 
                ? 'e.g., Year or Details (2023)' 
                : 'e.g., Dosage or Frequency (twice daily)';
        }
        
        addItemModal.classList.add('active');
        
        // Focus the input field
        setTimeout(() => {
            if (currentModalInput) {
                currentModalInput.focus();
                currentModalInput.select();
            }
        }, 100);
    }

    // 10. Create dropdown for allergies and diseases
    function createDropdownForCategory(category) {
        const select = document.createElement('select');
        select.id = 'modalSelect';
        select.className = 'modal-select';
        select.required = true;
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = 'Select from list...';
        select.appendChild(defaultOption);
        
        // Add options from medical data
        const options = medicalData[category];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
        
        // Add custom option
        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = 'Other (enter custom)...';
        select.appendChild(customOpt);
        
        // Handle custom option selection
        select.addEventListener('change', function() {
            if (this.value === 'custom') {
                // Create custom input field
                const customInput = document.createElement('input');
                customInput.type = 'text';
                customInput.className = 'modal-custom-input';
                customInput.placeholder = 'Enter custom value...';
                customInput.required = true;
                
                // Remove any existing custom input
                const existingCustomInput = modalInputContainer.querySelector('.modal-custom-input');
                if (existingCustomInput) {
                    existingCustomInput.remove();
                }
                
                modalInputContainer.appendChild(customInput);
                currentModalCustomInput = customInput;
                
                // Focus the custom input
                setTimeout(() => {
                    customInput.focus();
                    customInput.select();
                }, 50);
            } else {
                // Remove custom input if it exists
                const customInput = modalInputContainer.querySelector('.modal-custom-input');
                if (customInput) {
                    customInput.remove();
                    currentModalCustomInput = null;
                }
            }
        });
        
        modalInputContainer.appendChild(select);
        currentModalInput = select;
    }

    // 11. Create text input for surgeries and medications
    function createTextInputForCategory(category) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'modalTextInput';
        input.className = 'modal-input';
        input.placeholder = category === 'surgeries' 
            ? 'e.g., Appendectomy' 
            : 'e.g., Lisinopril 10mg';
        input.required = true;
        
        // Add autocomplete suggestions for common items
        const commonItems = medicalData[category === 'surgeries' ? 'commonSurgeries' : 'commonMedications'];
        input.setAttribute('list', `${category}-suggestions`);
        
        // Create datalist for suggestions
        const datalist = document.createElement('datalist');
        datalist.id = `${category}-suggestions`;
        
        commonItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            datalist.appendChild(option);
        });
        
        modalInputContainer.appendChild(input);
        modalInputContainer.appendChild(datalist);
        currentModalInput = input;
    }

    // 12. Handle add item form submission
    function handleAddItem() {
        const category = modalItemCategory.value;
        let name = '';
        const info = modalAdditionalInfo.value.trim();
        
        // Get value from appropriate field
        if (category === 'allergies' || category === 'chronicDiseases') {
            const select = document.getElementById('modalSelect');
            if (select) {
                if (select.value === 'custom' && currentModalCustomInput) {
                    name = currentModalCustomInput.value.trim();
                } else {
                    name = select.value;
                }
            }
        } else {
            const input = document.getElementById('modalTextInput');
            if (input) {
                name = input.value.trim();
            }
        }
        
        // Validation
        if (!name || name === '') {
            showMessage('Please enter a valid name', 'error');
            return;
        }
        
        // Check for duplicates (for allergies and diseases)
        if (category === 'allergies' || category === 'chronicDiseases') {
            const existingItems = Array.from(
                document.querySelectorAll(`#${category}Container .tag span`)
            ).map(span => span.textContent);
            
            if (existingItems.includes(name)) {
                showMessage('This item already exists', 'error');
                return;
            }
        }
        
        // Add the item
        addMedicalItem(category, name, info);
        closeAddModal();
    }

    // 13. Close add modal
    function closeAddModal() {
        addItemModal.classList.remove('active');
        addItemForm.reset();
        
        // Clear modal inputs
        modalInputContainer.innerHTML = '';
        modalAdditionalFieldContainer.style.display = 'none';
        modalAdditionalInfo.value = '';
        
        // Reset variables
        currentModalInput = null;
        currentModalCustomInput = null;
    }

    // 14. Close password modal
    function closePasswordModal() {
        passwordModal.classList.remove('active');
        passwordForm.reset();
    }

    // 15. Update 2FA status display
    function updateTwoFactorStatus(enabled) {
        twoFactorStatus.textContent = enabled ? 'ON' : 'OFF';
        twoFactorStatus.style.color = enabled ? 'var(--success-green)' : 'var(--error-red)';
    }

    // 16. Add medical item
    function addMedicalItem(category, name, info = '') {
        const containerId = category + 'Container';
        const container = document.getElementById(containerId);
        
        let displayText = name;
        
        // Format display text
        if (info && info.trim() !== '') {
            if (category === 'surgeries') {
                displayText = `${name} (${info})`;
            } else if (category === 'medications') {
                displayText = `${name} (${info})`;
            }
        }
        
        // Create new element
        if (category === 'chronicDiseases' || category === 'allergies') {
            addTagToContainer(container, displayText);
        } else {
            addListItemToContainer(container, displayText);
        }
        
        // Save data
        saveMedicalData();
        showMessage('Item added successfully', 'success');
    }

    // 17. Save user data to localStorage
    function saveUserData() {
        const userData = {
            fullName: document.getElementById('fullName').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            nationalId: document.getElementById('nationalId').value,
            gender: document.getElementById('gender').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            bloodType: document.getElementById('bloodType').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            twoFactorEnabled: twoFactorToggle.checked
        };
        
        // Preserve existing data
        const existingData = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const mergedData = { ...existingData, ...userData };
        
        localStorage.setItem('userProfile', JSON.stringify(mergedData));
        
        // Update displayed name
        document.getElementById('userFullName').textContent = userData.fullName;
    }

    // 18. Save medical data to localStorage
    function saveMedicalData() {
        const medicalData = {
            chronicDiseases: Array.from(document.querySelectorAll('#chronicDiseasesContainer .tag span'))
                .map(tag => tag.textContent),
            allergies: Array.from(document.querySelectorAll('#allergiesContainer .tag span'))
                .map(tag => tag.textContent),
            surgeries: Array.from(document.querySelectorAll('#surgeriesContainer .list-item span'))
                .map(item => item.textContent),
            medications: Array.from(document.querySelectorAll('#medicationsContainer .list-item span'))
                .map(item => item.textContent)
        };
        
        localStorage.setItem('userMedicalData', JSON.stringify(medicalData));
    }

    // 19. Reset form to original data
    function resetFormToOriginal() {
        document.getElementById('fullName').value = originalFormData.fullName || 'Jane Doe';
        document.getElementById('dateOfBirth').value = originalFormData.dateOfBirth || '1990-05-15';
        document.getElementById('nationalId').value = originalFormData.nationalId || '89123456789';
        document.getElementById('gender').value = originalFormData.gender || 'female';
        document.getElementById('phoneNumber').value = originalFormData.phoneNumber || '+1 (555) 123-4567';
        document.getElementById('bloodType').value = originalFormData.bloodType || 'A+';
        document.getElementById('email').value = originalFormData.email || 'jane.doe@example.com';
        document.getElementById('address').value = originalFormData.address || '123 Health Ave, Medical City';
        
        // Reset medical data
        updateMedicalData(originalFormData);
        
        // Reset 2FA if needed
        if (originalFormData.twoFactorEnabled !== undefined) {
            twoFactorToggle.checked = originalFormData.twoFactorEnabled;
            updateTwoFactorStatus(originalFormData.twoFactorEnabled);
        }
    }

    // 20. Update medical data display
    function updateMedicalData(userData) {
        // Chronic Diseases
        const chronicContainer = document.getElementById('chronicDiseasesContainer');
        if (userData.chronicDiseases && userData.chronicDiseases.length > 0) {
            // Clear existing items except add button
            const items = chronicContainer.querySelectorAll('.tag');
            items.forEach(item => item.remove());
            
            userData.chronicDiseases.forEach(disease => {
                addTagToContainer(chronicContainer, disease);
            });
        }
        
        // Allergies
        const allergiesContainer = document.getElementById('allergiesContainer');
        if (userData.allergies && userData.allergies.length > 0) {
            const items = allergiesContainer.querySelectorAll('.tag');
            items.forEach(item => item.remove());
            
            userData.allergies.forEach(allergy => {
                addTagToContainer(allergiesContainer, allergy);
            });
        }
        
        // Surgeries
        const surgeriesContainer = document.getElementById('surgeriesContainer');
        if (userData.surgeries && userData.surgeries.length > 0) {
            const items = surgeriesContainer.querySelectorAll('.list-item');
            items.forEach(item => item.remove());
            
            userData.surgeries.forEach(surgery => {
                addListItemToContainer(surgeriesContainer, surgery);
            });
        }
        
        // Medications
        const medicationsContainer = document.getElementById('medicationsContainer');
        if (userData.medications && userData.medications.length > 0) {
            const items = medicationsContainer.querySelectorAll('.list-item');
            items.forEach(item => item.remove());
            
            userData.medications.forEach(medication => {
                addListItemToContainer(medicationsContainer, medication);
            });
        }
    }

    // 21. Show message
    function showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => {
            msg.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => msg.remove(), 300);
        });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.animation = 'slideIn 0.3s ease';
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // Initialize the page
    initPage();
    
    // Auto-save every 30 seconds if there are changes
    setInterval(() => {
        if (isEditing) {
            saveUserData();
            saveMedicalData();
            console.log('Auto-saved changes');
        }
    }, 30000);
});