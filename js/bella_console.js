// bella_console.js - Bella Master Console v1.0
// Nieograniczona konsola do rozbudowy strony w Eterniverse

class BellaConsole {
  constructor() {
    this.history = [];
    this.historyIndex = -1;
    this.profile = localStorage.getItem('bella_profile') || 'wattpad'; // Domyślny profil

    this.initUI();
    this.bindEvents();
    this.log('Bella Console aktywna. Ctrl + ` otwiera. Wpisz "help" po komendy.', 'success');
  }

  initUI() {
    const consoleHTML = `
      <div id="bella-console" style="
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        width: 95%; max-width: 1200px; height: 65vh;
        background: rgba(10,10,30,0.98); border-radius: 24px;
        border: 2px solid #00e0ff; box-shadow: 0 30px 80px rgba(0,224,255,0.5);
        backdrop-filter: blur(25px); z-index: 99999;
        display: none; flex-direction: column;
        font-family: 'Consolas', monospace; color: #f0f8ff;
      ">
        <div style="padding:18px 24px; background:rgba(0,224,255,0.12); border-bottom:1px solid #00e0ff; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
          <span>🌌 BELLA MASTER CONSOLE v1.0</span>
          <span style="cursor:pointer; font-size:1.6rem;" onclick="bellaConsole.toggle()">✕</span>
        </div>
        <div id="console-output" style="flex:1; padding:24px; overflow-y:auto; font-size:1.05rem; line-height:1.7;"></div>
        <div style="padding:18px 24px; border-top:1px solid #334466; display:flex;">
          <input id="console-input" type="text" placeholder="Wpisz komendę... (help / add section / change style / generate text)" 
                 style="flex:1; background:transparent; border:none; color:#f0f8ff; font-size:1.05rem; outline:none;">
          <button onclick="bellaConsole.execute()" style="
            margin-left:18px; padding:0 40px; background:#00e0ff; color:#000; border:none; border-radius:14px; cursor:pointer; font-weight:700;">
            ▶
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', consoleHTML);
  }

  bindEvents() {
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

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    const consola = document.getElementById('bella-console');
    if (!consola) return;

    const isActive = consola.style.display === 'flex';
    consola.style.display = isActive ? 'none' : 'flex';

    if (!isActive) {
      document.getElementById('console-input')?.focus();
    }
  }

  log(message, type = 'info') {
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

  execute() {
    const input = document.getElementById('console-input');
    const command = input?.value?.trim();
    if (!command) return;

    this.log(`> ${command}`, 'command');
    input.value = '';

    this.history.unshift(command);
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
        this.log('Konsola wyczyszczona');
        break;
      case 'status':
        this.log('Profil: ' + this.profile);
        this.log('Elementów na stronie: ' + document.body.children.length);
        break;
      case 'add':
        this.addElement(args);
        break;
      case 'change':
        this.changeStyle(args);
        break;
      case 'generate':
        this.generateContent(args);
        break;
      case 'remove':
        this.removeElement(args);
        break;
      case 'profile':
        if (args === 'wattpad' || args === 'amazon') {
          this.profile = args;
          localStorage.setItem('bella_profile', args);
          this.log(`Profil zmieniony na: ${args.toUpperCase()}`, 'success');
        } else {
          this.log('Dostępne profile: wattpad, amazon', 'error');
        }
        break;
      default:
        this.log(`Nieznana komenda: "${main}". Wpisz "help".`, 'error');
    }
  }

  showHelp() {
    this.log('<strong>Bella Console Komendy:</strong>');
    this.log('• <strong>help</strong> – lista komend');
    this.log('• <strong>clear</strong> – wyczyść konsolę');
    this.log('• <strong>status</strong> – status strony');
    this.log('• <strong>add [element]</strong> – dodaj sekcję/przycisk/tekst (np. add section "Nowa Sekcja")');
    this.log('• <strong>change [selector] [style]</strong> – zmień styl (np. change body background #ff0000)');
    this.log('• <strong>generate [text/lorem]</strong> – wygeneruj treść (np. generate text "fantasy story")');
    this.log('• <strong>remove [selector]</strong> – usuń element (np. remove #old-section)');
    this.log('• <strong>profile wattpad/amazon</strong> – zmień profil generowania');
  }

  addElement(args) {
    const [type, ...titleParts] = args.split(' ');
    const title = titleParts.join(' ');

    let el;
    switch (type) {
      case 'section':
        el = document.createElement('section');
        el.innerHTML = `<h2>${title || 'Nowa Sekcja'}</h2><p>Treść sekcji...</p>`;
        el.id = 'section-' + Math.floor(Math.random() * 1000);
        break;
      case 'button':
        el = document.createElement('button');
        el.textContent = title || 'Nowy Przycisk';
        el.onclick = () => alert('Przycisk kliknięty!');
        break;
      case 'text':
        el = document.createElement('p');
        el.textContent = title || 'Nowy tekst...';
        break;
      case 'image':
        el = document.createElement('img');
        el.src = title || 'https://placehold.co/400x200';
        el.alt = 'Nowe zdjęcie';
        break;
      default:
        this.log('Nieznany typ: section/button/text/image', 'error');
        return;
    }

    document.body.appendChild(el);
    this.log(`Dodano: ${type} z ID: ${el.id || 'brak ID'}`, 'success');
  }

  changeStyle(args) {
    const [selector, property, ...valueParts] = args.split(' ');
    const value = valueParts.join(' ');

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      this.log(`Nie znaleziono elementów dla: ${selector}`, 'error');
      return;
    }

    elements.forEach(el => {
      el.style[property] = value;
    });

    this.log(`Zmieniono styl ${property} na ${value} dla ${elements.length} elementów`, 'success');
  }

  generateContent(args) {
    const generated = this.profile === 'amazon' 
      ? '⭐ Rewolucyjny produkt! Najwyższa jakość, darmowa wysyłka. Zamów teraz!'
      : 'W mroku nocy, jej serce biło szybciej. Czy to przeznaczenie, czy iluzja?';

    this.log(`Wygenerowano w stylu ${this.profile.toUpperCase()}: ${generated}`, 'generated');
  }

  removeElement(args) {
    const elements = document.querySelectorAll(args);
    if (elements.length === 0) {
      this.log(`Nie znaleziono elementów do usunięcia: ${args}`, 'error');
      return;
    }

    elements.forEach(el => el.remove());
    this.log(`Usunięto ${elements.length} elementów`, 'success');
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

// Uruchomienie Bella Console
const bellaConsole = new BellaConsole();
window.bellaConsole = bellaConsole;