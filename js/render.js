// render.js - Eterniverse Master Premium PRO Rendering Engine v12.0
// Pełny, modularny silnik renderujący z konsolą Bella Master (bez ograniczeń)

class EterniverseRenderer {
  constructor(app) {
    this.app = app;
    this.elements = this.cacheElements();
    this.consoleActive = false;
    this.commandHistory = [];
    this.historyIndex = -1;

    this.initConsole();
  }

  cacheElements() {
    return {
      structureTree: document.getElementById('structure-tree'),
      mapaGrid: document.getElementById('mapa-grid'),
      suggestions: document.getElementById('suggestions'),
      elementTitle: document.getElementById('element-title'),
      elementContent: document.getElementById('element-content'),
      currentPath: document.getElementById('current-path'),
      status: document.getElementById('status')
    };
  }

  // === RENDEROWANIE ===
  renderAll() {
    this.renderStructure();
    this.renderMapa();
    this.renderSuggestions([]);
    this.updateCurrentPath();
  }

  renderStructure() {
    const { structureTree } = this.elements;
    if (!structureTree) return;

    if (this.app.structure.length === 0) {
      structureTree.innerHTML = '<p style="opacity:0.6;text-align:center;padding:2.5rem;">Kliknij „+ Nowe Uniwersum”, by rozpocząć kreację</p>';
      return;
    }

    structureTree.innerHTML = this.app.structure.map(root => this.buildNode(root)).join('');
  }

  buildNode(node) {
    const icon = {
      'Uniwersum': '🌌',
      'Świat': '🌍',
      'Tom': '📚',
      'Rozdział': '📖',
      'Podrozdział': '📄',
      'Fragment': '📜'
    }[node.type] || '📄';

    const selected = this.app.currentElement && this.app.currentElement.id === node.id;

    let html = `
      <div class="tree-node \( {selected ? 'selected' : ''}" onclick="master.selectElement(' \){node.id}')">
        <span class="icon">${icon}</span>
        <strong>${this.escape(node.title || '(Bez tytułu)')}</strong>
        <small style="margin-left:8px;opacity:0.7;">${node.type || ''}</small>
    `;

    if (node.children && node.children.length > 0) {
      html += `<div class="nested">${node.children.map(child => this.buildNode(child)).join('')}</div>`;
    }

    html += `</div>`;
    return html;
  }

  renderMapa() {
    const { mapaGrid } = this.elements;
    if (!mapaGrid) return;

    mapaGrid.innerHTML = this.app.mapa.map(brama => `
      <div class="tree-node" onclick="master.insertBrama(${brama.id})">
        <span class="icon">🔮</span>
        <strong>${this.escape(brama.name)}</strong>
        <small style="margin-left:8px;opacity:0.7;">${brama.books?.length || 0} tytułów</small>
      </div>
    `).join('');
  }

  renderSuggestions(items = []) {
    const { suggestions } = this.elements;
    if (!suggestions) return;

    if (items.length === 0) {
      suggestions.innerHTML = '<p style="text-align:center;opacity:0.7;padding:4rem;line-height:1.8;">Wybierz element i użyj „Bella Analiza” lub „AI Generuj”</p>';
      return;
    }

    suggestions.innerHTML = items.map(item => `
      <div class="\( {item.type || 'suggestion'}"> \){this.escape(item.text)}</div>
    `).join('');
  }

  updateCurrentPath() {
    const { currentPath } = this.elements;
    if (!currentPath || !this.app.currentElement) {
      if (currentPath) currentPath.textContent = '';
      return;
    }

    const path = this.app.getPathTo(this.app.currentElement);
    currentPath.textContent = path.map(n => n.title || n.type).join(' → ');
  }

  renderCurrentElement() {
    const { elementTitle, elementContent } = this.elements;
    if (!this.app.currentElement) {
      if (elementTitle) elementTitle.value = '';
      if (elementContent) elementContent.value = '';
      return;
    }

    if (elementTitle) elementTitle.value = this.app.currentElement.title || '';
    if (elementContent) elementContent.value = this.app.currentElement.content || '';
  }

