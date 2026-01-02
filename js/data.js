// data.js - Eterniverse Master Premium PRO v13.0 – DataMaster Edition
// Centralny, niezniszczalny moduł zarządzania danymi, pamięcią i backupami

class EterniverseDataMaster {
  constructor() {
    // === WERSJA I KONFIGURACJA ===
    this.VERSION = 'v13.0-data-master';
    this.KEYS = {
      STRUCTURE: 'eterniverse_structure_v13',
      MAPA: 'eterniverse_mapa_v13',
      PROFILE: 'eterniverse_profile_v13',
      SETTINGS: 'eterniverse_settings_v13',
      BACKUPS: 'eterniverse_backups_v13',
      METADATA: 'eterniverse_metadata_v13'
    };

    // === STAN PAMIĘCI ===
    this.data = {
      structure: this.load(this.KEYS.STRUCTURE, []),
      mapa: this.load(this.KEYS.MAPA, this.defaultMapa()),
      profile: this.load(this.KEYS.PROFILE, 'wattpad'),
      settings: this.load(this.KEYS.SETTINGS, this.defaultSettings()),
      backups: this.load(this.KEYS.BACKUPS, []),
      metadata: this.load(this.KEYS.METADATA, { created: new Date().toISOString(), version: this.VERSION })
    };

    // === INICJALIZACJA ===
    this.init();
  }

  // Domyślna mapa 10 bram Eterniverse
  defaultMapa() {
    const gates = [];
    const names = [
      "INTERSEEKER", "ETERSEEKER", "OBFITOSEEKER", "THE KNOT",
      "RELIGIOSEEKER", "LUXSEEKER", "UMBRASEEKER", "AETHERSEEKER",
      "CHRONOSEEKER", "VOIDSEEKER"
    ];
    const sampleBooks = [
      ["INTERSEEKER: Geneza", "INTERSEEKER: Efekt Cienia", "INTERSEEKER: Kod Jaźni"],
      ["EterSeeker: Kronika Woli", "Interfejs Świadomości", "Protokół Reprogramowania"],
      ["ObfitoSeeker – Kod Obfitości", "Reguły Gry", "Dla Nikosia"],
      ["Kronika Splątania", "Eterniony Tom I", "Narodziny Eteriona³"],
      ["ReligioSeeker", "Droga bez religii", "Wiara w Siebie"],
      ["LuxSeeker: Światło Wewnętrzne", "Promień Przebudzenia"],
      ["UmbraSeeker: Cień Jaźni", "Dialog z Cieniem"],
      ["AetherSeeker: Eteryczna Sieć", "Splątanie Kwantowe"],
      ["ChronoSeeker: Pętla Czasu", "Paradoks Wieczności"],
      ["VoidSeeker: Pustka Potencjału", "Narodziny z Nicości"]
    ];

    for (let i = 1; i <= 10; i++) {
      gates.push({
        id: i,
        name: `BRAMA ${i} — ${names[i-1]}`,
        books: sampleBooks[i-1]
      });
    }
    return gates;
  }

  // Domyślne ustawienia
  defaultSettings() {
    return {
      theme: 'quantum',
      autosave: true,
      autosaveInterval: 1000, // ms
      backupInterval: 3600000, // 1h
      maxBackups: 20,
      dictationLang: 'pl-PL',
      aiStrength: 'high',
      consoleEnabled: true,
      notifications: true
    };
  }

