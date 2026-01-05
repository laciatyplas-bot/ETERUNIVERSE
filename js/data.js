// data.js — Eterniverse Master PRO — KANON v14.4
// JEDYNE ŹRÓDŁO PRAWDY
// ZGODNE 1:1 z app.js v2.0 + render.js v2.0
// WKLEJ BEZ ZMIAN

'use strict';

class DataMaster {
  constructor() {
    this.VERSION = 14.4;

    this.KEYS = {
      DATA: 'eterniverse_data_v14',
      DATA_VERSION: 'eterniverse_data_version'
    };

    this.migrate();
    this.data = this.load(this.KEYS.DATA, this.getCanonicalData());

    console.log('[DataMaster] OK | v', this.VERSION);
  }

  /* =========================
     MIGRACJA
  ========================= */
  migrate() {
    const raw = localStorage.getItem(this.KEYS.DATA_VERSION);
    const prev = raw ? Number(raw) : 0;

    if (prev < this.VERSION) {
      localStorage.removeItem(this.KEYS.DATA);
      localStorage.setItem(this.KEYS.DATA_VERSION, String(this.VERSION));
      console.log('[DataMaster] Migracja wykonana');
    }
  }

  /* =========================
     STATUSY — KANON
  ========================= */
  normalizeStatus(s) {
    const map = {
      opublikowana: 'published',
      published: 'published',
      gotowa: 'ready',
      ready: 'ready',
      'w przygotowaniu': 'writing',
      writing: 'writing',
      szkic: 'draft',
      draft: 'draft',
      idea: 'idea',
      planowana: 'idea'
    };
    return map[s] || 'idea';
  }

  /* =========================
     KANON CAŁOŚCI
  ========================= */
  getCanonicalData() {
    const data = {
      meta: { version: this.VERSION },
      worlds: [
        {
          id: 1,
          name: 'Świat I — INTERSEEKER',
          desc: 'Psychika · Cień · Trauma · Integracja'
        },
        {
          id: 2,
          name: 'Świat II — POLARIS',
          desc: 'Wola · Pole · Ekspansja'
        }
      ],
      gates: [
        {
          id: 1,
          name: 'BRAMA I — INTERSEEKER',
          sub: 'Psychika · Cień · Trauma · Mechanizmy przetrwania',
          tag: 'CORE/PSYCHE',
          books: [
            { title: 'INTERSEEKER: Geneza', status: 'published', desc: '', cover: '' },
            { title: 'INTERSEEKER: Efekt Cienia', status: 'published', desc: '', cover: '' },
            { title: 'INTERSEEKER: Kod Jaźni', status: 'writing', desc: '', cover: '' }
          ]
        },
        {
          id: 2,
          name: 'BRAMA II — ETERSEEKER',
          sub: 'Wola · Pole · Architektura rzeczywistości',
          tag: 'CORE/FIELD',
          books: [
            { title: 'EterSeeker: Kronika Woli', status: 'published', desc: '', cover: '' },
            { title: 'Interfejs Świadomości', status: 'published', desc: '', cover: '' },
            { title: 'Protokół Reprogramowania', status: 'idea', desc: '', cover: '' }
          ]
        },
        {
          id: 3,
          name: 'BRAMA III — OBFITOSEEKER',
          sub: 'Przepływ · Manifestacja · Reguły gry',
          tag: 'EMBODIED/FLOW',
          books: [
            { title: 'ObfitoSeeker – Kod Obfitości', status: 'published', desc: '', cover: '' },
            { title: 'Reguły Gry', status: 'writing', desc: '', cover: '' },
            { title: 'Dla Nikosia', status: 'idea', desc: '', cover: '' }
          ]
        },
        {
          id: 4,
          name: 'BRAMA IV — THE KNOT',
          sub: 'Splątanie · Węzły pola · Eterniony',
          tag: 'META/KNOT',
          books: [
            { title: 'Kronika Splątania', status: 'writing', desc: '', cover: '' },
            { title: 'Eterniony Tom I', status: 'idea', desc: '', cover: '' },
            { title: 'Narodziny Eteriona³', status: 'idea', desc: '', cover: '' }
          ]
        }
      ]
    };

    data.gates.forEach(g =>
      g.books.forEach(b => {
        b.status = this.normalizeStatus(b.status);
      })
    );

    return data;
  }

  /* =========================
     STORAGE
  ========================= */
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  save() {
    localStorage.setItem(this.KEYS.DATA, JSON.stringify(this.data));
  }

  /* =========================
     API
  ========================= */
  exportForRender() {
    return JSON.parse(JSON.stringify(this.data));
  }

  setData(val) {
    this.data = val;
    this.save();
  }

  resetToCanon() {
    if (!confirm('RESET DO KANONU?')) return;
    this.data = this.getCanonicalData();
    this.save();
    location.reload();
  }
}

/* =========================
   BOOT
========================= */
window.dataMaster = new DataMaster();
console.log('🌌 DataMaster v14.4 — GOTOWE');