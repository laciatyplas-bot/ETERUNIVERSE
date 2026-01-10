/* =====================================
   ETERNIVERSE — AUTO SAVE SYSTEM v1.0
   Automatyczny zapis co 30s + manual backup
   ===================================== */

(function() {
  // Singleton
  if (window.autoSaveLoaded) return;
  window.autoSaveLoaded = true;

  console.log("💾 AutoSave v1.0 – automatyczny zapis uruchomiony");

  let saveTimeout = null;
  let lastSave = Date.now();

  // === AUTOZAPIS CO 30 SEKUND ===
  function startAutoSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    
    saveTimeout = setTimeout(() => {
      if (window.WORLD_PSYCHE && Date.now() - lastSave > 25000) { // min 25s między zapisami
        performSave("Autozapis");
      }
      startAutoSave(); // Rekursja
    }, 30000);
  }

  // === MANUAL ZAPIS ===
  window.saveWorldNow = function(reason = "Ręczny zapis") {
    performSave(reason);
  };

  // === GŁÓWNA FUNKCJA ZAPISU ===
  function performSave(reason) {
    if (!window.WORLD_PSYCHE) {
      console.warn("💾 Brak WORLD_PSYCHE do zapisania");
      return;
    }

    try {
      // ZAPIS V4 (główny)
      localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", JSON.stringify(window.WORLD_PSYCHE));
      
      // BACKUP z timestamp (bezpiecznik)
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      localStorage.setItem(`ETERNIVERSE_BACKUP_${timestamp}`, JSON.stringify(window.WORLD_PSYCHE));
      
      // OGRANICZ BACKUPY (max 10)
      const backups = Object.keys(localStorage).filter(key => key.startsWith('ETERNIVERSE_BACKUP_'));
      if (backups.length > 10) {
        backups.slice(0, backups.length - 10).forEach(key => localStorage.removeItem(key));
      }

      lastSave = Date.now();
      console.log(`💾 [${reason}] Zapisano ${window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0)} książek`);
      
      // Belle notyfikacja (co 5 minut)
      if (Date.now() - lastSave < 300000) { // Pierwsze 5 min bez spamu
        if (typeof window.belleSpeak === 'function') {
          window.belleSpeak(`💾 ${reason} – wszystko bezpieczne`);
        }
      }
      
    } catch (e) {
      console.error("💾 Błąd zapisu:", e);
    }
  }

  // === PRZYWRÓĆ Z BACKUPU ===
  window.restoreFromBackup = function() {
    const backups = Object.keys(localStorage).filter(key => key.startsWith('ETERNIVERSE_BACKUP_'));
    if (backups.length === 0) {
      alert("Brak backupów do przywrócenia");
      return;
    }

    const latestBackup = backups.sort().pop();
    const backupData = localStorage.getItem(latestBackup);
    
    if (backupData && confirm(`Przywrócić z backupu?\n${latestBackup}`)) {
      window.WORLD_PSYCHE = JSON.parse(backupData);
      localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", backupData);
      
      if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
      if (typeof window.belleSpeak === 'function') {
        window.belleSpeak("🔄 Przywrócono z backupu – dane bezpieczne");
      }
      
      console.log("🔄 Przywrócono:", latestBackup);
    }
  };

  // === CZYSZCZENIE NA START ===
  function cleanupOldBackups() {
    const backups = Object.keys(localStorage).filter(key => key.startsWith('ETERNIVERSE_BACKUP_'));
    backups.slice(0, 5).forEach(key => localStorage.removeItem(key)); // Usuń najstarsze
  }

  // === INICJALIZACJA ===
  function init() {
    if (!window.WORLD_PSYCHE) {
      setTimeout(init, 500);
      return;
    }

    cleanupOldBackups();
    startAutoSave();
    
    // Zapis przy każdej zmianie (debounce 2s)
    document.addEventListener('worldRendered', () => {
      setTimeout(() => window.saveWorldNow("Zmiana w świecie"), 2000);
    });

    console.log("💾 AutoSave v1.0 – aktywny (co 30s + backup)");
  }

  // START
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
