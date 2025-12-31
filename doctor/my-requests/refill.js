document.addEventListener("DOMContentLoaded", function () {

  // الفريم الرئيسي
  const modal = document.querySelector(".refill-request");

  // زرار X فوق
  const closeIcon = document.querySelector(".refill-request__x");

  // الأزرار
  const cancelBtn = document.querySelector(".refill-request__button2");
  const rejectBtn = document.querySelector(".refill-request__button3");
  const approveBtn = document.querySelector(".refill-request__button4");

  // حقل الملاحظات (div مش textarea)
  const notesField = document.querySelector(
    ".refill-request__enter-your-response-or-notes-for-this-request"
  );

  // دالة غلق الفريم
  function closeModal() {
    if (modal) modal.style.display = "none";
  }

  // X
  if (closeIcon) {
    closeIcon.addEventListener("click", closeModal);
  }

  // Cancel
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal);
  }

  // Reject
  if (rejectBtn) {
    rejectBtn.addEventListener("click", function () {
      const notes = notesField ? notesField.innerText : "";
      alert("Request Rejected ❌\nNotes: " + notes);
      closeModal();
    });
  }

  // Approve
  if (approveBtn) {
    approveBtn.addEventListener("click", function () {
      const notes = notesField ? notesField.innerText : "";
      alert("Request Approved ✅\nNotes: " + notes);
      closeModal();
    });
  }

  // نخلي الـ notes قابلة للكتابة
  if (notesField) {
    notesField.setAttribute("contenteditable", "true");
    notesField.addEventListener("focus", function () {
      if (this.innerText.includes("Enter your response")) {
        this.innerText = "";
      }
    });
  }

});
