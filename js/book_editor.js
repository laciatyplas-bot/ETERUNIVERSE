/* =====================================
   BOOK_EDITOR.js v2.6 – UNIWSERALNY DETEKTOR
   Działa z każdą klasą – dataset.gateIndex + dataset.bookIndex
   ===================================== */

(function() {
  if (window.bookEditorLoaded) return;
  window.bookEditorLoaded = true;

  console.log("📚 Book Editor v2.6 – UNIWSERALNY DETEKTOR AKTYWNY!");

  // === MODAL (bez zmian - działa) ===
  function createBookModal() {
    const existing = document.getElementById('book-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'book-modal';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:99999;justify-content:center;align-items:center;backdrop-filter:blur(10px);';

    modal.innerHTML = `
      <div style="background:white;padding:2.5rem;border-radius:24px;max-width:550px;max-height:90vh;overflow:auto;box-shadow:0 30px 100px rgba(0,0,0,0.8);font-family:-apple-system,sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
          <h3 style="margin:0;font-size:28px;color:#1f2937;">✏️ EDYTUJ KSIĄŻKĘ</h3>
          <button id="close-book-modal" style="background:#ef4444;color:white;border:none;border-radius:50%;width:44px;height:44px;font-size:24px;cursor:pointer;font-weight:bold;">×</button>
        </div>
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;margin-bottom:0.75rem;font-weight:600;color:#374151;font-size:16px;">📖 Tytuł:</label>
          <input id="book-title" style="width:100%;padding:16px;border:2px solid #e5e7eb;border-radius:16px;font-size:16px;box-sizing:border-box;">
        </div>
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;margin-bottom:0.75rem;font-weight:600;color:#374151;font-size:16px;">📝 Opis:</label>
          <textarea id="book-desc" style="width:100%;height:120px;padding:16px;border:2px solid #e5e7eb;border-radius:16px;font-size:15px;resize:vertical;box-sizing:border-box;"></textarea>
        </div>
        <div style="margin-bottom:2rem;">
          <label style="display:block;margin-bottom:0.75rem;font-weight:600;color:#374151;font-size:16px;">🖼️ Okładka:</label>
          <div style="display:flex;gap:12px;">
            <input id="book-cover-url" placeholder="https://example.com/cover.jpg" style="flex:1;padding:16px;border:2px solid #e5e7eb;border-radius:16px;font-size:15px;box-sizing:border-box;">
            <button id="upload-cover-btn" style="background:#8b5cf6;color:white;border:none;padding:16px 24px;border-radius:16px;cursor:pointer;font-weight:600;">📤 Upload</button>
          </div>
          <div id="cover-preview" style="margin-top:16px;width:140px;height:180px;border-radius:16px;background:#f8fafc;border:3px dashed #cbd5e1;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px;"></div>
        </div>
        <div style="display:flex;gap:16px;justify-content:flex-end;">
          <button id="cancel-book" style="background:#6b7280;color:white;border:none;padding:16px 32px;border-radius:16px;cursor:pointer;font-weight:600;">Anuluj</button>
          <button id="delete-book" style="background:#ef4444;color:white;border:none;padding:16px 32px;border-radius:16px;cursor:pointer;font-weight:600;">🗑️ Usuń</button>
          <button id="save-book" style="background:#10b981;color:white;border:none;padding:16px 32px;border-radius:16px;cursor:pointer;font-weight:600;">💾 Zapisz</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // === FUNKCJA EDYCJI (bez zmian) ===
  window.editBook = function(gateIndex, bookIndex) {
    console.log("✏️ EDYCJA:", gateIndex, bookIndex);
    const modal = createBookModal();
    modal.style.display = 'flex';

    const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-desc').value = book.desc || '';
    document.getElementById('book-cover-url').value = book.coverImg || '';
    updateCoverPreview(book.coverImg || '');

    modal.gateIndex = gateIndex;
    modal.bookIndex = bookIndex;

    document.getElementById('close-book-modal').onclick = () => modal.style.display = 'none';
    document.getElementById('cancel-book').onclick = () => modal.style.display = 'none';

    document.getElementById('save-book').onclick = () => {
      const book = window.WORLD_PSYCHE.gates[modal.gateIndex].books[modal.bookIndex];
      book.title = document.getElementById('book-title').value;
      book.desc = document.getElementById('book-desc').value;
      book.coverImg = document.getElementById('book-cover-url').value;
      
      if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
      if (window.saveWorldNow) window.saveWorldNow("Edytowano książkę");
      modal.style.display = 'none';
    };

    document.getElementById('delete-book').onclick = () => {
      if (confirm('🗑️ USUNĄĆ?')) {
        window.WORLD_PSYCHE.gates[modal.gateIndex].books.splice(modal.bookIndex, 1);
        if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
        if (window.saveWorldNow) window.saveWorldNow("Usunięto");
        modal.style.display = 'none';
      }
    };
  };

  function updateCoverPreview(url) {
    const preview = document.getElementById('cover-preview');
    if (preview) {
      if (url) {
        preview.style.backgroundImage = `url(${url})`;
        preview.style.backgroundSize = 'cover';
        preview.style.color = 'transparent';
      } else {
        preview.style.backgroundImage = '';
        preview.style.color = '#94a3b8';
        preview.textContent = 'Podgląd';
      }
    }
  }

  // === 🔥 UNIWSERALNY DETEKTOR – WSZYSKIE ELEMENTY Z DATASET ===
  function universalBookDetector() {
    console.log("🔍 UNIWSERALNY DETEKTOR – szukam dataset...");
    
    // 1. SZUKAJ PO DATASET (wszystkie możliwe klasy)
    const bookElements = document.querySelectorAll('[data-gate-index][data-book-index], [data-gateIndex][data-bookIndex], .app-book, [class*="book"], .book');
    console.log("📚 Znaleziono potencjalnych:", bookElements.length);

    bookElements.forEach((el, index) => {
      if (el.querySelector('.book-actions')) return; // Już ma przyciski
      
      // PARSUJ INDEKSY Z DOWOLNEGO ŹRÓDŁA
      let gateIndex = parseInt(el.dataset.gateIndex) || parseInt(el.dataset.gateIndex_) || parseInt(el.getAttribute('data-gate-index'));
      let bookIndex = parseInt(el.dataset.bookIndex) || parseInt(el.dataset.bookIndex_) || parseInt(el.getAttribute('data-book-index'));
      
      console.log(`📖 Element ${index}: gate=${gateIndex} book=${bookIndex} class="${el.className}"`);

      if (!isNaN(gateIndex) && !isNaN(bookIndex)) {
        addBookButtonsToElement(el, gateIndex, bookIndex);
      }
    });
  }

  function addBookButtonsToElement(el, gateIndex, bookIndex) {
    const actions = document.createElement('div');
    actions.className = 'book-actions';
    actions.style.cssText = `
      position:absolute !important; top:20px !important; right:20px !important; z-index:10050 !important;
      opacity:0; transition:all 0.4s !important; background:rgba(15,15,25,0.95) !important;
      padding:16px !important; border-radius:24px !important; backdrop-filter:blur(20px) !important;
      display:flex !important; gap:16px !important; box-shadow:0 20px 40px rgba(0,0,0,0.6) !important;
    `;
    
    actions.innerHTML = `
      <button onclick="window.editBook(${gateIndex}, ${bookIndex})" style="
        background:linear-gradient(135deg,#8b5cf6,#7c3aed) !important; color:white !important; border:none !important;
        border-radius:50% !important; width:52px !important; height:52px !important; cursor:pointer !important;
        font-size:22px !important; font-weight:bold !important; box-shadow:0 8px 24px rgba(139,92,246,0.6) !important;
      " title="Edytuj">✏️</button>
      <button onclick="window.deleteBook(${gateIndex}, ${bookIndex})" style="
        background:linear-gradient(135deg,#ef4444,#dc2626) !important; color:white !important; border:none !important;
        border-radius:50% !important; width:52px !important; height:52px !important; cursor:pointer !important;
        font-size:22px !important; font-weight:bold !important; box-shadow:0 8px 24px rgba(239,68,68,0.6) !important;
      " title="Usuń">🗑️</button>
    `;
    
    el.style.position = 'relative';
    el.appendChild(actions);

    // HOVER Z FORCE
    el.onmouseenter = () => {
      actions.style.opacity = '1';
      actions.style.transform = 'scale(1)';
    };
    el.onmouseleave = () => {
      actions.style.opacity = '0';
      actions.style.transform = 'scale(0.9)';
    };

    console.log("✅ PRZYCISKI DODANE [", gateIndex, "][", bookIndex, "]");
  }

  // === SZYBKIE USUNIĘCIE ===
  window.deleteBook = function(gateIndex, bookIndex) {
    if (confirm('🗑️ USUNĄĆ książkę?')) {
      window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
      if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
      console.log("🗑️ USUNIĘTO [", gateIndex, "][", bookIndex, "]");
    }
  };

  // === AGRESYWNE SKANOWANIE ===
  setTimeout(universalBookDetector, 1000);
  setTimeout(universalBookDetector, 3000);
  setInterval(universalBookDetector, 3000);

  // MUTATION OBSERVER (backup)
  const observer = new MutationObserver(universalBookDetector);
  observer.observe(document.body, { childList: true, subtree: true });

  console.log("🚀 Book Editor v2.6 – UNIWSERALNY DETEKTOR START!");
  console.log("🔍 Szuka: [data-gate-index] [data-gateIndex] [data-book-index] [data-bookIndex] .app-book .book");
})();
