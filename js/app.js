// app.js - Eterniverse Master Premium PRO v13.0 – Full Master Edition
// Główny silnik aplikacji – kompletny, samodzielny, zintegrowany z DataMaster, Renderer i Bella Console

'use strict';

class EterniverseMasterPRO {
  constructor() {
    // === WERSJA ===
    this.VERSION = 'v13.0-master';

    // === REFERENCJE DO INNYCH SILNIKÓW ===
    this.data = window.dataMaster || null; // DataMaster
    this.renderer = window.renderer || null; // Renderer
    this.console = window.bellaConsole || window.metaConsole || null; // Bella Console

    // === STAN APLIKACJI ===
    this.currentElement = null;
    this.currentProfile = this.data?.getProfile() || 'wattpad';
    this.recognition = null;
    this.isDictating = false;

    // === INICJALIZACJA ===
    this.init();
  }

  init() {
    if (!this.data) {
      console.error('DataMaster nie załadowany – aplikacja nie może działać');
      this.status('BŁĄD: Brak DataMaster', 0);
      return;
    }

    this.updateUIProfile();
    this.bindAllEvents();
    this.renderEverything();
    this.initSpeechRecognition();
    this.status(`Eterniverse Master PRO ${this.VERSION} — świadomość aktywna`);
  }

  // === UI & BINDING ===
  updateUIProfile() {
    const select = document.getElementById('profile-select');
    if (select) select.value = this.currentProfile;
  }

  bindAllEvents() {
    // Profil
    const profileSelect = document.getElementById('profile-select');
    if (profileSelect) {
      profileSelect.onchange = (e) => {
        this.currentProfile = e.target.value;
        this.data.setProfile(this.currentProfile);
        this.status(`Profil zmieniony na: ${this.currentProfile.toUpperCase()}`);
      };
    }

    // Główne akcje
    document.getElementById('add-universe')?.addEventListener('click', () => this.addRootUniverse());
    document.getElementById('add-child')?.addEventListener('click', () => this.addChildElement());
    document.getElementById('generate-story')?.addEventListener('click', () => this.generateAIContent());
    document.getElementById('bella-analyze')?.addEventListener('click', () => this.bellaDeepAnalysis());
    document.getElementById('export-docx')?.addEventListener('click', () => this.exportToDocx());
    document.getElementById('backup-data')?.addEventListener('click', () => this.createBackup());
    document.getElementById('export-data')?.addEventListener('click', () => this.data.exportAllData());
    document.getElementById('start-dictate')?.addEventListener('click', () => this.startDictation());
    document.getElementById('stop-dictate')?.addEventListener('click', () => this.stopDictation());

    // Autozapis
    document.getElementById('element-title')?.addEventListener('input', () => this.autoSaveCurrent());
    document.getElementById('element-content')?.addEventListener('input', () => this.autoSaveCurrent());
  }

  renderEverything() {
    if (this.renderer) {
      this.renderer.renderAll();
      this.renderer.renderEditPanel(this.currentElement);
    }
  }

  // === OPERACJE NA HIERARCHII ===
  generateUniqueId() {
    return 'master_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  addRootUniverse() {
    const newUniverse = {
      id: this.generateUniqueId(),
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      content: '',
      created: new Date().toISOString(),
      children: []
    };

    const structure = this.data.getStructure();
    structure.push(newUniverse);
    this.data.setStructure(structure);

    this.currentElement = newUniverse;
    this.renderEverything();
    this.status('Nowe Uniwersum manifestowane');
  }

  addChildElement() {
    if (!this.currentElement) {
      alert('Wybierz element nadrzędny w hierarchii');
      return;
    }

    const hierarchy = ['Uniwersum', 'Świat', 'Tom', 'Rozdział', 'Podrozdział', 'Fragment'];
    const currentIndex = hierarchy.indexOf(this.currentElement.type || 'Uniwersum');
    const nextType = hierarchy[currentIndex + 1] || 'Fragment';

    const newChild = {
      id: this.generateUniqueId(),
      type: nextType,
      title: `Nowy ${nextType}`,
      content: '',
      created: new Date().toISOString(),
      children: []
    };

    this.currentElement.children = this.currentElement.children || [];
    this.currentElement.children.push(newChild);
    this.data.setStructure(this.data.getStructure());

    this.currentElement = newChild;
    this.renderEverything();
    this.status(`${nextType} dodany do hierarchii`);
  }

