// ==========================================================
//  ETERNIVERSE BOOK ENGINE
// ==========================================================
//  Zarządza książkami: dodawanie, edycja, usuwanie, zmiana statusu
// ==========================================================

import { BOOKS, saveAll } from './core.js';
import { renderUI } from './uiEngine.js';

// ==========================================================
// 🧩 Inicjalizacja silnika książek
// ==========================================================
export function setupBookEngine() {
  console.log('%c[BOOK ENGINE] Aktywny.', 'color:#28D3C6;');
}

// ==========================================================
// ➕ Dodaj książkę
// ==========================================================
export function addBook(newBook) {
  try {
    newBook.chapters = newBook.chapters || [];
    BOOKS.push(newBook);
    saveAll();
    renderUI(BOOKS);
    console.log(`[BOOK ENGINE] Dodano książkę: ${newBook.title}`);
  } catch (err) {
    console.error('[BOOK ENGINE] Błąd dodawania książki:', err);
  }
}

// ==========================================================
// ✏️ Edytuj książkę
// ==========================================================
export function editBook(index, updatedData) {
  try {
    if (!BOOKS[index]) throw new Error('Nie znaleziono książki o tym indeksie.');
    Object.assign(BOOKS[index], updatedData);
    saveAll();
    renderUI(BOOKS);
    console.log(`[BOOK ENGINE] Edytowano książkę: ${BOOKS[index].title}`);
  } catch (err) {
    console.error('[BOOK ENGINE] Błąd edycji książki:', err);
  }
}

// ==========================================================
// 🗑️ Usuń książkę
// ==========================================================
export function deleteBook(index) {
  try {
    if (!BOOKS[index]) throw new Error('Nie znaleziono książki do usunięcia.');
    const removed = BOOKS.splice(index, 1);
    saveAll();
    renderUI(BOOKS);
    console.warn(`[BOOK ENGINE] Usunięto książkę: ${removed[0].title}`);
  } catch (err) {
    console.error('[BOOK ENGINE] Błąd usuwania książki:', err);
  }
}

// ==========================================================
// 🧠 Znajdź książkę po tytule
// ==========================================================
export function findBookByTitle(title) {
  const found = BOOKS.find(b => b.title.toLowerCase() === title.toLowerCase());
  if (found) console.log(`[BOOK ENGINE] Znaleziono książkę: ${found.title}`);
  else console.warn('[BOOK ENGINE] Nie znaleziono książki:', title);
  return found;
}

// ==========================================================
// 📦 Eksport danych książek (tylko debug)
// ==========================================================
export function dumpBooks() {
  console.log('%c=== ETERNIVERSE BOOKS DUMP ===', 'color:#FFD700;font-weight:bold;');
  BOOKS.forEach((b, i) => {
    console.log(`📘 [${i}] ${b.title} (${b.status})`);
    if (b.chapters?.length) {
      b.chapters.forEach((ch, j) => console.log(`   ├─ ${j + 1}. ${ch.title}`));
    } else {
      console.log('   └─ brak rozdziałów');
    }
  });
}
