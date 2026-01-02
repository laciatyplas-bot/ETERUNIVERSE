// render.js - Eterniverse UI Rendering Engine v3.0
// Obsługuje: Bella Asystent, Książki, Strukturę Universum, Mapę, Sugestie

class EterniverseRenderer {
  constructor(app) {
    this.app = app; // odniesienie do głównej instancji aplikacji (np. EterniverseMaster lub EterniverseApp)
    this.elements = {};
    this.cacheDOM();
  }

  cacheDOM() {
    this.elements = {
      header: document.querySelector('header'),
      profileSelect: document.getElementById('profileSelector') || document.getElementById('profile-select'),
      console: document.getElementById('console') || document.getElementById('console-input'),
      editor: document.getElementById('editor') || document.getElementById('book-content'),
      suggestions: document.getElementById('suggestions'),
      output: document.getElementById('output'),
      history: document.getElementById('history'),
      booksList: document.getElementById('books-list') || document.getElementById('book-list'),
      structureTree: document.getElementById('structure-tree') || document.getElementById('struct-list'),
      mapaGrid: document.getElementById('mapa-grid'),
      bookTitle: document.getElementById('book-title'),
      bookStatus: document.getElementById('book-status'),
    };
  }

  // === GŁÓWNE RENDEROWANIE ===

  renderAll() {
    this.renderBooks();
    this.renderStructure();
    this.renderMapa();
    this.renderSuggestions([]);
    this.updateStatus('🚀 Eterniverse gotowy');
    this.renderHistory();
  }

  // === KSIĄŻKI ===
  renderBooks() {
    const list = this.elements.booksList;
    if (!list) return;

    const books = this.app.books || this.app.currentBook ? [this.app.currentBook] : [];

    if (books.length === 0) {
      list.innerHTML = '<div class="empty">➕ Dodaj pierwszą książkę</div>';
      return;
    }

    list.innerHTML = books.map(book => {
      const isActive = this.app.currentBook && this.app.currentBook.id === book.id;
      const wordCount = this.wordCount(book.content || '');
      return `
        <div class="book-card \( {isActive ? 'active' : ''}" onclick="app.openBook( \){book.id})">
          <div class="book-title">📖 ${this.escapeHtml(book.title || 'Bez tytułu')}</div>
          <div class="book-stats">${wordCount} słów • ${book.status || 'IDEA'}</div>
        </div>
      `;
    }).join('');
  }

  renderCurrentBook() {
    if (!this.app.currentBook) return;

    if (this.elements.bookTitle) this.elements.bookTitle.value = this.app.currentBook.title || '';
    if (this.elements.editor) this.elements.editor.value = this.app.currentBook.content || '';
    if (this.elements.bookStatus) this.elements.bookStatus.value = this.app.currentBook.status || 'IDEA';

    this.renderBooks(); // podświetl aktywną
  }

  // === STRUKTURA UNIWERSUM ===
  renderStructure() {
    const container = this.elements.structureTree;
    if (!container) return;

    const structure = this.app.structure || [];

    if (structure.length === 0) {
      container.innerHTML = '<div class="empty-state">🏗️ Stwórz pierwsze uniwersum</div>';
      return;
    }

    container.innerHTML = this.buildTreeNode(structure);
  }

  buildTreeNode(items) {
    return items.map(item => {
      const isActive = this.app.currentStruct && this.app.currentStruct.id === item.id;
      const icon = this.getTypeIcon(item.type);
      const children = item.children && item.children.length 
        ? `<div class="children">${this.buildTreeNode(item.children)}</div>` 
        : '';
      return `
        <div class="struct-node \( {isActive ? 'active' : ''}" onclick="app.selectStruct( \){item.id})">
          ${icon} ${this.escapeHtml(item.title)}
          ${children}
        </div>
      `;
    }).join('');
  }

  // === MAPA BRAM ===
  renderMapa() {
    const grid = this.elements.mapaGrid;
    if (!grid) return;

    const mapa = this.app.mapa || [];

    if (mapa.length === 0) {
      grid.innerHTML = '<div class="empty">🌌 Brak bram – stwórz pierwsze połączenie</div>';
      return;
    }

    grid.innerHTML = mapa.map(brama => `
      <div class="brama-card" onclick="app.selectBrama(${brama.id})">
        <div class="brama-title">🔮 ${this.escapeHtml(brama.name)}</div>
        <div class="brama-tag">${brama.books?.length || 0} ksiąg</div>
      </div>
    `).join('');
  }

  // === SUGESTIE BELLA ===
  renderSuggestions(suggestions = []) {
    const panel = this.elements.suggestions;
    if (!panel) return;

    if (suggestions.length === 0) {
      panel.innerHTML = '💡 Bella czeka na Twój tekst...';
      return;
    }

    panel.innerHTML = suggestions.map(suggestion => {
      const isAccepted = this.app.profiles?.[this.app.currentProfile]?.accepted?.includes(suggestion);
      return `
        <div class="suggestion ${isAccepted ? 'accepted' : ''}">
          ${suggestion}
          ${!isAccepted ? `
            <button onclick="app.acceptSuggestion('${this.escapeJs(suggestion)}')">✓ Akceptuj</button>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  // === STATUS I HISTORIA ===
  updateStatus(message) {
    if (this.elements.output) {
      this.elements.output.textContent = message;
    }
    this.logHistory(message);
  }

  logHistory(message) {
    if (!this.elements.history) return;

    const time = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `<span style="color: var(--accent);">[${time}]</span> ${this.escapeHtml(message)}`;

    this.elements.history.appendChild(item);
    this.elements.history.scrollTop = this.elements.history.scrollHeight;

    // Zachowaj tylko ostatnie 20 wpisów
    while (this.elements.history.children.length > 20) {
      this.elements.history.removeChild(this.elements.history.firstChild);
    }
  }

  renderHistory() {
    if (this.elements.history) this.elements.history.innerHTML = '';
  }

  // === POMOCNICZE ===
  getTypeIcon(type) {
    const icons = {
      '🌌': '🌌', 'Uniwersum': '🌌',
      '🌍': '🌍', 'Świat': '🌍',
      '📚': '📚', 'Tom': '📚',
      '📖': '📖', 'Rozdział': '📖',
      '📄': '📄', 'Fragment': '📄'
    };
    return icons[type] || '📄';
  }

  wordCount(text = '') {
    return (text.match(/\b\w+\b/g) || []).length;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  escapeJs(text) {
    return text.replace(/'/g, "\\'");
  }

  // === MODALE ===
  showModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'bella-modal fade-in';
    modal.innerHTML = `
      <div class="modal-inner">
        <h3>${title}</h3>
        <div class="modal-content">${content}</div>
        <div class="modal-actions">
          \( {buttons.map(b => `<button onclick=" \){b.action}">${b.label}</button>`).join('')}
          <button onclick="this.closest('.bella-modal').remove()">Zamknij</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showSuggestionsModal(suggestions) {
    const content = suggestions.length 
      ? suggestions.map(s => `<div class="sug-item">${s}</div>`).join('')
      : '<p>🎉 Brak sugestii – tekst idealny!</p>';

    this.showModal(
      `💡 Sugestie Bella [${(this.app.currentProfile || 'wattpad').toUpperCase()}]`,
      content
    );
  }

  toast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      padding: 16px 24px; background: var(--success); color: #000;
      border-radius: 12px; box-shadow: var(--shadow); font-weight: 600;
      animation: fadeInUp 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  }
}

// Eksport dla użycia w głównej aplikacji
window.EterniverseRenderer = EterniverseRenderer;