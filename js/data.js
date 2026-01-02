// data.js — Eterniverse Master Premium PRO v14.1 (STABLE)
// CENTRALNY DATA MASTER — PAMIĘĆ, MAPA BRAM, PROFIL, BACKUP

'use strict';

class DataMaster {
  constructor() {
    // === WERSJA ===
    this.VERSION = 'v14.1-data-master-stable';

    // === KLUCZE LOCALSTORAGE ===
    this.KEYS = {
      STRUCTURE: 'eterniverse_structure_v14',
      MAPA: 'eterniverse_mapa_v14',
      PROFILE: 'eterniverse_profile_v14',
      SETTINGS: 'eterniverse_settings_v14',
      BACKUP: 'eterniverse_backup_v14'
    };

    // === STAN ===
    this.structure = this.load(this.KEYS.STRUCTURE, []);
    this.mapa = this.load(this.KEYS.MAPA, this.defaultMapa());
    this.profile = this.load(this.KEYS.PROFILE, 'wattpad');
    this.settings = this.load(this.KEYS.SETTINGS, { theme: 'quantum' });

    console.log(`[DataMaster] Wersja ${this.VERSION}`);
    console.log(`[DataMaster] Elementów struktury: ${this.structure.length}`);
    console.log(`[DataMaster] Profil: ${this.profile.toUpperCase()}`);
    console.log(`[DataMaster] Bram: ${this.mapa.length}`);
  }

  /* =========================
     MAPA BRAM (10)
  ========================= */
  defaultMapa() {
    const names = [
      'INTERSEEKER',
      'ETERSEEKER',
      'OBFITOSEEKER',
      'THE KNOT',
      'RELIGIOSEEKER',
      'LUXSEEKER',
      'UMBRASEEKER',
      'AETHERSEEKER',
      'CHRONOSEEKER',
      'VOIDSEEKER'
    ];

    return names.map((name, i) => ({
      id: i + 1,
      name: `BRAMA ${i + 1} — ${name}`,
      books: [
        `Księga ${i + 1}.1`,
        `Księga ${i + 1}.2`,
        `Księga ${i + 1}.3`
      ]
    }));
  }

  /* =========================
     LOCALSTORAGE SAFE I/O
  ========================= */
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error(`[DataMaster] Błąd odczytu ${key}`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`[DataMaster] Błąd zapisu ${key}`, e);
      alert('Błąd zapisu danych (localStorage)');
    }
  }

  /* =========================
     STRUKTURA
  ========================= */
  getStructure() {
    return this.structure;
  }

  setStructure(structure) {
    this.structure = structure;
    this.save(this.KEYS.STRUCTURE, structure);
  }

  /* =========================
     MAPA
  ========================= */
  getMapa() {
    return this.mapa;
  }

  setMapa(mapa) {
    this.mapa = mapa;
    this.save(this.KEYS.MAPA, mapa);
  }

  /* =========================
     PROFIL
  ========================= */
  getProfile() {
    return this.profile;
  }

  setProfile(profile) {
    this.profile = profile;
    this.save(this.KEYS.PROFILE, profile);
  }

  /* =========================
     SETTINGS
  ========================= */
  getSettings() {
    return this.settings;
  }

  updateSettings(partial) {
    this.settings = { ...this.settings, ...partial };
    this.save(this.KEYS.SETTINGS, this.settings);
  }

  /* =========================
     BACKUP
  ========================= */
  createBackup() {
    const snapshot = {
      created: new Date().toISOString(),
      structure: this.structure,
      mapa: this.mapa,
      profile: this.profile,
      settings: this.settings
    };

    this.save(this.KEYS.BACKUP, snapshot);
    console.log('[DataMaster] Backup utworzony');
    return snapshot;
  }

  restoreBackup() {
    const backup = this.load(this.KEYS.BACKUP, null);
    if (!backup) {
      alert('Brak backupu do przywrócenia');
      return false;
    }

    this.structure = backup.structure || [];
    this.mapa = backup.mapa || this.defaultMapa();
    this.profile = backup.profile || 'wattpad';
    this.settings = backup.settings || { theme: 'quantum' };

    this.save(this.KEYS.STRUCTURE, this.structure);
    this.save(this.KEYS.MAPA, this.mapa);
    this.save(this.KEYS.PROFILE, this.profile);
    this.save(this.KEYS.SETTINGS, this.settings);

    console.log('[DataMaster] Backup przywrócony');
    return true;
  }

  /* =========================
     EXPORT (JSON)
  ========================= */
  exportAllData() {
    const payload = {
      version: this.VERSION,
      exported: new Date().toISOString(),
      structure: this.structure,
      mapa: this.mapa,
      profile: this.profile,
      settings: this.settings
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Eterniverse_Backup.json';
    a.click();
    URL.revokeObjectURL(url);

    console.log('[DataMaster] Eksport JSON zakończony');
  }
}

/* =========================
   START DATA MASTER
========================= */
const dataMaster = new DataMaster();
window.dataMaster = dataMaster;

console.log('DataMaster v14.1 uruchomiony — pamięć Eterniverse aktywna');