  // === OPERACJE NA LOCALSTORAGE ===
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
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
      this.notify('Błąd zapisu – pamięć może być pełna', 'error');
    }
  }

  // === DOSTĘP DO DANYCH ===
  getStructure() { return this.data.structure; }
  setStructure(val) { this.data.structure = val; this.save(this.KEYS.STRUCTURE, val); }

  getMapa() { return this.data.mapa; }
  setMapa(val) { this.data.mapa = val; this.save(this.KEYS.MAPA, val); }

  getProfile() { return this.data.profile; }
  setProfile(val) { this.data.profile = val; this.save(this.KEYS.PROFILE, val); }

  getSettings() { return this.data.settings; }
  updateSettings(partial) {
    this.data.settings = { ...this.data.settings, ...partial };
    this.save(this.KEYS.SETTINGS, this.data.settings);
  }

  getMetadata() { return this.data.metadata; }

  // === SYSTEM BACKUPÓW ===
  createBackup(name = null) {
    const backup = {
      id: this.generateId(),
      name: name || `Backup ${new Date().toLocaleString('pl-PL')}`,
      timestamp: new Date().toISOString(),
      version: this.VERSION,
      size: JSON.stringify(this.data).length,
      data: {
        structure: JSON.parse(JSON.stringify(this.data.structure)),
        mapa: JSON.parse(JSON.stringify(this.data.mapa)),
        profile: this.data.profile,
        settings: JSON.parse(JSON.stringify(this.data.settings))
      }
    };

    this.data.backups.unshift(backup);
    if (this.data.backups.length > this.data.settings.maxBackups) {
      this.data.backups.pop();
    }

    this.save(this.KEYS.BACKUPS, this.data.backups);
    this.notify(`Backup utworzony: ${backup.name}`, 'success');
    return backup;
  }

  getBackups() {
    return this.data.backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  restoreBackup(id) {
    const backup = this.data.backups.find(b => b.id === id);
    if (!backup) {
      this.notify('Backup nie znaleziony', 'error');
      return false;
    }

    if (confirm(`Przywrócić backup "${backup.name}" z ${new Date(backup.timestamp).toLocaleString('pl-PL')}?`)) {
      this.data.structure = backup.data.structure;
      this.data.mapa = backup.data.mapa;
      this.data.profile = backup.data.profile;
      this.data.settings = backup.data.settings;

      // Zapisz przywrócone dane
      this.save(this.KEYS.STRUCTURE, this.data.structure);
      this.save(this.KEYS.MAPA, this.data.mapa);
      this.save(this.KEYS.PROFILE, this.data.profile);
      this.save(this.KEYS.SETTINGS, this.data.settings);

      this.notify(`Przywrócono backup: ${backup.name}`, 'success');
      setTimeout(() => location.reload(), 1000);
      return true;
    }
    return false;
  }

  deleteBackup(id) {
    this.data.backups = this.data.backups.filter(b => b.id !== id);
    this.save(this.KEYS.BACKUPS, this.data.backups);
    this.notify('Backup usunięty', 'info');
  }

  // === EKSPORT / IMPORT ===
  exportAllData() {
    const exportPackage = {
      eterniverse_version: this.VERSION,
      export_timestamp: new Date().toISOString(),
      export_name: `Eterniverse_Full_Export_${new Date().toISOString().slice(0,10)}`,
      structure: this.data.structure,
      mapa: this.data.mapa,
      profile: this.data.profile,
      settings: this.data.settings,
      backups: this.data.backups,
      metadata: this.data.metadata
    };

    const dataStr = JSON.stringify(exportPackage, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportPackage.export_name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.notify('Pełny eksport danych zakończony', 'success');
  }

  importAllData(fileInputElementId = 'import-file-input') {
    const input = document.getElementById(fileInputElementId) || document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);

          if (confirm(`Zaimportować dane z ${file.name}? Nadpisze bieżącą pamięć.`)) {
            this.data.structure = imported.structure || [];
            this.data.mapa = imported.mapa || this.defaultMapa();
            this.data.profile = imported.profile || 'wattpad';
            this.data.settings = imported.settings || this.defaultSettings();
            this.data.backups = imported.backups || [];

            // Zapisz wszystko
            Object.values(this.KEYS).forEach(key => {
              const value = this.data[key.toLowerCase().replace(/_v13/g, '')] || [];
              this.save(key, value);
            });

            this.notify('Import danych zakończony – restart', 'success');
            setTimeout(() => location.reload(), 1500);
          }
        } catch (err) {
          this.notify('Błąd importu – nieprawidłowy plik JSON', 'error');
          console.error(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // === CZYSZCZENIE PAMIĘCI ===
  clearAllData() {
    if (confirm('!!! OSTZEŻENIE !!!\nCzy na pewno wyczyścić CAŁĄ pamięć Eterniverse?\nTo działanie jest nieodwracalne!')) {
      if (confirm('Potwierdź ponownie – to zniszczy wszystkie dane')) {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
        this.notify('Cała pamięć wyczyszczona – czysta tablica', 'warning');
        setTimeout(() => location.reload(), 1000);
      }
    }
  }

  // === INICJALIZACJA ===
  init() {
    console.log(`[DataMaster] Eterniverse DataMaster ${this.VERSION} uruchomiony`);
    console.log(`Struktura: ${this.data.structure.length} elementów`);
    console.log(`Bram: ${this.data.mapa.length}`);
    console.log(`Profil: ${this.data.profile.toUpperCase()}`);
    console.log(`Backupów: ${this.data.backups.length}`);

    // Automatyczne backupy
    if (this.data.settings.autosave && this.data.settings.backupInterval > 0) {
      setInterval(() => this.createBackup(), this.data.settings.backupInterval);
    }

    // Powiadomienie startowe
    this.notify(`DataMaster v13.0 aktywny – pamięć świadoma`, 'success');
  }

  // === POWIADOMIENIA ===
  notify(message, type = 'info') {
    console.log(`[DataMaster:${type}] ${message}`);

    if (window.renderer && window.renderer.setStatus) {
      window.renderer.setStatus(message, type === 'error' ? 8000 : 5000);
    }
  }

  // === POMOCNICZE ===
  generateId() {
    return 'dm_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}

// === URUCHOMIENIE DATA MASTER ===
const dataMaster = new EterniverseDataMaster();
window.dataMaster = dataMaster;

console.log('Eterniverse DataMaster PRO v13.0 – pamięć nieśmiertelna i nieskończona');