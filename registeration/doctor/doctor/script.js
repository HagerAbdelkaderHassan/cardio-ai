// Main Application Controller
class DoctorRegistrationApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {
            basicInfo: {},
            doctorDetails: {},
            documents: {
                medicalDocs: [],
                license: null
            }
        };
        this.init();
    }

    init() {
        // Load saved data from localStorage
        this.loadSavedData();
        
        // Initialize all components
        this.initEventListeners();
        this.initCustomSelects();
        this.initFileUpload();
        
        // Show current step
        this.showStep(this.currentStep);
        
        // Update progress bar
        this.updateProgress();
        
        // Initialize form validation
        this.initFormValidation();
    }

    // Step Navigation
    goToStep(stepNumber) {
        // Validate current step before leaving
        if (stepNumber > this.currentStep) {
            if (!this.validateCurrentStep()) {
                return false;
            }
        }
        
        // Save current step data
        this.saveCurrentStepData();
        
        // Update current step
        this.currentStep = stepNumber;
        
        // Show the step
        this.showStep(stepNumber);
        
        // Update progress
        this.updateProgress();
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        return true;
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step-content').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show the requested step
        const stepElement = document.getElementById(`step${stepNumber}`);
        if (stepElement) {
            stepElement.classList.add('active');
            
            // If it's the review step, update the review content
            if (stepNumber === 3) {
                this.updateReviewContent();
            }
        }
    }

    updateProgress() {
        // Calculate progress percentage
        const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${progressPercent}%`;
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            
            // Remove all classes
            step.classList.remove('active', 'completed');
            const stepNumberElement = step.querySelector('.step-number');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
                stepNumberElement.textContent = stepNumber;
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                stepNumberElement.textContent = '✓';
            } else {
                stepNumberElement.textContent = stepNumber;
            }
            
            // Make completed steps clickable
            if (stepNumber < this.currentStep) {
                step.style.cursor = 'pointer';
                step.onclick = () => this.goToStep(stepNumber);
            } else {
                step.style.cursor = 'default';
                step.onclick = null;
            }
        });
    }

    initEventListeners() {
        // Password toggle visibility
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetId = e.target.closest('.toggle-password').dataset.target;
                const input = document.getElementById(targetId);
                const icon = e.target.closest('.toggle-password').querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // Info button tooltip
        const infoBtn = document.querySelector('.info-btn');
        if (infoBtn) {
            infoBtn.addEventListener('mouseenter', () => {
                this.showTooltip(infoBtn, 'Supported: PDF, DOC, DOCX, JPG, PNG (Max 5MB)');
            });
            
            infoBtn.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        }
        
        // Terms agreement checkbox
        const termsCheckbox = document.getElementById('termsAgreement');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                this.clearError('termsError');
            });
        }
    }

    initFormValidation() {
        // Real-time validation for text inputs
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"]').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(`${input.id}Error`);
                input.style.borderColor = '#e5e7eb';
                input.style.boxShadow = 'none';
            });
        });
    }

    initCustomSelects() {
        document.querySelectorAll('.custom-select').forEach(selectContainer => {
            const trigger = selectContainer.querySelector('.select-trigger');
            const options = selectContainer.querySelector('.select-options');
            const hiddenInput = selectContainer.querySelector('input[type="hidden"]');
            const selectedValue = selectContainer.querySelector('.selected-value');
            const selectId = selectContainer.id;
            
            // Toggle options dropdown
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = selectContainer.classList.contains('open');
                
                // Close all other selects
                document.querySelectorAll('.custom-select.open').forEach(s => {
                    if (s !== selectContainer) {
                        s.classList.remove('open');
                    }
                });
                
                // Toggle this select
                selectContainer.classList.toggle('open', !isOpen);
            });
            
            // Handle option selection
            options.querySelectorAll('.option').forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    const value = option.dataset.value;
                    const text = option.querySelector('span').textContent;
                    const iconClass = option.querySelector('i').className;
                    
                    // Update display
                    selectedValue.innerHTML = `
                        <i class="${iconClass}"></i>
                        <span>${text}</span>
                    `;
                    selectedValue.classList.remove('placeholder');
                    
                    // Update hidden input
                    hiddenInput.value = value;
                    
                    // Mark selected option
                    options.querySelectorAll('.option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    option.classList.add('selected');
                    
                    // Close dropdown
                    selectContainer.classList.remove('open');
                    
                    // Update styling
                    selectContainer.style.borderColor = '#10b981';
                    selectContainer.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    
                    // Clear error
                    this.clearError(`${hiddenInput.id}Error`);
                    
                    // Save to form data immediately
                    this.saveCurrentStepData();
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                selectContainer.classList.remove('open');
            });
            
            // Initialize with saved value
            if (hiddenInput.value) {
                const option = options.querySelector(`.option[data-value="${hiddenInput.value}"]`);
                if (option) {
                    const text = option.querySelector('span').textContent;
                    const iconClass = option.querySelector('i').className;
                    
                    selectedValue.innerHTML = `
                        <i class="${iconClass}"></i>
                        <span>${text}</span>
                    `;
                    selectedValue.classList.remove('placeholder');
                    option.classList.add('selected');
                    selectContainer.style.borderColor = '#10b981';
                }
            }
        });
    }

    initFileUpload() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(dropZone => {
            const fileInput = dropZone.querySelector('input[type="file"]');
            const fileListId = dropZone.id === 'medicalDocsDropZone' ? 'medicalDocsList' : 'licenseFileList';
            const isMultiple = fileInput.multiple;
            
            // Click on drop zone
            dropZone.addEventListener('click', (e) => {
                if (!e.target.classList.contains('browse-btn')) {
                    fileInput.click();
                }
            });
            
            // Drag and drop events
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('dragover');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                this.handleFiles(files, fileListId, isMultiple);
            });
            
            // File input change
            fileInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                this.handleFiles(files, fileListId, isMultiple);
            });
        });
    }

    handleFiles(files, listId, multiple) {
        const fileList = document.getElementById(listId);
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png'
        ];
        
        files.forEach(file => {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                this.showError('fileError', 'Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files.');
                return;
            }
            
            // Validate file size
            if (file.size > maxSize) {
                this.showError('fileError', 'File size exceeds 5MB limit.');
                return;
            }
            
            // Create file item
            const fileItem = this.createFileItem(file);
            
            // If single file and we already have one, replace it
            if (!multiple && fileList.children.length > 0) {
                // Remove the existing file from data
                const existingFile = this.getFileFromList(listId);
                if (existingFile) {
                    this.removeFileInfo(existingFile.name, listId);
                }
                // Clear the list
                fileList.innerHTML = '';
            }
            
            // Add to UI
            fileList.appendChild(fileItem);
            
            // Save file info
            this.saveFileInfo(file, listId);
            
            // Clear any file errors
            this.clearError('fileError');
        });
    }

    createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = file.name;
        
        const fileIcon = document.createElement('div');
        fileIcon.className = 'file-icon';
        fileIcon.innerHTML = this.getFileIcon(file.type);
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('div');
        fileSize.className = 'file-size';
        fileSize.textContent = this.formatFileSize(file.size);
        
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileItem.remove();
            this.removeFileInfo(file.name, fileItem.parentElement.id);
        });
        
        fileItem.appendChild(fileIcon);
        fileItem.appendChild(fileInfo);
        fileItem.appendChild(removeBtn);
        
        return fileItem;
    }

    getFileIcon(fileType) {
        if (fileType.includes('pdf')) return '<i class="fas fa-file-pdf"></i>';
        if (fileType.includes('word')) return '<i class="fas fa-file-word"></i>';
        if (fileType.includes('image')) return '<i class="fas fa-file-image"></i>';
        return '<i class="fas fa-file"></i>';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    saveFileInfo(file, listId) {
        if (listId === 'medicalDocsList') {
            this.formData.documents.medicalDocs.push(file);
        } else if (listId === 'licenseFileList') {
            this.formData.documents.license = file;
        }
        
        // Save to localStorage
        this.saveToLocalStorage();
    }

    removeFileInfo(fileName, listId) {
        if (listId === 'medicalDocsList') {
            this.formData.documents.medicalDocs = this.formData.documents.medicalDocs.filter(
                file => file.name !== fileName
            );
        } else if (listId === 'licenseFileList') {
            this.formData.documents.license = null;
        }
        
        // Save to localStorage
        this.saveToLocalStorage();
    }

    getFileFromList(listId) {
        if (listId === 'medicalDocsList' && this.formData.documents.medicalDocs.length > 0) {
            return this.formData.documents.medicalDocs[0];
        } else if (listId === 'licenseFileList') {
            return this.formData.documents.license;
        }
        return null;
    }

    validateCurrentStep() {
        switch(this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            default:
                return true;
        }
    }

    validateStep1() {
        const fields = [
            { id: 'fullName', message: 'Full name is required' },
            { id: 'email', message: 'Valid email is required', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            { id: 'address', message: 'Address is required' },
            { id: 'password', message: 'Password must be at least 8 characters', minLength: 8 },
            { id: 'confirmPassword', message: 'Passwords must match' },
            { id: 'phoneNumber', message: 'Phone number is required' },
            { id: 'age', message: 'Age must be between 18 and 100', min: 18, max: 100 },
            { id: 'gender', message: 'Gender is required' },
            { id: 'role', message: 'Role is required' }
        ];

        let isValid = true;

        fields.forEach(field => {
            let element, value;
            
            if (field.id === 'gender' || field.id === 'role') {
                element = document.getElementById(field.id);
                value = element ? element.value : '';
            } else {
                element = document.getElementById(field.id);
                value = element ? element.value.trim() : '';
            }
            
            if (!element) return;

            let fieldValid = true;

            if (!value) {
                fieldValid = false;
            } else if (field.regex && !field.regex.test(value)) {
                fieldValid = false;
            } else if (field.minLength && value.length < field.minLength) {
                fieldValid = false;
            } else if (field.min !== undefined && Number(value) < field.min) {
                fieldValid = false;
            } else if (field.max !== undefined && Number(value) > field.max) {
                fieldValid = false;
            } else if (field.id === 'confirmPassword') {
                const password = document.getElementById('password').value;
                if (value !== password) {
                    fieldValid = false;
                }
            }

            if (!fieldValid) {
                this.showError(`${field.id}Error`, field.message);
                if (element.tagName === 'INPUT') {
                    element.style.borderColor = '#dc2626';
                    element.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                } else if (element.tagName === 'SELECT' || element.type === 'hidden') {
                    const selectContainer = element.closest('.custom-select');
                    if (selectContainer) {
                        selectContainer.style.borderColor = '#dc2626';
                        selectContainer.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }
                }
                isValid = false;
            } else {
                this.clearError(`${field.id}Error`);
                if (element.tagName === 'INPUT') {
                    element.style.borderColor = '#10b981';
                    element.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }
            }
        });

        return isValid;
    }

    validateStep2() {
        const requiredFields = [
            { id: 'medicalId', message: 'Medical ID is required' },
            { id: 'hospitalAffiliation', message: 'Hospital affiliation is required' },
            { id: 'yearsExperience', message: 'Years of experience is required', min: 0, max: 50 },
            { id: 'patientsPerWeek', message: 'Patients per week is required', min: 0, max: 1000 },
            { id: 'university', message: 'University is required' },
            { id: 'medicalDegree', message: 'Medical degree is required' }
        ];

        let isValid = true;

        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element) return;

            const value = element.value.trim();
            let fieldValid = true;

            if (!value) {
                fieldValid = false;
            } else if (field.min !== undefined && Number(value) < field.min) {
                fieldValid = false;
            } else if (field.max !== undefined && Number(value) > field.max) {
                fieldValid = false;
            }

            if (!fieldValid) {
                this.showError(`${field.id}Error`, field.message);
                element.style.borderColor = '#dc2626';
                element.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                isValid = false;
            } else {
                this.clearError(`${field.id}Error`);
                element.style.borderColor = '#10b981';
                element.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
            }
        });

        // Check if license is uploaded
        if (!this.formData.documents.license) {
            this.showError('fileError', 'Please upload your medical license');
            isValid = false;
        } else {
            this.clearError('fileError');
        }

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldId = input.id;
        
        // Clear previous error
        this.clearError(`${fieldId}Error`);
        
        // Special handling for select fields (hidden inputs)
        if (input.type === 'hidden') {
            if (!value) {
                this.showError(`${fieldId}Error`, `Please select a ${fieldId}`);
                const selectContainer = input.closest('.custom-select');
                if (selectContainer) {
                    selectContainer.style.borderColor = '#dc2626';
                    selectContainer.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                }
                return false;
            } else {
                const selectContainer = input.closest('.custom-select');
                if (selectContainer) {
                    selectContainer.style.borderColor = '#10b981';
                    selectContainer.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }
                return true;
            }
        }
        
        // Validation for different field types
        if (fieldId === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(`${fieldId}Error`, 'Please enter a valid email address');
                input.style.borderColor = '#dc2626';
                input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                return false;
            }
        }
        
        if (fieldId === 'age' && value) {
            const age = parseInt(value);
            if (isNaN(age) || age < 18 || age > 100) {
                this.showError(`${fieldId}Error`, 'Age must be between 18 and 100');
                input.style.borderColor = '#dc2626';
                input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                return false;
            }
        }
        
        if (fieldId === 'password' && value) {
            if (value.length < 8) {
                this.showError(`${fieldId}Error`, 'Password must be at least 8 characters');
                input.style.borderColor = '#dc2626';
                input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                return false;
            }
        }
        
        if (fieldId === 'confirmPassword' && value) {
            const password = document.getElementById('password').value;
            if (value !== password) {
                this.showError(`${fieldId}Error`, 'Passwords do not match');
                input.style.borderColor = '#dc2626';
                input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                return false;
            }
        }
        
        // If field is required and empty
        if (input.hasAttribute('required') && !value) {
            this.showError(`${fieldId}Error`, 'This field is required');
            input.style.borderColor = '#dc2626';
            input.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
            return false;
        }
        
        // Success styling
        input.style.borderColor = '#10b981';
        input.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
        
        return true;
    }

    saveCurrentStepData() {
        switch(this.currentStep) {
            case 1:
                this.saveBasicInfo();
                break;
            case 2:
                this.saveDoctorDetails();
                break;
        }
        
        // Save to localStorage
        this.saveToLocalStorage();
    }

    saveBasicInfo() {
        this.formData.basicInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            role: document.getElementById('role').value
        };
    }

    saveDoctorDetails() {
        const hasMastersPhD = document.querySelector('input[name="hasMastersPhD"]:checked');
        
        this.formData.doctorDetails = {
            medicalId: document.getElementById('medicalId').value,
            hospitalAffiliation: document.getElementById('hospitalAffiliation').value,
            hasPrivateClinic: document.getElementById('hasPrivateClinic').checked,
            yearsExperience: document.getElementById('yearsExperience').value,
            patientsPerWeek: document.getElementById('patientsPerWeek').value,
            university: document.getElementById('university').value,
            medicalDegree: document.getElementById('medicalDegree').value,
            hasMastersPhD: hasMastersPhD ? hasMastersPhD.value : 'no'
        };
    }

    saveToLocalStorage() {
        // Convert files to serializable format
        const serializableData = {
            basicInfo: this.formData.basicInfo,
            doctorDetails: this.formData.doctorDetails,
            documents: {
                medicalDocs: this.formData.documents.medicalDocs.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                })),
                license: this.formData.documents.license ? {
                    name: this.formData.documents.license.name,
                    size: this.formData.documents.license.size,
                    type: this.formData.documents.license.type,
                    lastModified: this.formData.documents.license.lastModified
                } : null
            }
        };
        
        localStorage.setItem('doctorRegistrationData', JSON.stringify(serializableData));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('doctorRegistrationData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Restore basic info
            if (data.basicInfo) {
                this.formData.basicInfo = data.basicInfo;
                this.populateBasicInfo();
            }
            
            // Restore doctor details
            if (data.doctorDetails) {
                this.formData.doctorDetails = data.doctorDetails;
                this.populateDoctorDetails();
            }
            
            // Restore documents info (metadata only, actual files need to be re-uploaded)
            if (data.documents) {
                // We only store metadata, actual File objects need to be recreated by user
                this.formData.documents = {
                    medicalDocs: [],
                    license: null
                };
            }
        }
    }

    populateBasicInfo() {
        const basicInfo = this.formData.basicInfo;
        if (!basicInfo) return;
        
        // Populate text inputs
        const textFields = ['fullName', 'email', 'address', 'phoneNumber', 'age'];
        textFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && basicInfo[field]) {
                element.value = basicInfo[field];
                this.validateField(element);
            }
        });
        
        // Populate select fields
        const selectFields = ['gender', 'role'];
        selectFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && basicInfo[field]) {
                element.value = basicInfo[field];
                
                // Update custom select display
                const selectContainer = element.closest('.custom-select');
                if (selectContainer) {
                    const option = selectContainer.querySelector(`.option[data-value="${basicInfo[field]}"]`);
                    if (option) {
                        const text = option.querySelector('span').textContent;
                        const iconClass = option.querySelector('i').className;
                        const selectedValue = selectContainer.querySelector('.selected-value');
                        
                        selectedValue.innerHTML = `
                            <i class="${iconClass}"></i>
                            <span>${text}</span>
                        `;
                        selectedValue.classList.remove('placeholder');
                        
                        option.classList.add('selected');
                        selectContainer.style.borderColor = '#10b981';
                    }
                }
            }
        });
    }

    populateDoctorDetails() {
        const doctorDetails = this.formData.doctorDetails;
        if (!doctorDetails) return;
        
        // Populate text inputs
        const textFields = ['medicalId', 'hospitalAffiliation', 'yearsExperience', 'patientsPerWeek', 'university', 'medicalDegree'];
        textFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && doctorDetails[field]) {
                element.value = doctorDetails[field];
                this.validateField(element);
            }
        });
        
        // Populate checkbox
        const hasPrivateClinic = document.getElementById('hasPrivateClinic');
        if (hasPrivateClinic && doctorDetails.hasPrivateClinic !== undefined) {
            hasPrivateClinic.checked = doctorDetails.hasPrivateClinic;
        }
        
        // Populate radio buttons
        if (doctorDetails.hasMastersPhD) {
            const radio = document.querySelector(`input[name="hasMastersPhD"][value="${doctorDetails.hasMastersPhD}"]`);
            if (radio) {
                radio.checked = true;
            }
        }
    }

    updateReviewContent() {
        this.updateBasicInfoReview();
        this.updateDoctorDetailsReview();
        this.updateDocumentsReview();
    }

    updateBasicInfoReview() {
        const container = document.getElementById('basicInfoReview');
        if (!container || !this.formData.basicInfo) return;
        
        const genderLabels = {
            'male': 'Male',
            'female': 'Female',
            'other': 'Other',
            'prefer-not-to-say': 'Prefer not to say'
        };
        
        const roleLabels = {
            'doctor': 'Doctor',
            'specialist': 'Specialist',
            'surgeon': 'Surgeon',
            'consultant': 'Consultant'
        };
        
        const fields = [
            { label: 'Full Name', value: this.formData.basicInfo.fullName, icon: 'fa-user' },
            { label: 'Email', value: this.formData.basicInfo.email, icon: 'fa-envelope' },
            { label: 'Address', value: this.formData.basicInfo.address, icon: 'fa-map-marker-alt' },
            { label: 'Phone Number', value: this.formData.basicInfo.phoneNumber, icon: 'fa-phone' },
            { label: 'Age', value: this.formData.basicInfo.age ? `${this.formData.basicInfo.age} years` : '', icon: 'fa-birthday-cake' },
            { label: 'Gender', value: genderLabels[this.formData.basicInfo.gender] || this.formData.basicInfo.gender, icon: 'fa-venus-mars' },
            { label: 'Role', value: roleLabels[this.formData.basicInfo.role] || this.formData.basicInfo.role, icon: 'fa-user-md' }
        ];
        
        container.innerHTML = fields.map(field => `
            <div class="review-item">
                <div class="review-label">
                    <i class="fas ${field.icon}"></i>
                    ${field.label}
                </div>
                <div class="review-value ${!field.value ? 'empty' : ''}">
                    ${field.value || 'Not provided'}
                </div>
            </div>
        `).join('');
    }

    updateDoctorDetailsReview() {
        const container = document.getElementById('doctorDetailsReview');
        if (!container || !this.formData.doctorDetails) return;
        
        const fields = [
            { label: 'Medical ID', value: this.formData.doctorDetails.medicalId, icon: 'fa-id-card' },
            { label: 'Hospital Affiliation', value: this.formData.doctorDetails.hospitalAffiliation, icon: 'fa-hospital' },
            { label: 'Private Clinic', value: this.formData.doctorDetails.hasPrivateClinic ? 'Yes' : 'No', icon: 'fa-clinic-medical' },
            { label: 'Years of Experience', value: this.formData.doctorDetails.yearsExperience ? `${this.formData.doctorDetails.yearsExperience} years` : '', icon: 'fa-briefcase' },
            { label: 'Patients per Week', value: this.formData.doctorDetails.patientsPerWeek, icon: 'fa-flask' },
            { label: 'University', value: this.formData.doctorDetails.university, icon: 'fa-university' },
            { label: 'Medical Degree', value: this.formData.doctorDetails.medicalDegree, icon: 'fa-award' },
            { label: 'Master\'s/PhD', value: this.formData.doctorDetails.hasMastersPhD === 'yes' ? 'Yes' : 'No', icon: 'fa-graduation-cap' }
        ];
        
        container.innerHTML = fields.map(field => `
            <div class="review-item">
                <div class="review-label">
                    <i class="fas ${field.icon}"></i>
                    ${field.label}
                </div>
                <div class="review-value ${!field.value ? 'empty' : ''}">
                    ${field.value || 'Not provided'}
                </div>
            </div>
        `).join('');
    }

    updateDocumentsReview() {
        const container = document.getElementById('documentsReview');
        if (!container) return;
        
        let documents = [];
        
        // Add medical license
        if (this.formData.documents.license) {
            documents.push({
                name: this.formData.documents.license.name,
                size: this.formData.documents.license.size,
                type: 'license'
            });
        }
        
        // Add medical documents
        if (this.formData.documents.medicalDocs && this.formData.documents.medicalDocs.length > 0) {
            this.formData.documents.medicalDocs.forEach(doc => {
                documents.push({
                    name: doc.name,
                    size: doc.size,
                    type: 'document'
                });
            });
        }
        
        if (documents.length === 0) {
            container.innerHTML = `
                <div class="review-item">
                    <div class="review-value empty">No documents uploaded</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = documents.map(doc => `
            <div class="document-item">
                <div class="document-icon">
                    <i class="fas ${doc.type === 'license' ? 'fa-file-certificate' : 'fa-file-medical'}"></i>
                </div>
                <div class="document-info">
                    <div class="document-name">${doc.name}</div>
                    <div class="document-size">${this.formatFileSize(doc.size)}</div>
                </div>
            </div>
        `).join('');
    }

    submitForm() {
        // Validate terms agreement
        const termsCheckbox = document.getElementById('termsAgreement');
        if (!termsCheckbox || !termsCheckbox.checked) {
            this.showError('termsError', 'You must agree to the terms and conditions');
            return;
        }
        
        // Save all data
        this.saveCurrentStepData();
        
        // Show loading state
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Simulate API call (in real app, this would be an actual fetch/axios call)
        setTimeout(() => {
            // Hide loading state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success modal
            this.showSuccessModal();
            
            // Clear localStorage
            localStorage.removeItem('doctorRegistrationData');
            
            // Reset form data
            this.formData = {
                basicInfo: {},
                doctorDetails: {},
                documents: {
                    medicalDocs: [],
                    license: null
                }
            };
        }, 2000);
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
    }

    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
    }

    redirectToDashboard() {
        // Redirect to dashboard page
        window.location.href = '/doctor/dashboadrd/dashboard.html';
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    showTooltip(element, text) {
        // Remove existing tooltip
        this.hideTooltip();
        
        // Create new tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(tooltip);
        
        // Store reference for removal
        this.currentTooltip = tooltip;
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }
}

// Global instance and functions
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new DoctorRegistrationApp();
});

// Global navigation functions
function goToStep(stepNumber) {
    if (app) {
        app.goToStep(stepNumber);
    }
}

function submitForm() {
    if (app) {
        app.submitForm();
    }
}

function closeSuccessModal() {
    if (app) {
        app.closeSuccessModal();
    }
}

function redirectToDashboard() {
    if (app) {
        app.redirectToDashboard();
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('successModal');
    if (modal && modal.classList.contains('show')) {
        if (e.target.classList.contains('modal-overlay')) {
            closeSuccessModal();
        }
    }
});