class Renderer {
  constructor(app) {
    this.app = app; // odniesienie do głównej aplikacji (master)
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

  // Główna metoda – renderuje wszystko naraz
  renderAll() {
    this.renderStructure();
    this.renderMapa();
    this.renderEditPanel(this.app.currentElement);
    this.renderSuggestions([]);
  }

  // === 1. RENDEROWANIE HIERARCHII ===
  renderStructure() {
    const container = this.elements.structureTree;
    if (!container) return;

    const structure = this.app.data.getStructure();
    if (structure.length === 0) {
      container.innerHTML = `
        <p style="opacity:0.6;text-align:center;padding:3rem;font-size:1.1rem;">
          Brak uniwersów<br><br>
          Kliknij „+ Nowe Uniwersum”, by rozpocząć kreację
        </p>`;
      return;
    }

    container.innerHTML = structure.map(root => this.buildTreeNode(root)).join('');
  }

  buildTreeNode(node) {
    const icons = {
      'Uniwersum': '🌌',
      'Świat': '🌍',
      'Tom': '📚',
      'Rozdział': '📖',
      'Podrozdział': '📄',
      'Fragment': '📜'
    };
    const icon = icons[node.type] || '📄';
    const isSelected = this.app.currentElement && this.app.currentElement.id === node.id;

    let html = `
      <div class="tree-node \( {isSelected ? 'selected' : ''}" onclick="master.selectElement(' \){node.id}')">
        <span class="icon">${icon}</span>
        <strong>${this.escape(node.title || '(Bez tytułu)')}</strong>
        <small style="margin-left:8px;opacity:0.7;">${node.type || ''}</small>
    `;

    if (node.children && node.children.length > 0) {
      html += `<div class="nested">${node.children.map(child => this.buildTreeNode(child)).join('')}</div>`;
    }

    html += `</div>`;
    return html;
  }

  // === 2. RENDEROWANIE MAPY BRAM ===
  renderMapa() {
    const container = this.elements.mapaGrid;
    if (!container) return;

    const mapa = this.app.data.getMapa();
    container.innerHTML = mapa.map(brama => `
      <div class="tree-node" onclick="master.insertBrama(${brama.id})">
        <span class="icon">🔮</span>
        <strong>${this.escape(brama.name)}</strong>
        <small style="margin-left:8px;opacity:0.7;">${brama.books?.length || 0} tytułów</small>
      </div>
    `).join('');
  }

  // === 3. RENDEROWANIE PANELU EDYCJI ===
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
    if (!this.elements.currentPath || !element) {
      if (this.elements.currentPath) this.elements.currentPath.innerHTML = '';
      return;
    }

    const path = this.app.getPathToElement(element);
    this.elements.currentPath.innerHTML = path.map(n => `${n.title || n.type}`).join(' → ');
  }

  // === 4. RENDEROWANIE SUGESTII BELLA AI ===
  renderSuggestions(items = []) {
    const panel = this.elements.suggestions;
    if (!panel) return;

    if (items.length === 0) {
      panel.innerHTML = `
        <p style="text-align:center;opacity:0.7;padding:4rem;line-height:1.8;">
          Wybierz element i użyj „Bella Analiza” lub „AI Generuj”
        </p>`;
      return;
    }

    panel.innerHTML = items.map(item => `
      <div class="${item.type || 'suggestion'}">
        ${this.escape(item.text)}
      </div>
    `).join('');
  }

  // === 5. STATUS DOLNY PASEK ===
  setStatus(message, timeout = 6000) {
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

  // === POMOCNICZA ===
  escape(text = '') {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}