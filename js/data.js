// data.js — Eterniverse Master PRO — KANON BRAM v14.3
// JEDYNE ŹRÓDŁO PRAWDY — ZGODNE Z app.js / render.js
// WKLEJ 1:1

'use strict';

class DataMaster {
  constructor() {
    this.VERSION = 14.3;
 
    this.KEYS = {
      STRUCTURE: 'eterniverse_structure_v14',
      MAPA: 'eterniverse_mapa_v14',
      PROFILE: 'eterniverse_profile_v14',
      SETTINGS: 'eterniverse_settings_v14',
      DATA_VERSION: 'eterniverse_data_version'
    };

    this.migrateData();

    this.structure = this.load(this.KEYS.STRUCTURE, []);
    this.mapa = this.load(this.KEYS.MAPA, this.getCanonicalMapa());
    this.profile = this.load(this.KEYS.PROFILE, 'wattpad');
    this.settings = this.load(this.KEYS.SETTINGS, { theme: 'eter', autoSave: true });

    console.log('[DataMaster] OK | v', this.VERSION);
  }

  /* =========================
     MIGRACJA
  ========================= */
  migrateData() {
    const raw = localStorage.getItem(this.KEYS.DATA_VERSION);
    const prev = raw ? Number(raw) : 0;

    if (prev < this.VERSION) {
      if (prev < 14.0) {
        localStorage.removeItem(this.KEYS.STRUCTURE);
        console.log('[DataMaster] Migracja: struktura wyczyszczona');
      }
      localStorage.setItem(this.KEYS.DATA_VERSION, String(this.VERSION));
    }
  }

  /* =========================
     STATUSY — KANON
  ========================= */
  normalizeStatus(s) {
    const map = {
      'opublikowana': 'published',
      'published': 'published',
      'gotowa': 'ready',
      'ready': 'ready',
      'w przygotowaniu': 'writing',
      'writing': 'writing',
      'szkic': 'draft',
      'draft': 'draft',
      'idea': 'idea',
      'planowana': 'idea'
    };
    return map[s] || 'idea';
  }

  /* =========================
     KANON BRAM
  ========================= */
  getCanonicalMapa() {
    const canon = [
      {
        id: 1,
        name: 'BRAMA 1 — INTERSEEKER',
        color: '#28D3C6',
        sub: 'Psychika · Cień · Trauma · Mechanizmy przetrwania',
        tag: 'CORE/PSYCHE',
        books: [
          { title: 'INTERSEEKER: Geneza', status: 'published' },
          { title: 'INTERSEEKER: Efekt Cienia', status: 'published' },
          { title: 'INTERSEEKER: Kod Jaźni', status: 'writing' }
        ]
      },
      {
        id: 2,
        name: 'BRAMA 2 — ETERSEEKER',
        color: '#12C65B',
        sub: 'Wola · Pole · Architektura rzeczywistości',
        tag: 'CORE/FIELD',
        books: [
          { title: 'EterSeeker: Kronika Woli', status: 'published' },
          { title: 'Interfejs Świadomości', status: 'published' },
          { title: 'Protokół Reprogramowania', status: 'idea' }
        ]
      },
      {
        id: 3,
        name: 'BRAMA 3 — OBFITOSEEKER',
        color: '#FFB14B',
        sub: 'Przepływ · Manifestacja · Reguły gry',
        tag: 'EMBODIED/FLOW',
        books: [
          { title: 'ObfitoSeeker – Kod Obfitości', status: 'published' },
          { title: 'Reguły Gry', status: 'writing' },
          { title: 'Dla Nikosia', status: 'idea' }
        ]
      },
      {
        id: 4,
        name: 'BRAMA 4 — THE KNOT',
        color: '#9B6BFF',
        sub: 'Splątanie · Węzły pola · Eterniony',
        tag: 'META/KNOT',
        books: [
          { title: 'Kronika Splątania', status: 'writing' },
          { title: 'Eterniony Tom I', status: 'idea' },
          { title: 'Narodziny Eteriona³', status: 'idea' }
        ]
      }
    ];

    // normalizacja statusów
    canon.forEach(g =>
      g.books.forEach(b => {
        b.status = this.normalizeStatus(b.status);
        b.cover = b.cover || '';
      })
    );

    return canon;
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

  save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  /* =========================
     API PUBLICZNE
  ========================= */
  getMapa() { return this.mapa; }

  setMapa(val) {
    this.mapa = val;
    this.save(this.KEYS.MAPA, val);
  }

  exportForRender() {
    return JSON.parse(JSON.stringify(this.mapa));
  }

  resetToCanon() {
    if (!confirm('RESET DO KANONU? (utrata danych)')) return;
    this.structure = [];
    this.mapa = this.getCanonicalMapa();
    this.save(this.KEYS.STRUCTURE, []);
    this.save(this.KEYS.MAPA, this.mapa);
    location.reload();
  }
}

/* =========================
   BOOT
========================= */
window.dataMaster = new DataMaster();
console.log('🌌 DataMaster v14.3 — GOTOWE');