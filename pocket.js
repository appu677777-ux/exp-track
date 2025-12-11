// HTML elements
const noteInput = document.getElementById("note-input");
const noteType = document.getElementById("note-type");
const addNoteBtn = document.getElementById("add-note-btn");
const noteList = document.getElementById("note-list");

// Load notes from localStorage
let notes = JSON.parse(localStorage.getItem("pocketNotes")) || [];

// Load notes when page opens
window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("bg-black", "text-white");
    }

    renderNotes();
};

// Add note
addNoteBtn.addEventListener("click", () => {
    const text = noteInput.value.trim();
    const type = noteType.value;

    if (text === "") {
        alert("Please enter a note.");
        return;
    }

    notes.push({
        text,
        type,
        id: Date.now()
    });

    localStorage.setItem("pocketNotes", JSON.stringify(notes));

    noteInput.value = "";
    renderNotes();
});

// Render notes in UI
function renderNotes() {
    noteList.innerHTML = "";

    if (notes.length === 0) {
        noteList.innerHTML = `
            <p class="text-gray-500 text-center">No notes available...</p>
        `;
        return;
    }

    notes.forEach((note) => {
        const div = document.createElement("div");

        // Animated initial state
        div.className =
            "note-enter flex justify-between items-center p-3 rounded border bg-gray-50";

        div.innerHTML = `
            <div>
                <p class="font-medium">${note.text}</p>
                <span class="text-xs px-2 py-1 rounded ${note.type === "income"
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }">${note.type}</span>
            </div>

            <button class="delete-btn text-white bg-red-500 px-3 py-1 rounded"
                    data-id="${note.id}">
                Delete
            </button>
        `;

        noteList.appendChild(div);

        // Apply fade + slide animation
        requestAnimationFrame(() => {
            div.classList.add("note-enter-active");
        });
    });

    addDeleteEvents();
}


// Delete note
function addDeleteEvents() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);

            const noteDiv = e.target.parentElement;

            // Add exit animation
            noteDiv.classList.add("note-exit");
            requestAnimationFrame(() => {
                noteDiv.classList.add("note-exit-active");
            });

            // Remove from UI after animation
            setTimeout(() => {
                notes = notes.filter((note) => note.id !== id);
                localStorage.setItem("pocketNotes", JSON.stringify(notes));
                renderNotes();
            }, 300); // Match this duration with CSS transition
        });
    });
}

