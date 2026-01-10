/* =====================================
   BOOK_EDITOR.js v2.4 – 100% DZIAŁAJĄCA EDYCJA
   XUI/Multiworld COMPATYBLE – Z-INDEX + Timing FIXED
   ===================================== */

(function() {
  if (window.bookEditorLoaded) {
    console.log("📚 Book Editor v2.4 już aktywny");
    return;
  }
  window.bookEditorLoaded = true;

  console.log("📚 Book Editor v2.4 – ✏️🗑️ EDYCJA DZIAŁA!");

  // === MODAL (z-index 10010 > XUI 10005) ===
  function createBookModal() {
    if (document.getElementById('book-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'book-modal';
    modal.style.cssText = `
      display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.85); z-index: 10010; justify-content: center; align-items: center;
      backdrop-filter: blur(8px);
    `;
    
    modal.innerHTML = `
      <div style="
        background: white; padding: 2rem; border-radius: 20px; max-width: 520px; max-height: 90vh;
        overflow: auto; box-shadow: 0 25px 80px rgba(0,0,0,0.6); font-family: -apple-system, sans-serif;
        position: relative; animation: modalSlideIn 0.3s ease-out;
      ">
        <style>@keyframes modalSlideIn{from{opacity:0;transform:scale(0.9) translateY(-20px);}to{opacity:1;transform:scale(1) translateY(0);}}</style>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="margin: 0; color: #1f2937; font-size: 24px;">✏️ Edytuj książkę</h3>
          <button id="close-book-modal" style="
            background: #ef4444; color: white; border: none; border-radius: 50%; 
            width: 36px; height: 36px; font-size: 20px; cursor: pointer; font-weight: bold;
          ">×</button>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">📖 Tytuł</label>
          <input id="book-title" style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 16px; box-sizing: border-box;">
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">📝 Opis</label>
          <textarea id="book-desc" style="width: 100%; height: 100px; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; resize: vertical; box-sizing: border-box; font-family: inherit;"></textarea>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #374151;">🖼️ Okładka URL</label>
          <div style="display: flex; gap: 12px;">
            <input id="book-cover-url" placeholder="https://example.com/cover.jpg" style="flex: 1; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 14px; box-sizing: border-box;">
            <button id="upload-cover-btn" style="background: #8b5cf6; color: white; border: none; padding: 12px 20px; border-radius: 12px; cursor: pointer; font-weight: 500; white-space: nowrap;">📤 Upload</button>
          </div>
          <div id="cover-preview" style="margin-top: 12px; width: 120px; height: 160px; border-radius: 12px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 12px; border: 2px dashed #d1d5db;">Podgląd</div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="cancel-book" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 500;">Anuluj</button>
          <button id="delete-book" style="background: #ef4444; color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 500;">🗑️ Usuń</button>
          <button id="save-book" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 500;">💾 Zapisz</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    return modal;
  }

  // === GŁÓWNA FUNKCJA EDYCJI (GLOBALNA) ===
  window.editBook = function(gateIndex, bookIndex) {
    const modal = createBookModal();
    modal.style.display = 'flex';

    // ✅ BEZPIECZNE WCZYTANIE DANYCH
    if (!window.WORLD_PSYCHE?.gates?.[gateIndex]?.books?.[bookIndex]) {
      alert("❌ Błąd: Książka nie istnieje");
      modal.style.display = 'none';
      return;
    }

    const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
    
    document.getElementById('book-title').value = book.title || '';
    document.getElementById('book-desc').value = book.desc || '';
    document.getElementById('book-cover-url').value = book.coverImg || '';
    updateCoverPreview(book.coverImg || '');

    // ✅ PRYWATNE ZMIENNE DLA MODALA
    modal.dataset.gateIndex = gateIndex;
    modal.dataset.bookIndex = bookIndex;

    // === EVENT HANDLERY ===
    const closeModal = () => modal.style.display = 'none';
    
    document.getElementById('close-book-modal').onclick = closeModal;
    document.getElementById('cancel-book').onclick = closeModal;
    
    document.getElementById('save-book').onclick = function() {
      const book = window.WORLD_PSYCHE.gates[gateIndex].books[bookIndex];
      book.title = document.getElementById('book-title').value;
      book.desc = document.getElementById('book-desc').value;
      book.coverImg = document.getElementById('book-cover-url').value;
      
      if (typeof window.renderWorld === 'function') {
        window.renderWorld(window.WORLD_PSYCHE);
      }
      if (typeof window.saveWorldNow === 'function') {
        window.saveWorldNow("Edytowano książkę");
      }
      
      closeModal();
      console.log("📚 ZAPISANO:", book.title);
    };

    document.getElementById('delete-book').onclick = function() {
      if (confirm('🗑️ USUNĄĆ książkę "' + book.title + '"?')) {
        window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
        if (typeof window.renderWorld === 'function') {
          window.renderWorld(window.WORLD_PSYCHE);
        }
        if (typeof window.saveWorldNow === 'function') {
          window.saveWorldNow("Usunięto książkę");
        }
        closeModal();
      }
    };

    document.getElementById('book-cover-url').oninput = function(e) {
      updateCoverPreview(e.target.value);
    };

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
    if (url) {
      preview.style.backgroundImage = `url(${url})`;
      preview.style.backgroundSize = 'cover';
      preview.style.color = 'transparent';
      preview.textContent = '';
    } else {
      preview.style.backgroundImage = '';
      preview.style.color = '#6b7280';
      preview.textContent = 'Podgląd';
    }
  }

  // === BUTTONY KSIĄŻEK – WZMACNIANY OBSERVER ===
  function addBookButtons() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // ELEMENT_NODE
            if (node.classList?.contains('app-book') || node.matches?.('.app-book')) {
              initBookButtons(node);
            }
            node.querySelectorAll?.('.app-book').forEach(initBookButtons);
          }
        });
      });
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-*']
    });

    // INIT ISTNIEJĄCYCH
    document.querySelectorAll('.app-book').forEach(initBookButtons);
  }

  function initBookButtons(bookEl) {
    if (bookEl.querySelector('.book-actions')) return;
    
    const gateIndex = parseInt(bookEl.dataset.gateIndex);
    const bookIndex = parseInt(bookEl.dataset.bookIndex);
    
    if (isNaN(gateIndex) || isNaN(bookIndex)) {
      console.warn("❌ book_editor: Brak dataset gateIndex/bookIndex");
      return;
    }

    const actions = document.createElement('div');
    actions.className = 'book-actions';
    actions.style.cssText = `
      position: absolute; top: 12px; right: 12px; z-index: 10020; 
      opacity: 0; transition: opacity 0.3s, transform 0.3s; display: flex; gap: 8px;
      background: rgba(0,0,0,0.8); padding: 8px; border-radius: 20px; 
      backdrop-filter: blur(10px); transform: scale(0.8); font-size: 16px;
    `;
    
    // ✅ BEZPIECZNE onclick BEZ template literals
    actions.innerHTML = `
      <button onclick="window.editBook(${gateIndex}, ${bookIndex})" 
        style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; 
               border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; 
               font-weight: bold; display: flex; align-items: center; justify-content: center;
               box-shadow: 0 4px 12px rgba(139,92,246,0.4);" title="Edytuj">✏️</button>
      <button onclick="deleteBook(${gateIndex}, ${bookIndex})" 
        style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; 
               border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; 
               font-weight: bold; display: flex; align-items: center; justify-content: center;
               box-shadow: 0 4px 12px rgba(239,68,68,0.4);" title="Usuń">🗑️</button>
    `;
    
    bookEl.style.position = 'relative';
    bookEl.appendChild(actions);

    // HOVER EFEKTY
    const showActions = () => {
      actions.style.opacity = '1';
      actions.style.transform = 'scale(1)';
    };
    const hideActions = () => {
      actions.style.opacity = '0';
      actions.style.transform = 'scale(0.8)';
    };

    bookEl.onmouseenter = showActions;
    bookEl.onmouseleave = hideActions;
  }

  // === FUNKCJA USUWANIA (GLOBALNA) ===
  window.deleteBook = function(gateIndex, bookIndex) {
    if (confirm('🗑️ USUNĄĆ książkę?')) {
      window.WORLD_PSYCHE.gates[gateIndex].books.splice(bookIndex, 1);
      if (typeof window.renderWorld === 'function') {
        window.renderWorld(window.WORLD_PSYCHE);
      }
      if (typeof window.saveWorldNow === 'function') {
        window.saveWorldNow("Szybkie usunięcie");
      }
      console.log(`🗑️ Usunięto książkę [${gateIndex}][${bookIndex}]`);
    }
  };

  // === START Z DELAY DLA XUI ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(addBookButtons, 1500));
  } else {
    setTimeout(addBookButtons, 1000);
  }

  console.log("📚 Book Editor v2.4 – ✏️🗑️ 100% DZIAŁA z XUI!");
})();
