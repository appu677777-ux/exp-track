// ===================== LOAD SETTINGS =====================
let savedPIN = localStorage.getItem("appPIN") || "2005";
let theme = localStorage.getItem("theme") || "light";

if (theme === "dark") document.body.classList.add("bg-black", "text-white");

// ===================== CHANGE PIN =====================
const changePINBtn = document.getElementById("change-pin-btn");
const pinMsg = document.getElementById("pin-msg");

changePINBtn.addEventListener("click", () => {
    const oldPin = document.getElementById("old-pin").value;
    const newPin = document.getElementById("new-pin").value;
    const confirmPin = document.getElementById("confirm-pin").value;

    if (oldPin !== savedPIN) {
        pinMsg.textContent = "Old PIN incorrect.";
        pinMsg.className = "text-red-600";
        return;
    }

    if (newPin.length < 4) {
        pinMsg.textContent = "PIN must be at least 4 digits.";
        pinMsg.className = "text-red-600";
        return;
    }

    if (newPin !== confirmPin) {
        pinMsg.textContent = "New PIN does not match.";
        pinMsg.className = "text-red-600";
        return;
    }

    localStorage.setItem("appPIN", newPin);
    pinMsg.textContent = "PIN updated successfully!";
    pinMsg.className = "text-green-600";
});

// ===================== THEME TOGGLE =====================
document.getElementById("theme-toggle").addEventListener("click", () => {
    if (theme === "light") {
        theme = "dark";
        document.body.classList.add("bg-black", "text-white");
    } else {
        theme = "light";
        document.body.classList.remove("bg-black", "text-white");
    }
    localStorage.setItem("theme", theme);
});

// ===================== EXPORT JSON =====================
document.getElementById("export-json").addEventListener("click", () => {
    const data = {
        incomes: JSON.parse(localStorage.getItem("incomes") || "[]"),
        expenses: JSON.parse(localStorage.getItem("expenses") || "[]"),
        notes: JSON.parse(localStorage.getItem("pocketNotes") || "[]"),
        pin: localStorage.getItem("appPIN") || "2005",
        theme: localStorage.getItem("theme") || "light"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
});

// ===================== EXPORT CSV =====================
document.getElementById("export-csv").addEventListener("click", () => {
    const incomes = JSON.parse(localStorage.getItem("incomes") || "[]");
    const expenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    let csv = "Type,Amount,Description,Date\n";

    incomes.forEach(x => csv += `Income,${x.amount},${x.desc},${x.date}\n`);
    expenses.forEach(x => csv += `Expense,${x.amount},${x.desc},${x.date}\n`);

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
});

// ===================== IMPORT DATA =====================
document.getElementById("import-btn").addEventListener("click", () => {
    const file = document.getElementById("import-file").files[0];
    const msg = document.getElementById("import-msg");

    if (!file) {
        msg.textContent = "Please select a JSON file.";
        msg.className = "text-red-600";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);

            localStorage.setItem("incomes", JSON.stringify(data.incomes || []));
            localStorage.setItem("expenses", JSON.stringify(data.expenses || []));
            localStorage.setItem("pocketNotes", JSON.stringify(data.notes || []));
            localStorage.setItem("appPIN", data.pin || "2005");
            localStorage.setItem("theme", data.theme || "light");

            msg.textContent = "Data imported successfully!";
            msg.className = "text-green-600";
        } catch {
            msg.textContent = "Invalid file format.";
            msg.className = "text-red-600";
        }
    };

    reader.readAsText(file);
});

// ===================== CLEAR ALL DATA =====================
document.getElementById("clear-all").addEventListener("click", () => {
    if (!confirm("Are you sure you want to delete ALL data?")) return;

    localStorage.clear();
    alert("All data removed!");
    location.reload();
});
