// consola.js — Eterniverse Master Premium Console META Edition v7.2 (STABLE)
// PEŁNA, POPRAWIONA WERSJA — WKLEJ 1:1

'use strict';

class EterniverseMetaConsole {
  constructor(app) {
    this.app = app;
    this.history = [];
    this.historyIndex = -1;
    this.metaMode = true;

    this.init();
  }

  /* =========================
     INIT
  ========================= */
  init() {
    this.createConsoleUI();
    this.bindConsoleEvents();
    this.log('🌌 Eterniverse META Console v7.2 uruchomiona', 'success');
    this.log('Wpisz "help" po pełną listę komend META', 'info');
    this.log('Tryb META: AKTYWNY', 'warning');
  }

  /* =========================
     UI
  ========================= */
  createConsoleUI() {
    const html = `
      <div id="eterniverse-meta-console" style="
        position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
        width:95%; max-width:1200px; height:70vh;
        background:linear-gradient(135deg, rgba(10,5,30,.98), rgba(20,0,60,.98));
        border-radius:28px; border:3px solid #7f4efd;
        box-shadow:0 40px 100px rgba(127,78,253,.4), 0 0 60px rgba(0,224,255,.2);
        backdrop-filter:blur(30px); z-index:99999;
        display:none; flex-direction:column;
        font-family:'Courier New', Consolas, monospace; color:#e6f6ff;
      ">
        <div style="
          padding:20px 28px;
          background:linear-gradient(90deg, rgba(127,78,253,.3), rgba(0,224,255,.3));
          border-bottom:2px solid #7f4efd;
          font-weight:700; display:flex; justify-content:space-between; align-items:center;
        ">
          <span style="font-size:1.4rem; letter-spacing:2px;">
            🌌 ETERNIVERSE META CONSOLE v7.2
          </span>
          <span id="meta-close" style="cursor:pointer;font-size:1.8rem;">✕</span>
        </div>

        <div id="console-output"
             style="flex:1; padding:28px; overflow-y:auto;
                    font-size:1.1rem; line-height:1.8;"></div>

        <div style="
          padding:20px 28px; border-top:2px solid #7f4efd;
          display:flex; background:rgba(127,78,253,.1);
        ">
          <input id="console-input" type="text"
            placeholder="META COMMAND: help | system | create | quantum | ..."
            style="flex:1; background:transparent; border:none;
                   color:#e6f6ff; font-size:1.2rem; outline:none;">
          <button id="meta-exec" style="
            margin-left:20px; padding:0 50px;
            background:linear-gradient(45deg,#7f4efd,#00e0ff);
            color:#fff; border:none; border-radius:18px;
            cursor:pointer; font-weight:700; font-size:1.2rem;
            box-shadow:0 0 30px rgba(127,78,253,.5);
          ">
            ⚡ EXECUTE
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  bindConsoleEvents() {
    const input = document.getElementById('console-input');
    const execBtn = document.getElementById('meta-exec');
    const closeBtn = document.getElementById('meta-close');

    if (execBtn) execBtn.addEventListener('click', () => this.execute());
    if (closeBtn) closeBtn.addEventListener('click', () => this.toggle());

    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
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
    }

    // Globalny skrót: Ctrl + Shift + `
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    const el = document.getElementById('eterniverse-meta-console');
    if (!el) return;

    const isVisible = el.style.display === 'flex';
    el.style.display = isVisible ? 'none' : 'flex';

    if (!isVisible) {
      const input = document.getElementById('console-input');
      if (input) input.focus();
      this.log('META Console otwarta — witaj, Architekcie', 'meta');
    } else {
      this.log('META Console zamknięta', 'info');
    }
  }

