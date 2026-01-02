// consola.js - Eterniverse Master Premium Console META Edition v7.0
// Zaawansowana, nieograniczona konsola meta-kontroli z pełną introspekcją i mocą twórczą

class EterniverseMetaConsole {
  constructor(app) {
    this.app = app; // odniesienie do głównej instancji EterniverseMaster
    this.history = [];
    this.historyIndex = -1;
    this.metaMode = false; // tryb meta – pełna introspekcja systemu

    this.init();
  }

  init() {
    this.createConsoleUI();
    this.bindConsoleEvents();
    this.log('🌌 Eterniverse META Console v7.0 uruchomiona', 'success');
    this.log('Wpisz "help" po pełną listę komend meta', 'info');
    this.log('Tryb meta: włączony (pełna moc twórcza)', 'warning');
  }

  createConsoleUI() {
    const consoleHTML = `
      <div id="eterniverse-meta-console" style="
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        width: 95%;
        max-width: 1200px;
        height: 70vh;
        background: linear-gradient(135deg, rgba(10,5,30,0.98), rgba(20,0,60,0.98));
        border-radius: 28px;
        border: 3px solid #7f4efd;
        box-shadow: 0 40px 100px rgba(127,78,253,0.4), 0 0 60px rgba(0,224,255,0.2);
        backdrop-filter: blur(30px);
        z-index: 99999;
        display: none;
        flex-direction: column;
        font-family: 'Consolas', 'Courier New', monospace;
        color: #e6f6ff;
        overflow: hidden;
      ">
        <div style="padding:20px 28px; background:linear-gradient(90deg, rgba(127,78,253,0.3), rgba(0,224,255,0.3)); border-bottom:2px solid #7f4efd; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:1.4rem; letter-spacing:2px;">🌌 ETERNIVERSE META CONSOLE v7.0</span>
          <span style="cursor:pointer; font-size:1.8rem;" onclick="metaConsole.toggle()">✕</span>
        </div>
        <div id="console-output" style="flex:1; padding:28px; overflow-y:auto; font-size:1.1rem; line-height:1.8;"></div>
        <div style="padding:20px 28px; border-top:2px solid #7f4efd; display:flex; background:rgba(127,78,253,0.1);">
          <input id="console-input" type="text" placeholder="META COMMAND: help | system | create | destroy | quantum | ..." 
                 style="flex:1; background:transparent; border:none; color:#e6f6ff; font-size:1.2rem; outline:none; letter-spacing:1px;">
          <button onclick="metaConsole.execute()" style="
            margin-left:20px; padding:0 50px; background:linear-gradient(45deg, #7f4efd, #00e0ff); color:#fff; border:none; border-radius:18px; cursor:pointer; font-weight:700; font-size:1.2rem; box-shadow:0 0 30px rgba(127,78,253,0.5);">
            ⚡ EXECUTE
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
        e.preventDefault();
        this.historyUp();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.historyDown();
      }
    });

    // Globalny skrót: Ctrl + Shift + `
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    const consola = document.getElementById('eterniverse-meta-console');
    if (!consola) return;

    const isVisible = consola.style.display === 'flex';
    consola.style.display = isVisible ? 'none' : 'flex';

    if (!isVisible) {
      document.getElementById('console-input')?.focus();
      this.log('META Console otwarta – pełna moc aktywowana', 'warning');
    }
  }

