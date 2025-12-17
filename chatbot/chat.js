// Application State
const state = {
    currentLanguage: 'en',
    darkMode: false,
    currentChatId: 1,
    chats: [
        { id: 1, name: 'Analog Clock React app', active: true, messages: [] },
        { id: 2, name: 'Simple Design System', active: false, messages: [] },
        { id: 3, name: 'Figma variable planning', active: false, messages: [] },
        { id: 4, name: 'OKCLH token algorithm', active: false, messages: [] },
        { id: 5, name: 'Component naming advice', active: false, messages: [] }
    ],
    currentMessages: [],
    uploadedFiles: [],
    mediaRecorder: null,
    audioChunks: [],
    isRecording: false,
    recordingTimer: null,
    recordingStartTime: null,
    audioContext: null,
    analyser: null,
    animationFrameId: null
};

// DOM Elements
const elements = {
    // Sidebar elements
    sidebar: document.querySelector('.sidebar'),
    backButton: document.getElementById('backButton'),
    menuButton: document.getElementById('menuButton'),
    newChatButton: document.getElementById('newChatButton'),
    newChatFab: document.getElementById('newChatFab'),
    searchInput: document.getElementById('searchInput'),
    chatsList: document.getElementById('chatsList'),
    settingsButton: document.getElementById('settingsButton'),
    
    // Main content elements
    themeToggle: document.getElementById('themeToggle'),
    languageToggle: document.getElementById('languageToggle'),
    exitButton: document.getElementById('exitButton'),
    
    // Chat area elements
    chatArea: document.getElementById('chatArea'),
    welcomeMessage: document.getElementById('welcomeMessage'),
    messagesContainer: document.getElementById('messagesContainer'),
    messageInput: document.getElementById('messageInput'),
    sendButton: document.getElementById('sendButton'),
    
    // Media buttons
    voiceButton: document.getElementById('voiceButton'),
    imageUploadButton: document.getElementById('imageUploadButton'),
    cameraButton: document.getElementById('cameraButton'),
    fileUploadButton: document.getElementById('fileUploadButton'),
    
    // Modals
    uploadModal: document.getElementById('uploadModal'),
    cameraModal: document.getElementById('cameraModal'),
    audioModal: document.getElementById('audioModal'),
    settingsModal: document.getElementById('settingsModal'),
    
    // Upload modal elements
    closeUpload: document.getElementById('closeUpload'),
    uploadImageOption: document.getElementById('uploadImageOption'),
    takePhotoOption: document.getElementById('takePhotoOption'),
    uploadFileOption: document.getElementById('uploadFileOption'),
    uploadAudioOption: document.getElementById('uploadAudioOption'),
    imageInput: document.getElementById('imageInput'),
    fileInput: document.getElementById('fileInput'),
    uploadPreview: document.getElementById('uploadPreview'),
    uploadCancel: document.getElementById('uploadCancel'),
    uploadSend: document.getElementById('uploadSend'),
    
    // Camera modal elements
    closeCamera: document.getElementById('closeCamera'),
    cameraVideo: document.getElementById('cameraVideo'),
    cameraCanvas: document.getElementById('cameraCanvas'),
    captureButton: document.getElementById('captureButton'),
    switchCamera: document.getElementById('switchCamera'),
    
    // Audio modal elements
    closeAudio: document.getElementById('closeAudio'),
    audioVisualizer: document.getElementById('audioVisualizer'),
    audioTimer: document.getElementById('audioTimer'),
    recordButton: document.getElementById('recordButton'),
    stopButton: document.getElementById('stopButton'),
    playButton: document.getElementById('playButton'),
    audioCancel: document.getElementById('audioCancel'),
    audioSend: document.getElementById('audioSend'),
    
    // Settings modal elements
    closeSettings: document.getElementById('closeSettings'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    languageSelect: document.getElementById('languageSelect'),
    soundToggle: document.getElementById('soundToggle'),
    notificationsToggle: document.getElementById('notificationsToggle'),
    
    // Hidden inputs
    hiddenImageInput: document.getElementById('hiddenImageInput'),
    hiddenFileInput: document.getElementById('hiddenFileInput'),
    hiddenAudioInput: document.getElementById('hiddenAudioInput'),
    
    // Audio elements
    audioPlayer: document.getElementById('audioPlayer'),
    notificationSound: document.getElementById('notificationSound')
};

// Text based on language
const texts = {
    en: {
        welcome: "What can I help you today?",
        newChat: "New Chat",
        search: "Search",
        chats: "Chats",
        online: "Online",
        exit: "Exit",
        uploadTitle: "Upload File",
        chooseFile: "Choose file from device",
        takePhoto: "Take photo",
        settingsTitle: "Settings",
        darkModeLabel: "Dark Mode",
        languageLabel: "Language",
        messagePlaceholder: "What can I help you today?",
        send: "Send",
        fileUploaded: "File uploaded",
        photoTaken: "Photo taken",
        typing: "CardioAI is typing...",
        recording: "Recording...",
        noCamera: "Camera not available",
        noMicrophone: "Microphone not available",
        confirmExit: "Do you want to exit?",
        confirmDelete: "Are you sure you want to delete this chat?",
        emptyChat: "Start a conversation with CardioAI"
    },
    ar: {
        welcome: "كيف يمكنني مساعدتك اليوم؟",
        newChat: "محادثة جديدة",
        search: "بحث",
        chats: "المحادثات",
        online: "متصل الآن",
        exit: "خروج",
        uploadTitle: "رفع ملف",
        chooseFile: "اختر ملف من الجهاز",
        takePhoto: "التقاط صورة",
        settingsTitle: "الإعدادات",
        darkModeLabel: "الوضع الداكن",
        languageLabel: "اللغة",
        messagePlaceholder: "كيف يمكنني مساعدتك اليوم؟",
        send: "إرسال",
        fileUploaded: "تم رفع الملف",
        photoTaken: "تم التقاط الصورة",
        typing: "CardioAI يكتب...",
        recording: "جاري التسجيل...",
        noCamera: "الكاميرا غير متاحة",
        noMicrophone: "الميكروفون غير متاح",
        confirmExit: "هل تريد الخروج؟",
        confirmDelete: "هل أنت متأكد من حذف هذه المحادثة؟",
        emptyChat: "ابدأ محادثة مع CardioAI"
    }
};

// Initialize Application
function initApp() {
    renderChatsList();
    updateUIByLanguage();
    attachEventListeners();
    loadCurrentChatMessages();
    
    // Check for saved settings
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    if (savedDarkMode) {
        toggleDarkMode(true);
    }
    
    if (savedLanguage !== 'en') {
        state.currentLanguage = savedLanguage;
        elements.languageSelect.value = savedLanguage;
        updateUIByLanguage();
    }
}

// Render Chats List
function renderChatsList() {
    elements.chatsList.innerHTML = '';
    
    state.chats.forEach(chat => {
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chat.active ? 'active' : ''}`;
        chatItem.innerHTML = `
            <i class="fas fa-comment"></i>
            <span class="chat-name">${chat.name}</span>
            <button class="chat-delete-btn" data-id="${chat.id}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Click on chat item
        chatItem.addEventListener('click', (e) => {
            if (!e.target.closest('.chat-delete-btn')) {
                switchChat(chat.id);
            }
        });
        
        // Delete button
        const deleteBtn = chatItem.querySelector('.chat-delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        });
        
        elements.chatsList.appendChild(chatItem);
    });
}

// Switch Chat
function switchChat(chatId) {
    // Save current chat messages
    const currentChat = state.chats.find(c => c.active);
    if (currentChat) {
        currentChat.messages = [...state.currentMessages];
    }
    
    // Update active state
    state.chats.forEach(chat => {
        chat.active = chat.id === chatId;
    });
    
    state.currentChatId = chatId;
    
    // Re-render chats list
    renderChatsList();
    
    // Load new chat messages
    loadCurrentChatMessages();
}

// Delete Chat
function deleteChat(chatId) {
    if (state.chats.length <= 1) {
        alert(getText('confirmDelete'));
        return;
    }
    
    if (confirm(getText('confirmDelete'))) {
        // Remove chat from state
        state.chats = state.chats.filter(chat => chat.id !== chatId);
        
        // If deleted chat was active, switch to first chat
        if (state.currentChatId === chatId) {
            state.currentChatId = state.chats[0].id;
            state.chats[0].active = true;
        }
        
        // Re-render
        renderChatsList();
        loadCurrentChatMessages();
    }
}

// Load Current Chat Messages
function loadCurrentChatMessages() {
    const currentChat = state.chats.find(chat => chat.id === state.currentChatId);
    state.currentMessages = currentChat ? currentChat.messages : [];
    
    // Clear messages container
    elements.messagesContainer.innerHTML = '';
    
    // Show/hide welcome message
    if (state.currentMessages.length === 0) {
        elements.welcomeMessage.style.display = 'flex';
    } else {
        elements.welcomeMessage.style.display = 'none';
        // Render messages
        state.currentMessages.forEach(msg => renderMessage(msg));
        scrollToBottom();
    }
}

// Update UI based on language
function updateUIByLanguage() {
    const t = texts[state.currentLanguage];
    
    // Update all text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // Update specific elements
    if (elements.welcomeText) {
        elements.welcomeText.textContent = t.welcome;
    }
    
    if (document.querySelector('.new-chat-button span')) {
        document.querySelector('.new-chat-button span').textContent = t.newChat;
    }
    
    if (elements.searchInput) {
        elements.searchInput.placeholder = t.search;
    }
    
    if (document.querySelector('.section-title')) {
        document.querySelector('.section-title').textContent = t.chats;
    }
    
    if (elements.userStatus) {
        elements.userStatus.textContent = t.online;
    }
    
    if (elements.exitButton) {
        elements.exitButton.textContent = t.exit;
    }
    
    if (elements.uploadTitle) {
        elements.uploadTitle.textContent = t.uploadTitle;
    }
    
    if (document.querySelector('#uploadImageOption span')) {
        document.querySelector('#uploadImageOption span').textContent = t.chooseFile;
    }
    
    if (document.querySelector('#takePhotoOption span')) {
        document.querySelector('#takePhotoOption span').textContent = t.takePhoto;
    }
    
    if (elements.settingsTitle) {
        elements.settingsTitle.textContent = t.settingsTitle;
    }
    
    if (elements.darkModeLabel) {
        elements.darkModeLabel.textContent = t.darkModeLabel;
    }
    
    if (elements.languageLabel) {
        elements.languageLabel.textContent = t.languageLabel;
    }
    
    if (elements.messageInput) {
        elements.messageInput.placeholder = t.messagePlaceholder;
    }
    
    // Update text direction
    document.body.dir = state.currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.currentLanguage;
}

// Get text by key
function getText(key) {
    return texts[state.currentLanguage][key] || key;
}

// Attach Event Listeners
function attachEventListeners() {
    // Sidebar controls
    elements.backButton.addEventListener('click', toggleSidebar);
    elements.menuButton.addEventListener('click', toggleSidebar);
    elements.newChatButton.addEventListener('click', createNewChat);
    elements.newChatFab.addEventListener('click', createNewChat);
    elements.settingsButton.addEventListener('click', openSettings);
    
    // Search functionality
    elements.searchInput.addEventListener('input', filterChats);
    
    // Header controls
    elements.themeToggle.addEventListener('click', toggleDarkMode);
    elements.languageToggle.addEventListener('click', () => {
        elements.settingsModal.classList.add('active');
    });
    elements.exitButton.addEventListener('click', exitApp);
    
    // Message input
    elements.sendButton.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Media buttons
    elements.voiceButton.addEventListener('click', startVoiceRecording);
    elements.imageUploadButton.addEventListener('click', () => openUploadModal('image'));
    elements.cameraButton.addEventListener('click', openCamera);
    elements.fileUploadButton.addEventListener('click', () => openUploadModal('file'));
    
    // Upload modal
    elements.closeUpload.addEventListener('click', closeUploadModal);
    elements.uploadCancel.addEventListener('click', closeUploadModal);
    elements.uploadSend.addEventListener('click', sendUploadedFiles);
    
    // Upload options
    elements.uploadImageOption.addEventListener('click', () => elements.hiddenImageInput.click());
    elements.takePhotoOption.addEventListener('click', openCamera);
    elements.uploadFileOption.addEventListener('click', () => elements.hiddenFileInput.click());
    elements.uploadAudioOption.addEventListener('click', openAudioRecorder);
    
    // Hidden file inputs
    elements.hiddenImageInput.addEventListener('change', handleImageUpload);
    elements.hiddenFileInput.addEventListener('change', handleFileUpload);
    elements.hiddenAudioInput.addEventListener('change', handleAudioUpload);
    
    // Camera modal
    elements.closeCamera.addEventListener('click', closeCameraModal);
    elements.captureButton.addEventListener('click', capturePhoto);
    elements.switchCamera.addEventListener('click', switchCamera);
    
    // Audio modal
    elements.closeAudio.addEventListener('click', closeAudioModal);
    elements.audioCancel.addEventListener('click', closeAudioModal);
    elements.recordButton.addEventListener('click', toggleAudioRecording);
    elements.stopButton.addEventListener('click', stopAudioRecording);
    elements.playButton.addEventListener('click', playRecordedAudio);
    elements.audioSend.addEventListener('click', sendRecordedAudio);
    
    // Settings modal
    elements.closeSettings.addEventListener('click', closeSettings);
    elements.darkModeToggle.addEventListener('change', () => toggleDarkMode(elements.darkModeToggle.checked));
    elements.languageSelect.addEventListener('change', changeLanguage);
    
    // Suggestion buttons
    document.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            elements.messageInput.value = text;
            elements.messageInput.focus();
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.uploadModal) closeUploadModal();
        if (e.target === elements.cameraModal) closeCameraModal();
        if (e.target === elements.audioModal) closeAudioModal();
        if (e.target === elements.settingsModal) closeSettings();
    });
    
    // Prevent drag and drop default behavior
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
}