  /* =========================
     LOGGING
  ========================= */
  log(message, type = 'info') {
    const out = document.getElementById('console-output');
    if (!out) return;

    const line = document.createElement('div');
    const time = new Date().toLocaleTimeString('pl-PL', { hour12: false });

    const colors = {
      success: '#40f0a0',
      error: '#ff4060',
      warning: '#f0d040',
      command: '#00e0ff',
      meta: '#c0a0ff',
      quantum: '#7f4efd',
      info: '#e6f6ff'
    };

    line.style.color = colors[type] || colors.info;
    line.style.margin = '6px 0';
    line.style.opacity = type === 'command' ? '0.8' : '1';
    line.innerHTML = `<span style="opacity:.6">[${time}]</span> ${message}`;

    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  /* =========================
     COMMAND EXECUTION
  ========================= */
  execute() {
    const input = document.getElementById('console-input');
    const cmd = input?.value?.trim();
    if (!cmd) return;

    this.log(`> ${cmd}`, 'command');
    input.value = '';

    // Historia
    this.history.unshift(cmd);
    if (this.history.length > 100) this.history.pop(); // limit
    this.historyIndex = -1;

    this.processCommand(cmd.toLowerCase());
  }

  processCommand(cmd) {
    const parts = cmd.split(' ');
    const main = parts[0];
    const args = parts.slice(1).join(' ');

    switch (main) {
      case 'help':
        this.showHelp();
        break;

      case 'clear':
      case 'cls':
        const output = document.getElementById('console-output');
        if (output) output.innerHTML = '';
        this.log('Konsola wyczyszczona', 'quantum');
        break;

      case 'status':
      case 'system':
        this.systemStatus();
        break;

      case 'create':
      case 'add':
        this.metaCreate(args);
        break;

      case 'bella':
        if (this.app?.bellaAnalyze) {
          this.app.bellaAnalyze();
          this.log('Bella AI uruchomiona — analiza w toku', 'success');
        } else {
          this.log('Bella AI niedostępna', 'error');
        }
        break;

      case 'generate':
      case 'ai':
        if (this.app?.generateAIContent) {
          this.app.generateAIContent();
          this.log('Generator AI aktywny', 'quantum');
        } else {
          this.log('Generator AI niedostępny', 'error');
        }
        break;

      case 'export':
        if (this.app?.exportToDocx) {
          this.app.exportToDocx();
          this.log('Eksport DOCX zainicjowany', 'success');
        } else {
          this.log('Funkcja eksportu niedostępna', 'error');
        }
        break;

      case 'profile':
        if (args === 'wattpad' || args === 'amazon') {
          if (this.app) this.app.currentProfile = args;
          const select = document.getElementById('profile-select');
          if (select) select.value = args;
          this.log(`Profil zmieniony na: ${args.toUpperCase()}`, 'meta');
        } else {
          this.log('Dostępne profile: wattpad | amazon', 'error');
        }
        break;

      case 'meta':
        this.metaMode = !this.metaMode;
        this.log(`Tryb META: ${this.metaMode ? 'AKTYWNY' : 'WYŁĄCZONY'}`, 'meta');
        break;

      case 'theme':
        document.body.classList.toggle('light-theme');
        this.log(`Tryb jasny: ${document.body.classList.contains('light-theme') ? 'WŁĄCZONY' : 'WYŁĄCZONY'}`, 'info');
        break;

      case 'reset':
        if (confirm('Zresetować całą aplikację? (dane lokalne zostaną usunięte)')) {
          localStorage.clear();
          location.reload();
        }
        break;

      case 'version':
        this.log('Eterniverse META Console v7.2 | Master Edition 2026', 'quantum');
        break;

      case 'time':
        this.log(`Aktualny czas: ${new Date().toLocaleString('pl-PL')}`, 'info');
        break;

      case 'echo':
        this.log(args || '...', 'quantum');
        break;

      default:
        this.log(`Nieznana komenda: "${main}". Wpisz "help" po listę.`, 'error');
    }
  }

  showHelp() {
    this.log('<strong>⭐ DOSTĘPNE KOMENDY META</strong>', 'meta');
    this.log('help — wyświetla tę listę');
    this.log('clear / cls — czyści konsolę');
    this.log('status / system — status aplikacji');
    this.log('create universe — tworzy nowe uniwersum');
    this.log('create child — dodaje element potomny');
    this.log('bella — uruchamia analizę Bella AI');
    this.log('generate / ai — aktywuje generator treści AI');
    this.log('export — eksportuje do DOCX');
    this.log('profile wattpad | amazon — zmienia profil');
    this.log('meta — przełącza tryb META');
    this.log('theme — przełącza tryb jasny/ciemny');
    this.log('reset — resetuje aplikację (ostrożnie!)');
    this.log('version — wersja konsoli');
    this.log('time — aktualny czas');
    this.log('echo [tekst] — powtarza tekst');
    this.log('Ctrl + Shift + ` — otwiera/zamyka konsolę');
  }

  systemStatus() {
    this.log('=== STATUS SYSTEMU ===', 'meta');
    this.log(`Wersja konsoli: v7.2 Master Edition`);
    this.log(`Profil aktywny: ${this.app?.currentProfile?.toUpperCase() || 'BRAK'}`);
    this.log(`Aktualny element: ${this.app?.currentElement?.title || 'brak'}`);
    this.log(`Tryb META: ${this.metaMode ? 'AKTYWNY' : 'WYŁĄCZONY'}`);
    this.log(`Historia komend: ${this.history.length} wpisów`);
    this.log('=== KONIEC STATUSU ===', 'meta');
  }

  metaCreate(args) {
    if (args.includes('universe')) {
      if (this.app?.addRootUniverse) {
        this.app.addRootUniverse();
        this.log('Nowe Uniwersum utworzone', 'quantum');
      }
    } else if (args.includes('child')) {
      if (this.app?.addChild) {
        this.app.addChild();
        this.log('Dodano element potomny', 'quantum');
      }
    } else {
      this.log('Użycie: create universe | create child', 'error');
    }
  }

  historyUp() {
    if (this.history.length === 0) return;
    this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
    const input = document.getElementById('console-input');
    if (input) input.value = this.history[this.historyIndex];
  }

  historyDown() {
    if (this.history.length === 0) return;
    this.historyIndex = Math.max(this.historyIndex - 1, -1);
    const input = document.getElementById('console-input');
    if (input) input.value = this.historyIndex === -1 ? '' : this.history[this.historyIndex];
  }
}

/* =========================
   START
========================= */
document.addEventListener('DOMContentLoaded', () => {
  if (window.master || window.app) {
    window.metaConsole = new EterniverseMetaConsole(window.master || window.app);
    console.log('🌌 META Console v7.2 załadowana pomyślnie');
  } else {
    console.warn('Brak instancji master/app — META Console nieaktywna');
  }
});