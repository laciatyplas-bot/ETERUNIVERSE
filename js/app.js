// app.js - Eterniverse Master Premium PRO v12.0
// Główna logika aplikacji: Hierarchia + AI + Eksport + Dyktowanie + Bella Console

'use strict';

class EterniverseMasterPRO {
  constructor() {
    // Klucze localStorage
    this.STRUCT_KEY = 'eterniverse_structure_pro_v12';
    this.MAPA_KEY = 'eterniverse_mapa_pro';

    // Dane
    this.structure = this.load(this.STRUCT_KEY, []);
    this.mapa = this.load(this.MAPA_KEY, this.defaultMapa());

    // Stan
    this.currentElement = null;
    this.currentProfile = localStorage.getItem('eterniverse_profile') || 'wattpad';
    this.recognition = null;

    this.init();
  }

  // Domyślna mapa bram
  defaultMapa() {
    return [
      { id: 1, name: "BRAMA 1 — INTERSEEKER", books: ["INTERSEEKER: Geneza", "INTERSEEKER: Efekt Cienia"] },
      { id: 2, name: "BRAMA 2 — ETERSEEKER", books: ["EterSeeker: Kronika Woli", "Interfejs Świadomości"] },
      { id: 3, name: "BRAMA 3 — OBFITOSEEKER", books: ["ObfitoSeeker – Kod Obfitości"] },
      { id: 4, name: "BRAMA 4 — THE KNOT", books: ["Kronika Splątania", "Eterniony Tom I"] },
      { id: 5, name: "BRAMA 5 — RELIGIOSEEKER", books: ["ReligioSeeker"] }
    ];
  }

