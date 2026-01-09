// ==========================================================
//  ETERNIVERSE BOOK ENGINE
// ==========================================================
//  Obsługa książek (CRUD + filtry)
// ==========================================================

import { saveAll, ETERNIVERSE_DATA } from './core.js';
import { renderUI } from './uiEngine.js';

export function setupBookEngine() {
  console.log('[BOOK ENGINE] Aktywny');
}

// ➕ Dodaj książkę
export function addBook(gateId, newBook) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return console.warn('Nie znaleziono bramy', gateId);

  gate.books.push(newBook);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}

// ✏️ Edytuj książkę
export function updateBook(gateId, bookIndex, newData) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return;
  Object.assign(gate.books[bookIndex], newData);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}

// ❌ Usuń książkę
export function deleteBook(gateId, bookIndex) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return;
  gate.books.splice(bookIndex, 1);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}
