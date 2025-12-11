// Load saved data
let incomes = JSON.parse(localStorage.getItem('incomes')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const transactionList = document.getElementById("transaction-list");
const clearAllBtn = document.getElementById("clear-all-btn");

// Load UI when page opens
window.onload = () => {
    loadHistory();
};

// Load transaction history
function loadHistory() {
    transactionList.innerHTML = "";

    const all = [
        ...incomes.map((x, i) => ({
            ...x,
            type: "Income",
            color: "text-green-600",
            array: "incomes",
            index: i
        })),
        ...expenses.map((x, i) => ({
            ...x,
            type: "Expense",
            color: "text-red-600",
            array: "expenses",
            index: i
        })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    all.forEach(item => {
        const li = document.createElement("li");
        li.className = `flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b ${item.color}`;

        li.innerHTML = `
            <span>${item.type}: ${item.desc} - ₹${item.amount.toFixed(2)} (${item.date})</span>
            <div class="flex space-x-2 mt-2 md:mt-0">
                <button class="edit-btn bg-blue-500 text-white px-2 py-1 rounded"
                    data-array="${item.array}" data-index="${item.index}">
                    Edit
                </button>

                <button class="delete-btn bg-red-500 text-white px-2 py-1 rounded"
                    data-array="${item.array}" data-index="${item.index}">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(li);
    });

    addButtonEvents();
}

// Add edit & delete button functions
function addButtonEvents() {

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.onclick = e => {
            const arr = e.target.dataset.array;
            const index = parseInt(e.target.dataset.index);
            const data = arr === "incomes" ? incomes[index] : expenses[index];

            const newAmt = prompt("Enter new amount:", data.amount);
            const newDesc = prompt("Enter new description:", data.desc);

            if (newAmt && newDesc && !isNaN(newAmt)) {
                data.amount = parseFloat(newAmt);
                data.desc = newDesc;

                localStorage.setItem(arr, JSON.stringify(arr === "incomes" ? incomes : expenses));
                loadHistory();
            }
        };
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.onclick = e => {
            if (!confirm("Delete this transaction?")) return;

            const arr = e.target.dataset.array;
            const index = parseInt(e.target.dataset.index);

            if (arr === "incomes") {
                incomes.splice(index, 1);
                localStorage.setItem("incomes", JSON.stringify(incomes));
            } else {
                expenses.splice(index, 1);
                localStorage.setItem("expenses", JSON.stringify(expenses));
            }

            loadHistory();
        };
    });
}

// Clear all data button
clearAllBtn.addEventListener("click", () => {
    if (!confirm("Are you sure you want to clear ALL data?")) return;

    incomes = [];
    expenses = [];

    localStorage.removeItem("incomes");
    localStorage.removeItem("expenses");

    loadHistory();
});
