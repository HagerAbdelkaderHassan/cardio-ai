/*************************************************
 * Cardio AI Dashboard – Vanilla JS
 *************************************************/
console.log("Cardio AI JS Loaded");

/* ================== HELPERS ================== */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ================== GLOBAL STATE ================== */
const state = {
  totalAppointments: 8,
  completed: 3,
  remaining: 5,
  pendingRequests: 12,
};

/* ================== NAVIGATION HANDLERS ================== */
function initNavigation() {
  // Sidebar Navigation - Dashboard Button
  const dashboardBtn = $(".doctor-dashboard__button5");
  if (dashboardBtn) {
    dashboardBtn.style.cursor = "pointer";
    dashboardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "./dashboard.html";
    });
    dashboardBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }

  // Sidebar Navigation - Patient Search Button
  const patientSearchBtn = $(".doctor-dashboard__button");
  if (patientSearchBtn) {
    patientSearchBtn.style.cursor = "pointer";
    patientSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../patient-search/patient-search/patient-search.html";
    });
    patientSearchBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }

  // Sidebar Navigation - My Patients Button
  const myPatientsBtn = $(".doctor-dashboard__button2");
  if (myPatientsBtn) {
    myPatientsBtn.style.cursor = "pointer";
    myPatientsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../my-patients/my-patients.html";
    });
    myPatientsBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }

  // Sidebar Navigation - Requests Button
  const requestsBtn = $(".doctor-dashboard__button3");
  if (requestsBtn) {
    requestsBtn.style.cursor = "pointer";
    requestsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../my-requests/my-requests.html";
    });
    requestsBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }

  // Sidebar Navigation - Schedule Button
  const scheduleBtn = $(".doctor-dashboard__button4");
  if (scheduleBtn) {
    scheduleBtn.style.cursor = "pointer";
    scheduleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../schedule/schedule.html";
    });
    scheduleBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }

  // Quick Actions Navigation
  const quickAction1 = $(".doctor-dashboard__container15");
  if (quickAction1) {
    quickAction1.style.cursor = "pointer";
    quickAction1.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../my-requests/my-requests.html";
    });
  }

  const quickAction2 = $(".doctor-dashboard__container16");
  if (quickAction2) {
    quickAction2.style.cursor = "pointer";
    quickAction2.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../patient-search/patient-search/patient-search.html";
    });
  }

  const quickAction3 = $(".doctor-dashboard__container17");
  if (quickAction3) {
    quickAction3.style.cursor = "pointer";
    quickAction3.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "../schedule/schedule.html";
    });
  }

  // Footer Navigation
  $(".doctor-dashboard__home")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "./dashboard.html";
  });

  $(".doctor-dashboard__features")?.addEventListener("click", (e) => {
    e.preventDefault();
    // يمكنك إضافة رابط Features هنا
    openModal("<h3>Features</h3><p>Advanced Cardio AI Features</p>");
  });

  $(".doctor-dashboard__solutions")?.addEventListener("click", (e) => {
    e.preventDefault();
    // يمكنك إضافة رابط About هنا
    openModal("<h3>About Cardio AI</h3><p>Cardio AI Platform Information</p>");
  });

  $(".doctor-dashboard__contact")?.addEventListener("click", (e) => {
    e.preventDefault();
    // يمكنك إضافة رابط Contact هنا
    openModal("<h3>Contact Us</h3><p>Contact information for Cardio AI</p>");
  });

  // Logout Button
  $(".doctor-dashboard__button-109")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to log out?")) {
      console.log("User logged out");
      // هنا يمكنك إضافة منطق تسجيل الخروج
      openModal("<h3>Logged Out</h3><p>You have been successfully logged out.</p>");
    }
  });
}

/* ================== SEARCH FUNCTIONALITY ================== */
function initSearch() {
  const container = $(".doctor-dashboard__button7");
  const fakeText = $(".doctor-dashboard__find-patient");

  if (!container || !fakeText) return;

  console.log("🔍 Initializing Search");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search by name, email, or ID...";
  input.style.cssText = `
    width:100%;
    height:100%;
    padding-left:40px;
    font-size:14px;
    outline:none;
    border:none;
    background:transparent;
  `;

  fakeText.replaceWith(input);

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    console.log("Searching for:", value);
    filterAppointments(value);
  });

  // إضافة زر للبحث المتقدم
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchValue = input.value.trim();
      if (searchValue) {
        window.location.href = `../patient-search/patient-search/patient-search.html?search=${encodeURIComponent(searchValue)}`;
      }
    }
  });
}

