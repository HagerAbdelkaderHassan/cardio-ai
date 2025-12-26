// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Checkbox functionality
    const checkbox = document.getElementById('checkbox');
    const privacyLink = document.getElementById('privacyLink');
    const completeBtn = document.getElementById('completeBtn');
    const loginBtn = document.getElementById('loginBtn');
    
    // Toggle checkbox state
    function toggleCheckbox() {
        checkbox.classList.toggle('checked');
        checkFormCompletion();
    }
    
    // Add event listeners for checkbox
    if (checkbox) {
        checkbox.addEventListener('click', toggleCheckbox);
    }
    
    // Add event listener for privacy link
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCheckbox();
        });
        privacyLink.style.cursor = 'pointer';
    }
    
    // 2. Form validation and button state management
    const formInputs = [
        document.getElementById('fullName'),
        document.getElementById('nationalId'),
        document.getElementById('dateOfBirth'),
        document.getElementById('gender'),
        document.getElementById('phoneNumber'),
        document.getElementById('email'),
        document.getElementById('password'),
        document.getElementById('confirmPassword')
    ];
    
    // Check if all form fields are filled and valid
    function checkFormCompletion() {
        let allFilled = true;
        
        // Check all required fields
        formInputs.forEach(input => {
            if (input && !input.value.trim()) {
                allFilled = false;
            }
        });
        
        // Check password match
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (password !== confirmPassword || !password || !confirmPassword) {
            allFilled = false;
        }
        
        // Check checkbox
        if (!checkbox || !checkbox.classList.contains('checked')) {
            allFilled = false;
        }
        
        // Check email format
        const email = document.getElementById('email').value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailPattern.test(email)) {
            allFilled = false;
        }
        
        // Update button state
        if (completeBtn) {
            if (allFilled) {
                completeBtn.classList.add('active');
                completeBtn.style.cursor = 'pointer';
            } else {
                completeBtn.classList.remove('active');
                completeBtn.style.cursor = 'not-allowed';
            }
        }
        
        return allFilled;
    }
    
    // Add event listeners to all form inputs
    formInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', checkFormCompletion);
            input.addEventListener('change', checkFormCompletion);
            
            // Add focus effects
            input.addEventListener('focus', function() {
                if (this.parentElement && this.parentElement.classList.contains('sign-up__textfield')) {
                    this.parentElement.style.borderColor = '#779f00';
                }
            });
            
            input.addEventListener('blur', function() {
                if (this.parentElement && this.parentElement.classList.contains('sign-up__textfield')) {
                    this.parentElement.style.borderColor = '#dee1e6';
                }
            });
        }
    });
    
    // Special handling for date input
    const dateInput = document.getElementById('dateOfBirth');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            checkFormCompletion();
        });
    }
    
    // 3. Complete account button click handler
    if (completeBtn) {
        completeBtn.addEventListener('click', function() {
            if (!checkFormCompletion()) {
                alert('Please fill all required fields correctly before submitting.');
                return;
            }
            
            // Validate email format
            const email = document.getElementById('email').value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                document.getElementById('email').parentElement.style.borderColor = 'red';
                return;
            }
            
            // Validate password match
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                document.getElementById('password').parentElement.style.borderColor = 'red';
                document.getElementById('confirmPassword').parentElement.style.borderColor = 'red';
                return;
            }
            
            // Validate checkbox
            if (!checkbox.classList.contains('checked')) {
                alert('Please agree to the Terms & Privacy Policy.');
                checkbox.style.borderColor = 'red';
                return;
            }
            
            // All validations passed - redirect to login.html
            window.location.href = 'login.html';
        });
    }
    
    // 4. Login button functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    // 5. Real-time password validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    function validatePasswords() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password && confirmPassword) {
            if (password !== confirmPassword) {
                passwordInput.parentElement.style.borderColor = 'red';
                confirmPasswordInput.parentElement.style.borderColor = 'red';
            } else {
                passwordInput.parentElement.style.borderColor = '#779f00';
                confirmPasswordInput.parentElement.style.borderColor = '#779f00';
            }
        }
    }
    
    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', validatePasswords);
        confirmPasswordInput.addEventListener('input', validatePasswords);
    }
    
    // 6. Initialize form state
    checkFormCompletion();
});













// login


