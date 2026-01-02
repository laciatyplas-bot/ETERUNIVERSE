// data.js - Eterniverse Master Premium PRO v14.0 – DataMaster Edition
// Centralny moduł zarządzania danymi, pamięcią, backupami i lokalnym systemem plików

class DataMaster {
  constructor() {
    // === WERSJA I KLUCZE PAMIĘCI ===
    this.VERSION = 'v14.0-data-master';
    this.KEYS = {
      STRUCTURE: 'eterniverse_structure_v14',
      MAPA: 'eterniverse_mapa_v14',
      PROFILE: 'eterniverse_profile_v14',
      SETTINGS: 'eterniverse_settings_v14'
    };

    // === STAN PAMIĘCI ===
    this.structure = this.load(this.KEYS.STRUCTURE, []);
    this.mapa = this.load(this.KEYS.MAPA, this.defaultMapa());
    this.profile = this.load(this.KEYS.PROFILE, 'wattpad');
    this.settings = this.load(this.KEYS.SETTINGS, { theme: 'quantum' });

    console.log(`[DataMaster] Załadowano ${this.structure.length} elementów hierarchii`);
    console.log(`[DataMaster] Profil: ${this.profile.toUpperCase()}`);
    console.log(`[DataMaster] Bram: ${this.mapa.length}`);
  }

  // Domyślna mapa 10 Eterycznych Bram
  defaultMapa() {
    const names = [
      "INTERSEEKER", "ETERSEEKER", "OBFITOSEEKER", "THE KNOT",
      "RELIGIOSEEKER", "LUXSEEKER", "UMBRASEEKER", "AETHERSEEKER",
      "CHRONOSEEKER", "VOIDSEEKER"
    ];
    return names.map((name, i) => ({
      id: i + 1,
      name: `BRAMA ${i + 1} — ${name}`,
      books: [`Księga ${i + 1}.1`, `Księga ${i + 1}.2`, `Księga ${i + 1}.3`]
    }));
  }

  // === BEZPIECZNE OPERACJE NA LOCALSTORAGE ===
  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`[DataMaster] Błąd odczytu ${key}:`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`[DataMaster] Błąd zapisu ${key}:`, e);
      alert('Błąd zapisu – pamięć przeglądarki może być pełna');
    }
  }

  // === DOSTĘP DO DANYCH ===
  getStructure() { return this.structure; }
  setStructure(structure) {
    this.structure = structure;
    this.save(this.KEYS.STRUCTURE, structure);
  }

  getMapa() { return this.mapa; }
  setMapa(mapa) {
    this.mapa = mapa;
    this.save(this.KEYS.MAPA, mapa);
  }

  getProfile() { return this.profile; }
  setProfile(profile) {
    this.profile = profile;
    this.save(this.KEYS.PROFILE, profile);
  }

  getSettings() { return this.settings; }
  updateSettings(partialSettings) {
    this.settings = { ...this.settings, ...partialSettings };
    this.save(this.KEYS.SETTINGS, this.settings);
  }
}

// === URUCHOMIENIE DATA MASTER ===
const dataMaster = new DataMaster();
window.dataMaster = dataMaster;

console.log('DataMaster v14.0 uruchomiony – pamięć Eterniverse aktywna');