  selectElement(id) {
    this.currentElement = this.findElementById(id, this.data.getStructure());
    this.renderEverything();
  }

  findElementById(id, nodes) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findElementById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  getPathToElement(element) {
    const path = [];
    const traverse = (nodes) => {
      for (const node of nodes) {
        if (node.id === element.id) {
          path.unshift(node);
          return true;
        }
        if (node.children?.length && traverse(node.children)) {
          path.unshift(node);
          return true;
        }
      }
      return false;
    };
    traverse(this.data.getStructure());
    return path;
  }

  autoSaveCurrent() {
    if (!this.currentElement) return;

    const title = document.getElementById('element-title')?.value.trim();
    const content = document.getElementById('element-content')?.value;

    if (title === '') {
      this.status('Tytuł nie może być pusty', 4000);
      return;
    }

    this.currentElement.title = title || '(Bez tytułu)';
    this.currentElement.content = content || '';

    this.data.setStructure(this.data.getStructure());
    this.status('Zapisano automatycznie');
  }

  createBackup() {
    this.data.createBackup();
    this.status('Backup pamięci utworzony');
  }

  // === MAPA BRAM ===
  insertBrama(bramaId) {
    const mapa = this.data.getMapa();
    const brama = mapa.find(b => b.id === bramaId);
    if (!this.currentElement || !brama) {
      this.status('Brama lub element nie istnieje');
      return;
    }

    const bookList = brama.books?.map(book => `• ${book}`).join('\n') || 'Brak opublikowanych tytułów';
    const content = `\n\n✦ === \( {brama.name} === ✦\n \){bookList}\n\n`;

    const textarea = document.getElementById('element-content');
    textarea.value += content;
    this.autoSaveCurrent();
    this.status(`Wstawiono treści z ${brama.name}`);
  }

  // === BELLA AI ANALIZA ===
  bellaDeepAnalysis() {
    if (!this.currentElement || !this.currentElement.content?.trim()) {
      this.status('Brak treści do analizy');
      return;
    }

    const suggestions = this.generateBellaSuggestions(this.currentElement);
    if (this.renderer) {
      this.renderer.renderSuggestions(suggestions.map(text => ({ type: 'suggestion', text })));
    }
    this.status(`${suggestions.length} sugestii Bella AI`);
  }