  setStatus(message, timeout = 6000) {
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
  escape(text = '') {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // === BELLA MASTER CONSOLE – PEŁNA MOC, ZERO OGRANICZEŃ ===
  initConsole() {
    this.createConsoleUI();
    this.bindConsoleEvents();
    this.consoleLog('Bella Master Console v1.0 uruchomiona. Ctrl + ` otwiera/zamyka.', 'success');
  }

  createConsoleUI() {
    const consoleHTML = `
      <div id="bella-console" style="
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 95%;
        max-width: 1200px;
        height: 65vh;
        background: rgba(10,10,30,0.98);
        border-radius: 24px;
        border: 2px solid #00e0ff;
        box-shadow: 0 30px 80px rgba(0,224,255,0.5);
        backdrop-filter: blur(25px);
        z-index: 99999;
        display: none;
        flex-direction: column;
        font-family: 'Consolas', monospace;
        color: #f0f8ff;
      ">
        <div style="padding:18px 24px; background:rgba(0,224,255,0.12); border-bottom:1px solid #00e0ff; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
          <span>🌌 BELLA MASTER CONSOLE v1.0</span>
          <span style="cursor:pointer; font-size:1.6rem;" onclick="renderer.toggleConsole()">✕</span>
        </div>
        <div id="console-output" style="flex:1; padding:24px; overflow-y:auto; font-size:1.05rem; line-height:1.7;"></div>
        <div style="padding:18px 24px; border-top:1px solid #334466; display:flex;">
          <input id="console-input" type="text" placeholder="Wpisz komendę... (help)" 
                 style="flex:1; background:transparent; border:none; color:#f0f8ff; font-size:1.05rem; outline:none;">
          <button onclick="renderer.executeCommand()" style="
            margin-left:18px; padding:0 40px; background:#00e0ff; color:#000; border:none; border-radius:14px; cursor:pointer; font-weight:700;">
            ▶
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', consoleHTML);
  }

  bindConsoleEvents() {
    const input = document.getElementById('console-input');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.historyUp();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.historyDown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        this.toggleConsole();
      }
    });
  }

  toggleConsole() {
    const consola = document.getElementById('bella-console');
    if (!consola) return;

    this.consoleActive = !this.consoleActive;
    consola.style.display = this.consoleActive ? 'flex' : 'none';

    if (this.consoleActive) {
      document.getElementById('console-input')?.focus();
    }
  }

  consoleLog(message, type = 'info') {
    const output = document.getElementById('console-output');
    if (!output) return;

    const line = document.createElement('div');
    line.style.margin = '6px 0';

    const timestamp = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    switch(type) {
      case 'success': line.style.color = '#40f0a0'; break;
      case 'error': line.style.color = '#ff4060'; break;
      case 'warning': line.style.color = '#f0d040'; break;
      case 'command': line.style.color = '#00e0ff'; break;
      case 'generated': line.style.color = '#a040f0'; break;
    }

    line.innerHTML = `<span style="opacity:0.6;">[${timestamp}]</span> ${message}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  executeCommand() {
    const input = document.getElementById('console-input');
    const command = input?.value?.trim();
    if (!command) return;

    this.consoleLog(`> ${command}`, 'command');
    input.value = '';

    this.commandHistory.unshift(command);
    this.historyIndex = -1;

    this.processCommand(command.toLowerCase());
  }

  processCommand(cmd) {
    const parts = cmd.split(' ');
    const main = parts[0];
    const args = parts.slice(1).join(' ');

    switch(main) {
      case 'help':
        this.showHelp();
        break;
      case 'clear':
        document.getElementById('console-output').innerHTML = '';
        this.consoleLog('Konsola wyczyszczona');
        break;
      case 'status':
        this.consoleLog(`Elementów w strukturze: ${this.app.structure.length}`);
        this.consoleLog(`Aktualny element: ${this.app.currentElement?.title || 'brak'}`);
        this.consoleLog(`Profil: ${this.app.currentProfile.toUpperCase()}`);
        break;
      case 'add':
        if (args === 'universe') {
          this.app.addRootUniverse();
          this.consoleLog('Dodano nowe uniwersum', 'success');
        } else if (args === 'child') {
          this.app.addChild();
          this.consoleLog('Dodano dziecko do bieżącego elementu', 'success');
        } else {
          this.consoleLog('Użycie: add universe | add child', 'error');
        }
        break;
      case 'generate':
        this.app.generateStory();
        this.consoleLog('Wygenerowano treść AI', 'generated');
        break;
      case 'bella':
        this.app.bellaAnalyze();
        this.consoleLog('Uruchomiono analizę Bella AI', 'success');
        break;
      case 'export':
        this.app.exportDocx();
        this.consoleLog('Rozpoczęto eksport DOCX', 'success');
        break;
      case 'brama':
        const num = parseInt(args);
        if (num && num >= 1 && num <= this.app.mapa.length) {
          this.app.insertBrama(num);
          this.consoleLog(`Wstawiono bramę ${num}`, 'success');
        } else {
          this.consoleLog('Nieprawidłowy numer bramy (1-' + this.app.mapa.length + ')', 'error');
        }
        break;
      case 'profile':
        if (args === 'wattpad' || args === 'amazon') {
          this.app.currentProfile = args;
          document.getElementById('profile-select').value = args;
          this.consoleLog(`Profil zmieniony na ${args.toUpperCase()}`, 'success');
        } else {
          this.consoleLog('Dostępne profile: wattpad, amazon', 'error');
        }
        break;
      default:
        this.consoleLog(`Nieznana komenda: "${main}". Wpisz "help".`, 'error');
    }
  }

  showHelp() {
    this.consoleLog('<strong>Dostępne komendy Bella Master Console:</strong>');
    this.consoleLog('• <strong>help</strong> – pokaż tę pomoc');
    this.consoleLog('• <strong>clear</strong> – wyczyść konsolę');
    this.consoleLog('• <strong>status</strong> – stan aplikacji');
    this.consoleLog('• <strong>add universe</strong> – nowe uniwersum');
    this.consoleLog('• <strong>add child</strong> – dodaj dziecko do bieżącego elementu');
    this.consoleLog('• <strong>generate</strong> – wygeneruj treść AI');
    this.consoleLog('• <strong>bella</strong> – analiza Bella AI');
    this.consoleLog('• <strong>export</strong> – eksport bieżącego elementu do DOCX');
    this.consoleLog('• <strong>brama [1-5]</strong> – wstaw wybraną bramę');
    this.consoleLog('• <strong>profile wattpad/amazon</strong> – zmień profil');
    this.consoleLog('<em>Ctrl + ` otwiera/zamyka konsolę</em>');
  }

  historyUp() {
    if (this.commandHistory.length === 0) return;
    this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
    document.getElementById('console-input').value = this.commandHistory[this.historyIndex] || '';
  }

  historyDown() {
    if (this.commandHistory.length === 0) return;
    this.historyIndex = Math.max(this.historyIndex - 1, -1);
    document.getElementById('console-input').value = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
  }
}

// Globalny dostęp
window.EterniverseRenderer = EterniverseRenderer;

// Automatyczne uruchomienie po załadowaniu głównej aplikacji
document.addEventListener('DOMContentLoaded', () => {
  if (window.master) {
    window.renderer = new EterniverseRenderer(window.master);
    window.master.renderer = window.renderer;
  }
});