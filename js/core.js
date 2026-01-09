import { loadData, saveData } from './dataEngine.js';
import { renderBookList } from './uiEngine.js';
import { addBook, updateBook } from './bookEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  const data = loadData();
  renderBookList(data);
});
