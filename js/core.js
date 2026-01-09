// ==========================================================
//  ETERNIVERSE CORE ENGINE
// ==========================================================
//  Autor: Architekt Dominik
//  Wersja: 1.0.0
// ==========================================================
//  Ten plik jest sercem projektu ETERNIVERSE.
//  Łączy wszystkie silniki (bookEngine, chapterEngine, uiEngine, dataEngine, audioEngine)
//  i zarządza przepływem danych oraz logiką całej aplikacji.
// ==========================================================

import { loadData, saveData, debugDump } from './dataEngine.js';
import { renderUI, setupUI } from './uiEngine.js';
import { setupBookEngine, addBook, editBook, deleteBook } from './bookEngine.js';
import { setupChapterEngine, addChapter, editChapter, deleteChapter } from './chapterEngine.js';
import { setupAudioEngine } from './audioEngine.js';

// ==========================================================
// 🌍 GLOBALNE DANE SYSTEMU
// ==========================================================
export let BOOKS = [];

// ==========================================================
// ⚙️ INICJALIZACJA SYSTEMU
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c[CORE] Inicjalizacja systemu ETERNIVERSE...', 'color:#FFD700;font-weight:bold;');

  // 1️⃣ Wczytaj dane z localStorage
  BOOKS = loadData();

  // 2️⃣ Renderuj UI (interfejs użytkownika)
  renderUI(BOOKS);
  setupUI(addBook, addChapter, editBook, deleteBook, editChapter, deleteChapter);

  // 3️⃣ Uruchom silniki logiki
  setupBookEngine();
  setupChapterEngine();
  setupAudioEngine();

  console.log('%c[CORE] System gotowy. Załadowano ' + BOOKS.length + ' książek.', 'color:#12C65B;font-weight:bold;');
});

// ==========================================================
// 💾 GLOBALNA FUNKCJA ZAPISU
// ==========================================================
export function saveAll() {
  saveData(BOOKS);
  console.log('%c[CORE] Dane zapisane do localStorage.', 'color:#28D3C6;');
}

// ==========================================================
// 🧠 FUNKCJE NARZĘDZIOWE (DEVELOPER TOOLS)
// ==========================================================

/**
 * 📜 Wypisz wszystkie książki i rozdziały w konsoli
 */
export function debugBooks() {
  console.log('%c=== AKTUALNA BAZA KSIĄŻEK ===', 'color:#D9A441;font-weight:bold;');
  BOOKS.forEach((b, i) => {
    console.log(`%c📘 [${i}] ${b.title} (${b.status})`, 'color:#28D3C6;');
    if (b.chapters && b.chapters.length > 0) {
      b.chapters.forEach((ch, j) => {
        console.log(`   ├─ ${j + 1}. ${ch.title}`);
      });
    } else {
      console.log('   └─ brak rozdziałów');
    }
  });
}

/**
 * 🧹 Resetuje dane do domyślnego stanu
 */
export function resetUniverse() {
  localStorage.removeItem('eterniverseBooksData_v1');
  BOOKS = loadData();
  renderUI(BOOKS);
  console.warn('%c[CORE] Dane zresetowane. Załadowano domyślną bazę.', 'color:#FF6B6B;');
}

/**
 * 📤 Eksport danych — kopiuje JSON do schowka
 */
export function exportData() {
  const json = JSON.stringify(BOOKS, null, 2);
  navigator.clipboard.writeText(json)
    .then(() => alert('📋 Dane ETERNIVERSE zostały skopiowane do schowka!'))
    .catch(err => console.error('Błąd eksportu:', err));
}

/**
 * 📥 Import danych — wklej JSON z kopii
 */
export function importData() {
  const json = prompt('Wklej dane JSON:');
  if (!json) return;
  try {
    const parsed = JSON.parse(json);
    BOOKS = parsed;
    saveAll();
    renderUI(BOOKS);
    alert('✅ Dane zaimportowane pomyślnie!');
  } catch (err) {
    alert('❌ Błąd: niepoprawny JSON.');
  }
}

/**
 * 🧩 Wypisz dane debugowe w konsoli
 */
export function dumpData() {
  debugDump(BOOKS);
}

// ==========================================================
// 🛡️ TRYB DEVELOPERA (opcjonalny log debugowy)
// ==========================================================
const DEV_MODE = true; // ustaw false, aby wyciszyć logi w produkcji

if (DEV_MODE) {
  console.log('%c[CORE] Developer Mode: aktywny', 'color:#9BA9C8;');
  window.debugBooks = debugBooks;
  window.resetUniverse = resetUniverse;
  window.exportData = exportData;
  window.importData = importData;
  window.dumpData = dumpData;
}

// ==========================================================
// 🔧 STATUS
// ==========================================================
console.log('%c[CORE] Plik core.js załadowany poprawnie.', 'color:#9BA9C8;');
