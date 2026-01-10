/* =====================================
   BOOK EDITOR — DODAWANIE / EDYCJA / USUWANIE
   Architekt: Maciej Maciuszek
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("book-modal");
  const addBtn = document.getElementById("add-book-btn");
  const cancelBtn = document.getElementById("cancel-book");
  const saveBtn = document.getElementById("save-book");

  const titleInput = document.getElementById("book-title");
  const descInput = document.getElementById("book-desc");
  const coverInput = document.getElementById("book-cover");
  const audioInput = document.getElementById("book-audio");

  let editIndex = null; // śledzenie, czy edytujemy książkę

  // === Otwieranie modalu ===
  addBtn.addEventListener("click", () => {
    openModal();
  });

  function openModal(book = null, index = null) {
    modal.classList.remove("hidden");
    editIndex = index;

    if (book) {
      titleInput.value = book.title;
      descInput.value = book.description;
      coverInput.value = book.cover || "";
      audioInput.value = book.audio || "";
    } else {
      titleInput.value = "";
      descInput.value = "";
      coverInput.value = "";
      audioInput.value = "";
    }
  }

  // === Zamykanie ===
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // === Zapis nowej lub edytowanej książki ===
  saveBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const cover = coverInput.value.trim();
    const audio = audioInput.value.trim();

    if (!title) {
      alert("Podaj tytuł książki!");
      return;
    }

    const newBook = { title, description: desc, cover, audio };

    const gate = window.WORLD_PSYCHE.gates[0];

    if (editIndex !== null) {
      gate.books[editIndex] = newBook;
      editIndex = null;
    } else {
      gate.books.push(newBook);
    }

    saveWorld();
    renderWorld(window.WORLD_PSYCHE);
    modal.classList.add("hidden");
  });

  // === Zapis do localStorage ===
  function saveWorld() {
    localStorage.setItem("WORLD_PSYCHE", JSON.stringify(window.WORLD_PSYCHE));
  }

  // === Przywracanie danych ===
  const saved = localStorage.getItem("WORLD_PSYCHE");
  if (saved) {
    try {
      window.WORLD_PSYCHE = JSON.parse(saved);
    } catch (e) {
      console.error("Błąd wczytywania zapisanych danych:", e);
    }
  }

  // === Edycja i usuwanie książek ===
  window.enableBookActions = function () {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = (e) => {
        const index = parseInt(btn.dataset.index);
        const book = window.WORLD_PSYCHE.gates[0].books[index];
        openModal(book, index);
      };
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = (e) => {
        const index = parseInt(btn.dataset.index);
        if (confirm("Na pewno chcesz usunąć tę książkę?")) {
          window.WORLD_PSYCHE.gates[0].books.splice(index, 1);
          saveWorld();
          renderWorld(window.WORLD_PSYCHE);
        }
      };
    });
  };

  // === Pierwsze renderowanie ===
  renderWorld(window.WORLD_PSYCHE);
});
