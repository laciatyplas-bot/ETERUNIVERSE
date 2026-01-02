// daja.js - Eterniverse Master Premium PRO v12.0
// Główny silnik aplikacji – Daja Master Edition (Data + AI + JavaScript Architecture)
// Pełna, samodzielna, modularna i gotowa do działania wersja master

'use strict';

class DajaMaster {
  constructor() {
    // === KONFIGURACJA SYSTEMU ===
    this.VERSION = 'v12.0';
    this.STRUCT_KEY = 'daja_structure_master_v12';
    this.MAPA_KEY = 'daja_mapa_master';
    this.PROFILE_KEY = 'daja_profile';

    // === STAN APLIKACJI ===
    this.structure = this.load(this.STRUCT_KEY, []);
    this.mapa = this.load(this.MAPA_KEY, this.defaultMapa());
    this.currentElement = null;
    this.currentProfile = localStorage.getItem(this.PROFILE_KEY) || 'wattpad';
    this.recognition = null;
    this.isDictating = false;

    // === INICJALIZACJA ===
    this.init();
  }

  // Domyślna mapa bram Eterniverse
  defaultMapa() {
    return [
      { id: 1, name: "BRAMA 1 — INTERSEEKER", books: ["INTERSEEKER: Geneza", "INTERSEEKER: Efekt Cienia"] },
      { id: 2, name: "BRAMA 2 — ETERSEEKER", books: ["EterSeeker: Kronika Woli", "Interfejs Świadomości"] },
      { id: 3, name: "BRAMA 3 — OBFITOSEEKER", books: ["ObfitoSeeker – Kod Obfitości"] },
      { id: 4, name: "BRAMA 4 — THE KNOT", books: ["Kronika Splątania", "Eterniony Tom I"] },
      { id: 5, name: "BRAMA 5 — RELIGIOSEEKER", books: ["ReligioSeeker"] }
    ];
  }

