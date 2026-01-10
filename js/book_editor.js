/* =====================================
   BOOK_EDITOR.js v2.5 – ULTRA FIXED EDYCJA
   DEBUG MODE + FORCE COMPATYBILNOŚĆ XUI
   ===================================== */

(function() {
  if (window.bookEditorLoaded) return;
  window.bookEditorLoaded = true;

  console.log("📚 Book Editor v2.5 – DEBUG MODE AKTYWNY!");

  // === 1. SPRAWDŹ DANE ===
  console.log("🔍 DEBUG: WORLD_PSYCHE =", window.WORLD_PSYCHE ? "OK" : "BRAK");
  console.log("🔍 DEBUG: renderWorld =", typeof window.renderWorld);
  console.log("🔍 DEBUG: gates =", window.WORLD_PSYCHE?.gates?.length || "BRAK");

  // === 2. ULTRA BEZPIECZNY MODAL ===
  function createBookModal() {
    const existing = document.getElementById('book-modal');
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'book-modal';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:99999;justify-content:center;align-items:center;backdrop-filter:blur(10px);';

    modal.innerHTML = `
      <div style="background:white;padding:2.5rem;border-radius:24px;max-width:550px;max-height:90vh;overflow:auto;box-shadow:0 30px 100px rgba(0,0,0,0.8);font-family:-apple-system,sans-serif;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem;">
          <h3 style="margin:0;font-size:28px;color:#1f2937;">✏️ EDYTUJ KSIĄŻKĘ</h3>
          <button id="close-book-modal" style="background:#ef4444;color:white;border:none;border-radius:50%;width:44px;height:44px;font-size:24px;cursor:pointer;font-weight:bold;box-shadow:0 4px 12px rgba(239,68,68,0.4);">×</button>
        </div>
        
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;margin-bottom:0.75rem;font-weight:600;color:#374151;font-size:16px;">📖 Tytuł książki:</label>
          <input id="book-title" style="width:100%;padding:16px;border:2px solid #e5e7eb;border-radius:16px;font-size:16px;box-sizing:border-box;font-weight:500;">
        </div>
        
        <div style="margin-bottom:1.5rem;">
          <label style="display:block;margin-bottom:0.75rem;font-weight:600;color:#374151;font-size:16px;">📝 Opis:</label>
          <textarea id="book-desc" style="width:100%;height:120px;padding:16px;border:2px solid #e5e7eb;border-radius:16px;font-size:15px;resize:vertical;box-sizing:border-box;font-family:inherit;"></textarea>
        </div>
        
        <div style="margin-bottom:2rem;">
          <label style="display:block;margin-bottom:0.75rem;font-weight:600;color:#374151;font-size:16px;">🖼️ Okładka:</label>
          <div style="display:flex;gap:12px;">
            <input id="book-cover-url" placeholder="https://example.com/cover.jpg" style="flex:1;padding:16px;border:2px solid #e5e7eb;border-radius:16px;font-size:15px;box-sizing:border-box;">
            <button id="upload-cover-btn" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;border:none;padding:16px 24px;border-radius:16px;cursor:pointer;font-weight:600;font-size:15px;">📤 UPLOAD</button>
          </div>
          <div id="cover-preview" style="margin-top:16px;width:140px;height:180px;border-radius:16px;background:#f8fafc;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:13px;border:3px dashed #cbd5e1;"></div>
        </div>
        
        <div style="display:flex;gap:16px;justify-content:flex-end;">
          <button id="cancel-book" style="background:#6b7280;color:white;border:none;padding:16px 32px;border-radius:16px;cursor:pointer;font-weight:600;font-size:15px;">ANULUJ</button>
          <button id="delete-book" style="background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border:none;padding:16px 32px;border-radius:16px;cursor:pointer;font-weight:600;font-size:15px;">🗑️ USUŃ</button>
          <button id="save-book" style="background:linear-gradient(135deg,#10b981,#059669);color:white;border:none;padding:16px 32px;border-radius:16px;cursor:pointer;font-weight:600;font-size:15px;box-shadow:0 6px 20px rgba(16,185,129,0.4);">💾 ZAPISZ</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
  }

  // === ULTRA BEZPIECZNA EDYCJA ===
  window.editBook = function(gateIndex, bookIndex) {
    console.log("🔍 DEBUG editBook WYWOŁANE:", gateIndex, bookIndex);
    
    // WALIDACJA DANYCH
    if (!window.WORLD_PSYCHE || !window.WORLD_PSYCHE.gates || !window.WORLD_PSYCHE.gates[gateIndex]) {
      alert("❌ BŁĄD: Brak danych świata (F12 sprawdź WORLD_PSYCHE)");
      return;
    }
    
    if (!window.WORLD_PSYCHE.gates[gateIndex].books || !window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex]) {
      alert("❌ BŁĄD: Książka nie istnieje");
      return;
    }

    console.log("✅ DANE OK – otwieram modal");
    const modal = createBookModal();
    modal.style.display = 'flex';

    const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
    console.log("📚 Ładuję książkę:", book.title);

    // WCZYTANIE DANYCH
    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-desc').value = book.desc || '';
    document.getElementById('book-cover-url').value = book.coverImg || '';
    updateCoverPreview(book.coverImg || '');

    // ZAPIS ZMIENNYCH
    modal.gateIndex = gateIndex;
    modal.bookIndex = bookIndex;

    // EVENTY
    document.getElementById('close-book-modal').onclick = () => modal.style.display = 'none';
    document.getElementById('cancel-book').onclick = () => modal.style.display = 'none';

    document.getElementById('save-book').onclick = function() {
      console.log("💾 ZAPISUJĘ...");
      const book = window.WORLD_PSYCHE.gates[modal.gateIndex].books[modal.bookIndex];
      book.title = document.getElementById('book-title').value;
      book.desc = document.getElementById('book-desc').value;
      book.coverImg = document.getElementById('book-cover-url').value;
      
      // SAFE RENDER
      if (typeof window.renderWorld === 'function') {
        window.renderWorld(window.WORLD_PSYCHE);
        console.log("✅ renderWorld OK");
      }
      
      if (typeof window.saveWorldNow === 'function') {
        window.saveWorldNow("Edytowano książkę");
        console.log("✅ saveWorldNow OK");
      }
      
      modal.style.display = 'none';
      console.log("🎉 ZAPISANO:", book.title);
    };

    document.getElementById('delete-book').onclick = function() {
      if (confirm('🗑️ USUNĄĆ "' + book.title + '"?')) {
        window.WORLD_PSYCHE.gates[modal.gateIndex].books.splice(modal.bookIndex, 1);
        if (typeof window.renderWorld === 'function') window.renderWorld(window.WORLD_PSYCHE);
        if (typeof window.saveWorldNow === 'function') window.saveWorldNow("Usunięto książkę");
        modal.style.display = 'none';
        console.log("🗑️ USUNIĘTO");
      }
    };

    // OKŁADKA
    document.getElementById('book-cover-url').oninput = (e) => updateCoverPreview(e.target.value);
    
    document.getElementById('upload-cover-btn').onclick = function() {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*';
      input.onchange = (e) => {
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
      input.click();
    };
  };

  function updateCoverPreview(url) {
    const preview = document.getElementById('cover-preview');
    if (preview) {
      if (url) {
        preview.style.backgroundImage = `url(${url})`;
        preview.style.backgroundSize = 'cover';
        preview.style.color = 'transparent';
        preview.textContent = '';
      } else {
        preview.style.backgroundImage = '';
        preview.style.color = '#94a3b8';
        preview.textContent = 'Podgląd okładki';
      }
    }
  }

  // === FORCE BUTTONY – CO 2 SEKUNDY ===
  function forceAddButtons() {
    console.log("🔍 Szukam książek...");
    const books = document.querySelectorAll('.app-book');
    console.log("📚 Znaleziono książek:", books.length);
    
    books.forEach((bookEl, index) => {
      if (!bookEl.querySelector('.book-actions')) {
        const gateIndex = parseInt(bookEl.dataset.gateIndex);
        const bookIndex = parseInt(bookEl.dataset.bookIndex);
        
        console.log(`📚 Inicjalizuję książkę [${gateIndex}][${bookIndex}]`);
        
        const actions = document.createElement('div');
        actions.className = 'book-actions';
        actions.style.cssText = `
          position:absolute;top:16px;right:16px;z-index:10030;opacity:0;transition:all 0.3s;
          background:rgba(0,0,0,0.9);padding:12px;border-radius:24px;backdrop-filter:blur(20px);
          display:flex;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);
        `;
        
        actions.innerHTML = `
          <button onclick="window.editBook(${gateIndex},${bookIndex})" style="
            background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;border:none;
            border-radius:50%;width:44px;height:44px;cursor:pointer;font-weight:bold;
            font-size:18px;box-shadow:0 6px 20px rgba(139,92,246,0.5);" title="Edytuj">✏️</button>
          <button onclick="window.deleteBook(${gateIndex},${bookIndex})" style="
            background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border:none;
            border-radius:50%;width:44px;height:44px;cursor:pointer;font-weight:bold;
            font-size:18px;box-shadow:0 6px 20px rgba(239,68,68,0.5);" title="Usuń">🗑️</button>
        `;
        
        bookEl.style.position = 'relative';
        bookEl.appendChild(actions);
        
        bookEl.onmouseenter = () => actions.style.opacity = '1';
        bookEl.onmouseleave = () => actions.style.opacity = '0';
        
        console.log("✅ Dodano przyciski do książki", index);
      }
    });
  }

  // === DEBUG DELETE ===
  window.deleteBook = function(gateIndex, bookIndex) {
    console.log("🗑️ SZYBKIE USUNIĘCIE:", gateIndex, bookIndex);
    if (confirm('Napewno usunąć?')) {
      window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
      if (typeof window.renderWorld === 'function') window.renderWorld(window.WORLD_PSYCHE);
      console.log("🗑️ USUNIĘTO!");
    }
  };

  // === START DEBUG LOOP ===
  setTimeout(forceAddButtons, 2000);
  setInterval(forceAddButtons, 2000); // CO 2s sprawdza książki
  
  console.log("🚀 Book Editor v2.5 – FORCE MODE + DEBUG!");
  console.log("📋 TEST: Hover na książkę → ✏️🗑️ MUSZĄ się pojawić!");
})();
