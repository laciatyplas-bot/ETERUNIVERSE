// ==========================================================
//  ETERNIVERSE CHAPTER ENGINE
// ==========================================================
//  Zarządza rozdziałami (chapters) dla każdej książki.
//  Funkcje: dodawanie, edycja, usuwanie, audio, debug.
// ==========================================================
//
//  Importy:
//    BOOKS     → globalna lista książek z core.js
//    saveAll   → zapis danych do localStorage
//    renderUI  → aktualizacja interfejsu po zmianach
//
// ==========================================================

import { BOOKS, saveAll } from './core.js';
import { renderUI } from './uiEngine.js';

// ==========================================================
// 🧩 Inicjalizacja silnika rozdziałów
// ==========================================================
export function setupChapterEngine() {
  console.log('%c[CHAPTER ENGINE] Aktywny i gotowy.', 'color:#28D3C6;font-weight:bold;');
}

// ==========================================================
// ➕ Dodaj nowy rozdział do danej książki
// ==========================================================
export function addChapter(bookIndex, newChapter) {
  try {
    if (!BOOKS[bookIndex]) throw new Error(`Nie znaleziono książki o indeksie ${bookIndex}.`);

    // jeśli książka nie ma jeszcze listy rozdziałów — utwórz ją
    if (!BOOKS[bookIndex].chapters) BOOKS[bookIndex].chapters = [];

    // dodaj rozdział
    BOOKS[bookIndex].chapters.push(newChapter);

    // zapisz i odśwież interfejs
    saveAll();
    renderUI(BOOKS);

    console.log(`[CHAPTER ENGINE] Dodano rozdział "${newChapter.title}" do książki "${BOOKS[bookIndex].title}"`);
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd dodawania rozdziału:', err);
  }
}

// ==========================================================
// ✏️ Edytuj istniejący rozdział
// ==========================================================
export function editChapter(bookIndex, chapterIndex, updatedData) {
  try {
    if (!BOOKS[bookIndex]) throw new Error('Nie znaleziono książki.');
    if (!BOOKS[bookIndex].chapters?.[chapterIndex]) throw new Error('Nie znaleziono rozdziału.');

    Object.assign(BOOKS[bookIndex].chapters[chapterIndex], updatedData);

    saveAll();
    renderUI(BOOKS);

    console.log(`[CHAPTER ENGINE] Edytowano rozdział #${chapterIndex + 1} w książce "${BOOKS[bookIndex].title}"`);
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd edycji rozdziału:', err);
  }
}

// ==========================================================
// 🗑️ Usuń rozdział z książki
// ==========================================================
export function deleteChapter(bookIndex, chapterIndex) {
  try {
    if (!BOOKS[bookIndex]) throw new Error('Nie znaleziono książki.');
    if (!BOOKS[bookIndex].chapters?.[chapterIndex]) throw new Error('Nie znaleziono rozdziału.');

    const removed = BOOKS[bookIndex].chapters.splice(chapterIndex, 1);

    saveAll();
    renderUI(BOOKS);

    console.warn(`[CHAPTER ENGINE] Usunięto rozdział "${removed[0].title}" z książki "${BOOKS[bookIndex].title}"`);
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd usuwania rozdziału:', err);
  }
}

// ==========================================================
// 🔊 Odtwórz audio rozdziału (jeśli jest dostępne)
// ==========================================================
export function playChapterAudio(bookIndex, chapterIndex) {
  try {
    const ch = BOOKS[bookIndex]?.chapters?.[chapterIndex];
    if (!ch) throw new Error('Nie znaleziono rozdziału.');

    if (!ch.audio) {
      alert('Ten rozdział nie ma pliku audio.');
      return;
    }

    const audio = new Audio(ch.audio);
    audio.play();

    console.log(`[CHAPTER ENGINE] Odtwarzanie audio rozdziału: "${ch.title}"`);
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd odtwarzania audio:', err);
  }
}

// ==========================================================
// 🔍 Znajdź rozdział po tytule
// ==========================================================
export function findChapter(bookIndex, title) {
  try {
    const chapters = BOOKS[bookIndex]?.chapters;
    if (!chapters) throw new Error('Książka nie ma żadnych rozdziałów.');

    const found = chapters.find(ch => ch.title.toLowerCase() === title.toLowerCase());
    if (found) console.log(`[CHAPTER ENGINE] Znaleziono rozdział: ${found.title}`);
    else console.warn(`[CHAPTER ENGINE] Brak rozdziału "${title}" w książce "${BOOKS[bookIndex].title}".`);

    return found || null;
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd wyszukiwania rozdziału:', err);
    return null;
  }
}

// ==========================================================
// 🧠 Debug — wypisz wszystkie rozdziały danej książki
// ==========================================================
export function dumpChapters(bookIndex) {
  try {
    const book = BOOKS[bookIndex];
    if (!book) throw new Error('Nie znaleziono książki.');

    console.log('%c=== ROZDZIAŁY KSIĄŻKI ===', 'color:#D9A441;font-weight:bold;');
    console.log(`📘 ${book.title} (${book.status})`);
    if (!book.chapters?.length) {
      console.log('   └─ brak rozdziałów.');
      return;
    }

    book.chapters.forEach((ch, i) => {
      console.log(`   ├─ ${i + 1}. ${ch.title} — ${ch.desc || 'bez opisu'}`);
    });
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd dumpowania rozdziałów:', err);
  }
}

// ==========================================================
// ♻️ Reset wszystkich rozdziałów w danej książce
// ==========================================================
export function clearChapters(bookIndex) {
  try {
    if (!BOOKS[bookIndex]) throw new Error('Nie znaleziono książki.');
    BOOKS[bookIndex].chapters = [];
    saveAll();
    renderUI(BOOKS);
    console.warn(`[CHAPTER ENGINE] Wyczyściłem wszystkie rozdziały z książki "${BOOKS[bookIndex].title}".`);
  } catch (err) {
    console.error('[CHAPTER ENGINE] Błąd czyszczenia rozdziałów:', err);
  }
}

// ==========================================================
// 🧩 Koniec pliku
// ==========================================================
console.log('%c[CHAPTER ENGINE] Załadowano pomyślnie.', 'color:#9BA9C8;');
