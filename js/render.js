// render.js - Eterniverse Master Premium Rendering Engine v6.0
// Modularny silnik UI: Książki + Struktura + Mapa Bram + Sugestie Bella

class EterniverseRenderer {
  constructor(app) {
    this.app = app; // odniesienie do instancji EterniverseMaster
    this.elements = this.cacheElements();
  }

  cacheElements() {
    return {
      booksList: document.getElementById('books-list'),
      structureTree: document.getElementById('structure-tree'),
      mapaGrid: document.getElementById('mapa-grid'),
      suggestions: document.getElementById('suggestions'),
      bookTitle: document.getElementById('book-title'),
      bookContent: document.getElementById('book-content'),
      status: document.getElementById('status')
    };
  }

  // === GŁÓWNE RENDEROWANIE ===
  renderAll() {
    this.renderBooks();
    this.renderStructure();
    this.renderMapa();
    this.renderSuggestions([]);
  }

  // === KSIĘGI ===
  renderBooks() {
    const { booksList } = this.elements;
    if (!booksList) return;

    if (this.app.books.length === 0) {
      booksList.innerHTML = '<p style="opacity:0.6;text-align:center;padding:2rem;">Brak ksiąg – utwórz pierwszą</p>';
      return;
    }

    booksList.innerHTML = this.app.books.map(book => {
      const isActive = this.app.currentBook && this.app.currentBook.id === book.id;
      const wordCount = this.wordCount(book.content || '');
      return `
        <div class="item \( {isActive ? 'active' : ''}" onclick="master.openBook( \){book.id})">
          <strong>📖 ${this.escape(book.title || 'Bez tytułu')}</strong>
          <div style="font-size:0.9rem;opacity:0.8;margin-top:0.4rem;">
            ${wordCount} słów
          </div>
        </div>
      `;
    }).join('');
  }

  // === STRUKTURA UNIWERSUM ===
  renderStructure() {
    const { structureTree } = this.elements;
    if (!structureTree) return;

    if (this.app.structure.length === 0) {
      structureTree.innerHTML = '<p style="opacity:0.6;text-align:center;padding:1rem;">Brak struktur – dodaj pierwsze uniwersum</p>';
      return;
    }

    structureTree.innerHTML = this.app.structure.map(item => this.buildTreeNode(item)).join('');
  }

  buildTreeNode(item) {
    const icon = this.getIcon(item.type || 'Uniwersum');
    const children = item.children?.length
      ? `<div class="nested">${item.children.map(c => this.buildTreeNode(c)).join('')}</div>`
      : '';

    return `
      <div class="item" onclick="master.selectStruct(${item.id})">
        ${icon} ${this.escape(item.title)}
        ${children}
      </div>
    `;
  }

  getIcon(type) {
    const icons = {
      'Uniwersum': '🌌',
      'Świat': '🌍',
      'Tom': '📚',
      'Rozdział': '📖',
      'Fragment': '📄'
    };
    return icons[type] || '📄';
  }

  // === MAPA BRAM ===
  renderMapa() {
    const { mapaGrid } = this.elements;
    if (!mapaGrid) return;

    if (this.app.mapa.length === 0) {
      mapaGrid.innerHTML = '<p style="opacity:0.6;text-align:center;padding:1rem;">Brak bram</p>';
      return;
    }

    mapaGrid.innerHTML = this.app.mapa.map(brama => `
      <div class="item" onclick="master.insertBrama(${brama.id})">
        <strong>🔮 ${this.escape(brama.name)}</strong>
        <div style="font-size:0.9rem;opacity:0.8;margin-top:0.4rem;">
          ${brama.books?.length || 0} tytułów
        </div>
      </div>
    `).join('');
  }

  // === SUGESTIE BELLA ===
  renderSuggestions(suggestions = []) {
    const { suggestions: panel } = this.elements;
    if (!panel) return;

    if (suggestions.length === 0) {
      panel.innerHTML = '<p style="text-align:center;opacity:0.7;padding:2rem;">Kliknij „Bella AI”, by otrzymać sugestie</p>';
      return;
    }

    panel.innerHTML = suggestions.map(s => `
      <div class="suggestion">${s}</div>
    `).join('');
  }

  // === EDYCJA KSIĘGI ===
  renderCurrentBook() {
    const { bookTitle, bookContent } = this.elements;
    if (!this.app.currentBook) {
      if (bookTitle) bookTitle.value = '';
      if (bookContent) bookContent.value = '';
      return;
    }

    if (bookTitle) bookTitle.value = this.app.currentBook.title || '';
    if (bookContent) bookContent.value = this.app.currentBook.content || '';
  }

  // === STATUS ===
  setStatus(message, timeout = 5000) {
    const { status } = this.elements;
    if (!status) return;

    status.textContent = message;
    if (timeout > 0) {
      setTimeout(() => {
        if (status.textContent === message) {
          status.textContent = 'Gotowy';
        }
      }, timeout);
    }
  }

  // === POMOCNICZE ===
  wordCount(text = '') {
    return (text.match(/\b\w+\b/g) || []).length;
  }

  escape(text = '') {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // === ANIMACJE / EFEKTY (opcjonalne rozszerzenia) ===
  highlightElement(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.style.transition = 'background 0.4s';
      el.style.background = 'rgba(0,208,255,0.2)';
      setTimeout(() => {
        el.style.background = '';
      }, 800);
    }
  }
}

// Eksport dla użycia w głównej aplikacji
window.EterniverseRenderer = EterniverseRenderer;