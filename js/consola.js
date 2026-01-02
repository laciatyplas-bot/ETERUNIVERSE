// consola.js — Eterniverse Master Premium Console META Edition v7.1 (STABLE)
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
    this.log('🌌 Eterniverse META Console v7.1 uruchomiona', 'success');
    this.log('Wpisz "help" po listę komend META', 'info');
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
        font-family:Consolas, monospace; color:#e6f6ff;
      ">
        <div style="
          padding:20px 28px;
          background:linear-gradient(90deg, rgba(127,78,253,.3), rgba(0,224,255,.3));
          border-bottom:2px solid #7f4efd;
          font-weight:700; display:flex; justify-content:space-between; align-items:center;
        ">
          <span style="font-size:1.4rem; letter-spacing:2px;">
            🌌 ETERNIVERSE META CONSOLE v7.1
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

    execBtn?.addEventListener('click', () => this.execute());
    closeBtn?.addEventListener('click', () => this.toggle());

    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.execute();
      if (e.key === 'ArrowUp') { e.preventDefault(); this.historyUp(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); this.historyDown(); }
    });

    // Ctrl + Shift + `
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

    const visible = el.style.display === 'flex';
    el.style.display = visible ? 'none' : 'flex';

    if (!visible) {
      document.getElementById('console-input')?.focus();
      this.log('META Console otwarta', 'meta');
    }
  }

  /* =========================
     LOGGING
  ========================= */
  log(message, type = 'info') {
    const out = document.getElementById('console-output');
    if (!out) return;

    const line = document.createElement('div');
    const time = new Date().toLocaleTimeString('pl-PL');

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

    this.history.unshift(cmd);
    this.historyIndex = -1;

    this.processCommand(cmd.toLowerCase());
  }

  processCommand(cmd) {
    const [main, ...rest] = cmd.split(' ');
    const args = rest.join(' ');

    switch (main) {
      case 'help':
        this.showHelp();
        break;

      case 'clear':
      case 'cls':
        document.getElementById('console-output').innerHTML = '';
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
        this.app?.bellaAnalyze?.();
        this.log('Bella AI uruchomiona', 'success');
        break;

      case 'generate':
      case 'ai':
        this.app?.generateAIContent?.();
        this.log('Generator AI aktywny', 'quantum');
        break;

      case 'export':
        this.app?.exportToDocx?.();
        this.log('Eksport DOCX', 'success');
        break;

      case 'profile':
        if (args === 'wattpad' || args === 'amazon') {
          this.app.currentProfile = args;
          document.getElementById('profile-select').value = args;
          this.log(`Profil ustawiony: ${args.toUpperCase()}`, 'meta');
        }
        break;

      case 'meta':
        this.metaMode = !this.metaMode;
        this.log(`Tryb META: ${this.metaMode ? 'AKTYWNY' : 'OFF'}`, 'meta');
        break;

      case 'time':
        this.log(`Czas: ${new Date().toLocaleString('pl-PL')}`, 'info');
        break;

      case 'echo':
        this.log(args || '...', 'quantum');
        break;

      default:
        this.log(`Nieznana komenda: ${main}`, 'error');
    }
  }

  showHelp() {
    this.log('<strong>META KOMENDY</strong>', 'meta');
    this.log('help — lista komend');
    this.log('clear / cls — wyczyść konsolę');
    this.log('status / system — status systemu');
    this.log('create universe | create child');
    this.log('bella — analiza Bella AI');
    this.log('generate / ai — generacja AI');
    this.log('export — eksport DOCX');
    this.log('profile wattpad / amazon');
    this.log('meta — przełącz tryb META');
    this.log('time — aktualny czas');
    this.log('echo [tekst]');
    this.log('Ctrl + Shift + ` — otwórz konsolę');
  }

  systemStatus() {
    this.log('=== SYSTEM STATUS ===', 'meta');
    this.log(`Profil: ${this.app.currentProfile?.toUpperCase()}`);
    this.log(`Aktualny element: ${this.app.currentElement?.title || 'brak'}`);
    this.log(`Tryb META: ${this.metaMode ? 'AKTYWNY' : 'OFF'}`);
    this.log('=== END STATUS ===', 'meta');
  }

  metaCreate(args) {
    if (args.includes('universe')) {
      this.app.addRootUniverse();
      this.log('Utworzono Uniwersum', 'quantum');
    } else if (args.includes('child')) {
      this.app.addChild();
      this.log('Dodano element potomny', 'quantum');
    } else {
      this.log('Użycie: create universe | create child', 'error');
    }
  }

  historyUp() {
    if (!this.history.length) return;
    this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
    document.getElementById('console-input').value = this.history[this.historyIndex];
  }

  historyDown() {
    if (!this.history.length) return;
    this.historyIndex = Math.max(this.historyIndex - 1, -1);
    document.getElementById('console-input').value =
      this.historyIndex === -1 ? '' : this.history[this.historyIndex];
  }
}

/* =========================
   START
========================= */
document.addEventListener('DOMContentLoaded', () => {
  if (window.master) {
    window.metaConsole = new EterniverseMetaConsole(window.master);
    console.log('META Console v7.1 załadowana');
  } else {
    console.warn('Brak master — META Console nieaktywna');
  }
});