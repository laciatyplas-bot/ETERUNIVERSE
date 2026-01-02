// app.js — Eterniverse Master Premium PRO v13.1 (STABLE)
// GŁÓWNY SILNIK APLIKACJI — PEŁNY PLIK

'use strict';

class EterniverseMasterPRO {
  constructor() {
    this.VERSION = 'v13.1-stable';

    // === SILNIKI ZEWNETRZNE ===
    this.data = window.dataMaster || null;
    this.renderer = window.renderer || null;
    this.console = window.bellaConsole || window.metaConsole || null;

    // === STAN ===
    this.currentElement = null;
    this.currentProfile = this.data?.getProfile?.() || 'wattpad';

    // === DYKTOWANIE ===
    this.recognition = null;
    this.isDictating = false;

    this.init();
  }

  /* =========================
     INIT
  ========================= */
  init() {
    if (!this.data) {
      console.error('❌ DataMaster nie załadowany');
      this.setStatus('BŁĄD: Brak DataMaster', 0);
      return;
    }

    this.updateUIProfile();
    this.bindEvents();
    this.render();
    this.initSpeechRecognition();

    this.setStatus(`Eterniverse Master PRO ${this.VERSION} — aktywny`);
  }

  /* =========================
     UI
  ========================= */
  updateUIProfile() {
    const sel = document.getElementById('profile-select');
    if (sel) sel.value = this.currentProfile;
  }

  bindEvents() {
    const $ = id => document.getElementById(id);

    $('profile-select')?.addEventListener('change', e => {
      this.currentProfile = e.target.value;
      this.data.setProfile?.(this.currentProfile);
      this.setStatus(`Profil: ${this.currentProfile.toUpperCase()}`);
    });

    $('add-universe')?.addEventListener('click', () => this.addRootUniverse());
    $('add-child')?.addEventListener('click', () => this.addChild());
    $('bella-analyze')?.addEventListener('click', () => this.bellaAnalyze());
    $('generate-story')?.addEventListener('click', () => this.generateAIContent());
    $('export-docx')?.addEventListener('click', () => this.exportToDocx());
    $('backup-data')?.addEventListener('click', () => this.data.createBackup?.());
    $('export-data')?.addEventListener('click', () => this.data.exportAllData?.());

    $('start-dictate')?.addEventListener('click', () => this.startDictation());
    $('stop-dictate')?.addEventListener('click', () => this.stopDictation());

    $('element-title')?.addEventListener('input', () => this.autoSaveCurrent());
    $('element-content')?.addEventListener('input', () => this.autoSaveCurrent());

    // DELEGACJA KLIKÓW (drzewo + bramy)
    document.addEventListener('click', e => {
      const tree = e.target.closest('.tree-node[data-id]');
      if (tree) {
        this.selectElement(tree.dataset.id);
        return;
      }

      const brama = e.target.closest('.brama-card[data-id]');
      if (brama) {
        this.insertBrama(brama.dataset.id);
      }
    });
  }

  render() {
    if (!this.renderer) return;
    this.renderer.renderAll();
    this.renderer.renderEditPanel(this.currentElement);
  }

  /* =========================
     STRUKTURA
  ========================= */
  generateId() {
    return 'node_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  addRootUniverse() {
    const u = {
      id: this.generateId(),
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      content: '',
      created: new Date().toISOString(),
      children: []
    };

    const s = this.data.getStructure();
    s.push(u);
    this.data.setStructure(s);

    this.currentElement = u;
    this.render();
    this.setStatus('Utworzono nowe Uniwersum');
  }

  addChild() {
    if (!this.currentElement) {
      alert('Wybierz element nadrzędny');
      return;
    }

    const order = ['Uniwersum', 'Świat', 'Tom', 'Rozdział', 'Podrozdział', 'Fragment'];
    const idx = order.indexOf(this.currentElement.type);
    const type = order[idx + 1] || 'Fragment';

    const c = {
      id: this.generateId(),
      type,
      title: `Nowy ${type}`,
      content: '',
      created: new Date().toISOString(),
      children: []
    };

    this.currentElement.children ||= [];
    this.currentElement.children.push(c);

    this.data.setStructure(this.data.getStructure());
    this.currentElement = c;

    this.render();
    this.setStatus(`Dodano: ${type}`);
  }

  selectElement(id) {
    this.currentElement = this.findById(id, this.data.getStructure());
    this.render();
  }

  findById(id, nodes) {
    for (const n of nodes) {
      if (String(n.id) === String(id)) return n;
      if (n.children?.length) {
        const f = this.findById(id, n.children);
        if (f) return f;
      }
    }
    return null;
  }

  getPathTo(el) {
    const path = [];
    const walk = nodes => {
      for (const n of nodes) {
        if (n === el) {
          path.unshift(n);
          return true;
        }
        if (n.children && walk(n.children)) {
          path.unshift(n);
          return true;
        }
      }
      return false;
    };
    walk(this.data.getStructure());
    return path;
  }

