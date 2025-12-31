/*************************************************
 * Cardio AI – My Patients Page
 * Vanilla JavaScript
 *************************************************/
console.log("✅ script.js loaded");

/* ========== HELPERS ========= */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ========== STATE (localStorage) ========= */
let state = {
  patients: [],
  appointments: [],
  currentPatient: null
};

/* ========== INIT ========= */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DOM Loaded");
  loadState();
  initSearch();
  initStatsFilters();
  initPatientCards();
  initNewAppointment();
  initSidebarNav();
  initChatbot();
});

/* ========== LOAD / SAVE ========= */
function loadState() {
  state.patients = JSON.parse(localStorage.getItem("patients")) || mockPatients();
  state.appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  console.log("📦 State Loaded", state);
}

function saveState() {
  localStorage.setItem("patients", JSON.stringify(state.patients));
  localStorage.setItem("appointments", JSON.stringify(state.appointments));
}

/* ========== MOCK DATA ========= */
function mockPatients() {
  return [
    { id: 1, name: "Sarah Johnson", status: "active", critical: false },
    { id: 2, name: "Robert Wilson", status: "inactive", critical: true },
    { id: 3, name: "Robert Wilson", status: "critical", critical: true }
  ];
}

/* ========== SEARCH ========= */
function initSearch() {
  const box = $(".my-patient__button2");
  const fake = $(".my-patient__find-new-patient");
  if (!box || !fake) return;

  const input = document.createElement("input");
  input.placeholder = "Search by name, email, or ID...";
  input.style.cssText = "width:100%;height:100%;padding-left:40px";

  fake.replaceWith(input);

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    console.log("🔍 Searching:", q);
    filterPatients(q);
  });
}

function filterPatients(q) {
  $$(".my-patient__container6,.my-patient__container7,.my-patient__container8")
    .forEach(card => {
      const name = card.innerText.toLowerCase();
      card.style.display = name.includes(q) ? "block" : "none";
    });
}

/* ========== STATS FILTER ========= */
function initStatsFilters() {
  $(".my-patient__container2")?.addEventListener("click", () => showAll());
  $(".my-patient__container4")?.addEventListener("click", () => showCritical());
}

function showAll() {
  console.log("📊 Show all patients");
  $$(".my-patient__container6,.my-patient__container7,.my-patient__container8")
    .forEach(c => c.style.display = "block");
}

function showCritical() {
  console.log("🚨 Show critical patients");
  showAll();
  $$(".my-patient__container6,.my-patient__container7")
    .forEach(c => c.style.display = "none");
}

/* ========== PATIENT CARDS ========= */
function initPatientCards() {
  $$(".my-patient__container6,.my-patient__container7,.my-patient__container8")
    .forEach(card => {
      // View Chart Button
      const viewChartBtn = card.querySelector(".my-patient__button3");
      if (viewChartBtn) {
        viewChartBtn.style.cursor = "pointer";
        viewChartBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          window.location.href = "../patient-search/view-patient-hisoty/index.html";
        });
      }

      // Open Records Button
      const openRecordsBtn = card.querySelector(".my-patient__button4");
      if (openRecordsBtn) {
        openRecordsBtn.style.cursor = "pointer";
        openRecordsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          window.location.href = "../patient-search/view-patient-hisoty/index.html";
        });
      }

      card.addEventListener("click", () => {
        const name = card.querySelector("div[class*='johnson'],div[class*='wilson']")?.innerText;
        state.currentPatient = name;
        console.log("👤 Open profile:", name);
        openModal(profileHTML(name));
      });
    });
}

/* ========== NEW APPOINTMENT ========= */
function initNewAppointment() {
  $(".my-patient__button")?.addEventListener("click", () => {
    openModal(`
      <h3>New Appointment</h3>
      <input id="apptName" placeholder="Patient name"/><br/><br/>
      <input id="apptDate" type="date"/><br/><br/>
      <button id="saveAppt">Save</button>
    `);

    $("#saveAppt").onclick = () => {
      const n = $("#apptName").value;
      const d = $("#apptDate").value;
      if (!n || !d) return alert("Required field");

      state.appointments.push({ n, d });
      saveState();
      console.log("➕ Appointment added", n, d);
      closeModal();
    };
  });
}

/* ========== MODAL ========= */
function openModal(html) {
  closeModal();
  const m = document.createElement("div");
  m.id = "modal";
  m.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.4);
    display:flex;align-items:center;justify-content:center;
  `;
  m.innerHTML = `<div style="background:#fff;padding:20px">${html}</div>`;
  document.body.appendChild(m);

  m.addEventListener("click", e => e.target === m && closeModal());
  document.addEventListener("keydown", escClose);
}

function closeModal() {
  document.getElementById("modal")?.remove();
  document.removeEventListener("keydown", escClose);
}

function escClose(e) {
  if (e.key === "Escape") closeModal();
}

/* ========== PROFILE ========= */
function profileHTML(name) {
  return `
    <h3>${name}</h3>
    <p>Age / Email editable (mock)</p>
    <button onclick="alert('Saved (mock)')">Save</button>
  `;
}

/* ========== SIDEBAR NAV ========= */
function initSidebarNav() {
  // Dashboard Button
  const dashboardBtn = $(".my-patient__button9");
  if (dashboardBtn) {
    dashboardBtn.style.cursor = "pointer";
    dashboardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.href = "../dashboadrd/dashboard.html";
    });
    dashboardBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }
  
  // Patient Search Button
  const patientSearchBtn = $(".my-patient__button5");
  if (patientSearchBtn) {
    patientSearchBtn.style.cursor = "pointer";
    patientSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.href = "../patient-search/patient-search/patient-search.html";
    });
    patientSearchBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }
  
  // My Patients Button (current page - no action needed)
  
  // Requests Button
  const requestsBtn = $(".my-patient__button7");
  if (requestsBtn) {
    requestsBtn.style.cursor = "pointer";
    requestsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.href = "../my-requests/my-requests.html";
    });
    requestsBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }
  
  // Schedule Button
  const scheduleBtn = $(".my-patient__button8");
  if (scheduleBtn) {
    scheduleBtn.style.cursor = "pointer";
    scheduleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      location.href = "../schedule/schedule.html";
    });
    scheduleBtn.querySelectorAll("*").forEach(child => {
      child.style.pointerEvents = "none";
    });
  }
}

/* ========== CHATBOT ========= */
function initChatbot() {
  $(".my-patient__container-279")?.addEventListener("click", () => {
    openModal(`
      <h3>AI Chatbot</h3>
      <p>Patient: ${state.currentPatient || "None"}</p>
      <p>AI: Elevated HR detected (mock)</p>
    `);
  });
}
