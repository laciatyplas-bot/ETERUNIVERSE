/* =====================================
   BOOK EDITOR — v2.1 KOMPATYBILNY Z CORE v4.3
   Architekt: Maciej Maciuszek + AI Assistant
   ===================================== 
   POPRAWIONY: Używa WORLD_PSYCHE_V4 + eventy bez konfliktu
*/

(function() {
  // Singleton – wykonaj tylko raz
  if (window.bookEditorLoaded) return;
  window.bookEditorLoaded = true;

  console.log("📚 Book Editor v2.1 załadowany – kompatybilny z core.js v4.3");

  // Czekaj na DOM + WORLD_PSYCHE
  function init() {
    if (!document.getElementById("modal") || typeof window.WORLD_PSYCHE === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    setupEditor();
  }

  function setupEditor() {
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

    let currentEdit = null;

    // Wypełnij select bram
    function populateGates() {
      if (!gateSelect || !window.WORLD_PSYCHE?.gates) return;
      gateSelect.innerHTML = window.WORLD_PSYCHE.gates.map(gate => 
        `<option value="${gate.id}">${gate.name}</option>`
      ).join('');
    }

    // Otwórz modal
    window.openBookModal = function(book = null, gateId = 1) {
      modal.classList.remove("hidden");
      currentEdit = book;
      
      modalTitle.textContent = book ? "Edytuj książkę" : "Nowa książka";
      bookTitle.value = book?.title || "";
      bookDesc.value = book?.description || "";
      bookCover.value = book?.cover || "media/covers/default.jpg";
      bookAudio.value = book?.audio || "";
      
      if (gateId) gateSelect.value = gateId;
    };

    // Zapisz książkę
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
        alert("Błąd: nie znaleziono bramy!");
        return;
      }

      if (currentEdit) {
        // Edycja
        Object.assign(currentEdit, newBook);
      } else {
        // Nowa książka
        gate.books.push(newBook);
      }

      saveWorldData();
      
      // Trigger re-render z core.js
      if (typeof renderWorld === 'function') {
        renderWorld(window.WORLD_PSYCHE);
      }
      
      modal.classList.add("hidden");
      currentEdit = null;
    }

    // ZAPIS localStorage (kompatybilny z core.js v4)
    function saveWorldData() {
      try {
        localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", JSON.stringify(window.WORLD_PSYCHE));
        console.log("📚 Zapisano książkę do localStorage V4");
      } catch (e) {
        console.error("Błąd zapisu:", e);
      }
    }

    // Eventy
    if (addBookBtn) {
      addBookBtn.onclick = () => window.openBookModal(null, 1);
    }
    if (cancelBtn) {
      cancelBtn.onclick = () => modal.classList.add("hidden");
    }
    if (saveBtn) {
      saveBtn.onclick = saveBook;
    }

    // Dynamiczne przyciski EDIT/DELETE (po renderze core.js)
    window.enableBookActions = function() {
      document.querySelectorAll(".edit-btn, button[onclick*='openEditor']").forEach(btn => {
        btn.onclick = function() {
          const gateId = parseInt(this.dataset.gate || this.dataset.gateId);
          const index = parseInt(this.dataset.index);
          const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
          const book = gate?.books[index];
          if (book) window.openBookModal(book, gateId);
        };
      });

      document.querySelectorAll(".delete-btn, button[onclick*='deleteBook']").forEach(btn => {
        btn.onclick = function() {
          if (!confirm("Na pewno usunąć książkę?")) return;
          const gateId = parseInt(this.dataset.gate || this.dataset.gateId);
          const index = parseInt(this.dataset.index);
          const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
          if (gate) {
            gate.books.splice(index, 1);
            saveWorldData();
            if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
          }
        };
      });
    };

    // Wypełnij select po załadowaniu świata
    populateGates();

    // Event po renderze świata (z core.js)
    document.addEventListener("worldRendered", () => {
      window.enableBookActions();
      populateGates();
    });

    console.log("📚 Book Editor v2.1 – gotowy do pracy");
  }

  // Start po DOM
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
