'use strict';

/*
  =========================================
  BELLA MASTER CONSOLE v1.2
  Eterniverse Compatible — FIXED / HARDENED
  =========================================
  ✔ brak inline onclick
  ✔ bezpieczne eventy
  ✔ historia komend
  ✔ zero konfliktów z META / Master
  ✔ defensywne sprawdzanie DOM
*/

class BellaConsole {
  constructor(app = null) {
    this.app = app || window.master || null;
    this.history = [];
    this.historyIndex = -1;
    this.profile = localStorage.getItem('bella_profile') || 'wattpad';

    this.initUI();
    this.bindEvents();
    this.log('Bella Console aktywna. Ctrl + ` otwiera. Wpisz "help".', 'success');
  }

  /* =========================
     UI
  ========================= */
  initUI() {
    if (document.getElementById('bella-console')) return;

    const html = `
      <div id="bella-console" style="
        position:fixed; bottom:30px; left:50%; transform:translateX(-50%);
        width:95%; max-width:1200px; height:65vh;
        background:rgba(10,10,30,0.98);
        border-radius:24px;
        border:2px solid #00e0ff;
        box-shadow:0 30px 80px rgba(0,224,255,.5);
        backdrop-filter:blur(25px);
        z-index:99998;
        display:none;
        flex-direction:column;
        font-family:Consolas,monospace;
        color:#f0f8ff;
      ">
        <div id="bella-console-header" style="
          padding:18px 24px;
          background:rgba(0,224,255,.12);
          border-bottom:1px solid #00e0ff;
          font-weight:700;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <span>🌌 BELLA MASTER CONSOLE v1.2</span>
          <span id="bella-console-close" style="cursor:pointer;font-size:1.6rem;">✕</span>
        </div>

        <div id="bella-console-output" style="
          flex:1;
          padding:24px;
          overflow-y:auto;
          font-size:1.05rem;
          line-height:1.7;
        "></div>

        <div style="
          padding:18px 24px;
          border-top:1px solid #334466;
          display:flex;
        ">
          <input id="bella-console-input"
                 type="text"
                 autocomplete="off"
                 placeholder="help | status | generate | profile"
                 style="
                   flex:1;
                   background:transparent;
                   border:none;
                   color:#f0f8ff;
                   font-size:1.05rem;
                   outline:none;
                 ">
          <button id="bella-console-run" style="
            margin-left:18px;
            padding:0 40px;
            background:#00e0ff;
            color:#000;
            border:none;
            border-radius:14px;
            cursor:pointer;
            font-weight:700;
          ">▶</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  /* =========================
     EVENTS
  ========================= */
  bindEvents() {
    const input = document.getElementById('bella-console-input');
    const runBtn = document.getElementById('bella-console-run');
    const closeBtn = document.getElementById('bella-console-close');

    runBtn?.addEventListener('click', () => this.execute());
    closeBtn?.addEventListener('click', () => this.toggle());

    input?.addEventListener('keydown', e => {
      if (e.key === 'Enter') this.execute();
      if (e.key === 'ArrowUp') { e.preventDefault(); this.historyUp(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); this.historyDown(); }
      if (e.key === 'Escape') this.toggle();
    });

    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /* =========================
     CORE
  ========================= */
  toggle() {
    const el = document.getElementById('bella-console');
    if (!el) return;
    const open = el.style.display === 'flex';
    el.style.display = open ? 'none' : 'flex';
    if (!open) document.getElementById('bella-console-input')?.focus();
  }

  log(message, type = 'info') {
    const out = document.getElementById('bella-console-output');
    if (!out) return;

    const line = document.createElement('div');
    const time = new Date().toLocaleTimeString('pl-PL');

    const colors = {
      success: '#40f0a0',
      error: '#ff4060',
      warning: '#f0d040',
      command: '#00e0ff',
      generated: '#a040f0',
      info: '#f0f8ff'
    };

    line.style.margin = '6px 0';
    line.style.color = colors[type] || colors.info;
    line.innerHTML = `<span style="opacity:.6;">[${time}]</span> ${this.escapeHtml(message)}`;

    out.appendChild(line);
    out.scrollTop = out.scrollHeight;
  }

  execute() {
    const input = document.getElementById('bella-console-input');
    const raw = input?.value?.trim();
    if (!raw) return;

    this.log(`> ${raw}`, 'command');
    input.value = '';

    this.history.unshift(raw);
    this.historyIndex = -1;

    this.process(raw.toLowerCase());
  }

  /* =========================
     COMMANDS
  ========================= */
  process(cmd) {
    const [main, ...rest] = cmd.split(' ');
    const args = rest.join(' ');

    switch (main) {
      case 'help': return this.help();
      case 'clear':
        document.getElementById('bella-console-output').innerHTML = '';
        return this.log('Konsola wyczyszczona', 'success');

      case 'status':
        this.log(`Profil: ${this.profile}`);
        this.log(`Master: ${this.app ? 'OK' : 'brak'}`);
        return;

      case 'profile':
        if (args === 'wattpad' || args === 'amazon') {
          this.profile = args;
          localStorage.setItem('bella_profile', args);
          this.log(`Profil zmieniony na ${args.toUpperCase()}`, 'success');
        } else {
          this.log('Dostępne: wattpad | amazon', 'error');
        }
        return;

      case 'generate':
        return this.generate();

      default:
        this.log(`Nieznana komenda: ${main}`, 'error');
    }
  }

  help() {
    this.log('BELLA CONSOLE — KOMENDY');
    this.log('help – lista');
    this.log('clear – wyczyść');
    this.log('status – status systemu');
    this.log('profile wattpad | amazon');
    this.log('generate – przykładowa treść');
  }

  generate() {
    const text = this.profile === 'amazon'
      ? '⭐ Bestseller klasy premium. Odkryj teraz.'
      : 'W ciszy nocy zapadła decyzja, która zmieniła wszystko.';
    this.log(text, 'generated');
  }

  /* =========================
     HISTORY
  ========================= */
  historyUp() {
    if (!this.history.length) return;
    this.historyIndex = Math.min(this.historyIndex + 1, this.history.length - 1);
    document.getElementById('bella-console-input').value =
      this.history[this.historyIndex];
  }

  historyDown() {
    if (!this.history.length) return;
    this.historyIndex = Math.max(this.historyIndex - 1, -1);
    document.getElementById('bella-console-input').value =
      this.historyIndex === -1 ? '' : this.history[this.historyIndex];
  }

  /* =========================
     UTIL
  ========================= */
  escapeHtml(t = '') {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }
}

/* =========================
   INIT
========================= */
window.bellaConsole = new BellaConsole(window.master);