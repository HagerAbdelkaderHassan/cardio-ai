// Profile Page Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileForm = document.getElementById('profileForm');
    const cancelChangesBtn = document.getElementById('cancelChangesBtn');
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    const editFieldBtns = document.querySelectorAll('.edit-field-btn');
    const addTagBtns = document.querySelectorAll('.add-tag-btn');
    const addItemBtns = document.querySelectorAll('.add-item-btn');
    const removeTagBtns = document.querySelectorAll('.remove-tag');
    const removeItemBtns = document.querySelectorAll('.remove-item');
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
    const modalTitle = document.getElementBشyId('modalTitle');
    const itemName = document.getElementById('itemName');
    const additionalFieldContainer = document.getElementById('additionalFieldContainer');
    const additionalInfo = document.getElementById('additionalInfo');
    const itemCategory = document.getElementById('itemCategory');
    const addItemForm = document.getElementById('addItemForm');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    
    const passwordModal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('passwordForm');
    const closePasswordBtn = document.getElementById('closePasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    
    // Original form data for cancel functionality
    let originalFormData = {};
    let isEditing = false;

    // 1. Initialize page
    function initPage() {
        saveOriginalFormData();
        setupEventListeners();
        loadUserData();
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
            
            // Update medical data
            updateMedicalData(userData);
            
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

    // 4. Update medical data display
    function updateMedicalData(userData) {
        // Chronic Diseases
        const chronicContainer = document.getElementById('chronicDiseasesContainer');
        if (userData.chronicDiseases && userData.chronicDiseases.length > 0) {
            chronicContainer.innerHTML = '';
            userData.chronicDiseases.forEach(disease => {
                addTagToContainer(chronicContainer, disease);
            });
        }
        
        // Allergies
        const allergiesContainer = document.getElementById('allergiesContainer');
        if (userData.allergies && userData.allergies.length > 0) {
            allergiesContainer.innerHTML = '';
            userData.allergies.forEach(allergy => {
                addTagToContainer(allergiesContainer, allergy);
            });
        }
        
        // Surgeries
        const surgeriesContainer = document.getElementById('surgeriesContainer');
        if (userData.surgeries && userData.surgeries.length > 0) {
            surgeriesContainer.innerHTML = '';
            userData.surgeries.forEach(surgery => {
                addListItemToContainer(surgeriesContainer, surgery);
            });
        }
        
        // Medications
        const medicationsContainer = document.getElementById('medicationsContainer');
        if (userData.medications && userData.medications.length > 0) {
            medicationsContainer.innerHTML = '';
            userData.medications.forEach(medication => {
                addListItemToContainer(medicationsContainer, medication);
            });
        }
        
        // Add buttons back
        addAddButton(chronicContainer, 'chronicDiseases');
        addAddButton(allergiesContainer, 'allergies');
        addAddButton(surgeriesContainer, 'surgeries');
        addAddButton(medicationsContainer, 'medications');
    }

    // 5. Add tag to container
    function addTagToContainer(container, text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            <span>${text}</span>
            <button type="button" class="remove-tag">&times;</button>
        `;
        container.appendChild(tag);
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
        container.appendChild(item);
    }

    // 7. Add "Add" button to container
    function addAddButton(container, category) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = category.includes('Diseases') || category.includes('allergies') ? 'add-tag-btn' : 'add-item-btn';
        addBtn.setAttribute('data-category', category);
        addBtn.innerHTML = `<i class="fas fa-plus"></i> ${category.includes('Diseases') || category.includes('allergies') ? 'Add' : category === 'surgeries' ? 'Add Surgery' : 'Add Medication'}`;
        container.appendChild(addBtn);
    }

    // 8. Setup event listeners
    function setupEventListeners() {
        // Edit field buttons
        editFieldBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const fieldId = this.getAttribute('data-field');
                const field = document.getElementById(fieldId);
                field.focus();
                field.select();
            });
        });
        
        // Add tag/item buttons
        addTagBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                openAddModal(category, 'tag');
            });
        });
        
        addItemBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                openAddModal(category, 'item');
            });
        });
        
        // Remove tag/item buttons (event delegation)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-tag')) {
                e.target.closest('.tag').remove();
                showMessage('Item removed', 'success');
                saveUserData();
            }
            
            if (e.target.classList.contains('remove-item')) {
                e.target.closest('.list-item').remove();
                showMessage('Item removed', 'success');
                saveUserData();
            }
        });
        
        // Avatar upload
        changePhotoBtn.addEventListener('click', () => avatarUpload.click());
        avatarUploadBtn.addEventListener('click', () => avatarUpload.click());
        profileAvatar.addEventListener('click', () => avatarUpload.click());
        userAvatarLarge.addEventListener('click', () => avatarUpload.click());
        
        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
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
        });
        
        // Cancel changes
        cancelChangesBtn.addEventListener('click', function() {
            if (confirm('Discard all changes?')) {
                resetFormToOriginal();
                showMessage('Changes discarded', 'success');
            }
        });
        
        // Change password
        changePasswordBtn.addEventListener('click', function() {
            passwordModal.classList.add('active');
        });
        
        // Password form submission
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showMessage('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Save password (in real app, this would be sent to server)
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
            const category = itemCategory.value;
            const name = itemName.value;
            const info = additionalInfo.value;
            
            let displayText = name;
            if (info) {
                displayText = category === 'surgeries' ? `${name} (${info})` : `${name} (${info})`;
            }
            
            const containerId = category + 'Container';
            const container = document.getElementById(containerId);
            
            if (category === 'chronicDiseases' || category === 'allergies') {
                addTagToContainer(container, displayText);
            } else {
                addListItemToContainer(container, displayText);
            }
            
            // Re-add the add button
            const addBtn = container.querySelector('button[data-category]');
            if (addBtn) {
                addBtn.remove();
            }
            addAddButton(container, category);
            
            closeAddModal();
            saveUserData();
            showMessage('Item added successfully', 'success');
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
        itemCategory.value = category;
        itemName.value = '';
        additionalInfo.value = '';
        
        // Show additional field for surgeries and medications
        if (category === 'surgeries' || category === 'medications') {
            additionalFieldContainer.style.display = 'block';
            additionalInfo.placeholder = category === 'surgeries' ? 'e.g., Year' : 'e.g., Dosage';
        } else {
            additionalFieldContainer.style.display = 'none';
        }
        
        addItemModal.classList.add('active');
        itemName.focus();
    }

    // 10. Close add modal
    function closeAddModal() {
        addItemModal.classList.remove('active');
        addItemForm.reset();
    }

    // 11. Close password modal
    function closePasswordModal() {
        passwordModal.classList.remove('active');
        passwordForm.reset();
    }

    // 12. Update 2FA status display
    function updateTwoFactorStatus(enabled) {
        twoFactorStatus.textContent = enabled ? 'ON' : 'OFF';
        twoFactorStatus.style.color = enabled ? 'var(--success-green)' : 'var(--error-red)';
    }

    // 13. Save user data to localStorage
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
            chronicDiseases: Array.from(document.querySelectorAll('#chronicDiseasesContainer .tag span')).map(tag => tag.textContent),
            allergies: Array.from(document.querySelectorAll('#allergiesContainer .tag span')).map(tag => tag.textContent),
            surgeries: Array.from(document.querySelectorAll('#surgeriesContainer .list-item span')).map(item => item.textContent),
            medications: Array.from(document.querySelectorAll('#medicationsContainer .list-item span')).map(item => item.textContent),
            twoFactorEnabled: twoFactorToggle.checked,
            avatar: avatarImage.src
        };
        
        localStorage.setItem('userProfile', JSON.stringify(userData));
        
        // Update displayed name
        document.getElementById('userFullName').textContent = userData.fullName;
    }

    // 14. Reset form to original data
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

    // 15. Show message
    function showMessage(message, type = 'success') {
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