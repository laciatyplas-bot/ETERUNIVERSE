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

  let gateSelect; // selektor bram
  let editing = null;

  // 🔄 Załaduj dane z LocalStorage
  const loadData = () => {
    const saved = localStorage.getItem("eterniverse_world_1");
    if (saved) {
      const parsed = JSON.parse(saved);
      WORLD_PSYCHE.gates = parsed.gates;
    }
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
        <p>${gate.sub || gate.theme || ""}</p>`;

      gate.books.forEach((book, i) => {
        const b = document.createElement("div");
        b.className = "book";
        b.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${book.cover || 'media/covers/default.jpg'}" alt="${book.title}">
            <div>
              <strong>${book.title}</strong><br>
              <small>${book.description || ""}</small><br>
              <audio class="audio" controls src="${book.audio || ''}"></audio>
            </div>
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

    // Dodaj selektor bramy
    let selectorHTML = `<label>Wybierz bramę:</label><select id="gateSelect">`;
    WORLD_PSYCHE.gates.forEach(g => {
      selectorHTML += `<option value="${g.id}" style="color:${g.color}">${g.name}</option>`;
    });
    selectorHTML += `</select>`;
    const modalContent = modal.querySelector(".modal-content");
    if (!modal.querySelector("#gateSelect")) {
      modalContent.insertAdjacentHTML("afterbegin", selectorHTML);
    }

    modal.classList.remove("hidden");
    gateSelect = document.getElementById("gateSelect");
  };

  // 💾 Zapisz książkę
  saveBtn.onclick = () => {
    const newBook = {
      title: titleInput.value,
      description: descInput.value,
      cover: coverInput.value,
      audio: audioInput.value
    };

    const selectedGateId = gateSelect ? gateSelect.value : (editing ? editing.gateId : WORLD_PSYCHE.gates[0].id);
    const gate = WORLD_PSYCHE.gates.find(g => g.id == selectedGateId);

    if (editing) {
      gate.books[editing.index] = newBook;
    } else {
      gate.books.push(newBook);
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
      gateSelect = null;
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

  // 🔄 Start
  loadData();
  render();
});