/* script.js – نسخة مباشرة للانتقال إلى dashboard.html */
document.addEventListener('DOMContentLoaded', function () {

    /* ===== عناصر الصفحة ===== */
    const loginForm        = document.getElementById('loginForm');
    const loginBtn         = document.getElementById('loginBtn');
    const signupBtn        = document.getElementById('signupBtn');
    const forgotPassLink   = document.getElementById('forgotPasswordLink');
    const rememberChk      = document.getElementById('rememberMe');

    /* ===== استعادة Remember Me (إن وُجد) ===== */
    if (rememberChk) {
        const savedRemember = localStorage.getItem('rememberLogin');
        if (savedRemember === 'true') {
            rememberChk.checked = true;
            document.getElementById('emailOrPhone').value = localStorage.getItem('savedEmail') || '';
            document.getElementById('password').value     = localStorage.getItem('savedPassword') || '';
        }
        rememberChk.addEventListener('change', () => {
            if (!rememberChk.checked) {          // ألغى التذكّر
                localStorage.removeItem('savedEmail');
                localStorage.removeItem('savedPassword');
            }
        });
    }
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const emailOrPhone = document.getElementById('emailOrPhone').value;
            const password = document.getElementById('password').value;
            
            // التحقق من البيانات
            if (!emailOrPhone || !password) {
                alert('Please enter both email/phone and password');
                return;
            }
            
            // هنا يمكنك إضافة كود للتحقق من صحة البيانات في قاعدة بيانات
            // لكن حالياً سننتقل مباشرة
            
            // الانتقال للصفحة الرئيسية أو Dashboard
            console.log('Logging in with:', { emailOrPhone, password });
            window.location.href = '/patient/dashboard/dashboard.html'; // أو أي صفحة أخرى
        });
    }
    /* ===== منع إرسال الفورم + الانتقال المباشر ===== */
    loginForm?.addEventListener('submit', function (e) {
        e.preventDefault();                      // لازم نمنع الإعادة الافتراضية
        handleLogin();                           // نبدأ عملية الدخول
    });

    /* ===== دخول مباشر عند الضغط على Enter داخل حقل الباسورد ===== */
    document.getElementById('password')?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    });

    /* ===== زر Sign Up أسفل الفورم ===== */
    signupBtn?.addEventListener('click', () => window.location.href = 'signup.html');

    /* ===== Forgot Password ===== */
    forgotPassLink?.addEventListener('click', function (e) {
        e.preventDefault();
        const mail = document.getElementById('emailOrPhone').value.trim();
        if (mail) alert(`Password reset link will be sent to: ${mail}`);
        else      alert('Please enter your email first');
    });

    /* ===== دالة الدخول الرئيسية ===== */
    function handleLogin() {
        const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
        const password     = document.getElementById('password').value.trim();
        const rememberMe   = rememberChk?.checked || false;

        /* 1- التحقق البسيط */
        if (!emailOrPhone || !password) {
            alert('Please fill in all fields');
            return;
        }

        /* 2- حالة التحميل */
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        /* 3- حفظ بيانات Remember Me */
        if (rememberMe) {
            localStorage.setItem('rememberLogin', 'true');
            localStorage.setItem('savedEmail', emailOrPhone);
            localStorage.setItem('savedPassword', password);
        } else {
            localStorage.removeItem('rememberLogin');
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }

        /* 4- محاكاة طلب (يمكنك استبدالها بـ fetch حقيقي) */
        setTimeout(() => {               // فقط لإظهار حالة التحميل
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;

            /* 5- تخزين حالة الدخول */
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', emailOrPhone);
            localStorage.setItem('loginTime', new Date().toISOString());

            /* 6- الانتقال الفوري إلى dashboard.html */
            window.location.href = 'dashboard.html';
        }, 700); // 0.7 ثانية فقط لإنهاء التحميل (غيّريها لو حابة)
    }

    /* ===== التحقق من تسجيل سابق (إن أردت توجيه تلقائي) ===== */
    if (localStorage.getItem('isLoggedIn') === 'true') {
        console.log('Already logged-in → redirecting...');
        // window.location.href = 'dashboard.html';   // فعّلي السطر ده لو عايزة توجيه تلقائي
    }
});










// complete account



