// data.js - Eterniverse Master Premium PRO v12.0
// Master Edition – Centralny moduł danych, pamięci i struktury Eterniverse
// Pełna, samodzielna, nieograniczona i gotowa do integracji wersja master

'use strict';

class EterniverseDataMaster {
  constructor() {
    // === KONFIGURACJA PAMIĘCI ===
    this.VERSION = 'v12.0-master';
    this.MEMORY_KEYS = {
      STRUCTURE: 'eterniverse_structure_master_v12',
      MAPA: 'eterniverse_mapa_master_v12',
      PROFILE: 'eterniverse_profile_master',
      SETTINGS: 'eterniverse_settings_master',
      BACKUP: 'eterniverse_backup_master'
    };

    // === STAN PAMIĘCI ===
    this.memory = {
      structure: this.load(this.MEMORY_KEYS.STRUCTURE, []),
      mapa: this.load(this.MEMORY_KEYS.MAPA, this.defaultMapa()),
      profile: this.load(this.MEMORY_KEYS.PROFILE, 'wattpad'),
      settings: this.load(this.MEMORY_KEYS.SETTINGS, this.defaultSettings()),
      backup: this.load(this.MEMORY_KEYS.BACKUP, [])
    };

    // === INICJALIZACJA ===
    this.init();
  }

  // Domyślna mapa bram Eterniverse
  defaultMapa() {
    return [
      { id: 1, name: "BRAMA 1 — INTERSEEKER", books: ["INTERSEEKER: Geneza", "INTERSEEKER: Efekt Cienia"] },
      { id: 2, name: "BRAMA 2 — ETERSEEKER", books: ["EterSeeker: Kronika Woli", "Interfejs Świadomości"] },
      { id: 3, name: "BRAMA 3 — OBFITOSEEKER", books: ["ObfitoSeeker – Kod Obfitości"] },
      { id: 4, name: "BRAMA 4 — THE KNOT", books: ["Kronika Splątania", "Eterniony Tom I"] },
      { id: 5, name: "BRAMA 5 — RELIGIOSEEKER", books: ["ReligioSeeker"] },
      { id: 6, name: "BRAMA 6 — LUXSEEKER", books: ["LuxSeeker: Światło Wewnętrzne"] },
      { id: 7, name: "BRAMA 7 — UMBRASEEKER", books: ["UmbraSeeker: Cień Jaźni"] },
      { id: 8, name: "BRAMA 8 — AETHERSEEKER", books: ["AetherSeeker: Eteryczna Sieć"] },
      { id: 9, name: "BRAMA 9 — CHRONOSEEKER", books: ["ChronoSeeker: Pętla Czasu"] },
      { id: 10, name: "BRAMA 10 — VOIDSEEKER", books: ["VoidSeeker: Pustka Potencjału"] }
    ];
  }

  // Domyślne ustawienia
  defaultSettings() {
    return {
      theme: 'quantum',
      autosave: true,
      dictationLang: 'pl-PL',
      aiStrength: 'high',
      consoleEnabled: true,
      backupInterval: 3600000 // 1 godzina
    };
  }

