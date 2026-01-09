import { saveAll, ETERNIVERSE_DATA } from './core.js';
import { renderUI } from './uiEngine.js';

export function setupBookEngine() {
  console.log('[BOOK ENGINE] aktywny');
}

export function addBook(gateId, newBook) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return;
  gate.books.push(newBook);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}

export function updateBook(gateId, bookIndex, newData) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return;
  Object.assign(gate.books[bookIndex], newData);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}

export function deleteBook(gateId, bookIndex) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return;
  gate.books.splice(bookIndex, 1);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}
