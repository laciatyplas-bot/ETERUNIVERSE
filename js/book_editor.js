/* =====================================
   BOOK_EDITOR.js v2.2 – PEŁNY KOD 1:1 Z OKŁADKAMI
   Architekt: Maciej Maciuszek + AI Assistant
   100% PRODUCTION READY – OKŁADKI + UPLOAD
   ===================================== */

(function() {
  // Singleton
  if (window.bookEditorLoaded) {
    console.log("📚 Book Editor v2.2 już załadowany");
    return;
  }
  window.bookEditorLoaded = true;

  console.log("📚 Book Editor v2.2 załadowany – ✏️🗑️ OKŁADKI DZIAŁAJĄ!");

  // === TWORZENIE MODALA (JEŚLI BRAK) ===
  function createBookModal() {
    if (document.getElementById('book-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'book-modal';
    modal.style.cssText = `
      display: none;
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8); z-index: 9999;
      justify-content: center; align-items: center; backdrop-filter: blur(5px);
    `;
    modal.innerHTML = `
      <div style="
        background: white; padding: 2rem; border-radius: 16px; max-width: 500px; 
        max-height: 90vh; overflow: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      ">
        <h3 style="margin: 0 0 1.5rem 0; color: #1f2937; display: flex; align-items: center;">
          ✏️ Edytuj książkę
          <button id="close-book-modal" style="
            margin-left: auto; background: none; border: none; font-size: 24px; 
            cursor: pointer; color: #6b7280; padding: 0;
          ">×</button>
        </h3>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">📖 Tytuł:</label>
          <input id="book-title" placeholder="Wpisz tytuł książki" style="
            width: 100%; padding: 0.75rem; border: 2px solid #e5e7eb; 
            border-radius: 8px; font-size: 16px; box-sizing: border-box;
            transition: border-color 0.2s;
          " onfocus="this.style.borderColor='#8b5cf6'" onblur="this.style.borderColor='#e5e7eb'">
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">📝 Opis:</label>
          <textarea id="book-desc" placeholder="Krótki opis książki..." style="
            width: 100%; height: 100px; padding: 0.75rem; border: 2px solid #e5e7eb; 
            border-radius: 8px; font-size: 14px; resize: vertical; box-sizing: border-box;
            font-family: inherit; transition: border-color 0.2s;
          " onfocus="this.style.borderColor='#8b5cf6'" onblur="this.style.borderColor='#e5e7eb'"></textarea>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151;">🖼️ Okładka:</label>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <input id="book-cover-url" placeholder="https://example.com/cover.jpg" style="
              flex: 1; padding: 0.75rem; border: 2px solid #e5e7eb; 
              border-radius: 8px; font-size: 14px; box-sizing: border-box;
            " onfocus="this.style.borderColor='#8b5cf6'" onblur="this.style.borderColor='#e5e7eb'">
            <button id="upload-cover-btn" style="
              background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; 
              border: none; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer;
              font-weight: 500; font-size: 14px; white-space: nowrap;
              transition: transform 0.2s, box-shadow 0.2s;
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(139,92,246,0.4)'"
              onmouseout="this.style.transform=''; this.style.boxShadow=''">
              📤 Upload
            </button>
          </div>
          <div id="cover-preview" style="
            margin-top: 0.75rem; width: 100px; height: 140px; border-radius: 8px; 
            background: #f3f4f6; display: flex; align-items: center; justify-content: center;
            color: #6b7280; font-size: 12px; border: 2px dashed #d1d5db;
          ">Podgląd okładki</div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button id="cancel-book" style="
            background: #6b7280; color: white; border: none; padding: 0.75rem 1.5rem; 
            border-radius: 8px; cursor: pointer; font-weight: 500; transition: background 0.2s;
          " onmouseover="this.style.background='#4b5563'" onmouseout="this.style.background='#6b7280'">
            Anuluj
          </button>
          <button id="delete-book" style="
            background: #ef4444; color: white; border: none; padding: 0.75rem 1.5rem; 
            border-radius: 8px; cursor: pointer; font-weight: 500; transition: background 0.2s;
          " onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
            🗑️ Usuń
          </button>
          <button id="save-book" style="
            background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; 
            padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-weight: 500;
            transition: all 0.2s;
          " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 12px rgba(16,185,129,0.4)'"
            onmouseout="this.style.transform=''; this.style.boxShadow=''">
            💾 Zapisz zmiany
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // === GŁÓWNA FUNKCJA EDYCJI ===
  function editBook(book, gateIndex, bookIndex) {
    const modal = createBookModal();
    modal.style.display = 'flex';

    // WYPEŁNIJ FORMULARZ
    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-desc').value = book.desc || '';
    document.getElementById('book-cover-url').value = book.coverImg || '';

    // PODGLĄD OKŁADKI
    updateCoverPreview(book.coverImg);

    // ZAPISZ INDEKSY
    modal.dataset.gateIndex = gateIndex;
    modal.dataset.bookIndex = bookIndex;

    // EVENTY
    setupModalEvents(gateIndex, bookIndex);
  }

  // === PODGLĄD OKŁADKI ===
  function updateCoverPreview(url) {
    const preview = document.getElementById('cover-preview');
    if (url) {
      preview.style.backgroundImage = `url(${url})`;
      preview.style.backgroundSize = 'cover';
      preview.style.color = 'transparent';
      preview.innerHTML = '';
    } else {
      preview.style.backgroundImage = '';
      preview.style.backgroundSize = '';
      preview.style.color = '#6b7280';
      preview.innerHTML = 'Podgląd okładki';
    }
  }

  // === UPLOAD FILE ===
  function setupFileUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    document.getElementById('upload-cover-btn').onclick = () => {
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            document.getElementById('book-cover-url').value = ev.target.result;
            updateCoverPreview(ev.target.result);
          };
          reader.readAsDataURL(file);
        }
      };
      fileInput.click();
    };
  }

  // === EVENT HANDLERY MODALA ===
  function setupModalEvents(gateIndex, bookIndex) {
    // ZAMKNIJ
    document.getElementById('close-book-modal').onclick = closeModal;
    document.getElementById('cancel-book').onclick = closeModal;

    // ZAPISZ
    document.getElementById('save-book').onclick = () => {
      const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
      book.title = document.getElementById('book-title').value;
      book.desc = document.getElementById('book-desc').value;
      book.coverImg = document.getElementById('book-cover-url').value;

      renderWorld();
      closeModal();
      
      if (window.saveWorldNow) window.saveWorldNow("Książka edytowana");
      if (window.BELLA) window.BELLA.process("Książka zapisana");
      
      console.log("📚 Zapisano książkę:", book.title);
    };

    // USUŃ
    document.getElementById('delete-book').onclick = () => {
      if (confirm(`🗑️ USUNĄĆ "${window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex].title}"?`)) {
        window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
        renderWorld();
        closeModal();
        
        if (window.saveWorldNow) window.saveWorldNow("Książka usunięta");
        console.log("🗑️ Usunięto książkę");
      }
    };

    // PODGLĄD OKŁADKI LIVE
    document.getElementById('book-cover-url').oninput = (e) => {
      updateCoverPreview(e.target.value);
    };

    // ESCAPE
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') closeModal();
    });

    setupFileUpload();
  }

  function closeModal() {
    document.getElementById('book-modal').style.display = 'none';
  }

  // === INICJALIZACJA – DODAJ BUTTONY DO KSIĄŻEK ===
  function initBookButtons() {
    // MutationObserver – nowe książki po render
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.app-book').forEach((bookEl, index) => {
        const gateIndex = parseInt(bookEl.dataset.gateIndex);
        const bookIndex = parseInt(bookEl.dataset.bookIndex);
        
        if (!bookEl.querySelector('.book-actions')) {
          bookEl.innerHTML += `
            <div class="book-actions" style="
              position: absolute; top: 8px; right: 8px; opacity: 0; 
              transition: opacity 0.3s; display: flex; gap: 4px;
            ">
              <button onclick="editBook(window.WORLD_PSYCHE.gates[${gateIndex}].books[${bookIndex}], ${gateIndex}, ${bookIndex})" 
                style="background: #8b5cf6; color: white; border: none; border-radius: 50%; 
                       width: 32px; height: 32px; cursor: pointer; font-size: 16px;" 
                title="Edytuj">✏️</button>
              <button onclick="window.WORLD_PSYCHE.gates[${gateIndex}].books.splice(${bookIndex}, 1); renderWorld(); if(window.saveWorldNow) window.saveWorldNow('Książka usunięta')" 
                style="background: #ef4444; color: white; border: none; border-radius: 50%; 
                       width: 32px; height: 32px; cursor: pointer; font-size: 16px;" 
                title="Usuń">🗑️</button>
            </div>
          `;
          
          // HOVER
          bookEl.onmouseenter = () => bookEl.querySelector('.book-actions').style.opacity = '1';
          bookEl.onmouseleave = () => bookEl.querySelector('.book-actions').style.opacity = '0';
        }
      });
    });
    observer.observe(document.getElementById('app') || document.body, { childList: true, subtree: true });
  }

  // === START ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initBookButtons, 1000);
    });
  } else {
    setTimeout(initBookButtons, 500);
  }

  // GLOBALNA FUNKCJA (dla buttonów inline)
  window.editBook = editBook;

  console.log("📚 Book Editor v2.2 – GOTOWY! Hover na książki → ✏️🗑️");
})();
