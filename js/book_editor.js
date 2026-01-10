/* =====================================
   BOOK_EDITOR.js v2.7 – 100% KOMPATYBILNY Z CORE v4.4
   data-gate + data-index + .book = ✏️🗑️ DZIAŁAJĄ!
   ===================================== */

(function() {
  if (window.bookEditorLoaded) return;
  window.bookEditorLoaded = true;

  console.log("📚 Book Editor v2.7 – KOMPATYBILNY CORE v4.4!");

  // === MODAL (skrócony - działa 100%) ===
  function createBookModal() {
    const existing = document.getElementById('book-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'book-modal';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:99999;justify-content:center;align-items:center;';

    modal.innerHTML = `
      <div style="background:white;padding:2rem;border-radius:20px;max-width:500px;max-height:85vh;overflow:auto;box-shadow:0 30px 100px rgba(0,0,0,0.8);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h3 style="margin:0;font-size:24px;color:#1f2937;">✏️ Edytuj książkę</h3>
          <button id="close-book-modal" style="background:#ef4444;color:white;border:none;border-radius:50%;width:40px;height:40px;font-size:20px;cursor:pointer;">×</button>
        </div>
        <input id="book-title" style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:12px;font-size:16px;box-sizing:border-box;margin-bottom:1rem;" placeholder="Tytuł">
        <textarea id="book-desc" style="width:100%;height:100px;padding:12px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;box-sizing:border-box;margin-bottom:1rem;" placeholder="Opis"></textarea>
        <input id="book-cover-url" style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:12px;font-size:14px;box-sizing:border-box;margin-bottom:1rem;" placeholder="URL okładki">
        <div id="cover-preview" style="width:100px;height:140px;border-radius:8px;background:#f3f4f6;border:2px dashed #d1d5db;display:flex;align-items:center;justify-content:center;color:#6b7280;font-size:12px;margin-bottom:1rem;">Podgląd</div>
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button id="cancel-book" style="background:#6b7280;color:white;border:none;padding:12px 24px;border-radius:12px;cursor:pointer;">Anuluj</button>
          <button id="delete-book" style="background:#ef4444;color:white;border:none;padding:12px 24px;border-radius:12px;cursor:pointer;">🗑️ Usuń</button>
          <button id="save-book" style="background:#10b981;color:white;border:none;padding:12px 24px;border-radius:12px;cursor:pointer;">💾 Zapisz</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // === GŁÓWNA FUNKCJA EDYCJI ===
  window.editBook = function(gateIndex, bookIndex) {
    console.log("✏️ EDYCJA WYWOŁANA:", gateIndex, bookIndex);
    
    if (!window.WORLD_PSYCHE?.gates?.[gateIndex]?.books?.[bookIndex]) {
      alert("❌ Książka nie istnieje");
      return;
    }

    const modal = createBookModal();
    modal.style.display = 'flex';

    const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
    console.log("📚 Edytuję:", book.title);

    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-desc').value = book.desc || book.description || '';
    document.getElementById('book-cover-url').value = book.coverImg || book.cover || '';

    modal.gateIndex = gateIndex;
    modal.bookIndex = bookIndex;

    // CLOSE
    document.getElementById('close-book-modal').onclick = () => modal.style.display = 'none';
    document.getElementById('cancel-book').onclick = () => modal.style.display = 'none';

    // SAVE
    document.getElementById('save-book').onclick = () => {
      const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
      book.title = document.getElementById('book-title').value;
      book.description = book.desc = document.getElementById('book-desc').value;
      book.cover = book.coverImg = document.getElementById('book-cover-url').value;
      
      if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
      if (window.saveWorldNow) window.saveWorldNow("Edytowano książkę");
      
      modal.style.display = 'none';
      console.log("✅ ZAPISANO:", book.title);
    };

    // DELETE
    document.getElementById('delete-book').onclick = () => {
      if (confirm('🗑️ USUNĄĆ "' + book.title + '"?')) {
        window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
        if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
        modal.style.display = 'none';
        console.log("🗑️ USUNIĘTO");
      }
    };

    // PREVIEW
    document.getElementById('book-cover-url').oninput = (e) => {
      const preview = document.getElementById('cover-preview');
      if (e.target.value) {
        preview.style.backgroundImage = `url(${e.target.value})`;
        preview.style.backgroundSize = 'cover';
        preview.textContent = '';
      } else {
        preview.style.backgroundImage = '';
        preview.textContent = 'Podgląd';
      }
    };
  };

  // === SZYBKIE USUNIĘCIE ===
  window.deleteBook = function(gateIndex, bookIndex) {
    if (confirm('🗑️ USUNĄТЬ książkę?')) {
      window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
      if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
      console.log("🗑️ SZYBKIE USUNIĘCIE");
    }
  };

  // === 🔥 ULTRA PRECYZYJNY DETEKTOR DLA CORE v4.4 ===
  function detectCoreBooks() {
    // 1. SZUKAJ PO STRUKTURZE CORE v4.4: .gate > .book
    const books = document.querySelectorAll('.gate .book');
    console.log("📚 CORE v4.4: Znaleziono .gate .book =", books.length);

    books.forEach((bookEl, globalIndex) => {
      if (bookEl.querySelector('.book-actions')) return;

      // 2. POBIERZ data-gate i data-index Z KILKA ŹRÓDŁ
      const gateId = bookEl.querySelector('.edit-btn')?.dataset.gate;
      const bookIndex = bookEl.querySelector('.edit-btn')?.dataset.index;
      
      const gateIndex = parseInt(gateId);
      const bookIdx = parseInt(bookIndex);

      console.log(`📖 Książka ${globalIndex}: gateId="${gateId}" bookIndex="${bookIndex}"`);

      if (!isNaN(gateIndex) && !isNaN(bookIdx)) {
        addEditButtons(bookEl, gateIndex, bookIdx);
      }
    });
  }

  function addEditButtons(bookEl, gateIndex, bookIndex) {
    // UKRYJ ORYGINALNE PRZYCISKI CORE
    const origEdit = bookEl.querySelector('.edit-btn');
    const origDelete = bookEl.querySelector('.delete-btn');
    if (origEdit) origEdit.style.display = 'none';
    if (origDelete) origDelete.style.display = 'none';

    const actions = document.createElement('div');
    actions.className = 'book-actions';
    actions.style.cssText = `
      position:absolute;top:12px;right:12px;z-index:10060;opacity:0;transition:all 0.3s;
      background:rgba(15,15,25,0.95);padding:12px;border-radius:20px;backdrop-filter:blur(20px);
      display:flex;gap:12px;box-shadow:0 15px 35px rgba(0,0,0,0.5);
    `;

    actions.innerHTML = `
      <button onclick="window.editBook(${gateIndex},${bookIndex})" style="
        background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:white;border:none;
        border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:18px;
        box-shadow:0 6px 20px rgba(139,92,246,0.5);" title="✏️ Edytuj">✏️</button>
      <button onclick="window.deleteBook(${gateIndex},${bookIndex})" style="
        background:linear-gradient(135deg,#ef4444,#dc2626);color:white;border:none;
        border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:18px;
        box-shadow:0 6px 20px rgba(239,68,68,0.5);" title="🗑️ Usuń">🗑️</button>
    `;

    bookEl.style.position = 'relative';
    bookEl.appendChild(actions);

    // HOVER
    bookEl.onmouseenter = () => actions.style.opacity = '1';
    bookEl.onmouseleave = () => actions.style.opacity = '0';

    console.log("✅ NOWE ✏️🗑️ DODANE [", gateIndex, "][", bookIndex, "]");
  }

  // === START PO RENDER CORE ===
  setTimeout(detectCoreBooks, 1500);
  setTimeout(detectCoreBooks, 3500);
  setInterval(detectCoreBooks, 2500);

  // NASŁUCHUJ worldRendered Z CORE
  document.addEventListener('worldRendered', detectCoreBooks);

  console.log("🚀 Book Editor v2.7 – CORE v4.4 KOMPATYBILNY!");
  console.log("🔍 Czeka na .gate .book + data-gate/data-index...");
})();
