// data.js — Eterniverse Master PRO — KANON BRAM v14.2
// JEDYNE ŹRÓDŁO PRAWDY dla mapy Bram ETERNIVERSE
// WKLEJ 1:1

'use strict';

class DataMaster {
  constructor() {
    this.VERSION = 'v14.2-kanon';

    this.KEYS = {
      STRUCTURE: 'eterniverse_structure_v14',
      MAPA: 'eterniverse_mapa_v14',
      PROFILE: 'eterniverse_profile_v14',
      SETTINGS: 'eterniverse_settings_v14',
      DATA_VERSION: 'eterniverse_data_version'
    };

    // Migracja wersji
    this.migrateData();

    // Ładowanie danych
    this.structure = this.load(this.KEYS.STRUCTURE, []);
    this.mapa = this.load(this.KEYS.MAPA, this.getCanonicalMapa());
    this.profile = this.load(this.KEYS.PROFILE, 'wattpad');
    this.settings = this.load(this.KEYS.SETTINGS, { theme: 'eter', autoSave: true });

    console.log('[DataMaster] Wersja:', this.VERSION);
    console.log('[DataMaster] Elementów struktury:', this.structure.length);
    console.log('[DataMaster] Bram w kanonie:', this.mapa.length);
    console.log('[DataMaster] Profil:', this.profile);
  }

  /* =========================
     MIGRACJA WERSJI
  ========================= */
  migrateData() {
    const currentVersion = localStorage.getItem(this.KEYS.DATA_VERSION);
    if (currentVersion === this.VERSION) return;

    // Przykład migracji: jeśli stara wersja, wyczyść strukturę użytkownika
    if (!currentVersion || currentVersion < 'v14.0') {
      localStorage.removeItem(this.KEYS.STRUCTURE);
      console.log('[DataMaster] Migracja: wyczyszczono starą strukturę');
    }

    localStorage.setItem(this.KEYS.DATA_VERSION, this.VERSION);
  }

