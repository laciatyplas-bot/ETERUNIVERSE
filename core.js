import { loadData, saveData } from './dataEngine.js';
import { renderUI, setupUI } from './uiEngine.js';
import { addBook } from './bookEngine.js';
import { addChapter } from './chapterEngine.js';

export let BOOKS = [];

document.addEventListener('DOMContentLoaded', () => {
  BOOKS = loadData();
  renderUI(BOOKS);
  setupUI(addBook, addChapter);
});

export function saveAll() {
  saveData(BOOKS);
}
