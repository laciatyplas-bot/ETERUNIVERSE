/* =====================================
   BOOK EDITOR — DODAWANIE / EDYCJA / USUWANIE v2.0
   Architekt: Maciej Maciuszek
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  // === ELEMENTY DOM ===
  const modal = document.getElementById("modal");
  const addBookBtn = document.getElementById("addBookBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const modalTitle = document.getElementById("modalTitle");
  const gateSelect = document.getElementById("gateSelect");
  const bookTitle = document.getElementById("bookTitle");
  const bookDesc = document.getElementById("bookDesc");
  const bookCover = document.getElementById("bookCover");
  const bookAudio = document.getElementById("bookAudio");

  let currentEdit = null; // null = nowa książka, obiekt = edycja

  // === FUNKCJE ===
  function openModal(book = null, gateId = null) {
    modal.classList.remove("hidden");
    currentEdit = book;

    // Domyślne wartości
    modalTitle.textContent = book ? "Edytuj książkę" : "Nowa książka";
    bookTitle.value = book?.title || "";
    bookDesc.value = book?.description || "";
    bookCover.value = book?.cover || "";
    bookAudio.value = book?.audio || "";

    // Ustaw bramę w select
    if (gateId) gateSelect.value = gateId;
  }

  function closeModal() {
    modal.classList.add("hidden");
    currentEdit = null;
  }

  function saveBook() {
    const title = bookTitle.value.trim();
    if (!title) {
      alert("Tytuł jest wymagany!");
      return;
    }

    const newBook = {
      title,
      description: bookDesc.value.trim(),
      cover: bookCover.value.trim() || "media/covers/default.jpg",
      audio: bookAudio.value.trim() || "",
      status: "idea",
      chapters: currentEdit?.chapters || []
    };

    const gateId = parseInt(gateSelect.value);
    const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);

    if (!gate) {
      alert("Nie wybrano poprawnej bramy!");
      return;
    }

    if (currentEdit) {
      // Edycja istniejącej
      Object.assign(currentEdit, newBook);
    } else {
      // Nowa książka
      gate.books.push(newBook);
    }

    saveWorldData();
    renderWorld(window.WORLD_PSYCHE);
    closeModal();
  }

  function saveWorldData() {
    try {
      localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE", JSON.stringify(window.WORLD_PSYCHE));
      console.log("Zapisano stan świata do localStorage");
    } catch (e) {
      console.error("Błąd zapisu:", e);
    }
  }

  function loadWorldData() {
    const saved = localStorage.getItem("ETERNIVERSE_WORLD_PSYCHE");
    if (saved) {
      try {
        window.WORLD_PSYCHE = JSON.parse(saved);
        console.log("Wczytano zapisany stan świata");
      } catch (e) {
        console.error("Błąd wczytywania:", e);
      }
    }
  }

  // === EVENTY ===
  if (addBookBtn) {
    addBookBtn.addEventListener("click", () => openModal(null, 1)); // Domyślnie brama 1
  }

  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (saveBtn) saveBtn.addEventListener("click", saveBook);

  // Ładuj dane przy starcie
  loadWorldData();

  // === OBSŁUGA EDYCJI/USUWANIA (dynamicznie po renderze) ===
  window.enableBookActions = function () {
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = (e) => {
        const index = parseInt(btn.dataset.index);
        const gateId = parseInt(btn.dataset.gate);
        const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
        const book = gate?.books[index];
        if (book) openModal(book, gateId);
      };
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = (e) => {
        if (!confirm("Na pewno usunąć książkę?")) return;
        const index = parseInt(btn.dataset.index);
        const gateId = parseInt(btn.dataset.gate);
        const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
        if (gate) {
          gate.books.splice(index, 1);
          saveWorldData();
          renderWorld(window.WORLD_PSYCHE);
        }
      };
    });
  };

  // Po załadowaniu świata – włącz akcje edycji/usuwania
  document.addEventListener("worldRendered", () => {
    window.enableBookActions();
  });
});
