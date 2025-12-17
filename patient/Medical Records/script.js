// Medical Records Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Sample reports data
    const reportsData = [
        {
            id: 1,
            title: "Complete Blood Count (CBC)",
            type: "lab-test",
            category: "lab-tests",
            date: "2023-10-26",
            doctor: "Dr. Emily White",
            description: "Normal results, slight increase in white blood cells.",
            fileType: "pdf",
            fileName: "cbc_report.pdf",
            fileSize: "2.4 MB"
        },
        {
            id: 2,
            title: "Cholesterol Panel",
            type: "lab-test",
            category: "lab-tests",
            date: "2023-08-15",
            doctor: "Dr. Emily White",
            description: "All levels within normal range.",
            fileType: "pdf",
            fileName: "cholesterol_panel.pdf",
            fileSize: "1.8 MB"
        },
        {
            id: 3,
            title: "Chest X-Ray",
            type: "xray",
            category: "radiology",
            date: "2023-09-20",
            doctor: "Dr. Michael Chen",
            description: "Clear lungs, no abnormalities detected.",
            fileType: "jpg",
            fileName: "chest_xray.jpg",
            fileSize: "4.2 MB"
        },
        {
            id: 4,
            title: "Blood Pressure Medication",
            type: "prescription",
            category: "prescriptions",
            date: "2023-11-05",
            doctor: "Dr. Sarah Johnson",
            description: "Lisinopril 10mg daily for hypertension.",
            fileType: "pdf",
            fileName: "bp_prescription.pdf",
            fileSize: "1.1 MB"
        },
        {
            id: 5,
            title: "Appendectomy Report",
            type: "surgery",
            category: "surgeries",
            date: "2022-05-12",
            doctor: "Dr. Robert Kim",
            description: "Successful laparoscopic appendectomy.",
            fileType: "pdf",
            fileName: "appendectomy_report.pdf",
            fileSize: "3.5 MB"
        }
    ];

    // Current state
    let currentReports = [...reportsData];
    let selectedReport = null;
    let selectedFile = null;

    // DOM Elements
    const uploadBtn = document.getElementById('uploadReportBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const uploadForm = document.getElementById('uploadForm');
    const reportsList = document.getElementById('reportsList');
    const tabs = document.querySelectorAll('.tab');
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');
    
    // Preview elements
    const previewTitle = document.getElementById('previewTitle');
    const previewType = document.getElementById('previewType');
    const previewDate = document.getElementById('previewDate');
    const previewDoctor = document.getElementById('previewDoctor');
    const previewDescription = document.getElementById('previewDescription');
    const previewImage = document.getElementById('previewImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Upload elements
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileUpload = document.getElementById('fileUpload');
    const browseBtn = document.getElementById('browseBtn');
    const filePreview = document.getElementById('filePreview');

    // 1. Initialize page
    function initPage() {
        renderReports();
        setupEventListeners();
        setupDate();
    }

    // 2. Setup current date for upload form
    function setupDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reportDate').value = today;
        document.getElementById('reportDate').max = today;
    }

    // 3. Render reports list
    function renderReports() {
        reportsList.innerHTML = '';
        
        if (currentReports.length === 0) {
            reportsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical"></i>
                    <h3>No reports found</h3>
                    <p>Upload your first medical report</p>
                </div>
            `;
            return;
        }
        
        currentReports.forEach(report => {
            const reportElement = document.createElement('div');
            reportElement.className = `report-item ${selectedReport?.id === report.id ? 'selected' : ''}`;
            reportElement.dataset.id = report.id;
            
            const icon = getReportIcon(report.type);
            const formattedDate = formatDate(report.date);
            
            reportElement.innerHTML = `
                <div class="report-icon">
                    <i class="${icon}"></i>
                </div>
                <div class="report-content">
                    <div class="report-title">${report.title}</div>
                    <div class="report-meta">${formattedDate} • ${report.doctor}</div>
                </div>
                <div class="report-actions">
                    <button class="action-btn download-action" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn delete-action" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            reportsList.appendChild(reportElement);
            
            // Add click event to select report
            reportElement.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    selectReport(report);
                }
            });
            
            // Add events to action buttons
            const downloadAction = reportElement.querySelector('.download-action');
            const deleteAction = reportElement.querySelector('.delete-action');
            
            downloadAction.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadReport(report);
            });
            
            deleteAction.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteReport(report.id);
            });
        });
    }

    // 4. Select report for preview
    function selectReport(report) {
        selectedReport = report;
        
        // Update UI
        document.querySelectorAll('.report-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.report-item[data-id="${report.id}"]`).classList.add('selected');
        
        // Update preview
        previewTitle.textContent = report.title;
        previewType.textContent = getReportTypeName(report.type);
        previewDate.textContent = formatDate(report.date);
        previewDoctor.textContent = report.doctor;
        previewDescription.textContent = report.description;
        
        // Show file preview
        previewImage.innerHTML = `
            <div class="file-preview-content">
                <i class="fas fa-file-${report.fileType === 'pdf' ? 'pdf' : 'image'} fa-3x"></i>
                <h4>${report.fileName}</h4>
                <p>${report.fileSize}</p>
            </div>
        `;
        
        // Enable download button
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => downloadReport(report);
    }

    // 5. Download report
    function downloadReport(report) {
        showMessage(`Downloading: ${report.fileName}`, 'success');
        
        // Simulate download
        const link = document.createElement('a');
        link.href = `#`; // In real app: actual file URL
        link.download = report.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 6. Delete report
    function deleteReport(reportId) {
        if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
            currentReports = currentReports.filter(report => report.id !== reportId);
            
            if (selectedReport?.id === reportId) {
                selectedReport = null;
                resetPreview();
            }
            
            renderReports();
            showMessage('Report deleted successfully', 'success');
        }
    }

    // 7. Upload new report
    function setupUploadForm() {
        // Open modal
        uploadBtn.addEventListener('click', () => {
            uploadModal.classList.add('active');
        });
        
        // Close modal
        closeModalBtn.addEventListener('click', closeModal);
        cancelUploadBtn.addEventListener('click', closeModal);
        
        // Click outside to close
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                closeModal();
            }
        });
        
        // File upload
        fileUploadArea.addEventListener('click', () => fileUpload.click());
        browseBtn.addEventListener('click', () => fileUpload.click());
        
        fileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                selectedFile = file;
                showFilePreview(file);
            }
        });
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            fileUploadArea.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            fileUploadArea.style.borderColor = 'var(--primary-blue)';
            fileUploadArea.style.background = 'rgba(0, 59, 133, 0.05)';
        }
        
        function unhighlight() {
            fileUploadArea.style.borderColor = 'var(--medium-gray)';
            fileUploadArea.style.background = 'transparent';
        }
        
        fileUploadArea.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file) {
                selectedFile = file;
                showFilePreview(file);
            }
        });
        
        // Form submission
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!selectedFile) {
                alert('Please select a file to upload');
                return;
            }
            
            const formData = {
                id: Date.now(), // Generate unique ID
                title: document.getElementById('reportTitle').value,
                type: document.getElementById('reportType').value,
                category: getCategoryFromType(document.getElementById('reportType').value),
                date: document.getElementById('reportDate').value,
                doctor: document.getElementById('reportDoctor').value,
                description: document.getElementById('reportDescription').value,
                fileType: selectedFile.name.split('.').pop().toLowerCase(),
                fileName: selectedFile.name,
                fileSize: formatFileSize(selectedFile.size)
            };
            
            // Add to reports
            currentReports.unshift(formData);
            renderReports();
            selectReport(formData);
            
            // Close modal and reset form
            closeModal();
            uploadForm.reset();
            selectedFile = null;
            filePreview.classList.remove('active');
            filePreview.innerHTML = '';
            
            showMessage('Report uploaded successfully', 'success');
        });
    }

    // 8. Show file preview
    function showFilePreview(file) {
        const fileSize = formatFileSize(file.size);
        const fileType = file.name.split('.').pop().toLowerCase();
        
        filePreview.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-${fileType === 'pdf' ? 'pdf' : fileType.match(/(jpg|jpeg|png|gif)$/) ? 'image' : 'alt'}"></i>
                <div class="file-details">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
                <button class="remove-file" type="button">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        filePreview.classList.add('active');
        
        // Remove file
        filePreview.querySelector('.remove-file').addEventListener('click', () => {
            selectedFile = null;
            filePreview.classList.remove('active');
            filePreview.innerHTML = '';
            fileUpload.value = '';
        });
    }

    // 9. Filter and search
    function setupFilters() {
        let currentCategory = 'lab-tests';
        
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentCategory = tab.dataset.category;
                filterReports();
            });
        });
        
        // Search
        searchInput.addEventListener('input', filterReports);
        
        // Type filter
        typeFilter.addEventListener('change', filterReports);
        
        function filterReports() {
            const searchTerm = searchInput.value.toLowerCase();
            const typeFilterValue = typeFilter.value;
            
            currentReports = reportsData.filter(report => {
                // Category filter
                if (currentCategory !== 'all' && report.category !== currentCategory) {
                    return false;
                }
                
                // Type filter
                if (typeFilterValue !== 'all' && report.type !== typeFilterValue) {
                    return false;
                }
                
                // Search filter
                if (searchTerm) {
                    const searchFields = [
                        report.title,
                        report.doctor,
                        report.description,
                        report.date
                    ];
                    return searchFields.some(field => 
                        field.toLowerCase().includes(searchTerm)
                    );
                }
                
                return true;
            });
            
            renderReports();
        }
    }

    // 10. Navigation
    function setupNavigation() {
        // Notifications button - عمل بالباث
        const notificationsBtn = document.getElementById('notificationsBtn');
        notificationsBtn.addEventListener('click', () => {
            window.location.href = 'notifications.html';
        });
        
        // Settings button - عمل بالباث
        const settingsBtn = document.getElementById('settingsBtn');
        settingsBtn.addEventListener('click', () => {
            window.location.href = 'settings.html';
        });
        
        // Quick links in footer - تعمل بالباث مباشرة
        // No JavaScript needed - they work with href attributes
        
        // Chatbot link in sidebar - يعمل بالباث
        // No JavaScript needed - works with href
        
        // Floating chatbot icon - يعمل بالباث
        // No JavaScript needed - works with href
        
        // Logout button - يعمل بالباث (تم تحويله لرابط في HTML)
        // No JavaScript needed - works with href
    }

    // 11. Helper functions
    function getReportIcon(type) {
        const icons = {
            'lab-test': 'fas fa-vial',
            'xray': 'fas fa-x-ray',
            'mri': 'fas fa-magnet',
            'prescription': 'fas fa-prescription-bottle-alt',
            'surgery': 'fas fa-syringe',
            'other': 'fas fa-file-medical'
        };
        return icons[type] || 'fas fa-file-medical';
    }
    
    function getReportTypeName(type) {
        const names = {
            'lab-test': 'Lab Test',
            'xray': 'X-Ray',
            'mri': 'MRI Scan',
            'prescription': 'Prescription',
            'surgery': 'Surgery Report',
            'other': 'Other'
        };
        return names[type] || type;
    }
    
    function getCategoryFromType(type) {
        const mapping = {
            'lab-test': 'lab-tests',
            'xray': 'radiology',
            'mri': 'radiology',
            'prescription': 'prescriptions',
            'surgery': 'surgeries',
            'other': 'lab-tests'
        };
        return mapping[type] || 'lab-tests';
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    function resetPreview() {
        previewTitle.textContent = 'No document selected';
        previewType.textContent = '-';
        previewDate.textContent = '-';
        previewDoctor.textContent = '-';
        previewDescription.textContent = '-';
        previewImage.innerHTML = `
            <div class="no-preview">
                <i class="fas fa-file-medical"></i>
                <p>Select a document to preview</p>
            </div>
        `;
        downloadBtn.disabled = true;
    }
    
    function closeModal() {
        uploadModal.classList.remove('active');
        uploadForm.reset();
        selectedFile = null;
        filePreview.classList.remove('active');
        filePreview.innerHTML = '';
    }
    
    function showMessage(message, type = 'info') {
        const colors = {
            'success': 'var(--accent-green)',
            'error': 'var(--error-red)',
            'info': 'var(--primary-blue)'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 6px;
            z-index: 2000;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
        
        // Add animation styles
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 12. Setup all event listeners
    function setupEventListeners() {
        setupUploadForm();
        setupFilters();
        setupNavigation();
        
        // Select first report by default
        if (currentReports.length > 0) {
            selectReport(currentReports[0]);
        }
    }

    // Initialize the page
    initPage();
});