// ==========================================================
//  ETERNIVERSE CORE ENGINE
// ==========================================================
//  Autor: Architekt Dominik (laciatyplas-bot)
//  Wersja: 1.0.0 (pełny system modułowy)
// ==========================================================
//
//  Ten plik jest głównym kontrolerem całego systemu ETERNIVERSE.
//  Odpowiada za:
//   ✅ inicjalizację wszystkich modułów
//   ✅ ładowanie danych z localStorage
//   ✅ synchronizację UI z logiką
//   ✅ globalne zapisywanie danych
//   ✅ integrację z silnikami (books, chapters, audio)
// ==========================================================

import { loadData, saveData, debugDump } from './dataEngine.js';
import { renderUI, setupUI } from './uiEngine.js';
import { setupBookEngine, addBook, editBook, deleteBook } from './bookEngine.js';
import { setupChapterEngine, addChapter, editChapter, deleteChapter } from './chapterEngine.js';
import { setupAudioEngine } from './audioEngine.js';

// ==========================================================
// 🌍 GLOBALNE DANE
// ==========================================================
export let BOOKS = [];

// ==========================================================
// ⚙️ INICJALIZACJA SYSTEMU
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c[CORE] Inicjalizacja systemu ETERNIVERSE...', 'color:#FFD700;font-weight:bold;');

  // 1️⃣ Wczytaj dane
  BOOKS = loadData();

  // 2️⃣ Uruchom UI (interfejs użytkownika)
  renderUI(BOOKS);
  setupUI(addBook, addChapter, editBook, deleteBook, editChapter, deleteChapter);

  // 3️⃣ Aktywuj silniki logiki
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
  console.log('%c[CORE] Dane zapisane.', 'color:#28D3C6;');
}

// ==========================================================
// 🧠 FUNKCJE NARZĘDZIOWE (DEVELOPER TOOLS)
// ==========================================================

/**
 * 📜 Wypisz wszystkie książki i rozdziały w konsoli.
 * Użyj w konsoli przeglądarki:
 *   → debugBooks();
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
 * 🧹 Czyści localStorage i restartuje dane domyślne.
 * Po uruchomieniu w konsoli:
 *   → resetUniverse();
 */
export function resetUniverse() {
  localStorage.removeItem('eterniverseBooksData_v1');
  BOOKS = loadData();
  renderUI(BOOKS);
  console.warn('%c[CORE] Reset danych — załadowano ponownie dane domyślne.', 'color:#FF6B6B;');
}

/**
 * 🔍 Eksport danych (kopiuj JSON do schowka)
 */
export function exportData() {
  const json = JSON.stringify(BOOKS, null, 2);
  navigator.clipboard.writeText(json);
  alert('📋 Dane ETERNIVERSE skopiowane do schowka!');
}

/**
 * 📥 Import danych (wklej JSON do systemu)
 */
export function importData() {
  const json = prompt('Wklej dane JSON:');
  try {
    const parsed = JSON.parse(json);
    BOOKS = parsed;
    saveAll();
    renderUI(BOOKS);
    alert('✅ Dane zaimportowane pomyślnie!');
  } catch (err) {
    alert('❌ Błąd importu: niepoprawny JSON.');
  }
}

// ==========================================================
// 🔧 DEV LOG
// ==========================================================
console.log('%c[CORE] Plik core.js załadowany poprawnie.', 'color:#9BA9C8;');