// Toggle Sidebar (for mobile)
function toggleSidebar() {
    elements.sidebar.classList.toggle('active');
}

// Filter Chats
function filterChats() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
        if (chatName.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Create New Chat
function createNewChat() {
    const chatName = `${getText('newChat')} ${state.chats.length + 1}`;
    const newChat = {
        id: Date.now(),
        name: chatName,
        active: true,
        messages: []
    };
    
    // Deactivate all chats
    state.chats.forEach(chat => chat.active = false);
    
    // Add new chat at the beginning
    state.chats.unshift(newChat);
    state.currentChatId = newChat.id;
    
    // Re-render
    renderChatsList();
    loadCurrentChatMessages();
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
    
    // Focus on input
    setTimeout(() => {
        elements.messageInput.focus();
    }, 300);
}

// Send Message
function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage({
        id: Date.now(),
        text,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
    });
    
    // Clear input
    elements.messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        removeTypingIndicator();
        simulateAIResponse(text);
    }, 1500 + Math.random() * 1000);
}

// Add Message
function addMessage(message) {
    // Hide welcome message
    if (state.currentMessages.length === 0) {
        elements.welcomeMessage.style.display = 'none';
    }
    
    // Add to state
    state.currentMessages.push(message);
    
    // Update current chat messages
    const currentChat = state.chats.find(chat => chat.id === state.currentChatId);
    if (currentChat) {
        currentChat.messages = state.currentMessages;
    }
    
    // Render message
    renderMessage(message);
    scrollToBottom();
    
    // Play notification sound if enabled
    if (elements.soundToggle.checked) {
        playNotificationSound();
    }
}

