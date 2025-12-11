// Security PIN
const PIN = localStorage.getItem("appPIN") || "2005";


// Elements
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

// Load saved data
let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let chart;

// Show lock at start
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("bg-black", "text-white");
    }

    lockScreen.classList.remove("hidden");
    mainApp.classList.add("hidden");
};

// Unlock App
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

// Logout
logoutBtn.addEventListener("click", () => {
    mainApp.classList.add("hidden");
    lockScreen.classList.remove("hidden");
    pinInput.value = "";
});

// Add Income
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

// Add Expense
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

// Update Main Page UI
function updateUI() {
    const totalIncome = incomes.reduce((s, x) => s + x.amount, 0);
    const totalExpenses = expenses.reduce((s, x) => s + x.amount, 0);
    const balance = totalIncome - totalExpenses;

    totalIncomeEl.textContent = `₹${totalIncome.toFixed(2)}`;
    totalExpensesEl.textContent = `₹${totalExpenses.toFixed(2)}`;
    balanceEl.textContent = `₹${balance.toFixed(2)}`;

    updateChart(totalIncome, totalExpenses, balance);
}

// Chart Update
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
