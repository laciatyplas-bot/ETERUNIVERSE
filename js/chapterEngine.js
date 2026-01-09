import { saveAll, ETERNIVERSE_DATA } from './core.js';
import { renderUI } from './uiEngine.js';

export function setupChapterEngine() {
  console.log('[CHAPTER ENGINE] aktywny');
}

export function addChapter(gateId, bookIndex, chapterData) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  if (!gate) return;
  const book = gate.books[bookIndex];
  if (!book.chapters) book.chapters = [];
  book.chapters.push(chapterData);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}

export function updateChapter(gateId, bookIndex, chapterIndex, newData) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  const book = gate?.books[bookIndex];
  if (!book || !book.chapters) return;
  Object.assign(book.chapters[chapterIndex], newData);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}

export function deleteChapter(gateId, bookIndex, chapterIndex) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  const book = gate?.books[bookIndex];
  if (!book || !book.chapters) return;
  book.chapters.splice(chapterIndex, 1);
  saveAll();
  renderUI(ETERNIVERSE_DATA);
}