// انتظر حتى يتم تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== Quick Links Navigation ==========
    
    // Home Link
    const homeLink = document.getElementById('homeLink');
    if (homeLink) {
        homeLink.addEventListener('click', function() {
            window.location.href = '/startpage/home.html';
        });
    }
    
    // Profile Link
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }
    
    // Sign Up Link
    const signupLink = document.getElementById('signupLink');
    if (signupLink) {
        signupLink.addEventListener('click', function() {
            window.location.href = 'signup.html';
        });
    }
    
    // Login Link
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    // Dashboard Link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // ========== Form Functionality ==========
    
    // 1. زر Save/Complete - يروح لـ login.html
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // جمع البيانات من الحقول
            const formData = {
                bloodType: document.getElementById('bloodType').value,
                chronicDiseases: document.getElementById('chronicDiseases').value,
                allergies: document.getElementById('allergies').value,
                previousSurgeries: document.getElementById('previousSurgeries').value,
                additionalInfo: document.getElementById('additionalInfo').value,
                fileName: document.getElementById('fileName').textContent
            };
            
            // التحقق من البيانات المطلوبة
            if (!formData.bloodType) {
                alert('Please select your blood type');
                document.getElementById('bloodType').focus();
                return;
            }
            
            // حفظ البيانات في localStorage
            localStorage.setItem('medicalInfo', JSON.stringify(formData));
            localStorage.setItem('accountCompleted', 'true');
            
            console.log('Medical information saved:', formData);
            
            // عرض رسالة نجاح
            alert('🎉 Account completed successfully!\nYour medical information has been saved.\nRedirecting to login page...');
            
            // الانتقال لصفحة Login بعد 2 ثانية
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
    
    // 2. زر Cancel - يروح لـ signup.html
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // التأكيد قبل الإلغاء
            const confirmCancel = confirm('⚠️ Are you sure you want to cancel?\nAny unsaved data will be lost.');
            
            if (confirmCancel) {
                // الانتقال لصفحة Sign Up
                window.location.href = 'signup.html';
            }
        });
    }
    
    // 3. زر Back Arrow - الرجوع للصفحة السابقة
    const backArrow = document.getElementById('backArrow');
    if (backArrow) {
        backArrow.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // 4. زر Upload Prescription
    const uploadBtn = document.getElementById('uploadBtn');
    const fileName = document.getElementById('fileName');
    if (uploadBtn && fileName) {
        uploadBtn.addEventListener('click', function() {
            // إنشاء عنصر input للرفع
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
            
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const file = this.files[0];
                    const fileSize = (file.size / (1024 * 1024)).toFixed(2); // بالـ MB
                    
                    if (fileSize > 5) {
                        alert('⚠️ File size should be less than 5MB');
                        return;
                    }
                    
                    fileName.textContent = file.name;
                    fileName.style.color = '#171a1f';
                    
                    // حفظ معلومات الملف
                    const fileInfo = {
                        name: file.name,
                        size: fileSize + ' MB',
                        type: file.type
                    };
                    localStorage.setItem('prescriptionFile', JSON.stringify(fileInfo));
                }
            });
            
            fileInput.click();
        });
    }
    
    // 5. السماح بإضافة عناصر بالضغط على Enter في الحقول
    const textareas = document.querySelectorAll('.complete-account-textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const value = this.value.trim();
                if (value) {
                    // إضافة العنصر لقائمة مؤقتة (في تطبيق حقيقي ترسل للخادم)
                    addToTempList(this.id, value);
                    this.value = ''; // مسح الحقل
                    
                    // إظهار رسالة تأكيد
                    showToast('✅ Item added: ' + value);
                }
            }
        });
    });
    
    // 6. دالة لإضافة عناصر للقائمة المؤقتة
    function addToTempList(fieldId, value) {
        const tempData = JSON.parse(localStorage.getItem('tempMedicalData') || '{}');
        
        if (!tempData[fieldId]) {
            tempData[fieldId] = [];
        }
        
        tempData[fieldId].push(value);
        localStorage.setItem('tempMedicalData', JSON.stringify(tempData));
        
        console.log(`Added to ${fieldId}:`, value);
    }
    
    // 7. دالة لعرض رسائل Toast
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #779f00;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: 'Manrope-Medium', sans-serif;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // 8. جعل زر Save هو الافتراضي عند الضغط على Enter + Ctrl
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            if (saveBtn) saveBtn.click();
        }
    });
    
    // 9. جعل زر Escape للرجوع
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (cancelBtn) cancelBtn.click();
        }
    });
    
    // 10. تحميل البيانات المحفوظة مسبقاً إن وجدت
    function loadSavedData() {
        const savedData = localStorage.getItem('medicalInfo');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // تعبئة الحقول بالبيانات المحفوظة
                if (data.bloodType) {
                    document.getElementById('bloodType').value = data.bloodType;
                }
                
                if (data.chronicDiseases) {
                    document.getElementById('chronicDiseases').value = data.chronicDiseases;
                }
                
                if (data.allergies) {
                    document.getElementById('allergies').value = data.allergies;
                }
                
                if (data.previousSurgeries) {
                    document.getElementById('previousSurgeries').value = data.previousSurgeries;
                }
                
                if (data.additionalInfo) {
                    document.getElementById('additionalInfo').value = data.additionalInfo;
                }
                
                if (data.fileName && data.fileName !== 'No file chosen') {
                    fileName.textContent = data.fileName;
                    fileName.style.color = '#171a1f';
                }
                
                console.log('Loaded saved medical data');
            } catch (e) {
                console.log('No saved data found');
            }
        }
        
        // تحميل بيانات الملف
        const fileInfo = localStorage.getItem('prescriptionFile');
        if (fileInfo) {
            try {
                const fileData = JSON.parse(fileInfo);
                fileName.textContent = fileData.name;
                fileName.style.color = '#171a1f';
            } catch (e) {
                // تجاهل الخطأ
            }
        }
    }
    
    // تحميل البيانات عند بدء التشغيل
    loadSavedData();
    
    // 11. التنبيه قبل مغادرة الصفحة إذا كان هناك بيانات غير محفوظة
    window.addEventListener('beforeunload', function(e) {
        const hasUnsavedData = document.getElementById('bloodType').value || 
                               document.getElementById('chronicDiseases').value ||
                               document.getElementById('allergies').value ||
                               document.getElementById('previousSurgeries').value ||
                               document.getElementById('additionalInfo').value;
        
        if (hasUnsavedData) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
    
    // 12. إضافة أنماط CSS للـ Toast animations
    const style = document.createElement('style');
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
    
    console.log('✅ Complete Account page loaded successfully with Quick Links!');
});

