  generateBellaSuggestions(element) {
    const text = element.content || '';
    const lower = text.toLowerCase();
    const type = element.type || 'Fragment';
    const profile = this.currentProfile;
    const suggestions = [];

    if (text.length < 300) suggestions.push('Rozwiń treść – dłuższe fragmenty mają większy zasięg');
    if (text.split('\n\n').length < 5) suggestions.push('Dodaj więcej akapitów – lepsza czytelność');

    if (['Rozdział', 'Podrozdział'].includes(type)) {
      if (!text.match(/["„”]/)) suggestions.push('Wprowadź dialogi – ożywiają postaci');
      if ((lower.match(/(miłość|strach|radość|smutek|gniew|nadzieja|przeraż|zakocha)/g) || []).length < 5) {
        suggestions.push('Wzmocnij emocje – Wattpad żyje uczuciami');
      }
    }

    if (profile === 'amazon') {
      if (!/najlepszy|rewolucyjny|ekskluzywny|premium/i.test(lower)) suggestions.push('Użyj słów premium: najlepszy, rewolucyjny, ekskluzywny');
      if (!/gwarancja|darmowa|satysfakcja/i.test(lower)) suggestions.push('Dodaj frazy konwertujące: „gwarancja satysfakcji”, „darmowa wysyłka”');
    }

    return suggestions.length ? suggestions : ['Tekst idealny – brak sugestii'];
  }

  // === AI STORY GENERATOR ===
  generateAIContent() {
    if (!this.currentElement) {
      this.status('Wybierz element przed generowaniem');
      return;
    }

    const generated = this.generateAIText(this.currentElement);
    const textarea = document.getElementById('element-content');
    const separator = textarea.value.trim() ? '\n\n--- AI Generated ---\n\n' : '';
    textarea.value += separator + generated;

    this.autoSaveCurrent();

    if (this.renderer) {
      this.renderer.renderSuggestions([{ type: 'generated', text: generated }]);
    }

    this.status('Treść wygenerowana przez AI');
  }

  generateAIText(element) {
    const profile = this.currentProfile;
    const type = element.type || 'Fragment';

    const templates = {
      wattpad: {
        'Rozdział': 'Deszcz spływał po szybie, a ona stała w milczeniu. W jego oczach widziała burzę – tę samą, która szalała w jej sercu. „Dlaczego właśnie teraz?” – szepnęła, czując, jak świat wokół nich zaczyna się rozpadać.',
        'Podrozdział': 'W ciemności lasu coś się poruszyło. To była stara magia, budząca się ze snu. Strach mieszał się z ekscytacją – co jeśli to przeznaczenie?',
        'default': 'Noc była zbyt cicha. W powietrzu unosiło się napięcie, jakby cały wszechświat wstrzymał oddech. On wiedział, że to moment przełomu.'
      },
      amazon: {
        'default': '⭐⭐⭐⭐⭐ ODKRYJ REWOLUCYJNĄ HISTORIĘ, która zmienia wszystko! Epicka przygoda pełna emocji i tajemnicy. Nr 1 wśród bestsellerów. Zamów teraz!'
      }
    };

    if (profile === 'amazon') return templates.amazon.default;
    return templates.wattpad[type] || templates.wattpad.default;
  }

  // === EKSPORT DOCX ===
  async exportToDocx() {
    if (!this.currentElement) {
      this.status('Brak wybranego elementu');
      return;
    }

    const { Document, Packer, Paragraph, HeadingLevel } = docx;
    const path = this.getPathToElement(this.currentElement);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: this.currentElement.title || 'Bez tytułu', heading: HeadingLevel.TITLE, alignment: "center" }),
          new Paragraph({ text: path.map(n => n.title || n.type).join(' → '), alignment: "center" }),
          new Paragraph({ text: `Typ: ${this.currentElement.type} • Profil: ${this.currentProfile.toUpperCase()} • ${new Date().toLocaleDateString('pl-PL')}`, alignment: "center" }),
          new Paragraph({ text: this.currentElement.content || '' })
        ]
      }]
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(this.currentElement.title || 'element').replace(/[^a-z0-9]/gi, '_')}_Eterniverse_v13.docx`;
      a.click();
      URL.revokeObjectURL(url);
      this.status('Eksport DOCX zakończony');
    } catch (e) {
      console.error(e);
      this.status('Błąd eksportu DOCX');
    }
  }

  // === DYKTACJA GŁOSOWA ===
  initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Dyktowanie nieobsługiwane');
      return;
    }

    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      const textarea = document.getElementById('element-content');
      if (textarea) {
        textarea.value += transcript;
        this.autoSaveCurrent();
      }
    };

    this.recognition.onstart = () => {
      this.isDictating = true;
      document.getElementById('start-dictate').disabled = true;
      document.getElementById('stop-dictate').disabled = false;
      this.status('Dyktowanie aktywne – mów');
    };

    this.recognition.onend = () => {
      this.isDictating = false;
      document.getElementById('start-dictate').disabled = false;
      document.getElementById('stop-dictate').disabled = true;
    };

    this.recognition.onerror = (event) => {
      this.status(`Błąd dyktowania: ${event.error}`);
      this.stopDictation();
    };
  }

  startDictation() {
    if (this.recognition && !this.isDictating) {
      this.recognition.start();
    }
  }

  stopDictation() {
    if (this.recognition && this.isDictating) {
      this.recognition.stop();
    }
  }

  // === STATUS ===
  status(message, duration = 6000) {
    if (this.renderer) {
      this.renderer.setStatus(message, duration);
    } else {
      const statusEl = document.getElementById('status');
      if (statusEl) {
        statusEl.textContent = message;
        if (duration > 0) {
          setTimeout(() => {
            if (statusEl.textContent === message) statusEl.textContent = 'Gotowy';
          }, duration);
        }
      }
    }
  }
}

// === URUCHOMIENIE MASTER ===
const master = new EterniverseMasterPRO();
window.master = master;

console.log(`Eterniverse Master Premium PRO ${master.VERSION} uruchomiony – pełna świadomość aktywna`);