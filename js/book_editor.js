/* =====================================
   BOOK EDITOR — PANEL DODAWANIA KSIĄŻEK
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

  // otwieranie
  addBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  // zamykanie
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // zapis nowej książki
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

    // dodaj do BRAMY 1
    window.WORLD_PSYCHE.gates[0].books.push(newBook);

    // zapisz w localStorage
    localStorage.setItem("WORLD_PSYCHE", JSON.stringify(window.WORLD_PSYCHE));

    // odśwież render
    document.getElementById("app").innerHTML = "";
    renderWorld(window.WORLD_PSYCHE);

    modal.classList.add("hidden");
    titleInput.value = descInput.value = coverInput.value = audioInput.value = "";
  });

  // przy starcie – wczytaj z localStorage
  const saved = localStorage.getItem("WORLD_PSYCHE");
  if (saved) {
    try {
      window.WORLD_PSYCHE = JSON.parse(saved);
      document.getElementById("app").innerHTML = "";
      renderWorld(window.WORLD_PSYCHE);
    } catch (e) {
      console.error("Błąd wczytywania zapisanych danych:", e);
    }
  }
});