// logout 


// انتظر حتى يتم تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // العناصر الرئيسية
    const logoutBtn = document.getElementById('logoutBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // روابط التنقل
    const homeLink = document.getElementById('homeLink');
    const signupLink = document.getElementById('signupLink');
    const loginLink = document.getElementById('loginLink');
    
    // ==== EVENT LISTENERS ====
    
    // 1. زر Log Out
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 2. زر Cancel
    if (cancelBtn) {
        cancelBtn.addEventListener('click', handleCancel);
        
        // السماح بالضغط على Esc للرجوع
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                handleCancel();
            }
        });
    }
    
    // 3. روابط التنقل
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'home.html';
        });
    }
    
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signup.html';
        });
    }
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'login.html';
        });
    }
    
    // 4. السماح بالضغط على Enter لتنفيذ Logout
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.target.matches('input, textarea')) {
            logoutBtn.click();
        }
    });
    
    // ==== FUNCTIONS ====
    
    function handleLogout() {
        // عرض حالة التحميل
        logoutBtn.classList.add('loading');
        logoutBtn.disabled = true;
        cancelBtn.disabled = true;
        
        // محاكاة عملية تسجيل الخروج
        setTimeout(() => {
            // مسح بيانات الجلسة (مثال)
            clearSessionData();
            
            // إظهار رسالة النجاح
            showSuccessMessage();
            
            // الانتقال إلى الصفحة الرئيسية بعد تأخير بسيط
            setTimeout(() => {
                window.location.href = '/startpage/home.html';
            }, 1500);
        }, 1000);
    }
    
    function handleCancel() {
        // عرض رسالة تأكيد
        if (confirm('Do you want to cancel logout?')) {
            // الرجوع للصفحة السابقة
            window.history.back();
            
            // أو الانتقال لصفحة محددة
            // window.location.href = 'dashboard.html';
        }
    }
    
    function clearSessionData() {
        // مسح بيانات الجلسة من localStorage
        localStorage.removeItem('userSession');
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
        
        // مسح بيانات الجلسة من sessionStorage
        sessionStorage.clear();
        
        // يمكنك إضافة كود لمسح الكوكيز هنا إذا لزم الأمر
        console.log('Session data cleared');
    }
    
    function showSuccessMessage() {
        // إنشاء عنصر رسالة النجاح
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message show';
        successMessage.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>You have been successfully logged out. Redirecting to home page...</span>
            </div>
        `;
        
        // إضافة الرسالة إلى البطاقة
        const logoutCard = document.querySelector('.logout-card');
        if (logoutCard) {
            logoutCard.appendChild(successMessage);
        }
    }
    
    // ==== ADDITIONAL FEATURES ====
    
    // إضافة تأثير عند التمرير
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) {
            navbar.style.boxShadow = '0 4px 12px rgba(18, 15, 40, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(18, 15, 40, 0.08)';
        }
    });
    
    // تحسين الوصول (accessibility)
    function setupKeyboardNavigation() {
        // إضافة tabindex للعناصر
        [logoutBtn, cancelBtn, homeLink, signupLink, loginLink].forEach(element => {
            if (element) {
                element.setAttribute('tabindex', '0');
            }
        });
    }
    
    // تهيئة التنقل بلوحة المفاتيح
    setupKeyboardNavigation();
    
    // إضافة تأثيرات CSS إضافية
    const style = document.createElement('style');
    style.textContent = `
        .logout-btn:focus {
            transform: scale(1.02);
        }
        
        .logout-btn--primary:focus {
            box-shadow: 0 0 0 3px rgba(222, 59, 64, 0.3);
        }
        
        .logout-btn--secondary:focus {
            box-shadow: 0 0 0 3px rgba(119, 159, 0, 0.3);
        }
        
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    console.log('Logout page initialized successfully');
});