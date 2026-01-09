// ==========================================================
//  ETERNIVERSE CORE ENGINE
// ==========================================================
//  Łączy wszystkie silniki: dane, UI, książki, audio
// ==========================================================

import { loadData, saveData } from './dataEngine.js';
import { renderUI, setupUIEvents } from './uiEngine.js';
import { setupBookEngine } from './bookEngine.js';
import { setupAudioEngine } from './audioEngine.js';

export let ETERNIVERSE_DATA = [];

// Inicjalizacja całego systemu
document.addEventListener('DOMContentLoaded', async () => {
  console.log('%c[ETERNIVERSE CORE] 🔥 Start systemu', 'color:#FFD700');

  // 1️⃣ Wczytaj dane
  ETERNIVERSE_DATA = await loadData();
  console.log('[CORE] Dane załadowane:', ETERNIVERSE_DATA);

  // 2️⃣ Zainicjuj interfejs
  renderUI(ETERNIVERSE_DATA);

  // 3️⃣ Ustaw logikę książek i dźwięku
  setupBookEngine();
  setupAudioEngine();

  // 4️⃣ Zainicjuj eventy UI (filtry, modale)
  setupUIEvents();

  console.log('%c[ETERNIVERSE] ✅ System uruchomiony pomyślnie', 'color:#12C65B');
});

// Funkcja globalnego zapisu
export function saveAll() {
  saveData(ETERNIVERSE_DATA);
  console.log('[CORE] Dane zapisane do localStorage');
}
