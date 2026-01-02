// data.js — Eterniverse Master PRO — KANON BRAM
// JEDYNE ŹRÓDŁO PRAWDY dla mapy Bram ETERNIVERSE

'use strict';

class DataMaster {
  constructor() {
    this.VERSION = 'v14.1-kanon';

    this.KEYS = {
      STRUCTURE: 'eterniverse_structure_v14',
      MAPA: 'eterniverse_mapa_v14',
      PROFILE: 'eterniverse_profile_v14',
      SETTINGS: 'eterniverse_settings_v14'
    };

    // === STAN ===
    this.structure = this.load(this.KEYS.STRUCTURE, []);
    this.mapa = this.load(this.KEYS.MAPA, this.getCanonicalMapa());
    this.profile = this.load(this.KEYS.PROFILE, 'wattpad');
    this.settings = this.load(this.KEYS.SETTINGS, { theme: 'eter' });

    console.log('[DataMaster] Wersja:', this.VERSION);
    console.log('[DataMaster] Elementów struktury:', this.structure.length);
    console.log('[DataMaster] Bram:', this.mapa.length);
  }

  /* =========================
     KANONICZNA MAPA BRAM
  ========================= */
  getCanonicalMapa() {
    return [
      {
        id: 1,
        name: 'BRAMA 1 — INTERSEEKER',
        books: [
          'INTERSEEKER: Geneza',
          'INTERSEEKER: Efekt Cienia',
          'INTERSEEKER: Kod Jaźni'
        ]
      },
      {
        id: 2,
        name: 'BRAMA 2 — ETERSEEKER',
        books: [
          'EterSeeker: Kronika Woli',
          'Interfejs Świadomości',
          'Protokół Reprogramowania'
        ]
      },
      {
        id: 3,
        name: 'BRAMA 3 — OBFITOSEEKER',
        books: [
          'ObfitoSeeker – Kod Obfitości',
          'Reguły Gry',
          'Dla Nikosia'
        ]
      },
      {
        id: 4,
        name: 'BRAMA 4 — THE KNOT',
        books: [
          'Kronika Splątania',
          'Eterniony Tom I',
          'Narodziny Eteriona³'
        ]
      },
      {
        id: 5,
        name: 'BRAMA 5 — RELIGIOSEEKER',
        books: [
          'ReligioSeeker',
          'Droga bez religii',
          'Wiara w Siebie'
        ]
      },
      {
        id: 6,
        name: 'BRAMA 6 — LUXSEEKER',
        books: [
          'LuxSeeker: Światło Wewnętrzne',
          'Promień Przebudzenia'
        ]
      },
      {
        id: 7,
        name: 'BRAMA 7 — UMBRASEEKER',
        books: [
          'UmbraSeeker: Cień Jaźni',
          'Dialog z Cieniem'
        ]
      },
      {
        id: 8,
        name: 'BRAMA 8 — AETHERSEEKER',
        books: [
          'AetherSeeker: Eteryczna Sieć',
          'Splątanie Kwantowe'
        ]
      },
      {
        id: 9,
        name: 'BRAMA 9 — CHRONOSEEKER',
        books: [
          'ChronoSeeker: Pętla Czasu',
          'Paradoks Wieczności'
        ]
      },
      {
        id: 10,
        name: 'BRAMA 10 — VOIDSEEKER',
        books: [
          'VoidSeeker: Pustka Potencjału',
          'Narodziny z Nicości'
        ]
      }
    ];
  }

  /* =========================
     STORAGE
  ========================= */
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('[DataMaster] Błąd load:', key, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('[DataMaster] Błąd save:', key, e);
    }
  }

  /* =========================
     API
  ========================= */
  getStructure() {
    return this.structure;
  }

  setStructure(structure) {
    this.structure = structure;
    this.save(this.KEYS.STRUCTURE, structure);
  }

  getMapa() {
    return this.mapa;
  }

  setMapa(mapa) {
    this.mapa = mapa;
    this.save(this.KEYS.MAPA, mapa);
  }

  getProfile() {
    return this.profile;
  }

  setProfile(profile) {
    this.profile = profile;
    this.save(this.KEYS.PROFILE, profile);
  }

  getSettings() {
    return this.settings;
  }

  updateSettings(partial) {
    this.settings = { ...this.settings, ...partial };
    this.save(this.KEYS.SETTINGS, this.settings);
  }
}

/* =========================
   BOOT
========================= */
const dataMaster = new DataMaster();
window.dataMaster = dataMaster;

console.log('ETERNIVERSE DataMaster — KANON BRAM ZAŁADOWANY');