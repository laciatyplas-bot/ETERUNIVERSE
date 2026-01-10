/* =====================================
   CHAPTER EDITOR — Modal edycji rozdziałów v1.0
   Architekt: Maciej Maciuszek + AI Assistant
   KOMPATYBILNY: core v4.4 + book_editor v2.1
   ===================================== */

(function() {
  // Singleton
  if (window.chapterEditorLoaded) return;
  window.chapterEditorLoaded = true;

  console.log("📖 Chapter Editor v1.0 załadowany");

  // Czekaj na DOM + WORLD_PSYCHE
  function init() {
    if (!document.getElementById("app") || !window.WORLD_PSYCHE) {
      setTimeout(init, 100);
      return;
    }
    setupChapterEditor();
  }

  function setupChapterEditor() {
    // 1. DODAJ HTML MODAL (raz)
    if (!document.getElementById('chapterModal')) {
      addChapterModalHTML();
    }

    // 2. BIND PRZYCISKI ROZDZIAŁÓW (po każdym renderze)
    document.addEventListener('worldRendered', bindChapterButtons);

    console.log("📖 Chapter Editor v1.0 – gotowy");
  }

  // === HTML MODAL ===
  function addChapterModalHTML() {
    const modalHTML = `
      <div id="chapterModal" class="modal hidden">
        <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
          <span class="close-modal" onclick="closeChapterModal()">×</span>
          <h2 id="chapterModalTitle">Rozdziały książki</h2>
          
          <!-- INFO KSIĄŻKI -->
          <div id="chapterBookInfo" style="background: rgba(40,211,198,0.1); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <strong>Brama:</strong> <span id="chapterGateName">-</span> | 
            <strong>Książka:</strong> <span id="chapterBookTitle">-</span>
          </div>

          <!-- LISTA ROZDZIAŁÓW -->
          <div id="chapterList" style="max-height: 400px; overflow-y: auto; margin-bottom: 1rem;">
            <!-- Dynamicznie wypełniane -->
          </div>

          <!-- NOWY ROZDZIAŁ -->
          <div style="border-top: 1px solid #38bdf8; padding-top: 1rem;">
            <h4>📝 Nowy rozdział</h4>
            <input type="text" id="newChapterTitle" placeholder="Tytuł rozdziału" style="width: 100%; margin-bottom: 0.5rem;">
            <textarea id="newChapterContent" placeholder="Treść / opis rozdziału..." style="width: 100%; height: 80px; margin-bottom: 0.5rem;"></textarea>
            <select id="newChapterStatus">
              <option value="idea">Idea</option>
              <option value="draft">Draft</option>
              <option value="written">Written</option>
              <option value="ready">Ready</option>
              <option value="published">Published</option>
            </select>
            <button id="addChapterBtn" style="background: #10b981; color: white; padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer;">
              ➕ Dodaj rozdział
            </button>
          </div>

          <div class="modal-actions">
            <button onclick="closeChapterModal()" style="background: #6b7280;">Anuluj</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // === BIND PRZYCISKI "ROZDZIAŁY" ===
  function bindChapterButtons() {
    // Usuń stare eventy
    document.querySelectorAll('.chapter-btn').forEach(btn => btn.remove());

    // Dodaj przyciski ROZDZIAŁY koło ✏️🗑️
    document.querySelectorAll('.book').forEach((bookEl, index) => {
      const gateEl = bookEl.closest('.gate');
      const gateId = parseInt(gateEl.dataset.gateId || gateEl.querySelector('[data-gate]').dataset.gate);
      const bookIndex = parseInt(bookEl.dataset.bookIndex || index);
      
      // DODAJ PRZYCISK 📖 ROZDZIAŁY
      const actions = bookEl.querySelector('.edit-btn').parentNode;
      if (actions && !actions.querySelector('.chapter-btn')) {
        const chapterBtn = document.createElement('button');
        chapterBtn.className = 'chapter-btn';
        chapterBtn.innerHTML = `📖 ${window.WORLD_PSYCHE.gates[gateId-1]?.books[bookIndex]?.chapters?.length || 0}`;
        chapterBtn.style.cssText = `
          padding: 0.4rem 0.6rem; 
          font-size: 0.8rem; 
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white; 
          border: none; 
          border-radius: 6px; 
          cursor: pointer;
          margin-left: 0.25rem;
        `;
        chapterBtn.onclick = () => openChapterModal(gateId, bookIndex);
        actions.appendChild(chapterBtn);
      }
    });
  }

  // === MODAL API ===
  window.openChapterModal = function(gateId, bookIndex) {
    const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
    const book = gate?.books[bookIndex];
    
    if (!book) {
      alert("❌ Książka nie znaleziona!");
      return;
    }

    document.getElementById('chapterModal').classList.remove('hidden');
    document.getElementById('chapterGateName').textContent = gate.name;
    document.getElementById('chapterBookTitle').textContent = book.title;
    document.getElementById('chapterModalTitle').textContent = `Rozdziały: ${book.title}`;
    
    renderChapterList(gateId, bookIndex);
  };

  window.closeChapterModal = function() {
    document.getElementById('chapterModal').classList.add('hidden');
  };

  // === RENDER LISTY ROZDZIAŁÓW ===
  function renderChapterList(gateId, bookIndex) {
    const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
    const book = gate?.books[bookIndex];
    const list = document.getElementById('chapterList');
    
    if (!book?.chapters) {
      list.innerHTML = '<p style="text-align: center; color: #94a3b8;">Brak rozdziałów. Dodaj pierwszy!</p>';
      return;
    }

    list.innerHTML = book.chapters.map((chapter, index) => `
      <div class="chapter-item" data-index="${index}" style="
        background: rgba(56,189,248,0.1); 
        border: 1px solid rgba(56,189,248,0.3); 
        border-radius: 8px; 
        padding: 1rem; 
        margin-bottom: 0.75rem;
        position: relative;
      ">
        <div style="font-weight: bold; color: #38bdf8; margin-bottom: 0.5rem;">${chapter.title}</div>
        <div style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem; line-height: 1.4;">
          ${chapter.content.substring(0, 150)}${chapter.content.length > 150 ? '...' : ''}
        </div>
        <div style="color: #6b7280; font-size: 0.8rem;">
          Status: <span style="color: #10b981;">${chapter.status}</span>
        </div>
        <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 0.25rem;">
          <button onclick="editChapter(${gateId}, ${bookIndex}, ${index})" style="
            background: #f59e0b; color: white; border: none; border-radius: 4px; 
            padding: 0.25rem 0.5rem; font-size: 0.75rem; cursor: pointer;
          ">✏️</button>
          <button onclick="deleteChapter(${gateId}, ${bookIndex}, ${index})" style="
            background: #ef4444; color: white; border: none; border-radius: 4px; 
            padding: 0.25rem 0.5rem; font-size: 0.75rem; cursor: pointer;
          ">🗑️</button>
          <button onclick="moveChapter(${gateId}, ${bookIndex}, ${index}, 'up')" style="
            background: #3b82f6; color: white; border: none; border-radius: 4px; 
            padding: 0.25rem 0.5rem; font-size: 0.75rem; cursor: pointer;
          ">↑</button>
          <button onclick="moveChapter(${gateId}, ${bookIndex}, ${index}, 'down')" style="
            background: #3b82f6; color: white; border: none; border-radius: 4px; 
            padding: 0.25rem 0.5rem; font-size: 0.75rem; cursor: pointer;
          ">↓</button>
        </div>
      </div>
    `).join('');
  }

  // === CRUD OPERATIONS ===
  window.editChapter = function(gateId, bookIndex, chapterIndex) {
    alert('Edycja rozdziału – funkcja do rozbudowy!');
    // TODO: modal podedytora tekstu
  };

  window.deleteChapter = function(gateId, bookIndex, chapterIndex) {
    if (!confirm('Usunąć rozdział?')) return;
    
    const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
    if (gate?.books[bookIndex]) {
      gate.books[bookIndex].chapters.splice(chapterIndex, 1);
      saveWorldData();
      renderChapterList(gateId, bookIndex);
    }
  };

  window.moveChapter = function(gateId, bookIndex, chapterIndex, direction) {
    const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
    if (!gate?.books[bookIndex]?.chapters) return;
    
    const chapters = gate.books[bookIndex].chapters;
    const newIndex = direction === 'up' ? chapterIndex - 1 : chapterIndex + 1;
    
    if (newIndex >= 0 && newIndex < chapters.length) {
      [chapters[chapterIndex], chapters[newIndex]] = [chapters[newIndex], chapters[chapterIndex]];
      saveWorldData();
      renderChapterList(gateId, bookIndex);
    }
  };

  window.saveWorldData = function() {
    localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", JSON.stringify(window.WORLD_PSYCHE));
  };

  // === NOWY ROZDZIAŁ ===
  document.getElementById('addChapterBtn')?.addEventListener('click', function() {
    const gateId = parseInt(document.querySelector('#chapterModal [data-gate-id]').dataset.gateId);
    const bookIndex = parseInt(document.querySelector('#chapterModal [data-book-index]').dataset.bookIndex);
    
    const title = document.getElementById('newChapterTitle').value.trim();
    const content = document.getElementById('newChapterContent').value.trim();
    const status = document.getElementById('newChapterStatus').value;
    
    if (!title) {
      alert('Tytuł rozdziału wymagany!');
      return;
    }

    const gate = window.WORLD_PSYCHE.gates.find(g => g.id === gateId);
    if (gate?.books[bookIndex]) {
      gate.books[bookIndex].chapters.push({
        title, content, status
      });
      saveWorldData();
      renderChapterList(gateId, bookIndex);
      
      // Wyczyść formularz
      document.getElementById('newChapterTitle').value = '';
      document.getElementById('newChapterContent').value = '';
    }
  });

  // START
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