  autoSaveCurrent() {
    if (!this.currentElement) return;

    const t = document.getElementById('element-title');
    const c = document.getElementById('element-content');

    this.currentElement.title = t?.value || '';
    this.currentElement.content = c?.value || '';

    this.data.setStructure(this.data.getStructure());
    this.setStatus('Zapisano', 3000);
  }

  /* =========================
     MAPA BRAM
  ========================= */
  insertBrama(id) {
    const mapa = this.data.getMapa();
    const b = mapa.find(x => String(x.id) === String(id));
    if (!b || !this.currentElement) return;

    const list = b.books?.map(t => `• ${t}`).join('\n') || '';
    const c = document.getElementById('element-content');
    if (!c) return;

    c.value += `\n\n✦ === ${b.name} === ✦\n${list}\n\n`;
    this.autoSaveCurrent();
    this.setStatus(`Wstawiono: ${b.name}`);
  }

  /* =========================
     BELLA AI
  ========================= */
  bellaAnalyze() {
    if (!this.currentElement?.content?.trim()) {
      this.setStatus('Brak treści do analizy');
      return;
    }

    const s = this.generateBellaSuggestions(this.currentElement);
    this.renderer?.renderSuggestions(s.map(t => ({ type: 'suggestion', text: t })));
    this.setStatus(`${s.length} sugestii Bella AI`);
  }

  generateBellaSuggestions(el) {
    const t = el.content.toLowerCase();
    const out = [];

    if (t.length < 300) out.push('Rozwiń treść — dłuższe fragmenty mają większą siłę');
    if ((t.match(/\n\n/g) || []).length < 3) out.push('Dodaj więcej akapitów');

    if (!/(dialog|powiedział|„)/.test(t)) out.push('Dodaj dialogi');
    if ((t.match(/miłość|strach|gniew|nadzieja/g) || []).length < 5)
      out.push('Wzmocnij emocje (Wattpad)');

    return out.length ? out : ['Tekst idealny — brak sugestii'];
  }

  generateAIContent() {
    if (!this.currentElement) {
      this.setStatus('Wybierz element');
      return;
    }

    const text = this.generateAIText(this.currentElement);
    const c = document.getElementById('element-content');
    if (!c) return;

    c.value += `\n\n--- AI Generated ---\n\n${text}`;
    this.autoSaveCurrent();

    this.renderer?.renderSuggestions([{ type: 'generated', text }]);
    this.setStatus('Treść wygenerowana przez AI');
  }

  generateAIText(el) {
    if (this.currentProfile === 'amazon') {
      return '⭐⭐⭐⭐⭐ Bestseller, który zmienia wszystko. Zamów teraz.';
    }
    return 'Noc była zbyt cicha. Świat wstrzymał oddech.';
  }

  /* =========================
     DOCX
  ========================= */
  async exportToDocx() {
    if (!this.currentElement) {
      this.setStatus('Brak wybranego elementu');
      return;
    }

    const { Document, Packer, Paragraph, HeadingLevel } = docx;
    const path = this.getPathTo(this.currentElement);

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: this.currentElement.title, heading: HeadingLevel.TITLE }),
          new Paragraph({ text: path.map(p => p.title || p.type).join(' → ') }),
          new Paragraph({ text: this.currentElement.content || '' })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Eterniverse.docx';
    a.click();
    URL.revokeObjectURL(url);

    this.setStatus('Eksport DOCX zakończony');
  }

  /* =========================
     DYKTOWANIE
  ========================= */
  initSpeechRecognition() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = e => {
      const text = Array.from(e.results).map(r => r[0].transcript).join(' ');
      const c = document.getElementById('element-content');
      if (c) {
        c.value += text + ' ';
        this.autoSaveCurrent();
      }
    };

    this.recognition.onstart = () => {
      this.isDictating = true;
      this.toggleDictation(true);
      this.setStatus('🎤 Dyktowanie aktywne', 0);
    };

    this.recognition.onend = () => {
      this.isDictating = false;
      this.toggleDictation(false);
      this.setStatus('Dyktowanie zatrzymane');
    };
  }

  startDictation() {
    if (!this.recognition || this.isDictating) return;
    try { this.recognition.start(); } catch {}
  }

  stopDictation() {
    if (!this.recognition || !this.isDictating) return;
    try { this.recognition.stop(); } catch {}
  }

  toggleDictation(active) {
    const s = document.getElementById('start-dictate');
    const t = document.getElementById('stop-dictate');
    if (s) s.disabled = active;
    if (t) t.disabled = !active;
  }

  /* =========================
     STATUS
  ========================= */
  setStatus(msg, time = 6000) {
    if (this.renderer?.setStatus) {
      this.renderer.setStatus(msg, time);
      return;
    }

    const e = document.getElementById('status');
    if (!e) return;

    e.textContent = msg;
    if (time > 0) {
      setTimeout(() => {
        if (e.textContent === msg) e.textContent = 'Gotowy';
      }, time);
    }
  }
}

/* =========================
   START
========================= */
const master = new EterniverseMasterPRO();
window.master = master;

console.log(`Eterniverse Master PRO ${master.VERSION} uruchomiony`);