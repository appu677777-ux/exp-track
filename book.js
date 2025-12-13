// ELEMENTS
const entryType = document.getElementById("entry-type");
const entryName = document.getElementById("entry-name");
const entryAmount = document.getElementById("entry-amount");
const addEntryBtn = document.getElementById("add-entry-btn");
const entryList = document.getElementById("entry-list");

// LOAD DATA FROM LOCAL STORAGE
let entries = JSON.parse(localStorage.getItem("bookEntries")) || [];

// RENDER ENTRIES WITH ANIMATION
function renderEntries() {
  entryList.innerHTML = "";

  if (entries.length === 0) {
    entryList.innerHTML =
      `<p class="text-gray-500 text-center">No entries yet</p>`;
    return;
  }

  entries.forEach((entry, index) => {
    const div = document.createElement("div");

    div.className = `note-enter flex justify-between items-center p-3 rounded border
      ${entry.type === "give"
        ? "border-red-300 bg-red-50"
        : "border-green-300 bg-green-50"}`;

    div.innerHTML = `
      <div>
        <p class="font-semibold">${entry.name}</p>
        <p class="text-sm">
          ${entry.type === "give" ? "To Give" : "To Get"}
          <span class="font-medium">₹${entry.amount}</span>
        </p>
      </div>

      <button
        class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        onclick="markDone(${index})">
        Done
      </button>
    `;

    entryList.appendChild(div);

    requestAnimationFrame(() => {
      div.classList.add("note-enter-active");
    });
  });
}

// ADD ENTRY
addEntryBtn.addEventListener("click", () => {
  const type = entryType.value;
  const name = entryName.value.trim();
  const amount = entryAmount.value.trim();

  if (!name) {
    alert("Please enter a name");
    return;
  }

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  entries.push({ type, name, amount });
  localStorage.setItem("bookEntries", JSON.stringify(entries));

  entryName.value = "";
  entryAmount.value = "";
  renderEntries();
});

// MARK ENTRY AS DONE WITH EXIT ANIMATION
function markDone(index) {
  const item = entryList.children[index];
  if (!item) return;

  item.classList.add("note-exit");
  requestAnimationFrame(() => {
    item.classList.add("note-exit-active");
  });

  setTimeout(() => {
    entries.splice(index, 1);
    localStorage.setItem("bookEntries", JSON.stringify(entries));
    renderEntries();
  }, 300);
}

// INITIAL LOAD
renderEntries();