  // === OPERACJE NA PAMIĘCI ===
  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      if (data === null) return fallback;
      return JSON.parse(data);
    } catch (e) {
      console.error(`[DataMaster] Błąd odczytu ${key}:`, e);
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.log(`Zapisano dane: ${key}`);
    } catch (e) {
      console.error(`[DataMaster] Błąd zapisu ${key}:`, e);
      alert('Błąd zapisu pamięci – localStorage może być pełny');
    }
  }

  // === DOSTĘP DO DANYCH ===
  getStructure() {
    return this.memory.structure;
  }

  setStructure(structure) {
    this.memory.structure = structure;
    this.save(this.MEMORY_KEYS.STRUCTURE, structure);
  }

  getMapa() {
    return this.memory.mapa;
  }

  getCurrentProfile() {
    return this.memory.profile;
  }

  setCurrentProfile(profile) {
    this.memory.profile = profile;
    this.save(this.MEMORY_KEYS.PROFILE, profile);
  }

  getSettings() {
    return this.memory.settings;
  }

  updateSettings(newSettings) {
    this.memory.settings = { ...this.memory.settings, ...newSettings };
    this.save(this.MEMORY_KEYS.SETTINGS, this.memory.settings);
  }

  // === BACKUP SYSTEM ===
  createBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      version: this.VERSION,
      data: {
        structure: this.memory.structure,
        mapa: this.memory.mapa,
        profile: this.memory.profile,
        settings: this.memory.settings
      }
    };

    this.memory.backup.push(backup);
    if (this.memory.backup.length > 10) {
      this.memory.backup.shift(); // max 10 backupów
    }

    this.save(this.MEMORY_KEYS.BACKUP, this.memory.backup);
    this.log('Utworzono backup pamięci', 'success');
  }

  restoreBackup(index) {
    if (index < 0 || index >= this.memory.backup.length) {
      this.log('Nieprawidłowy indeks backupu', 'error');
      return false;
    }

    const backup = this.memory.backup[index];
    this.memory.structure = backup.data.structure;
    this.memory.mapa = backup.data.mapa;
    this.memory.profile = backup.data.profile;
    this.memory.settings = backup.data.settings;

    // Zapisz przywrócone dane
    this.save(this.MEMORY_KEYS.STRUCTURE, this.memory.structure);
    this.save(this.MEMORY_KEYS.MAPA, this.memory.mapa);
    this.save(this.MEMORY_KEYS.PROFILE, this.memory.profile);
    this.save(this.MEMORY_KEYS.SETTINGS, this.memory.settings);

    this.log(`Przywrócono backup z ${new Date(backup.timestamp).toLocaleString('pl-PL')}`, 'success');
    return true;
  }

  getBackups() {
    return this.memory.backup;
  }

  exportAllData() {
    const exportData = {
      eterniverse_version: this.VERSION,
      export_date: new Date().toISOString(),
      structure: this.memory.structure,
      mapa: this.memory.mapa,
      profile: this.memory.profile,
      settings: this.memory.settings,
      backups: this.memory.backup
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `eterniverse_full_export_${new Date().toISOString().slice(0,10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
    this.log('Pełny eksport danych zakończony', 'success');
  }

  importAllData(jsonString) {
    try {
      const imported = JSON.parse(jsonString);

      if (confirm('Zaimportować wszystkie dane? To nadpisze bieżącą pamięć.')) {
        this.memory.structure = imported.structure || [];
        this.memory.mapa = imported.mapa || this.defaultMapa();
        this.memory.profile = imported.profile || 'wattpad';
        this.memory.settings = imported.settings || this.defaultSettings();
        this.memory.backup = imported.backups || [];

        // Zapisz wszystko
        Object.keys(this.MEMORY_KEYS).forEach(keyName => {
          const key = this.MEMORY_KEYS[keyName];
          this.save(key, this.memory[keyName.toLowerCase()] || []);
        });

        this.log('Pełny import danych zakończony', 'success');
        location.reload(); // przeładuj, by zastosować zmiany
      }
    } catch (e) {
      this.log('Błąd importu – nieprawidłowy format JSON', 'error');
      console.error(e);
    }
  }

  // === INICJALIZACJA ===
  init() {
    this.log(`Eterniverse DataMaster ${this.VERSION} uruchomiony`);
    this.log(`Załadowano ${this.memory.structure.length} elementów hierarchii`);
    this.log(`Profil: ${this.memory.profile.toUpperCase()}`);
    this.log(`Bram eterycznych: ${this.memory.mapa.length}`);

    // Automatyczny backup co godzinę
    if (this.memory.settings.autosave) {
      setInterval(() => this.createBackup(), this.memory.settings.backupInterval);
    }
  }

  // === LOGGING ===
  log(message, type = 'info') {
    console.log(`[DataMaster] ${message}`);

    // Przekaż log do konsoli Bella jeśli istnieje
    if (window.bellaConsole) {
      window.bellaConsole.log(message, type);
    }

    // Przekaż do statusu UI jeśli renderer istnieje
    if (window.renderer && window.renderer.setStatus) {
      window.renderer.setStatus(message, 5000);
    }
  }

  // === POMOCNICZE ===
  generateId() {
    return 'data_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  clearAllData() {
    if (confirm('Czy na pewno wyczyścić całą pamięć Eterniverse? To nieodwracalne!')) {
      Object.values(this.MEMORY_KEYS).forEach(key => localStorage.removeItem(key));
      this.log('Cała pamięć wyczyszczona – czysta tablica', 'warning');
      location.reload();
    }
  }
}

// === URUCHOMIENIE DATA MASTER ===
const dataMaster = new EterniverseDataMaster();
window.dataMaster = dataMaster;

// Eksport dla innych modułów
window.EterniverseDataMaster = EterniverseDataMaster;

console.log('Eterniverse DataMaster PRO v12.0 – pamięć świadoma i nieskończona');