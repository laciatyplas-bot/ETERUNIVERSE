window.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  const modal = document.getElementById("modal");
  const addBtn = document.getElementById("addBookBtn");
  const exportBtn = document.getElementById("exportBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const titleInput = document.getElementById("bookTitle");
  const descInput = document.getElementById("bookDesc");
  const coverInput = document.getElementById("bookCover");
  const audioInput = document.getElementById("bookAudio");

  let editing = null;

  // 🔄 Załaduj dane z LocalStorage
  const loadData = () => {
    const saved = localStorage.getItem("eterniverse_world_1");
    return saved ? JSON.parse(saved) : WORLD_PSYCHE;
  };

  // 💾 Zapisz dane
  const saveData = () => {
    localStorage.setItem("eterniverse_world_1", JSON.stringify(WORLD_PSYCHE));
  };

  // 🧱 Renderuj świat
  const render = () => {
    app.innerHTML = "";
    WORLD_PSYCHE.gates.forEach(gate => {
      const gateEl = document.createElement("div");
      gateEl.className = "gate";
      gateEl.style.borderColor = gate.color;

      gateEl.innerHTML = `<h2 style="color:${gate.color}">${gate.name}</h2>
        <p>${gate.theme}</p>`;

      gate.books.forEach((book, i) => {
        const b = document.createElement("div");
        b.className = "book";
        b.innerHTML = `
          <div>
            <img src="${book.cover || 'media/covers/default.jpg'}" alt="${book.title}">
            <div><strong>${book.title}</strong><br><small>${book.description}</small></div>
            <audio class="audio" controls src="${book.audio || ''}"></audio>
          </div>
          <div class="book-actions">
            <button data-gate="${gate.id}" data-index="${i}" class="edit">✏️</button>
            <button data-gate="${gate.id}" data-index="${i}" class="delete">🗑️</button>
          </div>
        `;
        gateEl.appendChild(b);
      });

      app.appendChild(gateEl);
    });

    saveData();
  };

  // 🆕 Dodaj nową książkę
  addBtn.onclick = () => {
    editing = null;
    titleInput.value = "";
    descInput.value = "";
    coverInput.value = "";
    audioInput.value = "";
    document.getElementById("modalTitle").textContent = "Nowa książka";
    modal.classList.remove("hidden");
  };

  // 💾 Zapisz książkę
  saveBtn.onclick = () => {
    const newBook = {
      title: titleInput.value,
      description: descInput.value,
      cover: coverInput.value,
      audio: audioInput.value
    };

    if (editing) {
      const gate = WORLD_PSYCHE.gates.find(g => g.id === editing.gateId);
      gate.books[editing.index] = newBook;
    } else {
      WORLD_PSYCHE.gates[0].books.push(newBook);
    }

    saveData();
    render();
    modal.classList.add("hidden");
  };

  // ❌ Anuluj
  cancelBtn.onclick = () => modal.classList.add("hidden");

  // ✏️ / 🗑️ Kliknięcia na książkach
  app.addEventListener("click", e => {
    if (e.target.classList.contains("edit")) {
      const gateId = e.target.dataset.gate;
      const index = e.target.dataset.index;
      const gate = WORLD_PSYCHE.gates.find(g => g.id == gateId);
      const book = gate.books[index];

      editing = { gateId, index };
      titleInput.value = book.title;
      descInput.value = book.description;
      coverInput.value = book.cover;
      audioInput.value = book.audio;
      document.getElementById("modalTitle").textContent = "Edytuj książkę";
      modal.classList.remove("hidden");
    }

    if (e.target.classList.contains("delete")) {
      const gateId = e.target.dataset.gate;
      const index = e.target.dataset.index;
      const gate = WORLD_PSYCHE.gates.find(g => g.id == gateId);
      if (confirm("Usunąć tę książkę?")) {
        gate.books.splice(index, 1);
        saveData();
        render();
      }
    }
  });

  // 📤 Eksport JSON
  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(WORLD_PSYCHE, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "eterniverse_world_psyche.json";
    link.click();
  };

  render();
});
