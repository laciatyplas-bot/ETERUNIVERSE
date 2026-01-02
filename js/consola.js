// consola.js - Eterniverse Master Premium Console Commands v6.0
// Moduł konsoli poleceń tekstowych i głosowych

class EterniverseConsole {
  constructor(app) {
    this.app = app; // odniesienie do głównej instancji EterniverseMaster
    this.history = [];
    this.commandLog = [];

    this.init();
  }

  init() {
    this.createConsoleUI();
    this.bindConsoleEvents();
    this.log('Consola Eterniverse gotowa. Wpisz "pomoc" po listę komend.');
  }

  createConsoleUI() {
    const consoleHTML = `
      <div id="eterniverse-console" style="
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 800px;
        background: rgba(15,15,25,0.95);
        border-radius: 16px;
        border: 1px solid #334466;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        backdrop-filter: blur(15px);
        z-index: 10000;
        font-family: 'Consolas', 'Courier New', monospace;
        color: #e6f6ff;
        display: none;
        flex-direction: column;
      ">
        <div style="padding: 12px 16px; border-bottom: 1px solid #334466; font-weight: 600; color: #00d0ff;">
          🌌 Consola Eterniverse <span style="float:right;cursor:pointer;" onclick="consola.toggle()">✕</span>
        </div>
        <div id="console-output" style="flex:1; padding:16px; max-height:300px; overflow-y:auto; font-size:0.95rem;"></div>
        <div style="display:flex; border-top:1px solid #334466;">
          <input id="console-input" type="text" placeholder="Wpisz komendę... (lub Ctrl+` aby otworzyć)" 
                 style="flex:1; padding:12px 16px; background:transparent; border:none; color:#e6f6ff; outline:none;">
          <button onclick="consola.execute()" style="
            padding:0 20px; background:#00d0ff; color:#000; border:none; cursor:pointer; font-weight:600;">
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
        this.execute();
      }
      if (e.key === 'ArrowUp') {
        this.historyUp();
      }
      if (e.key === 'ArrowDown') {
        this.historyDown();
      }
    });

    // Globalny skrót Ctrl + ` (backtick)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    const consola = document.getElementById('eterniverse-console');
    if (!consola) return;

    if (consola.style.display === 'flex') {
      consola.style.display = 'none';
    } else {
      consola.style.display = 'flex';
      document.getElementById('console-input')?.focus();
    }
  }

  log(message, type = 'info') {
    const output = document.getElementById('console-output');
    if (!output) return;

    const line = document.createElement('div');
    line.style.margin = '4px 0';
    line.style.opacity = '0.9';

    const timestamp = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (type === 'success') line.style.color = '#50c878';
    if (type === 'error') line.style.color = '#e74c3c';
    if (type === 'command') line.style.color = '#00d0ff';

    line.innerHTML = `<span style="opacity:0.6;">[${timestamp}]</span> ${message}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;

    this.commandLog.push(message);
  }

  execute(rawCommand = null) {
    const input = document.getElementById('console-input');
    const command = rawCommand || input?.value?.trim();

    if (!command) return;

    this.log(`> ${command}`, 'command');
    input.value = '';

    const lower = command.toLowerCase();
    const args = command.split(' ').slice(1);

    // === KOMENDY ===
    if (lower === 'pomoc' || lower === 'help') {
      this.showHelp();
    } else if (lower.startsWith('nowa') || lower.startsWith('new')) {
      this.app.addBook();
      this.log('Utworzono nową księgę', 'success');
    } else if (lower.startsWith('bella')) {
      this.app.bellaAnalyze();
      this.log('Analiza Bella uruchomiona', 'success');
    } else if (lower.includes('eksport') || lower.includes('docx')) {
      this.app.exportDocx();
      this.log('Eksport DOCX rozpoczęty', 'success');
    } else if (lower.startsWith('brama') || lower.startsWith('wstaw')) {
      const num = parseInt(args[0]) || parseInt(command.match(/\d+/)?.[0]);
      if (num && num >= 1 && num <= 5) {
        this.app.insertBrama(num);
        this.log(`Wstawiono Bramę ${num}`, 'success');
      } else {
        this.log('Podaj numer bramy: 1-5', 'error');
      }
    } else if (lower === 'profil wattpad') {
      this.app.currentProfile = 'wattpad';
      document.getElementById('profile-select').value = 'wattpad';
      this.log('Przełączono na profil Wattpad');
    } else if (lower === 'profil amazon') {
      this.app.currentProfile = 'amazon';
      document.getElementById('profile-select').value = 'amazon';
      this.log('Przełączono na profil Amazon');
    } else if (lower === 'dyktuj start') {
      this.app.startDictation();
      this.log('Dyktowanie rozpoczęte');
    } else if (lower === 'dyktuj stop') {
      this.app.stopDictation();
      this.log('Dyktowanie zatrzymane');
    } else if (lower === 'clear' || lower === 'cls') {
      document.getElementById('console-output').innerHTML = '';
      this.log('Konsola wyczyszczona');
    } else if (lower === 'status') {
      this.log(`Księgi: ${this.app.books.length} | Profil: ${this.app.currentProfile.toUpperCase()} | Bramy: ${this.app.mapa.length}`);
    } else {
      this.log(`Nieznana komenda: "${command}". Wpisz "pomoc" po listę.`, 'error');
    }

    this.history.unshift(command);
    this.historyIndex = -1;
  }

  showHelp() {
    this.log('<strong>Dostępne komendy:</strong>');
    this.log('• <strong>nowa</strong> – utwórz nową księgę');
    this.log('• <strong>bella</strong> – uruchom analizę Bella AI');
    this.log('• <strong>eksportuj</strong> / <strong>docx</strong> – eksportuj bieżącą księgę');
    this.log('• <strong>brama [1-5]</strong> – wstaw wybraną bramę do treści');
    this.log('• <strong>profil wattpad</strong> / <strong>amazon</strong> – przełącz profil');
    this.log('• <strong>dyktuj start/stop</strong> – kontrola dyktowania');
    this.log('• <strong>status</strong> – informacje o stanie aplikacji');
    this.log('• <strong>clear</strong> – wyczyść konsolę');
    this.log('• <strong>pomoc</strong> – pokaż tę listę');
    this.log('<em>Skrót: Ctrl + ` otwiera/zamyka konsolę</em>');
  }

  // Historia komend (strzałki góra/dół)
  historyIndex = -1;

  historyUp() {
    if (this.history.length === 0) return;
    this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
    document.getElementById('console-input').value = this.history[this.historyIndex] || '';
  }

  historyDown() {
    if (this.history.length === 0) return;
    this.historyIndex = Math.max(this.historyIndex - 1, -1);
    document.getElementById('console-input').value = this.historyIndex === -1 ? '' : this.history[this.historyIndex];
  }

  // Obsługa głosowych komend (opcjonalne rozszerzenie)
  listenForVoiceCommands(transcript) {
    this.execute(transcript);
  }
}

// Inicjalizacja konsoli po załadowaniu głównej aplikacji
document.addEventListener('DOMContentLoaded', () => {
  if (window.master) {
    window.consola = new EterniverseConsole(window.master);
  } else {
    console.warn('EterniverseMaster nie załadowany – consola nieaktywna');
  }
});