  /* =========================
     KANONICZNA MAPA BRAM — ROZSZERZONA
  ========================= */
  getCanonicalMapa() {
    return [
      {
        id: 1,
        name: 'BRAMA 1 — INTERSEEKER',
        color: '#28D3C6',
        sub: 'Psychika · Cień · Trauma · Mechanizmy przetrwania',
        tag: 'CORE/PSYCHE',
        description: 'Konfrontacja z wewnętrznym cieniem i mechanizmami przetrwania.',
        books: [
          { title: 'INTERSEEKER: Geneza', status: 'opublikowana', cover: '', link: '' },
          { title: 'INTERSEEKER: Efekt Cienia', status: 'opublikowana', cover: '', link: '' },
          { title: 'INTERSEEKER: Kod Jaźni', status: 'w przygotowaniu', cover: '', link: '' }
        ]
      },
      {
        id: 2,
        name: 'BRAMA 2 — ETERSEEKER',
        color: '#12C65B',
        sub: 'Wola · Pole · Architektura rzeczywistości',
        tag: 'CORE/FIELD',
        description: 'Reprogramowanie woli i odczytywanie znaków pola.',
        books: [
          { title: 'EterSeeker: Kronika Woli', status: 'opublikowana', cover: '', link: '' },
          { title: 'Interfejs Świadomości', status: 'opublikowana', cover: '', link: '' },
          { title: 'Protokół Reprogramowania', status: 'planowana', cover: '', link: '' }
        ]
      },
      {
        id: 3,
        name: 'BRAMA 3 — OBFITOSEEKER',
        color: '#FFB14B',
        sub: 'Przepływ · Manifestacja · Reguły gry',
        tag: 'EMBODIED/FLOW',
        description: 'Kod obfitości i zrozumienie materialnych reguł rzeczywistości.',
        books: [
          { title: 'ObfitoSeeker – Kod Obfitości', status: 'opublikowana', cover: '', link: '' },
          { title: 'Reguły Gry', status: 'w przygotowaniu', cover: '', link: '' },
          { title: 'Dla Nikosia', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 4,
        name: 'BRAMA 4 — THE KNOT',
        color: '#9B6BFF',
        sub: 'Splątanie · Węzły pola · Eterniony',
        tag: 'META/KNOT',
        description: 'Zrozumienie kolektywnego splątania i narodzin świadomości zbiorowej.',
        books: [
          { title: 'Kronika Splątania', status: 'w przygotowaniu', cover: '', link: '' },
          { title: 'Eterniony Tom I', status: 'idea', cover: '', link: '' },
          { title: 'Narodziny Eteriona³', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 5,
        name: 'BRAMA 5 — RELIGIOSEEKER',
        color: '#D9A441',
        sub: 'Duchowość · Wiara · Autonomia',
        tag: 'SPIRITUAL',
        description: 'Droga do wiary w siebie bez pośredników religijnych.',
        books: [
          { title: 'ReligioSeeker', status: 'idea', cover: '', link: '' },
          { title: 'Droga bez religii', status: 'idea', cover: '', link: '' },
          { title: 'Wiara w Siebie', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 6,
        name: 'BRAMA 6 — LUXSEEKER',
        color: '#FFD700',
        sub: 'Światło · Oświecenie · Energia',
        tag: 'LIGHT',
        description: 'Aktywacja wewnętrznego światła i przebudzenia.',
        books: [
          { title: 'LuxSeeker: Światło Wewnętrzne', status: 'idea', cover: '', link: '' },
          { title: 'Promień Przebudzenia', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 7,
        name: 'BRAMA 7 — UMBRASEEKER',
        color: '#8B008B',
        sub: 'Cień · Integracja mroku · Głębia',
        tag: 'SHADOW',
        description: 'Dialog z cieniem i pełna akceptacja ciemnych aspektów jaźni.',
        books: [
          { title: 'UmbraSeeker: Cień Jaźni', status: 'idea', cover: '', link: '' },
          { title: 'Dialog z Cieniem', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 8,
        name: 'BRAMA 8 — AETHERSEEKER',
        color: '#00CED1',
        sub: 'Eter · Sieć · Kwantowość',
        tag: 'AETHER',
        description: 'Zrozumienie eterycznej sieci splątania.',
        books: [
          { title: 'AetherSeeker: Eteryczna Sieć', status: 'idea', cover: '', link: '' },
          { title: 'Splątanie Kwantowe', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 9,
        name: 'BRAMA 9 — CHRONOSEEKER',
        color: '#FF6B6B',
        sub: 'Czas · Linie życia · Paradoksy',
        tag: 'TIME',
        description: 'Nieliniowa natura czasu i pętle świadomości.',
        books: [
          { title: 'ChronoSeeker: Pętla Czasu', status: 'idea', cover: '', link: '' },
          { title: 'Paradoks Wieczności', status: 'idea', cover: '', link: '' }
        ]
      },
      {
        id: 10,
        name: 'BRAMA 10 — VOIDSEEKER',
        color: '#2E0854',
        sub: 'Pustka · Nicość · Potencjał',
        tag: 'VOID',
        description: 'Narodziny z pustki – najwyższy poziom integracji.',
        books: [
          { title: 'VoidSeeker: Pustka Potencjału', status: 'idea', cover: '', link: '' },
          { title: 'Narodziny z Nicości', status: 'idea', cover: '', link: '' }
        ]
      }
    ];
  }

  /* =========================
     STORAGE — BEZPIECZNE
  ========================= */
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('[DataMaster] Błąd odczytu:', key, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[DataMaster] Błąd zapisu:', key, e);
    }
  }

  /* =========================
     PUBLIC API
  ========================= */
  getStructure() { return this.structure; }
  setStructure(val) { this.structure = val; this.save(this.KEYS.STRUCTURE, val); }

  getMapa() { return this.mapa; }
  setMapa(val) { this.mapa = val; this.save(this.KEYS.MAPA, val); }

  getProfile() { return this.profile; }
  setProfile(val) { this.profile = val; this.save(this.KEYS.PROFILE, val); }

  getSettings() { return this.settings; }
  updateSettings(partial) {
    this.settings = { ...this.settings, ...partial };
    this.save(this.KEYS.SETTINGS, this.settings);
  }

  // Reset do kanonu (ostrożnie!)
  resetToCanon() {
    if (confirm('Zresetować strukturę do kanonicznej mapy? (dane użytkownika zostaną utracone)')) {
      this.structure = [];
      this.mapa = this.getCanonicalMapa();
      this.save(this.KEYS.STRUCTURE, this.structure);
      this.save(this.KEYS.MAPA, this.mapa);
      location.reload();
    }
  }
}

/* =========================
   BOOT
========================= */
const dataMaster = new DataMaster();
window.dataMaster = dataMaster;

console.log('🌌 ETERNIVERSE DataMaster v14.2 — KANON BRAM ZAŁADOWANY I GOTOWY');