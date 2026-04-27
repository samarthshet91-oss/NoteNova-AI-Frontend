const defaultNotes = [
  {
    title: "Python Unit 1 Notes",
    subject: "CSE",
    uploader: "Aarav Mehta",
    rating: 4.9,
    downloads: "2.4k",
    description: "Variables, data types, control flow, functions, and beginner-friendly examples."
  },
  {
    title: "DBMS ER Model",
    subject: "CSE",
    uploader: "Isha Rao",
    rating: 4.8,
    downloads: "1.9k",
    description: "Entity relationships, attributes, constraints, keys, and clean diagram tips."
  },
  {
    title: "Calculus Quick Revision",
    subject: "Maths",
    uploader: "Kabir Singh",
    rating: 4.7,
    downloads: "1.5k",
    description: "Limits, differentiation, integration rules, and rapid formula revision."
  },
  {
    title: "AI Search Algorithms",
    subject: "AI",
    uploader: "Naina Kapoor",
    rating: 5.0,
    downloads: "3.1k",
    description: "BFS, DFS, uniform cost, greedy search, A*, and comparison notes."
  },
  {
    title: "Physics Optics Notes",
    subject: "Physics",
    uploader: "Rohan Das",
    rating: 4.6,
    downloads: "1.2k",
    description: "Ray optics, lenses, mirrors, interference, diffraction, and solved examples."
  }
];

const storageKey = "notenova-notes";
const notesGrid = document.querySelector("#notesGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#noteSearch");
const filterButtons = document.querySelectorAll(".chip");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const uploadForm = document.querySelector("#uploadForm");
const toast = document.querySelector("#toast");

let activeFilter = "All";
let notes = loadNotes();

function loadNotes() {
  const savedNotes = localStorage.getItem(storageKey);

  if (!savedNotes) {
    localStorage.setItem(storageKey, JSON.stringify(defaultNotes));
    return defaultNotes;
  }

  try {
    return JSON.parse(savedNotes);
  } catch {
    localStorage.setItem(storageKey, JSON.stringify(defaultNotes));
    return defaultNotes;
  }
}

function saveNotes() {
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

function renderNotes() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredNotes = notes.filter((note) => {
    const matchesFilter = activeFilter === "All" || note.subject === activeFilter;
    const searchableText = `${note.title} ${note.subject} ${note.uploader} ${note.description}`.toLowerCase();
    return matchesFilter && searchableText.includes(query);
  });

  notesGrid.innerHTML = filteredNotes.map(createNoteCard).join("");
  emptyState.style.display = filteredNotes.length ? "none" : "block";

  document.querySelectorAll(".summary-btn").forEach((button) => {
    button.addEventListener("click", () => openModal("summaryModal"));
  });

  document.querySelectorAll(".view-btn").forEach((button) => {
    button.addEventListener("click", () => showToast("Preview opened in prototype mode."));
  });
}

function createNoteCard(note) {
  return `
    <article class="note-card">
      <span class="subject-pill">${note.subject}</span>
      <h3>${note.title}</h3>
      <p>${note.description}</p>
      <div class="note-meta">
        <span>👤 ${note.uploader}</span>
        <span>⭐ ${note.rating}</span>
        <span>⬇ ${note.downloads}</span>
      </div>
      <div class="card-actions">
        <button class="view-btn" type="button">View Notes</button>
        <button class="summary-btn" type="button">AI Summary</button>
      </div>
    </article>
  `;
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal-backdrop.show")) {
    document.body.classList.remove("modal-open");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2300);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderNotes();
  });
});

searchInput.addEventListener("input", renderNotes);

document.querySelectorAll(".open-upload").forEach((button) => {
  button.addEventListener("click", () => openModal("uploadModal"));
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.dataset.close));
});

document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeModal(backdrop.id);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.show").forEach((modal) => closeModal(modal.id));
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

uploadForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.querySelector("#uploadTitleInput").value.trim();
  const subject = document.querySelector("#uploadSubject").value;
  const description = document.querySelector("#uploadDescription").value.trim();

  notes = [
    {
      title,
      subject,
      uploader: "You",
      rating: 5.0,
      downloads: "0",
      description
    },
    ...notes
  ];

  saveNotes();
  renderNotes();
  uploadForm.reset();
  closeModal("uploadModal");
  showToast("Note uploaded successfully!");
});

renderNotes();