  // === OPERACJE NA LOCALSTORAGE ===
  load(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error(`[Daja] Błąd ładowania ${key}:`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`[Daja] Błąd zapisu ${key}:`, e);
      this.status('Błąd zapisu – pamięć pełna?', 8000);
    }
  }

  // === INICJALIZACJA ===
  init() {
    this.updateProfileUI();
    this.bindAllEvents();
    this.renderEverything();
    this.initSpeechRecognition();
    this.status(`Daja Master ${this.VERSION} — świadomość aktywna`);
  }

  updateProfileUI() {
    const select = document.getElementById('profile-select');
    if (select) select.value = this.currentProfile;
  }

  bindAllEvents() {
    // Profil
    const profileSelect = document.getElementById('profile-select');
    if (profileSelect) {
      profileSelect.onchange = (e) => {
        this.currentProfile = e.target.value;
        localStorage.setItem(this.PROFILE_KEY, this.currentProfile);
        this.status(`Profil zmieniony na: ${this.currentProfile.toUpperCase()}`);
      };
    }

    // Główne przyciski
    document.getElementById('add-universe')?.addEventListener('click', () => this.addRootUniverse());
    document.getElementById('add-child')?.addEventListener('click', () => this.addChildElement());
    document.getElementById('generate-story')?.addEventListener('click', () => this.aiGenerateContent());
    document.getElementById('bella-analyze')?.addEventListener('click', () => this.bellaDeepAnalysis());
    document.getElementById('export-docx')?.addEventListener('click', () => this.exportToDocx());
    document.getElementById('start-dictate')?.addEventListener('click', () => this.startDictation());
    document.getElementById('stop-dictate')?.addEventListener('click', () => this.stopDictation());

    // Autozapis przy edycji
    document.getElementById('element-title')?.addEventListener('input', () => this.autoSaveCurrent());
    document.getElementById('element-content')?.addEventListener('input', () => this.autoSaveCurrent());
  }

  renderEverything() {
    if (window.renderer) {
      window.renderer.renderAll();
      window.renderer.renderCurrentElement();
    }
  }

  // === OPERACJE NA HIERARCHII ===
  generateUniqueId() {
    return 'daja_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  addRootUniverse() {
    const newUniverse = {
      id: this.generateUniqueId(),
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      content: '',
      children: []
    };

    this.structure.push(newUniverse);
    this.save(this.STRUCT_KEY, this.structure);
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
      children: []
    };

    this.currentElement.children = this.currentElement.children || [];
    this.currentElement.children.push(newChild);
    this.save(this.STRUCT_KEY, this.structure);
    this.currentElement = newChild;
    this.renderEverything();
    this.status(`${nextType} dodany do hierarchii`);
  }

  selectCurrentElement(id) {
    this.currentElement = this.findElementById(id);
    this.renderEverything();
  }

  findElementById(id, nodes = this.structure) {
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
    const search = (nodes) => {
      for (const node of nodes) {
        if (node.id === element.id) {
          path.unshift(node);
          return true;
        }
        if (node.children?.length && search(node.children)) {
          path.unshift(node);
          return true;
        }
      }
      return false;
    };
    search(this.structure);
    return path;
  }

  autoSaveCurrent() {
    if (!this.currentElement) return;

    this.currentElement.title = document.getElementById('element-title')?.value.trim() || '(Bez tytułu)';
    this.currentElement.content = document.getElementById('element-content')?.value || '';

    this.save(this.STRUCT_KEY, this.structure);
  }

  // === MAPA BRAM ===
  insertBramaContent(bramaId) {
    const brama = this.mapa.find(b => b.id === bramaId);
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

  // === BELLA AI – GŁĘBOKA ANALIZA ===
  bellaDeepAnalysis() {
    if (!this.currentElement || !this.currentElement.content?.trim()) {
      this.status('Brak treści do analizy');
      return;
    }

    const analysis = this.performBellaAnalysis(this.currentElement);
    if (window.renderer) {
      window.renderer.renderSuggestions(analysis.map(text => ({ type: 'suggestion', text })));
    }
    this.status(`${analysis.length} głębokich sugestii Bella AI`);
  }

  performBellaAnalysis(element) {
    const text = element.content;
    const type = element.type || 'Fragment';
    const profile = this.currentProfile;
    const suggestions = [];

    // Analiza strukturalna
    if (text.split('\n\n').length < 4) suggestions.push('Dodaj więcej akapitów – lepsza czytelność i rytm');
    if (this.wordCount(text) < 400 && ['Rozdział', 'Podrozdział'].includes(type)) suggestions.push('Rozwiń scenę – szczegóły budują immersję');

    // Analiza emocjonalna (Wattpad)
    if (profile === 'wattpad') {
      const emotions = text.toLowerCase().match(/(miłość|strach|radość|smutek|gniew|nadzieja|przeraż|zakocha|samotn|eufor|rozpacz)/g) || [];
      if (emotions.length < 6) suggestions.push('Wzmocnij warstwę emocjonalną – czytelnik musi czuć');
      if (!text.includes('„') && !text.includes('"')) suggestions.push('Dodaj dialogi – ożyw postacie');
    }

    // Analiza marketingowa (Amazon)
    if (profile === 'amazon') {
      if (!/najlepszy|rewolucyjny|unikalny|ekskluzywny|limitowany/i.test(text)) suggestions.push('Użyj słów mocy: rewolucyjny, ekskluzywny, najwyższa jakość');
      if (!/darmowa|gwarancja|satysfakcja/i.test(text)) suggestions.push('Dodaj frazy konwertujące: „gwarancja satysfakcji”, „darmowa wysyłka”');
    }

    return suggestions.length ? suggestions : ['Tekst perfekcyjny – brak sugestii redakcyjnych'];
  }

  // === AI STORY GENERATOR ===
  aiGenerateContent() {
    if (!this.currentElement) {
      this.status('Wybierz element przed generowaniem');
      return;
    }

    const generatedText = this.generateAIContent(this.currentElement);
    const textarea = document.getElementById('element-content');
    const separator = textarea.value.trim() ? '\n\n--- AI Generated Content ---\n\n' : '';
    textarea.value += separator + generatedText;

    this.autoSaveCurrent();

    if (window.renderer) {
      window.renderer.renderSuggestions([{ type: 'generated', text: generatedText }]);
    }

    this.status('Nowa treść wygenerowana przez Daja AI');
  }

  generateAIContent(element) {
    const type = element.type || 'Fragment';
    const profile = this.currentProfile;

    const templates = {
      wattpad: {
        'Rozdział': 'Deszcz spływał po szybie, a ona stała w milczeniu. W jego oczach widziała burzę – tę samą, która szalała w jej sercu. „Dlaczego właśnie teraz?” – szepnęła, czując, jak świat wokół nich zaczyna się rozpadać.',
        'Podrozdział': 'W ciemnym lesie coś się poruszyło. Nie był to wiatr. To była stara magia, budząca się ze snu. Ona poczuła dreszcz – strach mieszał się z ekscytacją. Co jeśli to przeznaczenie?',
        'default': 'Noc była cicha, zbyt cicha. W powietrzu unosiła się napięcie, jakby cały wszechświat wstrzymał oddech. On wiedział, że to moment przełomu.'
      },
      amazon: {
        'default': '⭐⭐⭐⭐⭐ ODKRYJ REWOLUCYJNĄ HISTORIĘ, która zmienia wszystko! Epicka przygoda pełna emocji i tajemnicy. Nr 1 wśród bestsellerów. Zamów teraz i przenieś się do innego świata!'
      }
    };

    if (profile === 'amazon') {
      return templates.amazon.default;
    }

    return templates.wattpad[type] || templates.wattpad.default;
  }

  // === EKSPORT DO DOCX ===
  async exportToDocx() {
    if (!this.currentElement) {
      this.status('Brak wybranego elementu do eksportu');
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
          new Paragraph({ text: this.currentElement.content || '', spacing: { after: 300 } })
        ]
      }]
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(this.currentElement.title || 'element').replace(/[^a-z0-9]/gi, '_')}_Daja_Master.docx`;
      a.click();
      URL.revokeObjectURL(url);
      this.status('Eksport DOCX zakończony');
    } catch (error) {
      console.error(error);
      this.status('Błąd podczas eksportu');
    }
  }

  // === DYKTowanie GŁOSOWE ===
  initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn('Dyktowanie nieobsługiwane w tej przeglądarce');
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
      this.status('Błąd dyktowania: ' + event.error);
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

  // === STATUS SYSTEMU ===
  status(message, duration = 6000) {
    if (window.renderer) {
      window.renderer.setStatus(message, duration);
    } else {
      const statusEl = document.getElementById('status');
      if (statusEl) {
        statusEl.textContent = message;
        if (duration > 0) {
          setTimeout(() => {
            if (statusEl.textContent === message) {
              statusEl.textContent = 'Gotowy';
            }
          }, duration);
        }
      }
    }
  }

  // === POMOCNICZE ===
  wordCount(text = '') {
    return (text.match(/\b\w+\b/g) || []).length;
  }
}

// === URUCHOMIENIE DAJA MASTER ===
const daja = new DajaMaster();
window.daja = daja;

// Integracja z rendererem (jeśli istnieje)
document.addEventListener('DOMContentLoaded', () => {
  if (window.EterniverseRenderer) {
    window.renderer = new EterniverseRenderer(daja);
    daja.renderer = window.renderer;
    daja.renderEverything();
  }
});

console.log('Daja Master Premium PRO v12.0 uruchomiony – pełna świadomość aktywna');