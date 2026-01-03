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
        localStorage.removeItem(this.KEYS.MAPA);
        console.log('[DataMaster] Migracja: struktura + mapa wyczyszczone');
      }
      localStorage.setItem(this.KEYS.DATA_VERSION, String(this.VERSION));
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
     KANON 10 BRAM
  ========================= */
  getCanonicalMapa() {
    const canon = [
      {
        id: 1,
        name: 'BRAMA I — INTERSEEKER',
        color: '#28D3C6',
        sub: 'Psychika · Cień · Trauma · Tożsamość',
        tag: 'CORE/PSYCHE',
        books: [
          { title: 'INTERSEEKER: Geneza', status: 'published' },
          { title: 'INTERSEEKER: Efekt Cienia', status: 'published' },
          { title: 'INTERSEEKER: Kod Jaźni', status: 'writing' }
        ]
      },
      {
        id: 2,
        name: 'BRAMA II — CUSTOS / GENEZA',
        color: '#D9A441',
        sub: 'Początek · Rdzeń · Strażnik · Linia rodu',
        tag: 'CORE/ORIGIN',
        books: [
          { title: 'RootSeeker — Anatomia Początku', status: 'idea' },
          { title: 'OriginCode — Kod Początku', status: 'idea' }
        ]
      },
      {
        id: 3,
        name: 'BRAMA III — ETERSEEKER',
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
        id: 4,
        name: 'BRAMA IV — ARCHETYPY',
        color: '#9B6BFF',
        sub: 'Role · Maski · Konstrukcja Ja',
        tag: 'CORE/ARCHETYPE',
        books: [
          { title: 'ArchetypSeeker — System Archetypów', status: 'idea' }
        ]
      },
      {
        id: 5,
        name: 'BRAMA V — OBFITOSEEKER',
        color: '#FFB14B',
        sub: 'Przepływ · Materia · Reguły gry',
        tag: 'EMBODIED/FLOW',
        books: [
          { title: 'ObfitoSeeker — Kod Obfitości', status: 'published' },
          { title: 'Reguły Gry', status: 'writing' }
        ]
      },
      {
        id: 6,
        name: 'BRAMA VI — BIOSEEKER',
        color: '#FF6B6B',
        sub: 'Ciało · Biologia · Granice adaptacji',
        tag: 'EMBODIED/BIO',
        books: [
          { title: 'BioSeeker — Sekret Biologii Pola', status: 'idea' }
        ]
      },
      {
        id: 7,
        name: 'BRAMA VII — SPLĄTANIE',
        color: '#7A6CFF',
        sub: 'Obserwator · AI · Meta-świadomość',
        tag: 'META/TECH',
        books: [
          { title: 'SplatanieSeeker — Protokół Obserwatora', status: 'idea' }
        ]
      },
      {
        id: 8,
        name: 'BRAMA VIII — TRAJEKTORIE',
        color: '#28D3C6',
        sub: 'Czas · Linie życia · Konsekwencje',
        tag: 'META/TIME',
        books: [
          { title: 'TrajektoriaSeeker — Mapa Linii Życia', status: 'idea' }
        ]
      },
      {
        id: 9,
        name: 'BRAMA IX — ETERNIONY',
        color: '#D9A441',
        sub: 'Kolektyw · Sieć · Jednostka',
        tag: 'COLLECTIVE',
        books: [
          { title: 'ETERNIONY — Tom I', status: 'idea' }
        ]
      },
      {
        id: 10,
        name: 'BRAMA X — ETERUNIVERSE',
        color: '#12C65B',
        sub: 'Integracja · Cisza · Projektant',
        tag: 'INTEGRATION',
        books: [
          { title: 'SilenceForge — Kuźnia Ciszy', status: 'idea' }
        ]
      }
    ];

    canon.forEach(brama =>
      brama.books.forEach(book => {
        book.status = this.normalizeStatus(book.status);
        book.cover = book.cover || '';
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
    } catch (e) {
      console.warn('[DataMaster] Błąd load', key, e);
      return fallback;
    }
  }

  save(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  /* =========================
     API PUBLICZNE
  ========================= */
  getMapa() {
    return this.mapa;
  }

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
console.log('🌌 DataMaster v14.3 — KANON 10 BRAM ZAŁADOWANY');