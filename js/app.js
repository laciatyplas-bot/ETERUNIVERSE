// app.js - Eterniverse Master Premium v6.0
// Pełna logika: Książki + Struktura Universum + Mapa Bram + Bella AI + Dyktowanie + Eksport DOCX

'use strict';

class EterniverseMaster {
  constructor() {
    // Klucze localStorage
    this.BOOKS_KEY = 'eterniverse_books_v6';
    this.STRUCT_KEY = 'eterniverse_structure_v6';
    this.MAPA_KEY = 'eterniverse_mapa_v6';

    // Dane
    this.books = this.load(this.BOOKS_KEY, []);
    this.structure = this.load(this.STRUCT_KEY, []);
    this.mapa = this.load(this.MAPA_KEY, [
      { id: 1, name: "BRAMA 1 — INTERSEEKER", books: [{ title: "INTERSEEKER: Geneza" }, { title: "INTERSEEKER: Efekt Cienia" }] },
      { id: 2, name: "BRAMA 2 — ETERSEEKER", books: [{ title: "EterSeeker: Kronika Woli" }, { title: "Interfejs Świadomości" }] },
      { id: 3, name: "BRAMA 3 — OBFITOSEEKER", books: [{ title: "ObfitoSeeker – Kod Obfitości" }] },
      { id: 4, name: "BRAMA 4 — THE KNOT", books: [{ title: "Kronika Splątania" }, { title: "Eterniony Tom I" }] },
      { id: 5, name: "BRAMA 5 — RELIGIOSEEKER", books: [{ title: "ReligioSeeker" }] }
    ]);

    // Stan
    this.currentBook = null;
    this.currentProfile = 'wattpad';
    this.recognition = null;

    this.init();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Błąd ładowania danych:', key, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Błąd zapisu:', key, e);
    }
  }

  init() {
    this.bindEvents();
    this.renderAll();
    this.initSpeech();
    this.status('Eterniverse Master Premium uruchomiony');
  }

  bindEvents() {
    const els = {
      profile: document.getElementById('profile-select'),
      addBook: document.getElementById('add-book-btn'),
      addUniverse: document.getElementById('add-universe'),
      bella: document.getElementById('bella-analyze'),
      export: document.getElementById('export-docx'),
      dictateStart: document.getElementById('start-dictate'),
      dictateStop: document.getElementById('stop-dictate'),
      title: document.getElementById('book-title'),
      content: document.getElementById('book-content')
    };

    els.profile.onchange = (e) => this.currentProfile = e.target.value;
    els.addBook.onclick = () => this.addBook();
    els.addUniverse.onclick = () => this.addUniverse();
    els.bella.onclick = () => this.bellaAnalyze();
    els.export.onclick = () => this.exportDocx();
    els.dictateStart.onclick = () => this.startDictation();
    els.dictateStop.onclick = () => this.stopDictation();
    els.title.oninput = () => this.autoSave();
    els.content.oninput = () => this.autoSave();
  }

  renderAll() {
    this.renderBooks();
    this.renderStructure();
    this.renderMapa();
  }

  // === KSIĘGI ===
  renderBooks() {
    const list = document.getElementById('books-list');
    if (this.books.length === 0) {
      list.innerHTML = '<p style="opacity:0.6;text-align:center;padding:2rem;">Brak ksiąg – utwórz pierwszą</p>';
      return;
    }

    list.innerHTML = this.books.map(book => `
      <div class="item \( {this.currentBook?.id === book.id ? 'active' : ''}" onclick="master.openBook( \){book.id})">
        <strong>📖 ${this.escape(book.title || 'Bez tytułu')}</strong>
        <div style="font-size:0.9rem;opacity:0.8;margin-top:0.4rem;">
          ${this.wordCount(book.content || '')} słów
        </div>
      </div>
    `).join('');
  }

  addBook() {
    const book = {
      id: Date.now(),
      title: 'Nowa Księga Eteryczna',
      content: '',
      created: new Date().toISOString()
    };
    this.books.unshift(book);
    this.save(this.BOOKS_KEY, this.books);
    this.openBook(book.id);
    this.status('Nowa księga utworzona');
  }

  openBook(id) {
    this.currentBook = this.books.find(b => b.id === id);
    if (!this.currentBook) return;

    document.getElementById('book-title').value = this.currentBook.title || '';
    document.getElementById('book-content').value = this.currentBook.content || '';
    this.renderBooks();
  }

  autoSave() {
    if (!this.currentBook) return;
    this.currentBook.title = document.getElementById('book-title').value;
    this.currentBook.content = document.getElementById('book-content').value;
    this.save(this.BOOKS_KEY, this.books);
  }

  // === STRUKTURA UNIWERSUM ===
  renderStructure() {
    const tree = document.getElementById('structure-tree');
    if (this.structure.length === 0) {
      tree.innerHTML = '<p style="opacity:0.6;text-align:center;padding:1rem;">Brak struktur – dodaj pierwsze uniwersum</p>';
      return;
    }

    tree.innerHTML = this.structure.map(item => this.buildTreeNode(item)).join('');
  }

  buildTreeNode(item) {
    const icon = { 'Uniwersum': '🌌', 'Świat': '🌍', 'Tom': '📚' }[item.type] || '📄';
    const children = item.children?.length 
      ? `<div class="nested">${item.children.map(c => this.buildTreeNode(c)).join('')}</div>` 
      : '';

    return `
      <div class="item" onclick="master.selectStruct(${item.id})">
        ${icon} ${this.escape(item.title)}
        ${children}
      </div>
    `;
  }

  addUniverse() {
    const univ = {
      id: Date.now(),
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      children: []
    };
    this.structure.push(univ);
    this.save(this.STRUCT_KEY, this.structure);
    this.renderStructure();
    this.status('Nowe uniwersum dodane');
  }

  selectStruct(id) {
    // Można rozbudować o edycję struktury w przyszłości
    this.status('Wybrano element struktury (funkcja w budowie)');
  }

  // === MAPA BRAM ===
  renderMapa() {
    const grid = document.getElementById('mapa-grid');
    if (this.mapa.length === 0) {
      grid.innerHTML = '<p style="opacity:0.6;text-align:center;padding:1rem;">Brak bram</p>';
      return;
    }

    grid.innerHTML = this.mapa.map(brama => `
      <div class="item" onclick="master.insertBrama(${brama.id})">
        <strong>🔮 ${this.escape(brama.name)}</strong>
        <div style="font-size:0.9rem;opacity:0.8;margin-top:0.4rem;">
          ${brama.books?.length || 0} tytułów
        </div>
      </div>
    `).join('');
  }

  insertBrama(id) {
    const brama = this.mapa.find(b => b.id === id);
    if (!this.currentBook || !brama) return;

    const list = brama.books?.map(b => `📖 ${b.title}`).join('\n') || '';
    const content = document.getElementById('book-content');
    content.value += `\n\n✦ === \( {brama.name} === ✦\n \){list}\n\n`;
    this.autoSave();
    this.status(`Wstawiono: ${brama.name}`);
  }

  // === BELLA AI ===
  bellaAnalyze() {
    if (!this.currentBook || !this.currentBook.content?.trim()) {
      return this.status('Brak tekstu do analizy');
    }

    const suggestions = this.generateBellaSuggestions(this.currentBook.content);
    this.renderSuggestions(suggestions);
    this.status(`${suggestions.length} sugestii od Bella AI`);
  }

  generateBellaSuggestions(text) {
    const suggestions = [];
    const lower = text.toLowerCase();
    const words = this.wordCount(text);

    if (this.currentProfile === 'amazon') {
      if (!/darmowa|wysyłka|gwarancja|satysfakcja/i.test(lower))
        suggestions.push('📦 Dodaj frazy konwertujące: „darmowa wysyłka”, „gwarancja satysfakcji”');
      if (!/najlepszy|rewolucyjny|premium|ekskluzywny|wyjątkowy/i.test(lower))
        suggestions.push('🏆 Użyj słów premium: najlepszy, rewolucyjny, ekskluzywny');
    } else {
      if (!text.includes('„') && !text.includes('"') && !text.includes('“'))
        suggestions.push('💬 Dodaj dialogi – to serce Wattpad');
      if ((lower.match(/(smut|strach|miłość|radość|przeraż|nadzieja|gniew|zakocha)/g) || []).length < 4)
        suggestions.push('❤️ Wpleć więcej emocji – czytelnik musi czuć');
    }

    if (words < 300) suggestions.push('📈 Rozwiń tekst – dłuższe fragmenty mają większy zasięg');
    if (text.split('\n\n').length < 5) suggestions.push('✨ Więcej akapitów – lepsza czytelność');

    return suggestions.slice(0, 8);
  }

  renderSuggestions(suggestions) {
    const panel = document.getElementById('suggestions');
    if (suggestions.length === 0) {
      panel.innerHTML = '<p style="text-align:center;opacity:0.7;padding:2rem;">🎉 Tekst idealny!</p>';
      return;
    }

    panel.innerHTML = suggestions.map(s => `
      <div class="suggestion">${s}</div>
    `).join('');
  }

  // === EKSPORT DOCX ===
  async exportDocx() {
    if (!this.currentBook) return this.status('Brak otwartej księgi');

    const { Document, Packer, Paragraph, HeadingLevel } = docx;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: this.currentBook.title || 'Bez tytułu', heading: HeadingLevel.TITLE, alignment: "center" }),
          new Paragraph({ text: `Eterniverse • ${this.currentProfile.toUpperCase()} • ${new Date().toLocaleDateString('pl-PL')}`, alignment: "center" }),
          new Paragraph({ text: this.currentBook.content || '' })
        ]
      }]
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(this.currentBook.title || 'ksiega').replace(/[^a-z0-9]/gi, '_')}_Eterniverse.docx`;
      a.click();
      URL.revokeObjectURL(url);
      this.status('Eksport DOCX zakończony');
    } catch (err) {
      this.status('Błąd eksportu');
      console.error(err);
    }
  }

  // === DYKTowanie ===
  initSpeech() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;

    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;

    this.recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map(r => r[0].transcript)
        .join('');
      document.getElementById('book-content').value += transcript;
      this.autoSave();
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

  startDictation() { this.recognition?.start(); }
  stopDictation() { this.recognition?.stop(); }

  // === POMOCNICZE ===
  status(msg) {
    const el = document.getElementById('status');
    el.textContent = msg;
    setTimeout(() => el.textContent = 'Gotowy', 5000);
  }

  wordCount(text = '') {
    return (text.match(/\b\w+\b/g) || []).length;
  }

  escape(text = '') {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Uruchomienie aplikacji
const master = new EterniverseMaster();
window.master = master; // Dla onclick w HTML