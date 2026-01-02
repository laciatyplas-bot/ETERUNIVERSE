'use strict';

/*
  =========================================
  ETERNIVERSE — RENDER ENGINE
  Bella Author Mode Compatible
  =========================================
  Odpowiedzialność:
  - TYLKO render DOM
  - ZERO logiki danych
  - ZERO globalnych onclick
*/

class Renderer {
  constructor(app) {
    this.app = app;

    this.elements = {
      structureTree: document.getElementById('structure-tree'),
      mapaGrid: document.getElementById('mapa-grid'),
      suggestions: document.getElementById('suggestions'),
      elementTitle: document.getElementById('element-title'),
      elementContent: document.getElementById('element-content'),
      currentPath: document.getElementById('current-path'),
      status: document.getElementById('status')
    };
  }

  /* =====================================
     GŁÓWNY RENDER
  ===================================== */
  renderAll() {
    this.renderStructure();
    this.renderMapa();
    this.renderEditPanel(this.app.currentElement || null);
  }

  /* =====================================
     1. STRUKTURA / DRZEWO
  ===================================== */
  renderStructure() {
    const container = this.elements.structureTree;
    if (!container) return;

    const structure = this.app.data.getStructure();

    if (!structure || structure.length === 0) {
      container.innerHTML = `
        <p style="opacity:.6;text-align:center;padding:3rem;">
          Brak struktury.<br>
          Utwórz pierwsze Uniwersum.
        </p>`;
      return;
    }

    container.innerHTML = structure
      .map(node => this.buildTreeNode(node))
      .join('');
  }

  buildTreeNode(node) {
    const icons = {
      Uniwersum: '🌌',
      Świat: '🌍',
      Tom: '📚',
      Rozdział: '📖',
      Podrozdział: '📄',
      Fragment: '📜'
    };

    const selected =
      this.app.currentElement &&
      this.app.currentElement.id === node.id;

    return `
      <div class="tree-node ${selected ? 'selected' : ''}"
           data-id="${node.id}"
           data-type="${node.type}">
        <span class="icon">${icons[node.type] || '📄'}</span>
        <strong>${this.escape(node.title || '(Bez tytułu)')}</strong>
        <small style="margin-left:6px;opacity:.7;">${node.type}</small>

        ${
          node.children && node.children.length
            ? `<div class="nested">
                ${node.children.map(c => this.buildTreeNode(c)).join('')}
               </div>`
            : ''
        }
      </div>
    `;
  }

  /* =====================================
     2. MAPA BRAM
  ===================================== */
  renderMapa() {
    const container = this.elements.mapaGrid;
    if (!container) return;

    const mapa = this.app.data.getMapa();

    if (!mapa || mapa.length === 0) {
      container.innerHTML = `
        <p style="opacity:.6;text-align:center;padding:3rem;">
          Brak Bram
        </p>`;
      return;
    }

    container.innerHTML = mapa.map((brama, i) => `
      <div class="brama-card"
           data-id="${brama.id}"
           style="--order:${i}">
        <div class="brama-name">${this.escape(brama.name)}</div>
        <div class="brama-books">
          ${brama.books ? brama.books.length : 0} książek
        </div>
        <div class="brama-hint">
          Kliknij, aby dodać do struktury
        </div>
      </div>
    `).join('');
  }

  /* =====================================
     3. PANEL EDYCJI
  ===================================== */
  renderEditPanel(element) {
    if (this.elements.elementTitle) {
      this.elements.elementTitle.value = element?.title || '';
    }

    if (this.elements.elementContent) {
      this.elements.elementContent.value = element?.content || '';
    }

    this.renderCurrentPath(element);
  }

  renderCurrentPath(element) {
    const container = this.elements.currentPath;
    if (!container) return;

    if (!element) {
      container.textContent = '';
      return;
    }

    const path = this.app.getPathToElement(element);
    container.textContent = path
      .map(p => p.title || p.type)
      .join(' → ');
  }

  /* =====================================
     4. SUGESTIE AI
  ===================================== */
  renderSuggestions(items = []) {
    const panel = this.elements.suggestions;
    if (!panel) return;

    if (!items.length) {
      panel.innerHTML = `
        <p style="opacity:.6;text-align:center;padding:3rem;">
          Brak sugestii
        </p>`;
      return;
    }

    panel.innerHTML = items.map((item, i) => `
      <div class="suggestion" style="--order:${i}">
        ${this.escape(item.text || '')}
      </div>
    `).join('');
  }

  /* =====================================
     5. STATUS
  ===================================== */
  setStatus(message = 'Gotowy', timeout = 5000) {
    if (!this.elements.status) return;

    this.elements.status.textContent = message;

    if (timeout > 0) {
      setTimeout(() => {
        if (this.elements.status.textContent === message) {
          this.elements.status.textContent = 'Gotowy';
        }
      }, timeout);
    }
  }

  /* =====================================
     HELPERS
  ===================================== */
  escape(text = '') {
    return String(text)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

// eksport globalny (dla app.js)
window.Renderer = Renderer;