  // Podstawowe operacje storage
  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Błąd ładowania danych:', e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Błąd zapisu danych:', e);
      alert('Błąd zapisu – localStorage może być pełny');
    }
  }

  // Inicjalizacja
  init() {
    this.updateProfileSelect();
    this.bindEvents();
    this.renderAll();
    this.initSpeech();
    this.status('Eterniverse Master Premium PRO v12.0 — gotowy do kreacji');
  }

  updateProfileSelect() {
    const select = document.getElementById('profile-select');
    if (select) select.value = this.currentProfile;
  }

  bindEvents() {
    // Profil
    document.getElementById('profile-select').onchange = (e) => {
      this.currentProfile = e.target.value;
      localStorage.setItem('eterniverse_profile', this.currentProfile);
    };

    // Przyciski główne
    document.getElementById('add-universe').onclick = () => this.addRootUniverse();
    document.getElementById('add-child').onclick = () => this.addChild();
    document.getElementById('generate-story').onclick = () => this.generateStory();
    document.getElementById('bella-analyze').onclick = () => this.bellaAnalyze();
    document.getElementById('export-docx').onclick = () => this.exportDocx();
    document.getElementById('start-dictate').onclick = () => this.startDictation();
    document.getElementById('stop-dictate').onclick = () => this.stopDictation();

    // Autozapis
    document.getElementById('element-title').oninput = () => this.autoSave();
    document.getElementById('element-content').oninput = () => this.autoSave();
  }

  renderAll() {
    if (window.renderer) {
      window.renderer.renderAll();
      window.renderer.renderCurrentElement();
    }
  }

  // === OPERACJE NA HIERARCHII ===
  addRootUniverse() {
    const newUniv = {
      id: this.generateId(),
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      content: '',
      children: []
    };

    this.structure.push(newUniv);
    this.save(this.STRUCT_KEY, this.structure);
    this.currentElement = newUniv;
    this.renderAll();
    this.status('Utworzono nowe uniwersum');
  }

  addChild() {
    if (!this.currentElement) {
      alert('Wybierz element nadrzędny w hierarchii');
      return;
    }

    const types = ['Uniwersum', 'Świat', 'Tom', 'Rozdział', 'Podrozdział', 'Fragment'];
    const currentIdx = types.indexOf(this.currentElement.type || 'Uniwersum');
    const childType = types[currentIdx + 1] || 'Fragment';

    const newChild = {
      id: this.generateId(),
      type: childType,
      title: `Nowy ${childType}`,
      content: '',
      children: []
    };

    this.currentElement.children = this.currentElement.children || [];
    this.currentElement.children.push(newChild);
    this.save(this.STRUCT_KEY, this.structure);
    this.currentElement = newChild;
    this.renderAll();
    this.status(`Dodano: ${childType}`);
  }

  selectElement(id) {
    this.currentElement = this.findById(id);
    this.renderAll();
    if (window.renderer) window.renderer.renderCurrentElement();
  }

  findById(id, nodes = this.structure) {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = this.findById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  getPathTo(element) {
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
    traverse(this.structure);
    return path;
  }

  autoSave() {
    if (!this.currentElement) return;

    this.currentElement.title = document.getElementById('element-title').value.trim();
    this.currentElement.content = document.getElementById('element-content').value;

    this.save(this.STRUCT_KEY, this.structure);
  }

  // === MAPA BRAM ===
  insertBrama(id) {
    const brama = this.mapa.find(b => b.id === id);
    if (!this.currentElement || !brama) return;

    const list = brama.books?.map(t => `• ${t}`).join('\n') || '';
    const textarea = document.getElementById('element-content');
    textarea.value += `\n\n✦ === \( {brama.name} === ✦\n \){list}\n\n`;
    this.autoSave();
    this.status(`Wstawiono: ${brama.name}`);
  }

  // === BELLA AI ANALIZA ===
  bellaAnalyze() {
    if (!this.currentElement || !this.currentElement.content?.trim()) {
      this.status('Brak treści do analizy');
      return;
    }

    const suggestions = this.generateProSuggestions(this.currentElement);
    if (window.renderer) {
      window.renderer.renderSuggestions(suggestions.map(text => ({ type: 'suggestion', text })));
    }
    this.status(`${suggestions.length} sugestii Bella AI`);
  }

  generateProSuggestions(element) {
    const text = element.content || '';
    const lower = text.toLowerCase();
    const type = element.type || 'Fragment';
    const suggestions = [];

    if (['Uniwersum', 'Świat'].includes(type)) {
      if (text.length < 200) suggestions.push('Opisz fundamenty świata: prawa fizyki, magia, historia');
      if (!lower.includes('geografia') && !lower.includes('mapa')) suggestions.push('Dodaj opis geografii i kluczowych lokacji');
    }

    if (['Tom', 'Rozdział', 'Podrozdział'].includes(type)) {
      if (!text.match(/["„”]/)) suggestions.push('Wprowadź dialogi – ożywiają postaci');
      if (!lower.includes('konflikt') && !lower.includes('cel')) suggestions.push('Zdefiniuj główny konflikt lub cel bohatera');
    }

    if (this.currentProfile === 'amazon') {
      if (!/limitowan|ekskluzywn|specjaln/i.test(lower)) suggestions.push('Podkreśl unikalność: „edycja limitowana”, „tylko tutaj”');
    } else {
      const emotions = (lower.match(/(miłość|strach|radość|smutek|gniew|nadzieja|przeraż|zakocha)/g) || []).length;
      if (emotions < 5) suggestions.push('Wzmocnij emocje – Wattpad żyje uczuciami');
    }

    if (this.wordCount(text) < 500) suggestions.push('Rozwijaj sceny – szczegóły budują immersję');

    return suggestions;
  }

  // === AI STORY GENERATOR ===
  generateStory() {
    if (!this.currentElement) {
      this.status('Wybierz element do generowania');
      return;
    }

    const context = this.currentElement;
    const profile = this.currentProfile;
    const type = context.type || 'Fragment';

    let generated = '';

    if (profile === 'amazon') {
      generated = '⭐⭐⭐⭐⭐ ODKRYJ NAJLEPSZĄ KSIĄŻKĘ ROKU! Epicka przygoda, która wciąga od pierwszej strony. Idealna dla fanów fantasy i emocjonalnych historii. Darmowa wysyłka przy zamówieniu teraz!';
    } else {
      if (['Rozdział', 'Podrozdział'].includes(type)) {
        generated = 'Deszcz bębnił o szybę, a jej serce biło jak oszalałe. Wiedziała, że to koniec... albo początek czegoś większego. Spojrzała w jego oczy i szepnęła: „Nie zostawiaj mnie”. Świat wokół nich zamarł w oczekiwaniu.';
      } else {
        generated = 'W ciemności lasu coś się poruszyło. Nie był to wiatr. To była magia – stara, zapomniana, budząca się do życia. Ona poczuła to pierwsza. Strach mieszał się z ekscytacją.';
      }
    }

    const textarea = document.getElementById('element-content');
    const separator = textarea.value ? '\n\n--- AI Generated ---\n\n' : '';
    textarea.value += separator + generated;

    this.autoSave();

    if (window.renderer) {
      window.renderer.renderSuggestions([{ type: 'generated', text: generated }]);
    }

    this.status('Treść wygenerowana przez AI');
  }

  // === EKSPORT DOCX ===
  async exportDocx() {
    if (!this.currentElement) {
      this.status('Nie wybrano elementu do eksportu');
      return;
    }

    const { Document, Packer, Paragraph, HeadingLevel } = docx;
    const path = this.getPathTo(this.currentElement);

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
      a.download = `${(this.currentElement.title || 'element').replace(/[^a-z0-9]/gi, '_')}_Eterniverse_PRO.docx`;
      a.click();
      URL.revokeObjectURL(url);
      this.status('Eksport DOCX zakończony');
    } catch (e) {
      this.status('Błąd eksportu');
      console.error(e);
    }
  }

  // === DYKTowanie ===
  initSpeech() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Dyktowanie nieobsługiwane w tej przeglądarce');
      return;
    }

    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
      const textarea = document.getElementById('element-content');
      if (textarea) {
        textarea.value += transcript;
        this.autoSave();
      }
    };

    this.recognition.onstart = () => {
      document.getElementById('start-dictate').disabled = true;
      document.getElementById('stop-dictate').disabled = false;
      this.status('Dyktowanie aktywne');
    };

    this.recognition.onend = () => {
      document.getElementById('start-dictate').disabled = false;
      document.getElementById('stop-dictate').disabled = true;
    };
  }

  startDictation() {
    if (this.recognition) this.recognition.start();
  }

  stopDictation() {
    if (this.recognition) this.recognition.stop();
  }

  // === POMOCNICZE ===
  generateId() {
    return 'node_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  status(message, timeout = 6000) {
    if (window.renderer) {
      window.renderer.setStatus(message, timeout);
    } else {
      const statusEl = document.getElementById('status');
      if (statusEl) {
        statusEl.textContent = message;
        if (timeout > 0) setTimeout(() => statusEl.textContent = 'Gotowy', timeout);
      }
    }
  }

  wordCount(text = '') {
    return (text.match(/\b\w+\b/g) || []).length;
  }
}

// Uruchomienie głównej aplikacji
const master = new EterniverseMasterPRO();
window.master = master;

// Po załadowaniu DOM – uruchom renderer (jeśli istnieje)
document.addEventListener('DOMContentLoaded', () => {
  if (window.EterniverseRenderer) {
    window.renderer = new EterniverseRenderer(master);
    master.renderer = window.renderer;
    master.renderAll(); // początkowe renderowanie
  }
});