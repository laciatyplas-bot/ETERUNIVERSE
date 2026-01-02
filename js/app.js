// app.js - ETERNIVERSE MASTER SUITE v2.0
// Wszystkie funkcje: Książki + Bella Redaktor + Architektura + Mapa

'use strict';

class EterniverseApp {
  constructor() {
    // Storage keys
    this.BOOKS_KEY = 'eterniverse_books_v2';
    this.STRUCT_KEY = 'eterniverse_structure_v2';
    this.PROFILES_KEY = 'bella_profiles_v2';
    this.MAPA_KEY = 'eterniverse_mapa';
    
    // State
    this.books = this.load('books', []);
    this.structure = this.load('structure', []);
    this.profiles = this.load('profiles', { amazon: [], wattpad: [] });
    this.mapa = this.load('mapa', []);
    
    this.currentBook = null;
    this.currentStruct = null;
    this.currentProfile = 'wattpad';
    this.isDictating = false;
    
    // Speech
    this.recognition = null;
    this.initSpeech();
    
    // Init UI
    this.init();
  }

  load(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(this[key.toUpperCase()]_KEY) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  save(key, data) {
    localStorage.setItem(this[key.toUpperCase()]_KEY, JSON.stringify(data));
  }

  init() {
    this.bindEvents();
    this.renderAll();
    this.welcome();
  }

  bindEvents() {
    // Global
    document.addEventListener('keydown', e => this.handleKey(e));
    
    // Books
    document.getElementById('add-book-btn').onclick = () => this.addBook();
    document.getElementById('import-btn').onclick = () => this.importDialog();
    
    // Editor
    document.getElementById('bella-analyze').onclick = () => this.bellaAnalyze();
    document.getElementById('export-docx').onclick = () => this.exportDocx();
    document.getElementById('profile-select').onchange = e => this.setProfile(e.target.value);
    
    // Structure
    document.getElementById('add-universe').onclick = () => this.addUniverse();
    
    // Dictation
    document.getElementById('start-dictate').onclick = () => this.startDictation();
    document.getElementById('stop-dictate').onclick = () => this.stopDictation();
    
    // Commands
    document.getElementById('execute-cmd').onclick = () => this.executeCommand();
    
    // Auto-save
    document.getElementById('book-content').addEventListener('input', debounce(() => this.autoSave(), 1000));
  }

  renderAll() {
    this.renderBooks();
    this.renderStructure();
    this.renderMapa();
    this.updateStatus();
  }

  // === BOOKS ===
  renderBooks() {
    const list = document.getElementById('books-list');
    list.innerHTML = this.books.map(book => `
      <div class="book-card ${book.id === this.currentBook?.id ? 'active' : ''}" 
           onclick="app.openBook(${book.id})">
        <div class="book-title">${book.title}</div>
        <div class="book-stats">${this.wordCount(book.content)} słów • ${book.status}</div>
      </div>
    `).join('') || '<div class="empty">➕ Dodaj pierwszą książkę</div>';
  }

  addBook() {
    const book = {
      id: Date.now(),
      title: 'Nowa Księga',
      content: '',
      status: 'IDEA',
      chapters: [],
      created: new Date().toISOString()
    };
    this.books.unshift(book);
    this.save('books', this.books);
    this.openBook(book.id);
  }

  openBook(id) {
    this.currentBook = this.books.find(b => b.id === id);
    document.getElementById('book-title').value = this.currentBook.title;
    document.getElementById('book-content').value = this.currentBook.content;
    document.getElementById('book-status').value = this.currentBook.status;
    this.renderBooks();
    this.speak(`Otwarto ${this.currentBook.title}`);
  }

  autoSave() {
    if (this.currentBook) {
      this.currentBook.title = document.getElementById('book-title').value;
      this.currentBook.content = document.getElementById('book-content').value;
      this.currentBook.status = document.getElementById('book-status').value;
      this.save('books', this.books);
    }
  }

  // === BELLA AI ===
  bellaAnalyze() {
    if (!this.currentBook) return this.toast('Wybierz książkę!');
    
    const text = this.currentBook.content;
    const profile = this.currentProfile;
    const suggestions = this.generateBellaSuggestions(text, profile);
    
    this.showSuggestions(suggestions);
    this.speak(`${suggestions.length} sugestii Bella`);
  }

  generateBellaSuggestions(text, profile) {
    const suggestions = [];
    const wordCount = this.wordCount(text);
    
    // Profile-specific
    if (profile === 'amazon') {
      if (!/darmow|wysyłk|gwaranc/i.test(text)) suggestions.push('📦 Dodaj SEO: darmowa wysyłka');
      if (this.sentenceCount(text) > 20 && wordCount < 300) suggestions.push('✂️ Skróć długie zdania');
    } else {
      const emotions = text.match(/(smut|szczęśliw|zakocha|przeraż|radość)/i)?.length || 0;
      if (emotions < 3) suggestions.push('❤️ Więcej emocji!');
      if (!/"|„|”/.test(text)) suggestions.push('💬 Dialogi!');
    }
    
    // Universal
    if (wordCount < 100) suggestions.push('📝 Rozwiń tekst');
    if (this.sentenceCount(text) < 3) suggestions.push('📝 Więcej zdań');
    
    return suggestions.slice(0, 6);
  }

  showSuggestions(sugs) {
    const modal = document.createElement('div');
    modal.className = 'bella-modal';
    modal.innerHTML = `
      <div class="modal-inner">
        <h3>💡 Bella Sugestie [${this.currentProfile.toUpperCase()}]</h3>
        ${sugs.map(s => `<div class="sug-item">${s}</div>`).join('')}
        <button onclick="this.parentElement.parentElement.remove()">Zamknij</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // === STRUCTURE ===
  renderStructure() {
    const list = document.getElementById('structure-tree');
    list.innerHTML = this.structure.map(item => this.buildNode(item)).join('');
  }

  buildNode(item) {
    return `
      <div class="struct-node ${item.id === this.currentStruct?.id ? 'active' : ''}" 
           onclick="app.selectStruct(${item.id})">
        ${this.getTypeIcon(item.type)} ${item.title}
        ${item.children?.length ? `<div class="children">${item.children.map(c => this.buildNode(c)).join('')}</div>` : ''}
      </div>
    `;
  }

  addUniverse() {
    const univ = { id: Date.now(), type: '🌌 Uniwersum', title: 'Nowe', children: [] };
    this.structure.push(univ);
    this.save('structure', this.structure);
    this.renderStructure();
  }

  selectStruct(id) {
    this.currentStruct = this.structure.find(s => s.id === id);
    this.renderStructure();
  }

  // === MAPA ETERNIVERSE ===
  renderMapa() {
    const grid = document.getElementById('mapa-grid');
    grid.innerHTML = this.mapa.map(brama => `
      <div class="brama-card" onclick="app.selectBrama(${brama.id})">
        <div class="brama-title">${brama.name}</div>
        <div class="brama-tag">${brama.books.length} ksiąg</div>
      </div>
    `).join('');
  }

  selectBrama(id) {
    const brama = this.mapa.find(b => b.id === id);
    if (this.currentBook) {
      this.currentBook.content = `=== ${brama.name} ===
${brama.books.map(bk => `📖 ${bk.title}`).join('
')}`;
      this.autoSave();
    }
  }

  // === SPEECH ===
  initSpeech() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition.lang = 'pl-PL';
      this.recognition.onresult = e => {
        const text = e.results[0][0].transcript;
        document.getElementById('console') ? 
          document.getElementById('console').value += text : 
          this.executeCommand(text);
        this.speak(`Rozpoznano: ${text}`);
      };
    }
  }

  startDictation() {
    this.recognition?.start();
    this.isDictating = true;
  }

  stopDictation() {
    this.recognition?.stop();
    this.isDictating = false;
  }

  // === COMMANDS ===
  executeCommand(input = null) {
    const cmd = (input || document.getElementById('console')?.value || '').trim().toUpperCase();
    
    if (cmd.startsWith('BELLA')) {
      this.bellaAnalyze();
    } else if (cmd.startsWith('NOWA')) {
      this.addBook();
    } else if (cmd.includes('EKSPORTUJ')) {
      this.exportDocx();
    } else {
      // Load to editor
      if (this.currentBook) this.currentBook.content += `

${input}`;
    }
    
    this.autoSave();
  }

  // === EXPORT DOCX ===
  async exportDocx() {
    if (!this.currentBook) return this.toast('Brak książki!');
    
    const { Document, Packer, Paragraph, HeadingLevel } = docx;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: `${this.currentBook.title} [${this.currentProfile}]`, heading: HeadingLevel.HEADING_1 }),
          new Paragraph(this.currentBook.content)
        ]
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentBook.title.replace(/[^a-z0-9]/gi, '_')}.docx`;
    a.click();
  }

  // === UTILS ===
  wordCount(text) {
    return (text.match(/\bw+\b/g) || []).length;
  }

  sentenceCount(text) {
    return (text.match(/[.!?]+/g) || []).length;
  }

  speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    speechSynthesis.speak(utterance);
  }

  toast(msg) {
    // Implement toast notification
    console.log('🔔', msg);
  }

  setProfile(profile) {
    this.currentProfile = profile;
    this.save('profiles', this.profiles);
  }

  getTypeIcon(type) {
    return { 'Uniwersum': '🌌', 'Świat': '🌍', 'Tom': '📚' }[type] || '📄';
  }

  handleKey(e) {
    if (e.ctrlKey && e.key === 'Enter') this.executeCommand();
    if (e.ctrlKey && e.key === 's') this.autoSave();
  }
}

// Debounce utility
function debounce(fn, ms) {
  let timer;
  return _ => {
    clearTimeout(timer);
    timer = setTimeout(_ => fn.apply(this, arguments), ms);
  };
}

// Global app instance
const app = new EterniverseApp();

// Expose for onclick handlers
window.app = app;