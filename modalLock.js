// ================= HISTORY PIN MODAL =================
const historyBtn = document.getElementById("history-btn");
const historyModal = document.getElementById("history-modal");
const historyPinInput = document.getElementById("history-pin-input");
const historySubmit = document.getElementById("history-submit");
const historyCancel = document.getElementById("history-cancel");
const historyPinError = document.getElementById("history-pin-error");

// Use same app PIN for consistency
const HISTORY_PIN = "0005";

// OPEN MODAL
historyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    historyModal.classList.remove("hidden");
    historyModal.classList.add("flex");
    historyPinInput.value = "";
    historyPinError.classList.add("hidden");
    historyPinInput.focus();
});

// CANCEL
historyCancel.addEventListener("click", () => {
    historyModal.classList.add("hidden");
});

// SUBMIT PIN
historySubmit.addEventListener("click", () => {
    if (historyPinInput.value === HISTORY_PIN) {
        window.location.href = "history.html";
    } else {
        historyPinError.classList.remove("hidden");
        historyPinInput.value = "";
    }
});