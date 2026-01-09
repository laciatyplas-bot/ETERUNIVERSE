// ==========================================================
//  ETERNIVERSE UI ENGINE
// ==========================================================
//  Renderowanie widoków i interakcje użytkownika
// ==========================================================

import { playAudio, stopAll } from './audioEngine.js';
import { updateBook, deleteBook } from './bookEngine.js';
import { ETERNIVERSE_DATA } from './core.js';

const gatesGrid = document.getElementById('gatesGrid');

export function renderUI(data) {
  gatesGrid.innerHTML = '';

  data.forEach((gate, gateIndex) => {
    const gateEl = document.createElement('article');
    gateEl.className = 'brama-card';
    gateEl.innerHTML = `
      <div class="brama-header">
        <div>
          <div class="brama-title">${gate.name}</div>
          <div class="brama-sub">${gate.sub}</div>
        </div>
        <span class="badge">${gate.tag}</span>
      </div>
    `;

    const booksWrap = document.createElement('div');
    booksWrap.className = 'books';

    gate.books.forEach((book, bookIndex) => {
      const el = document.createElement('div');
      el.className = 'book';
      el.innerHTML = `
        <div class="book-cover-thumb" style="${book.cover ? `background-image:url('${book.cover}')` : ''}"></div>
        <div class="book-main">
          <div class="book-title">${book.title}</div>
          <div class="book-meta">
            <span>${book.status}</span>
          </div>
          ${book.audio ? `<button class="play-btn">▶️ Audio</button>` : ''}
        </div>
      `;

      const btn = el.querySelector('.play-btn');
      if (btn && book.audio) {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          playAudio(book.audio);
        });
      }

      // Kliknięcie = edycja
      el.addEventListener('click', () => {
        const newTitle = prompt('Nowy tytuł:', book.title);
        if (newTitle) updateBook(gate.id, bookIndex, { title: newTitle });
      });

      booksWrap.appendChild(el);
    });

    gateEl.appendChild(booksWrap);
    gatesGrid.appendChild(gateEl);
  });
}

export function setupUIEvents() {
  console.log('[UI] Eventy aktywne');
}
