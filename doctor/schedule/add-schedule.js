// ========================================
// ADD SCHEDULE - JAVASCRIPT (CORRECTED PATH)
// ========================================

// ========================================
// DROPDOWN FUNCTIONALITY
// ========================================

const appointmentTypes = ['New Patient', 'Follow-up', 'Consultation', 'Emergency', 'Check-up'];
const appointmentTimes = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
    '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];
const durationOptions = ['15 minute', '30 minute', '45 minute', '60 minute', '90 minute', '120 minute'];

function createDropdownMenu(options, currentValue, onSelect) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.style.cssText = `
        position: absolute; top: 100%; left: 0; right: 0; background: white;
        border: 2px solid #e5e7eb; border-radius: 10px; margin-top: 5px;
        max-height: 200px; overflow-y: auto; z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); display: none;
        direction: ltr; text-align: left;
    `;

    options.forEach(option => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = option;
        item.style.cssText = `padding: 12px 16px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f3f4f6;`;
        
        if (option === currentValue) {
            item.style.background = '#f0f7ff'; item.style.color = '#003785'; item.style.fontWeight = '600';
        }
        
        item.addEventListener('mouseenter', function() { this.style.background = '#f0f7ff'; });
        item.addEventListener('mouseleave', function() { if (this.textContent !== currentValue) this.style.background = 'white'; });
        
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            onSelect(option);
            dropdown.style.display = 'none';
        });
        
        dropdown.appendChild(item);
    });
    return dropdown;
}

function initializeDropdowns() {
    const setupDropdown = (triggerSelector, spanSelector, options) => {
        const field = document.querySelector(triggerSelector);
        const span = document.querySelector(spanSelector);
        if (field && span) {
            field.style.position = 'relative';
            const dropdown = createDropdownMenu(options, span.textContent, (selected) => { span.textContent = selected; });
            field.appendChild(dropdown);
            
            field.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== dropdown) m.style.display = 'none';
                });
                
                const isOpen = dropdown.style.display === 'block';
                dropdown.style.display = isOpen ? 'none' : 'block';
            });
        }
    };

    setupDropdown('.add-appointment__dropdown-button-3 .add-appointment__textfield', '.add-appointment__new-patient', appointmentTypes);
    setupDropdown('.add-appointment__dropdown-button-32 .add-appointment__textfield', '.add-appointment__select-time', appointmentTimes);
    setupDropdown('.add-appointment__dropdown-button-33 .add-appointment__textfield', '.add-appointment___30-minute', durationOptions);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.add-appointment__textfield--dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
        }
    });
}

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

function validateForm() {
    const patientName = document.querySelector('.add-appointment__enter-patent-name')?.value.trim();
    const email = document.querySelector('.add-appointment__textbox-153 input')?.value.trim();
    const appointmentDate = document.querySelector('.add-appointment___09-feb-2021')?.value;
    
    let isValid = true;
    let errors = [];

    if (!patientName) { isValid = false; errors.push("Patient Name is required"); highlightError('.add-appointment__textbox-15'); }
    else removeErrorHighlight('.add-appointment__textbox-15');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { isValid = false; errors.push("Valid Email is required"); highlightError('.add-appointment__textbox-153'); }
    else removeErrorHighlight('.add-appointment__textbox-153');

    if (!appointmentDate) { isValid = false; errors.push("Date is required"); highlightError('.add-appointment__textbox-16'); }
    else removeErrorHighlight('.add-appointment__textbox-16');

    return { isValid, errors };
}

function highlightError(selector) {
    const el = document.querySelector(selector + ' .add-appointment__textfield');
    if(el) el.style.border = '2px solid red';
}
function removeErrorHighlight(selector) {
    const el = document.querySelector(selector + ' .add-appointment__textfield');
    if(el) el.style.border = '2px solid #e5e7eb';
}

function saveAppointment() {
    const validation = validateForm();
    if (!validation.isValid) {
        alert('Please fix errors:\n' + validation.errors.join('\n'));
        return;
    }

    showSuccessMessage('Appointment scheduled successfully!');

    // تم تحديث المسار بناءً على المسار الذي زودتني به
    setTimeout(() => {
        // المسار: الخروج من المجلد الحالي -> دخول مجلد dashboadrd -> ملف dashboard.html
        window.location.href = '../dashboadrd/dashboard.html'; 
    }, 1500);
}

function showSuccessMessage(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `position:fixed; top:20px; right:20px; background:#10b981; color:white; padding:15px 25px; border-radius:8px; z-index:9999; animation: slideIn 0.3s;`;
    document.body.appendChild(div);
    setTimeout(() => { div.remove(); }, 2000);
}

// ========================================
// BUTTON HANDLERS
// ========================================

function initializeButtons() {
    // 1. زر الإغلاق (X)
    const closeButton = document.querySelector('.add-appointment__c-remove-1');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (confirm('Close without saving?')) {
                window.location.href = '../dashboadrd/dashboard.html';
            }
        });
    }
    
    // 2. زر Schedule (حفظ)
    const scheduleButton = document.querySelector('.add-appointment__button');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', function(e) {
            e.preventDefault();
            saveAppointment();
        });
    }
    
    // 3. زر Cancel (إلغاء)
    const cancelButton = document.querySelector('.add-appointment__button-197');
    if (cancelButton) {
        cancelButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to cancel?')) {
                window.location.href = '../dashboadrd/dashboard.html';
            }
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("Add Schedule Script Loaded");
    initializeDropdowns();
    initializeButtons();
    
    const dateInput = document.querySelector('.add-appointment___09-feb-2021');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
});