  log(message, type = 'info') {
    const output = document.getElementById('console-output');
    if (!output) return;

    const line = document.createElement('div');
    line.style.margin = '8px 0';
    line.style.padding = '4px 0';

    const timestamp = new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit', millisecond: '3-digit' });

    switch(type) {
      case 'success': line.style.color = '#40f0a0'; line.style.textShadow = '0 0 10px #40f0a0'; break;
      case 'error': line.style.color = '#ff4060'; line.style.textShadow = '0 0 10px #ff4060'; break;
      case 'warning': line.style.color = '#f0d040'; line.style.textShadow = '0 0 10px #f0d040'; break;
      case 'command': line.style.color = '#00e0ff'; line.style.textShadow = '0 0 15px #00e0ff'; break;
      case 'meta': line.style.color = '#c0a0ff'; line.style.textShadow = '0 0 20px #c0a0ff'; line.style.fontWeight = 'bold'; break;
      case 'quantum': line.style.color = '#7f4efd'; line.style.textShadow = '0 0 25px #7f4efd'; line.style.fontStyle = 'italic'; break;
    }

    line.innerHTML = `<span style="opacity:0.6; font-size:0.9rem;">[${timestamp}]</span> ${message}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  execute() {
    const input = document.getElementById('console-input');
    const command = input?.value?.trim();
    if (!command) return;

    this.log(`> ${command}`, 'command');
    input.value = '';

    this.history.unshift(command);
    this.historyIndex = -1;

    this.processMetaCommand(command.toLowerCase());
  }

  processMetaCommand(cmd) {
    const parts = cmd.split(' ');
    const main = parts[0];
    const args = parts.slice(1).join(' ');

    // === META KOMENDY ===
    switch(main) {
      case 'help':
      case 'pomoc':
        this.showMetaHelp();
        break;
      case 'clear':
      case 'cls':
        document.getElementById('console-output').innerHTML = '';
        this.log('Konsola oczyszczona – pustka przed kreacją', 'quantum');
        break;
      case 'status':
      case 'system':
        this.systemStatus();
        break;
      case 'create':
      case 'add':
        this.metaCreate(args);
        break;
      case 'destroy':
      case 'delete':
        this.metaDestroy(args);
        break;
      case 'quantum':
        this.quantumCommand(args);
        break;
      case 'bella':
        this.app.bellaAnalyze();
        this.log('Bella AI aktywowana – głęboka analiza uruchomiona', 'success');
        break;
      case 'generate':
      case 'ai':
        this.app.generateStory();
        this.log('Kwantowy generator treści aktywowany', 'quantum');
        break;
      case 'export':
        this.app.exportDocx();
        this.log('Eksport rzeczywistości do DOCX rozpoczęty', 'success');
        break;
      case 'brama':
        const num = parseInt(args);
        if (num && num >= 1 && num <= this.app.mapa.length) {
          this.app.insertBrama(num);
          this.log(`Splątano z Bramą ${num}`, 'meta');
        } else {
          this.log('Nieprawidłowa brama – użyj 1-' + this.app.mapa.length, 'error');
        }
        break;
      case 'profile':
        if (args === 'wattpad' || args === 'amazon') {
          this.app.currentProfile = args;
          document.getElementById('profile-select').value = args;
          this.log(`Świadomość przełączona na profil: ${args.toUpperCase()}`, 'meta');
        }
        break;
      case 'meta':
        this.metaMode = !this.metaMode;
        this.log(`Tryb META: ${this.metaMode ? 'AKTYWNY' : 'wyłączony'}`, this.metaMode ? 'meta' : 'warning');
        break;
      case 'time':
        this.log(`Aktualny czas w Eterniverse: ${new Date().toLocaleString('pl-PL')}`, 'info');
        break;
      case 'echo':
        this.log(args || 'cisza...', 'quantum');
        break;
      default:
        this.log(`Nieznana komenda meta: "${main}". Wpisz "help".`, 'error');
    }
  }

  showMetaHelp() {
    this.log('<strong>🌌 META KOMENDY ETERNIVERSE v7.0</strong>', 'meta');
    this.log('• <strong>help</strong> – ta lista');
    this.log('• <strong>clear</strong> – oczyść konsolę');
    this.log('• <strong>status / system</strong> – pełny raport systemu');
    this.log('• <strong>add/create [universe/child]</strong> – manifestuj nowe byty');
    this.log('• <strong>destroy/delete</strong> – usuń wybrane elementy');
    this.log('• <strong>quantum [komenda]</strong> – dostęp do kwantowych funkcji');
    this.log('• <strong>bella</strong> – aktywuj głęboką analizę Bella AI');
    this.log('• <strong>generate / ai</strong> – kwantowa kreacja treści');
    this.log('• <strong>export</strong> – eksport bieżącej rzeczywistości');
    this.log('• <strong>brama [1-5]</strong> – splątanie z wybraną bramą');
    this.log('• <strong>profile wattpad/amazon</strong> – przełącz świadomość');
    this.log('• <strong>meta</strong> – włącz/wyłącz tryb meta-kontroli');
    this.log('• <strong>time</strong> – aktualny czas w Eterniverse');
    this.log('• <strong>echo [tekst]</strong> – odbij myśl');
    this.log('<em>Ctrl + Shift + ` – otwórz META Console</em>');
  }

  systemStatus() {
    this.log('<strong>=== SYSTEM STATUS ===</strong>', 'meta');
    this.log(`Uniwersów w strukturze: ${this.app.structure.length}`);
    this.log(`Aktualny element: \( {this.app.currentElement?.title || 'brak'} ( \){this.app.currentElement?.type || '-'})`);
    this.log(`Profil świadomości: ${this.app.currentProfile.toUpperCase()}`);
    this.log(`Bram eterycznych: ${this.app.mapa.length}`);
    this.log(`Czas systemowy: ${new Date().toLocaleString('pl-PL')}`);
    this.log(`Tryb META: ${this.metaMode ? 'AKTYWNY' : 'nieaktywny'}`);
    this.log('=== END STATUS ===', 'meta');
  }

  metaCreate(args) {
    if (args.includes('universe')) {
      this.app.addRootUniverse();
      this.log('Manifestowano nowe Uniwersum', 'quantum');
    } else if (args.includes('child')) {
      this.app.addChild();
      this.log('Splątano nowe dziecko w hierarchii', 'quantum');
    } else {
      this.log('Użycie: create universe | create child', 'error');
    }
  }

  metaDestroy(args) {
    this.log('Funkcja destrukcji tymczasowo zablokowana – wszechświat chroni się przed rozpadem', 'warning');
  }

  quantumCommand(args) {
    this.log(`Kwantowe polecenie: ${args || 'pulsacja'}`, 'quantum');
    // Tu można dodać zaawansowane funkcje w przyszłości
  }

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
}

// Globalna inicjalizacja META Console
document.addEventListener('DOMContentLoaded', () => {
  if (window.master) {
    window.metaConsole = new EterniverseMetaConsole(window.master);
    console.log('Eterniverse META Console v7.0 załadowana – pełna moc dostępna');
  } else {
    console.warn('EterniverseMaster nie załadowany – META Console nieaktywna');
  }
});