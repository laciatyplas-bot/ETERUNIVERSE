// ==========================================
// ⚙️ CORE ENGINE — ETERNIVERSE SYSTEM
// ŚWIAT I: PSYCHE / INTERSEEKER
// Architekt: Maciej Maciuszek
// ==========================================

function waitForWorld(callback) {
  if (window.WORLD_PSYCHE) callback();
  else setTimeout(() => waitForWorld(callback), 200);
}

waitForWorld(() => {
  console.log("⚙️ Ładowanie systemu redakcyjnego PSYCHE...");

  const app = document.getElementById("app");
  const modal = document.getElementById("modal");

  const addBtn = document.getElementById("addBookBtn");
  const exportBtn = document.getElementById("exportBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  const gateSelect = document.getElementById("gateSelect");
  const titleInput = document.getElementById("bookTitle");
  const descInput = document.getElementById("bookDesc");
  const coverInput = document.getElementById("bookCover");
  const audioInput = document.getElementById("bookAudio");

  let editing = null;

  // ==========================================
  // 🔁 STATUS SYSTEM
  // ==========================================
  const STATUS = {
    published: { label: "Opublikowana", color: "#3AED8D" },
    ready: { label: "Gotowa", color: "#28D3C6" },
    writing: { label: "W trakcie pisania", color: "#FFD700" },
    draft: { label: "Szkic", color: "#F78D2F" },
    idea: { label: "Koncepcja", color: "#FF5A5A" },
  };

  // ==========================================
  // 🔄 Ładowanie / zapisywanie danych
  // ==========================================
  const loadData = () => {
    const saved = localStorage.getItem("eterniverse_psyche");
    if (saved) WORLD_PSYCHE.gates = JSON.parse(saved).gates;
  };

  const saveData = () => {
    localStorage.setItem("eterniverse_psyche", JSON.stringify(WORLD_PSYCHE));
  };

  // ==========================================
  // 🧱 RENDER
  // ==========================================
  function render() {
    app.innerHTML = "";

    WORLD_PSYCHE.gates.forEach((gate) => {
      const gateBox = document.createElement("div");
      gateBox.className = "gate";
      gateBox.style.borderColor = gate.color;

      gateBox.innerHTML = `
        <h2 style="color:${gate.color}">${gate.name}</h2>
        <p class="sub">${gate.sub || ""}</p>
      `;

      gate.books.forEach((book, i) => {
        const bookEl = document.createElement("div");
        bookEl.className = "book";

        const statusInfo = STATUS[book.status] || { label: "Nieznany", color: "#ccc" };

        bookEl.innerHTML = `
          <div class="book-left">
            <img src="${book.cover || 'media/covers/default.jpg'}" alt="okładka">
            <div class="book-info">
              <strong>${book.title}</strong>
              <p>${book.description || ""}</p>
              <span class="status" style="color:${statusInfo.color}">● ${statusInfo.label}</span>
              <audio class="audio" controls src="${book.audio || ""}"></audio>
            </div>
          </div>
          <div class="book-actions">
            <button class="edit" data-gate="${gate.id}" data-index="${i}">✏️</button>
            <button class="delete" data-gate="${gate.id}" data-index="${i}">🗑️</button>
          </div>
        `;
        gateBox.appendChild(bookEl);
      });

      app.appendChild(gateBox);
    });

    saveData();
  }

  // ==========================================
  // ➕ DODAWANIE KSIĄŻKI
  // ==========================================
  addBtn.onclick = () => {
    modal.classList.remove("hidden");
    editing = null;
    titleInput.value = "";
    descInput.value = "";
    coverInput.value = "";
    audioInput.value = "";

    gateSelect.innerHTML = "";
    WORLD_PSYCHE.gates.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      opt.style.color = g.color;
      gateSelect.appendChild(opt);
    });
  };

  // ==========================================
  // 💾 ZAPISYWANIE KSIĄŻKI
  // ==========================================
  saveBtn.onclick = () => {
    const newBook = {
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      cover: coverInput.value.trim(),
      audio: audioInput.value.trim(),
      status: "idea", // domyślnie nowa książka = koncepcja
    };

    if (!newBook.title) {
      alert("Podaj tytuł książki!");
      return;
    }

    const gateId = editing ? editing.gateId : gateSelect.value;
    const gate = WORLD_PSYCHE.gates.find((g) => g.id == gateId);

    if (editing) gate.books[editing.index] = newBook;
    else gate.books.push(newBook);

    modal.classList.add("hidden");
    saveData();
    render();
  };

  cancelBtn.onclick = () => modal.classList.add("hidden");

  // ==========================================
  // ✏️ EDYCJA I USUWANIE
  // ==========================================
  app.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit")) {
      const gateId = e.target.dataset.gate;
      const index = e.target.dataset.index;
      const gate = WORLD_PSYCHE.gates.find((g) => g.id == gateId);
      const book = gate.books[index];

      editing = { gateId, index };
      titleInput.value = book.title;
      descInput.value = book.description;
      coverInput.value = book.cover;
      audioInput.value = book.audio;
      modal.classList.remove("hidden");
    }

    if (e.target.classList.contains("delete")) {
      const gateId = e.target.dataset.gate;
      const index = e.target.dataset.index;
      const gate = WORLD_PSYCHE.gates.find((g) => g.id == gateId);

      if (confirm("Usunąć tę książkę?")) {
        gate.books.splice(index, 1);
        saveData();
        render();
      }
    }
  });

  // ==========================================
  // 💾 EKSPORT DO JSON
  // ==========================================
  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(WORLD_PSYCHE, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "eterniverse_psyche_export.json";
    link.click();
  };

  // ==========================================
  // 🚀 START SYSTEMU
  // ==========================================
  loadData();
  render();
  console.log("🚀 ETERNIVERSE — PSYCHE SYSTEM ONLINE");
});