function filterAppointments(query) {
  const cards = $$(".doctor-dashboard__container9, .doctor-dashboard__container10, .doctor-dashboard__container11");

  cards.forEach(card => {
    const name = card.querySelector(".doctor-dashboard__sarah-johnson")?.innerText.toLowerCase();
    card.style.display = (!query || name.includes(query)) ? "block" : "none";
  });
}

/* ================== MODAL HELPER ================== */
function openModal(html) {
  const overlay = document.createElement("div");
  overlay.className = "cardio-modal-overlay";
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.4);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
  `;

  const modalContent = document.createElement("div");
  modalContent.className = "cardio-modal-content";
  modalContent.style.cssText = `
    background:#fff;
    padding:30px;
    border-radius:12px;
    min-width:400px;
    max-width:500px;
    box-shadow:0 10px 40px rgba(0,0,0,0.2);
  `;

  modalContent.innerHTML = html + `<br/><br/><button class="modal-close-btn" style="padding:8px 20px;background:#007bff;color:white;border:none;border-radius:6px;cursor:pointer;">Close</button>`;

  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  // إغلاق بالنقر خارج المودال
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  // إغلاق بالزر
  modalContent.querySelector(".modal-close-btn").addEventListener("click", () => {
    overlay.remove();
  });
}

/* ================== NEW APPOINTMENT ================== */
function initNewAppointment() {
  const btn = $(".doctor-dashboard__button8");
  if (!btn) return;

  btn.addEventListener("click", () => {
    console.log("➕ New Appointment clicked");
    
    // فتح صفحة schedule/add schedule.html مباشرة
    window.location.href = "../schedule/add-schedule.html";
  });
}

/* ================== PATIENT CARD INTERACTIONS ================== */
function initPatientCards() {
  const cards = $$(".doctor-dashboard__container9, .doctor-dashboard__container10, .doctor-dashboard__container11");

  cards.forEach(card => {
    card.style.cursor = "pointer";
    
    card.addEventListener("click", (e) => {
      // منع النقر إذا كان على زر داخلي
      if (e.target.closest('.doctor-dashboard__c-check-1')) return;
      
      const name = card.querySelector(".doctor-dashboard__sarah-johnson")?.innerText;
      console.log("👤 Patient clicked:", name);

      openModal(`
        <h3 style="margin-bottom:15px;color:#333;">${name}</h3>
        <p style="margin-bottom:10px;color:#666;">Medical History & Details</p>
        <div style="margin:15px 0;">
          <p><strong>Condition:</strong> ${card.querySelector('.doctor-dashboard__general-checkup, .doctor-dashboard__diabetes-management, .doctor-dashboard__hypertension')?.innerText || 'General Checkup'}</p>
          <p><strong>Time:</strong> ${card.querySelector('.doctor-dashboard___10-30-am, .doctor-dashboard___11-00-am, .doctor-dashboard___09-00-am')?.innerText || 'N/A'}</p>
          <p><strong>Status:</strong> ${card.querySelector('.doctor-dashboard__new-patient, .doctor-dashboard__consultation, .doctor-dashboard__follow-up')?.innerText || 'New Patient'}</p>
        </div>
        <button id="viewProfileBtn" style="padding:8px 20px;background:#28a745;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:10px;">View Full Profile</button>
        <button id="consultBtn" style="padding:8px 20px;background:#007bff;color:white;border:none;border-radius:6px;cursor:pointer;">Start Consultation</button>
      `);

      $("#viewProfileBtn")?.addEventListener("click", () => {
        window.location.href = "../my-patients/my-patients.html";
      });

      $("#consultBtn")?.addEventListener("click", () => {
        console.log("✔ Consultation completed for", name);
        state.completed++;
        state.remaining--;
        updateStats();
        openModal(`<h3>Consultation Complete</h3><p>Consultation marked as completed for ${name}</p>`);
      });
    });

    // زر التأشيرة (الcheck)
    const checkBtn = card.querySelector(".doctor-dashboard__c-check-1, .doctor-dashboard__c-check-12");
    if (checkBtn) {
      checkBtn.style.cursor = "pointer";
      checkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const name = card.querySelector(".doctor-dashboard__sarah-johnson")?.innerText;
        console.log("✅ Check clicked for:", name);
        
        // تبديل الحالة
        if (card.dataset.completed === "true") {
          card.dataset.completed = "false";
          state.completed--;
          state.remaining++;
        } else {
          card.dataset.completed = "true";
          state.completed++;
          state.remaining--;
        }
        updateStats();
      });
    }
  });
}

/* ================== PENDING REQUESTS ================== */
function initPendingRequests() {
  const card = $(".doctor-dashboard__container13");
  if (!card) return;

  card.style.cursor = "pointer";
  
  card.addEventListener("click", () => {
    console.log("📩 Pending Request clicked");

    openModal(`
      <h3 style="margin-bottom:15px;color:#333;">Request Details</h3>
      <p style="margin-bottom:10px;"><strong>Patient:</strong> Lisa Anderson</p>
      <p style="margin-bottom:10px;"><strong>Priority:</strong> <span style="color:#dc3545;font-weight:bold;">HIGH</span></p>
      <p style="margin-bottom:20px;"><strong>Description:</strong> Blood work results require review</p>
      <button id="approveReq" style="padding:8px 20px;background:#28a745;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:10px;">Approve Request</button>
      <button id="viewResults" style="padding:8px 20px;background:#17a2b8;color:white;border:none;border-radius:6px;cursor:pointer;">View Results</button>
    `);

    $("#approveReq")?.addEventListener("click", () => {
      state.pendingRequests--;
      $(".doctor-dashboard___12").innerText = state.pendingRequests;
      openModal(`<h3>Request Approved</h3><p>Request has been approved successfully.</p>`);
    });

    $("#viewResults")?.addEventListener("click", () => {
      window.location.href = "../my-requests/my-requests.html";
    });
  });
}

/* ================== VIEW ALL BUTTONS ================== */
function initViewAllButtons() {
  const viewAllBtns = $$(".doctor-dashboard__button9, .doctor-dashboard__button16");
  
  viewAllBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest("section");
      const title = section?.querySelector("h2")?.innerText || "Section";
      console.log(`View All clicked for: ${title}`);
      
      if (title.includes("Today's Schedule")) {
        window.location.href = "../schedule/schedule.html";
      } else if (title.includes("Pending Requests")) {
        window.location.href = "../my-requests/my-requests.html";
      } else if (title.includes("AI Alarm")) {
        openModal(`<h3>All AI Alerts</h3><p>Viewing all AI prediction alerts.</p>`);
      }
    });
  });
}

/* ================== AI ALARM SECTION ================== */
function initAIAlarm() {
  const viewPatientBtn = $(".doctor-dashboard__button14");
  const askChatbotBtn = $(".doctor-dashboard__button15");
  
  viewPatientBtn?.addEventListener("click", () => {
    console.log("View Patient Profile clicked");
    window.location.href = "../my-patients/my-patients.html";
  });
  
  askChatbotBtn?.addEventListener("click", () => {
    console.log("Ask Chatbot clicked");
    initChatbot();
  });
}

/* ================== AI CHATBOT ================== */
function initChatbot() {
  const btn = $(".doctor-dashboard__button6");
  
  btn?.addEventListener("click", () => {
    console.log("🤖 Chatbot opened");

    openModal(`
      <h3 style="margin-bottom:15px;color:#333;">Cardio AI Assistant</h3>
      <div style="height:200px;border:1px solid #ddd;border-radius:8px;padding:15px;margin-bottom:15px;overflow-y:auto;background:#f8f9fa;">
        <div style="margin-bottom:10px;"><strong>AI:</strong> Hello Dr. Abeer! I'm your Cardio AI assistant. How can I help you today?</div>
      </div>
      <div style="display:flex;gap:10px;">
        <input id="chatInput" placeholder="Type your question here..." style="flex:1;padding:10px;border:1px solid #ddd;border-radius:6px;">
        <button id="sendChat" style="padding:10px 20px;background:#007bff;color:white;border:none;border-radius:6px;cursor:pointer;">Send</button>
      </div>
      <div style="margin-top:15px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="quick-question" style="padding:6px 12px;background:#e9ecef;border:1px solid #dee2e6;border-radius:4px;cursor:pointer;">Patient stats</button>
        <button class="quick-question" style="padding:6px 12px;background:#e9ecef;border:1px solid #dee2e6;border-radius:4px;cursor:pointer;">Medication advice</button>
        <button class="quick-question" style="padding:6px 12px;background:#e9ecef;border:1px solid #dee2e6;border-radius:4px;cursor:pointer;">Risk assessment</button>
      </div>
    `);

    // إرسال الرسالة
    $("#sendChat")?.addEventListener("click", sendChatMessage);
    
    // إدخال بالإنتر
    $("#chatInput")?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendChatMessage();
    });
    
    // أسئلة سريعة
    $$(".quick-question").forEach(btn => {
      btn.addEventListener("click", function() {
        const question = this.textContent;
        $("#chatInput").value = question;
        sendChatMessage();
      });
    });
  });
}

function sendChatMessage() {
  const input = $("#chatInput");
  const message = input.value.trim();
  
  if (!message) return;
  
  const chatBox = document.querySelector(".cardio-modal-content div[style*='height:200px']");
  
  // إضافة رسالة المستخدم
  const userMsg = document.createElement("div");
  userMsg.innerHTML = `<strong>You:</strong> ${message}`;
  userMsg.style.marginBottom = "10px";
  userMsg.style.color = "#007bff";
  chatBox.appendChild(userMsg);
  
  // محاكاة رد الذكاء الاصطناعي
  setTimeout(() => {
    const aiResponses = [
      "Based on the patient data, I recommend reviewing the latest ECG results.",
      "The risk assessment shows moderate probability. Consider additional tests.",
      "Medication dosage appears appropriate based on current vitals.",
      "I've analyzed the trends and suggest scheduling a follow-up in 2 weeks.",
      "Patient history indicates good response to current treatment plan."
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const aiMsg = document.createElement("div");
    aiMsg.innerHTML = `<strong>AI:</strong> ${randomResponse}`;
    aiMsg.style.marginBottom = "10px";
    aiMsg.style.color = "#28a745";
    chatBox.appendChild(aiMsg);
    
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);
  
  input.value = "";
  input.focus();
}

/* ================== STATS UPDATER ================== */
function updateStats() {
  const statsElement = $(".doctor-dashboard___3-completed-5-remaining");
  if (statsElement) {
    statsElement.innerText = `${state.completed} completed • ${state.remaining} remaining`;
  }
}

/* ================== ENHANCE INTERACTIVITY ================== */
function enhanceInteractivity() {
  // إضافة تأثير hover على كل العناصر التفاعلية
  const interactiveElements = $$(
    ".doctor-dashboard__button, .doctor-dashboard__button2, .doctor-dashboard__button3, " +
    ".doctor-dashboard__button4, .doctor-dashboard__button5, .doctor-dashboard__button8, " +
    ".doctor-dashboard__container9, .doctor-dashboard__container10, .doctor-dashboard__container11, " +
    ".doctor-dashboard__container13, .doctor-dashboard__container15, .doctor-dashboard__container16, " +
    ".doctor-dashboard__container17, .doctor-dashboard__button14, .doctor-dashboard__button15"
  );
  
  interactiveElements.forEach(el => {
    if (el) {
      el.style.transition = "transform 0.2s, box-shadow 0.2s";
      
      el.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      });
      
      el.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "none";
      });
    }
  });
}

/* ================== INITIALIZATION ================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initializing Cardio AI Dashboard");
  
  // تهيئة كل المكونات
  initNavigation();
  initSearch();
  initNewAppointment();
  initPatientCards();
  initPendingRequests();
  initViewAllButtons();
  initAIAlarm();
  initChatbot();
  enhanceInteractivity();
  
  console.log("✅ All interactions initialized");
});