// Render Message
function renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender}-message`;
    messageElement.dataset.id = message.id;
    
    // Format time
    const time = new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Avatar
    const avatar = message.sender === 'bot' 
        ? '<div class="message-avatar">AI</div>'
        : '<div class="message-avatar">U</div>';
    
    // Message content based on type
    let content = '';
    
    if (message.type === 'text') {
        content = `
            <div class="message-content">
                <div class="message-text">${escapeHtml(message.text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else if (message.type === 'image') {
        content = `
            <div class="message-content">
                <div class="message-text">${message.text || '📷 Image'}</div>
                <div class="image-message">
                    <img src="${message.fileUrl}" alt="Uploaded image" style="max-width: 300px; border-radius: 8px;">
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else if (message.type === 'file') {
        const fileSize = message.fileSize ? formatFileSize(message.fileSize) : '';
        content = `
            <div class="message-content">
                <div class="message-text">${message.text || '📎 File'}</div>
                <div class="file-message">
                    <i class="fas fa-file file-icon"></i>
                    <div class="file-info">
                        <div class="file-name">${message.fileName}</div>
                        ${fileSize ? `<div class="file-size">${fileSize}</div>` : ''}
                    </div>
                    <i class="fas fa-download file-download" onclick="downloadFile('${message.fileUrl}', '${message.fileName}')"></i>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else if (message.type === 'audio') {
        content = `
            <div class="message-content">
                <div class="message-text">${message.text || '🎤 Audio message'}</div>
                <div class="audio-message">
                    <div class="audio-control" onclick="playAudioMessage('${message.id}')">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="audio-info">
                        <div class="audio-progress">
                            <div class="audio-progress-bar" id="progress-${message.id}"></div>
                        </div>
                        <div class="audio-duration" id="duration-${message.id}">${message.duration || '00:00'}</div>
                    </div>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }
    
    messageElement.innerHTML = avatar + content;
    elements.messagesContainer.appendChild(messageElement);
}

// Show Typing Indicator
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'message bot-message';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    elements.messagesContainer.appendChild(typingElement);
    scrollToBottom();
}

// Remove Typing Indicator
function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

// Simulate AI Response
function simulateAIResponse(userMessage) {
    const responses = state.currentLanguage === 'en' ? [
        "Thank you for your question! I'm CardioAI, your cardiac health assistant. Based on your query, I recommend consulting with a healthcare professional for personalized advice.",
        "That's an important question about heart health. While I can provide general information, please remember that I'm an AI assistant and not a substitute for medical advice from a qualified doctor.",
        "I understand your concern. For accurate cardiac health information, it's best to consult with a cardiologist who can consider your complete medical history.",
        "Interesting question! I've analyzed similar cases and found that lifestyle changes often play a crucial role in cardiac health. Would you like me to share some general tips?"
    ] : [
        "شكراً لسؤالك! أنا CardioAI، مساعدك في صحة القلب. بناءً على استفسارك، أنصحك باستشارة أخصائي رعاية صحية للحصول على نصيحة مخصصة.",
        "هذا سؤال مهم حول صحة القلب. بينما يمكنني تقديم معلومات عامة، تذكر أنني مساعد ذكي وليس بديلاً عن المشورة الطبية من طبيب مؤهل.",
        "أتفهم قلقك. للحصول على معلومات دقيقة عن صحة القلب، من الأفضل استشارة طبيب قلب يمكنه النظر في تاريخك الطبي الكامل.",
        "سؤال مثير للاهتمام! لقد قمت بتحليل حالات مماثلة ووجدت أن التغييرات في نمط الحياة غالباً ما تلعب دوراً حاسماً في صحة القلب. هل تريد أن أشارك بعض النصائح العامة؟"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    addMessage({
        id: Date.now(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
    });
}

// Scroll to Bottom
function scrollToBottom() {
    elements.chatArea.scrollTop = elements.chatArea.scrollHeight;
}

// Open Upload Modal
function openUploadModal(type) {
    elements.uploadModal.classList.add('active');
    elements.uploadPreview.innerHTML = '';
    elements.uploadSend.disabled = true;
    
    // Reset file inputs
    elements.imageInput.value = '';
    elements.fileInput.value = '';
    elements.hiddenImageInput.value = '';
    elements.hiddenFileInput.value = '';
    
    // Set accept attribute based on type
    if (type === 'image') {
        elements.imageInput.accept = 'image/*';
        elements.hiddenImageInput.accept = 'image/*';
    } else if (type === 'file') {
        elements.fileInput.accept = '*/*';
        elements.hiddenFileInput.accept = '*/*';
    }
}

// Close Upload Modal
function closeUploadModal() {
    elements.uploadModal.classList.remove('active');
    state.uploadedFiles = [];
}

// Handle Image Upload
function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            addFileToUploadList(file, 'image');
        } else {
            alert('Please select an image file');
        }
    });
}

// Handle File Upload
function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        addFileToUploadList(file, 'file');
    });
}

// Handle Audio Upload
function handleAudioUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type.startsWith('audio/')) {
            addFileToUploadList(file, 'audio');
        } else {
            alert('Please select an audio file');
        }
    });
}

// Add File to Upload List
function addFileToUploadList(file, type) {
    const fileId = Date.now();
    const fileObj = {
        id: fileId,
        file: file,
        type: type,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
    };
    
    state.uploadedFiles.push(fileObj);
    renderUploadPreview(fileObj);
    elements.uploadSend.disabled = false;
}

// Render Upload Preview
function renderUploadPreview(fileObj) {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.dataset.id = fileObj.id;
    
    let icon = 'fa-file';
    if (fileObj.type === 'image') icon = 'fa-image';
    if (fileObj.type === 'audio') icon = 'fa-volume-up';
    
    previewItem.innerHTML = `
        <i class="fas ${icon} preview-icon"></i>
        <div class="preview-info">
            <div class="preview-name">${fileObj.name}</div>
            <div class="preview-size">${formatFileSize(fileObj.size)}</div>
        </div>
        <i class="fas fa-times preview-remove" onclick="removeUploadedFile(${fileObj.id})"></i>
    `;
    
    elements.uploadPreview.appendChild(previewItem);
}

// Remove Uploaded File
function removeUploadedFile(fileId) {
    state.uploadedFiles = state.uploadedFiles.filter(f => f.id !== fileId);
    
    // Re-render preview
    elements.uploadPreview.innerHTML = '';
    state.uploadedFiles.forEach(file => renderUploadPreview(file));
    
    // Disable send button if no files
    elements.uploadSend.disabled = state.uploadedFiles.length === 0;
}

// Send Uploaded Files
function sendUploadedFiles() {
    state.uploadedFiles.forEach(fileObj => {
        if (fileObj.type === 'image') {
            addMessage({
                id: Date.now(),
                text: '📷 Image',
                sender: 'user',
                timestamp: new Date(),
                type: 'image',
                fileUrl: fileObj.url,
                fileName: fileObj.name,
                fileSize: fileObj.size
            });
        } else if (fileObj.type === 'file') {
            addMessage({
                id: Date.now(),
                text: '📎 File',
                sender: 'user',
                timestamp: new Date(),
                type: 'file',
                fileUrl: fileObj.url,
                fileName: fileObj.name,
                fileSize: fileObj.size
            });
        } else if (fileObj.type === 'audio') {
            addMessage({
                id: Date.now(),
                text: '🎤 Audio',
                sender: 'user',
                timestamp: new Date(),
                type: 'audio',
                fileUrl: fileObj.url,
                fileName: fileObj.name,
                fileSize: fileObj.size
            });
        }
    });
    
    // Show typing indicator and response
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        simulateAIResponse('file upload');
    }, 1500);
    
    // Close modal and reset
    closeUploadModal();
}

// Open Camera
async function openCamera() {
    closeUploadModal();
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        elements.cameraVideo.srcObject = stream;
        state.cameraStream = stream;
        elements.cameraModal.classList.add('active');
        
    } catch (error) {
        console.error('Camera error:', error);
        alert(getText('noCamera'));
    }
}

// Close Camera Modal
function closeCameraModal() {
    if (state.cameraStream) {
        state.cameraStream.getTracks().forEach(track => track.stop());
        state.cameraStream = null;
    }
    elements.cameraVideo.srcObject = null;
    elements.cameraModal.classList.remove('active');
}

// Switch Camera
async function switchCamera() {
    if (!state.cameraStream) return;
    
    const currentFacingMode = state.cameraStream.getVideoTracks()[0].getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    // Stop current stream
    state.cameraStream.getTracks().forEach(track => track.stop());
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: newFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        elements.cameraVideo.srcObject = stream;
        state.cameraStream = stream;
        
    } catch (error) {
        console.error('Camera switch error:', error);
        alert(getText('noCamera'));
    }
}

// Capture Photo
function capturePhoto() {
    const video = elements.cameraVideo;
    const canvas = elements.cameraCanvas;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to blob
    canvas.toBlob((blob) => {
        if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            addFileToUploadList(file, 'image');
            closeCameraModal();
            openUploadModal('image');
        }
    }, 'image/jpeg', 0.9);
}

// Open Audio Recorder
async function openAudioRecorder() {
    closeUploadModal();
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.audioStream = stream;
        initAudioVisualizer(stream);
        elements.audioModal.classList.add('active');
        
    } catch (error) {
        console.error('Microphone error:', error);
        alert(getText('noMicrophone'));
    }
}

// Close Audio Modal
function closeAudioModal() {
    stopAudioRecording();
    
    if (state.audioStream) {
        state.audioStream.getTracks().forEach(track => track.stop());
        state.audioStream = null;
    }
    
    if (state.audioContext) {
        state.audioContext.close();
        state.audioContext = null;
    }
    
    if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
    }
    
    elements.audioModal.classList.remove('active');
    resetAudioUI();
}

// Initialize Audio Visualizer
function initAudioVisualizer(stream) {
    if (!state.audioContext) {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const source = state.audioContext.createMediaStreamSource(stream);
    state.analyser = state.audioContext.createAnalyser();
    source.connect(state.analyser);
    
    // Set up visualizer
    const canvas = elements.audioVisualizer;
    const canvasContext = canvas.getContext('2d');
    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    function draw() {
        state.animationFrameId = requestAnimationFrame(draw);
        
        if (!state.analyser) return;
        
        state.analyser.getByteFrequencyData(dataArray);
        
        canvasContext.fillStyle = 'rgb(240, 240, 240)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        if (state.isRecording) {
            canvasContext.fillStyle = 'rgb(220, 53, 69)';
        } else {
            canvasContext.fillStyle = 'rgb(0, 59, 133)';
        }
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    
    draw();
}

// Toggle Audio Recording
function toggleAudioRecording() {
    if (state.isRecording) {
        stopAudioRecording();
    } else {
        startAudioRecording();
    }
}

// Start Audio Recording
async function startAudioRecording() {
    try {
        if (!state.audioStream) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            state.audioStream = stream;
            initAudioVisualizer(stream);
        }
        
        state.mediaRecorder = new MediaRecorder(state.audioStream);
        state.audioChunks = [];
        
        state.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                state.audioChunks.push(event.data);
            }
        };
        
        state.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(state.audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Create audio file
            const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
            
            // Add to uploaded files
            state.uploadedFiles = [{
                id: Date.now(),
                file: audioFile,
                type: 'audio',
                name: audioFile.name,
                size: audioFile.size,
                url: audioUrl,
                duration: elements.audioTimer.textContent
            }];
            
            // Update UI
            elements.audioSend.disabled = false;
            elements.playButton.disabled = false;
            elements.recordButton.disabled = true;
            elements.stopButton.disabled = true;
            
            // Update recording button
            elements.recordButton.classList.remove('recording');
            elements.recordButton.innerHTML = '<i class="fas fa-redo"></i>';
            elements.recordButton.title = 'Record again';
        };
        
        // Start recording
        state.mediaRecorder.start();
        state.isRecording = true;
        
        // Start timer
        state.recordingStartTime = Date.now();
        updateAudioTimer();
        state.recordingTimer = setInterval(updateAudioTimer, 1000);
        
        // Update UI
        elements.recordButton.classList.add('recording');
        elements.recordButton.innerHTML = '<i class="fas fa-stop"></i>';
        elements.stopButton.disabled = false;
        elements.playButton.disabled = true;
        elements.audioSend.disabled = true;
        
    } catch (error) {
        console.error('Recording error:', error);
        alert(getText('noMicrophone'));
    }
}

// Stop Audio Recording
function stopAudioRecording() {
    if (state.mediaRecorder && state.isRecording) {
        state.mediaRecorder.stop();
        state.isRecording = false;
        
        // Stop timer
        if (state.recordingTimer) {
            clearInterval(state.recordingTimer);
            state.recordingTimer = null;
        }
    }
}

// Update Audio Timer
function updateAudioTimer() {
    if (!state.recordingStartTime) return;
    
    const elapsed = Date.now() - state.recordingStartTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    elements.audioTimer.textContent = timeString;
}

// Play Recorded Audio
function playRecordedAudio() {
    if (state.uploadedFiles.length === 0) return;
    
    const audioFile = state.uploadedFiles[0];
    elements.audioPlayer.src = audioFile.url;
    elements.audioPlayer.play();
}

// Send Recorded Audio
function sendRecordedAudio() {
    if (state.uploadedFiles.length === 0) return;
    
    const audioFile = state.uploadedFiles[0];
    
    addMessage({
        id: Date.now(),
        text: '🎤 Audio message',
        sender: 'user',
        timestamp: new Date(),
        type: 'audio',
        fileUrl: audioFile.url,
        fileName: audioFile.name,
        fileSize: audioFile.size,
        duration: elements.audioTimer.textContent
    });
    
    // Show typing indicator and response
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        simulateAIResponse('audio message');
    }, 1500);
    
    // Close modal
    closeAudioModal();
}

// Reset Audio UI
function resetAudioUI() {
    elements.audioTimer.textContent = '00:00';
    elements.recordButton.classList.remove('recording');
    elements.recordButton.innerHTML = '<i class="fas fa-microphone"></i>';
    elements.recordButton.disabled = false;
    elements.stopButton.disabled = true;
    elements.playButton.disabled = true;
    elements.audioSend.disabled = true;
    state.uploadedFiles = [];
}

// Start Voice Recording (quick recording)
function startVoiceRecording() {
    elements.voiceButton.classList.add('recording');
    elements.voiceButton.title = 'Recording... Click to stop';
    
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // Send audio message
                addMessage({
                    id: Date.now(),
                    text: '🎤 Voice message',
                    sender: 'user',
                    timestamp: new Date(),
                    type: 'audio',
                    fileUrl: audioUrl,
                    fileName: `voice_${Date.now()}.webm`,
                    fileSize: audioBlob.size
                });
                
                // Show response
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    simulateAIResponse('voice message');
                }, 1500);
                
                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            
            // Stop recording after 30 seconds max
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 30000);
            
            // Click again to stop
            const stopRecording = () => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
                elements.voiceButton.classList.remove('recording');
                elements.voiceButton.title = 'Voice Message';
                elements.voiceButton.removeEventListener('click', stopRecording);
            };
            
            elements.voiceButton.addEventListener('click', stopRecording);
        })
        .catch(error => {
            console.error('Microphone error:', error);
            alert(getText('noMicrophone'));
            elements.voiceButton.classList.remove('recording');
        });
}

// Open Settings
function openSettings() {
    elements.settingsModal.classList.add('active');
}

// Close Settings
function closeSettings() {
    elements.settingsModal.classList.remove('active');
}

// Toggle Dark Mode
function toggleDarkMode(forceState = null) {
    if (forceState !== null) {
        state.darkMode = forceState;
    } else {
        state.darkMode = !state.darkMode;
    }
    
    if (state.darkMode) {
        document.body.classList.add('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        elements.darkModeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        elements.darkModeToggle.checked = false;
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', state.darkMode);
}

// Change Language
function changeLanguage() {
    state.currentLanguage = elements.languageSelect.value;
    updateUIByLanguage();
    
    // Save to localStorage
    localStorage.setItem('language', state.currentLanguage);
    
    // Update chat names if needed
    renderChatsList();
}

// Exit App - Go back to previous page
function exitApp() {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
        // Go back to previous page
        window.history.back();
    } else {
        // If no history, redirect to home or close window
        if (confirm('No previous page. Would you like to go to homepage?')) {
            window.location.href = '/'; // Change this to your homepage URL
        }
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function playAudioMessage(messageId) {
    const message = state.currentMessages.find(m => m.id === messageId);
    if (message && message.fileUrl) {
        elements.audioPlayer.src = message.fileUrl;
        elements.audioPlayer.play();
        
        // Update progress
        elements.audioPlayer.ontimeupdate = () => {
            const progress = (elements.audioPlayer.currentTime / elements.audioPlayer.duration) * 100;
            const progressBar = document.getElementById(`progress-${messageId}`);
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            // Update duration display
            const durationElement = document.getElementById(`duration-${messageId}`);
            if (durationElement) {
                const currentTime = formatTime(elements.audioPlayer.currentTime);
                const totalTime = formatTime(elements.audioPlayer.duration);
                durationElement.textContent = `${currentTime} / ${totalTime}`;
            }
        };
        
        // Reset when finished
        elements.audioPlayer.onended = () => {
            const progressBar = document.getElementById(`progress-${messageId}`);
            if (progressBar) {
                progressBar.style.width = '0%';
            }
            const durationElement = document.getElementById(`duration-${messageId}`);
            if (durationElement && message.duration) {
                durationElement.textContent = message.duration;
            }
        };
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function playNotificationSound() {
    elements.notificationSound.currentTime = 0;
    elements.notificationSound.play().catch(e => console.log('Audio play failed:', e));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);