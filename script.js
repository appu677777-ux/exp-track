// ================= SECURITY PIN =================
const PIN = localStorage.getItem("appPIN") || "2005";

// ================= ELEMENTS =================
const lockScreen = document.getElementById("lock-screen");
const mainApp = document.getElementById("main-app");
const pinInput = document.getElementById("pin-input");
const unlockBtn = document.getElementById("unlock-btn");
const errorMsg = document.getElementById("error-msg");

const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");

const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const balanceEl = document.getElementById("balance");

const chartCanvas = document.getElementById("finance-chart");
const logoutBtn = document.getElementById("logout-btn");

// ================= LOAD DATA =================
let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let chart;

// ================= THEME + LOCKSCREEN =================
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("bg-black", "text-white");
    }

    lockScreen.classList.remove("hidden");
    mainApp.classList.add("hidden");
};

// ================= UNLOCK APP =================
unlockBtn.addEventListener("click", () => {
    if (pinInput.value === PIN) {
        lockScreen.classList.add("hidden");
        mainApp.classList.remove("hidden");
        updateUI();
    } else {
        errorMsg.classList.remove("hidden");
        setTimeout(() => errorMsg.classList.add("hidden"), 2000);
    }
});

// ================= LOGOUT =================
logoutBtn.addEventListener("click", () => {
    mainApp.classList.add("hidden");
    lockScreen.classList.remove("hidden");
    pinInput.value = "";
});

// ================= ADD INCOME =================
incomeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    incomes.push({
        amount: parseFloat(document.getElementById("income-amount").value),
        desc: document.getElementById("income-desc").value,
        date: new Date().toLocaleString(),
    });

    localStorage.setItem("incomes", JSON.stringify(incomes));
    incomeForm.reset();
    updateUI();
});

// ================= ADD EXPENSE =================
expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    expenses.push({
        amount: parseFloat(document.getElementById("expense-amount").value),
        desc: document.getElementById("expense-desc").value,
        date: new Date().toLocaleString(),
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    expenseForm.reset();
    updateUI();
});

// ================= DENOMINATION FUNCTION =================
function convertToDenomination(amount) {
    amount = Math.floor(amount);

    let crore = Math.floor(amount / 10000000);
    let lakh = Math.floor((amount % 10000000) / 100000);
    let thousand = Math.floor((amount % 100000) / 1000);
    let rupees = amount % 1000;

    let parts = [];

    if (crore > 0) parts.push(`${crore} Crore`);
    if (lakh > 0) parts.push(`${lakh} Lakh`);
    if (thousand > 0) parts.push(`${thousand} Thousand`);
    if (rupees > 0 || amount === 0) parts.push(`${rupees} Rupees`);

    return parts.join(" ");
}

// ================= UPDATE UI =================
function updateUI() {
    const totalIncome = incomes.reduce((s, x) => s + x.amount, 0);
    const totalExpenses = expenses.reduce((s, x) => s + x.amount, 0);
    const balance = totalIncome - totalExpenses;

    // DENOMINATION DISPLAY
    totalIncomeEl.textContent = convertToDenomination(totalIncome);
    totalExpensesEl.textContent = convertToDenomination(totalExpenses);
    balanceEl.textContent = convertToDenomination(balance);

    updateChart(totalIncome, totalExpenses, balance);
}

// ================= PIE CHART =================
function updateChart(totalIncome, totalExpenses, balance) {
    if (chart) chart.destroy();

    if (totalIncome <= 0) {
        const ctx = chartCanvas.getContext("2d");
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        ctx.fillStyle = "#777";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Add income to show chart", chartCanvas.width / 2, chartCanvas.height / 2);
        return;
    }

    chart = new Chart(chartCanvas, {
        type: "pie",
        data: {
            labels: ["Expenses", "Balance"],
            datasets: [
                {
                    data: [totalExpenses, balance > 0 ? balance : 0],
                    backgroundColor: ["#EF4444", "#10B981"],
                },
            ],
        },
    });
}







