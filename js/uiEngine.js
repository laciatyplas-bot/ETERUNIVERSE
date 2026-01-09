// ==========================================================
//  ETERNIVERSE UI ENGINE
// ==========================================================
//  Tworzy i zarządza całym interfejsem użytkownika (UI):
//   ✅ Lista książek
//   ✅ Modal z rozdziałami
//   ✅ Przyciski dodawania / edycji / usuwania
//   ✅ Obsługa audio
// ==========================================================

import { BOOKS, saveAll } from './core.js';
import { addBook, editBook, deleteBook } from './bookEngine.js';
import { addChapter, editChapter, deleteChapter, playChapterAudio } from './chapterEngine.js';

// ==========================================================
// 🧩 Renderuj główny interfejs
// ==========================================================
export function renderUI(data) {
  const app = document.getElementById('app');
  if (!app) {
    console.error('[UI ENGINE] Nie znaleziono elementu #app w index.html');
    return;
  }

  app.innerHTML = ''; // wyczyść

  // 🔹 Pasek narzędzi
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const addBtn = document.createElement('button');
  addBtn.textContent = '+ Dodaj książkę';
  addBtn.onclick = () => openBookForm();

  const exportBtn = document.createElement('button');
  exportBtn.textContent = '📤 Eksport';
  exportBtn.onclick = exportData;

  const importBtn = document.createElement('button');
  importBtn.textContent = '📥 Import';
  importBtn.onclick = importData;

  toolbar.appendChild(addBtn);
  toolbar.appendChild(exportBtn);
  toolbar.appendChild(importBtn);

  app.appendChild(toolbar);

  // 🔹 Lista książek
  const grid = document.createElement('div');
  grid.className = 'grid';

  data.forEach((book, i) => {
    const bookEl = document.createElement('div');
    bookEl.className = 'book';
    bookEl.onclick = () => openBookModal(i);

    const cover = document.createElement('div');
    cover.className = 'book-cover';
    cover.style.backgroundImage = book.cover ? `url(${book.cover})` : 'none';
    if (!book.cover) cover.textContent = 'Brak okładki';

    const title = document.createElement('div');
    title.className = 'book-title';
    title.textContent = book.title;

    const status = document.createElement('div');
    status.className = 'status';
    status.textContent = book.status?.toUpperCase() || 'UNKNOWN';

    bookEl.appendChild(cover);
    bookEl.appendChild(title);
    bookEl.appendChild(status);
    grid.appendChild(bookEl);
  });

  app.appendChild(grid);
}

// ==========================================================
// 📘 Otwórz modal z książką i jej rozdziałami
// ==========================================================
function openBookModal(index) {
  const book = BOOKS[index];
  if (!book) return;

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal">
      <h2>${book.title}</h2>
      <div id="chapterList"></div>
      <button id="addChapterBtn">+ Dodaj rozdział</button>
      <hr style="margin:10px 0;opacity:0.2;">
      <button id="editBookBtn">✏️ Edytuj książkę</button>
      <button id="deleteBookBtn">🗑️ Usuń książkę</button>
      <button id="closeModal">Zamknij</button>
    </div>
  `;
  document.body.appendChild(modal);

  const chapterList = modal.querySelector('#chapterList');
  renderChapters(chapterList, book, index);

  modal.style.display = 'flex';

  modal.querySelector('#closeModal').onclick = () => modal.remove();
  modal.querySelector('#addChapterBtn').onclick = () => openChapterForm(index, modal);
  modal.querySelector('#editBookBtn').onclick = () => openBookForm(book, index, modal);
  modal.querySelector('#deleteBookBtn').onclick = () => {
    if (confirm(`Na pewno usunąć książkę "${book.title}"?`)) {
      deleteBook(index);
      modal.remove();
    }
  };
}

// ==========================================================
// 🧩 Renderuj listę rozdziałów w modalu
// ==========================================================
function renderChapters(container, book, bookIndex) {
  container.innerHTML = '';

  if (!book.chapters || book.chapters.length === 0) {
    const empty = document.createElement('div');
    empty.textContent = 'Brak rozdziałów.';
    empty.style.color = '#9BA9C8';
    empty.style.fontSize = '13px';
    container.appendChild(empty);
    return;
  }

  book.chapters.forEach((ch, i) => {
    const div = document.createElement('div');
    div.className = 'chapter';

    div.innerHTML = `
      <b>${ch.title}</b>
      <small>${ch.desc || ''}</small>
      ${ch.audio ? `<audio controls src="${ch.audio}"></audio>` : ''}
      <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
        <button class="action" id="playAudio_${i}">▶️ Odtwórz</button>
        <button class="action" id="editChapter_${i}">✏️ Edytuj</button>
        <button class="action" id="deleteChapter_${i}">🗑️ Usuń</button>
      </div>
    `;

    container.appendChild(div);

    const playBtn = div.querySelector(`#playAudio_${i}`);
    const editBtn = div.querySelector(`#editChapter_${i}`);
    const delBtn = div.querySelector(`#deleteChapter_${i}`);

    playBtn.onclick = () => playChapterAudio(bookIndex, i);
    editBtn.onclick = () => openChapterForm(bookIndex, null, book.chapters[i], i);
    delBtn.onclick = () => {
      if (confirm(`Usunąć rozdział "${ch.title}"?`)) {
        deleteChapter(bookIndex, i);
        renderChapters(container, BOOKS[bookIndex], bookIndex);
      }
    };
  });
}

// ==========================================================
// ➕ Formularz dodawania / edycji książki
// ==========================================================
function openBookForm(book = null, index = null, modalToClose = null) {
  const form = document.createElement('div');
  form.className = 'modal-backdrop';
  form.innerHTML = `
    <div class="modal">
      <h2>${book ? 'Edytuj książkę' : 'Nowa książka'}</h2>
      <label>Tytuł:</label>
      <input type="text" id="bookTitle" value="${book?.title || ''}" placeholder="Tytuł książki">
      <label>URL okładki:</label>
      <input type="text" id="bookCover" value="${book?.cover || ''}" placeholder="https://example.com/cover.jpg">
      <label>Status:</label>
      <select id="bookStatus">
        <option value="idea">Idea</option>
        <option value="draft">Szkic</option>
        <option value="writing">W trakcie pisania</option>
        <option value="ready">Gotowe</option>
        <option value="published">Opublikowane</option>
      </select>
      <div style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end;">
        <button id="saveBookBtn">${book ? 'Zapisz' : 'Dodaj'}</button>
        <button id="cancelBookBtn">Anuluj</button>
      </div>
    </div>
  `;
  document.body.appendChild(form);

  form.querySelector('#bookStatus').value = book?.status || 'idea';
  form.style.display = 'flex';

  const save = form.querySelector('#saveBookBtn');
  const cancel = form.querySelector('#cancelBookBtn');

  cancel.onclick = () => form.remove();

  save.onclick = () => {
    const newBook = {
      title: form.querySelector('#bookTitle').value.trim(),
      cover: form.querySelector('#bookCover').value.trim(),
      status: form.querySelector('#bookStatus').value,
      chapters: book?.chapters || [],
    };

    if (!newBook.title) {
      alert('Podaj tytuł książki.');
      return;
    }

    if (book) {
      editBook(index, newBook);
    } else {
      addBook(newBook);
    }

    form.remove();
    if (modalToClose) modalToClose.remove();
  };
}

// ==========================================================
// ➕ Formularz dodawania / edycji rozdziału
// ==========================================================
function openChapterForm(bookIndex, modal = null, chapter = null, chapterIndex = null) {
  const form = document.createElement('div');
  form.className = 'modal-backdrop';
  form.innerHTML = `
    <div class="modal">
      <h2>${chapter ? 'Edytuj rozdział' : 'Nowy rozdział'}</h2>
      <label>Tytuł rozdziału:</label>
      <input type="text" id="chTitle" value="${chapter?.title || ''}" placeholder="np. Rozdział I — Początek">
      <label>Opis:</label>
      <input type="text" id="chDesc" value="${chapter?.desc || ''}" placeholder="Krótki opis">
      <label>URL pliku audio (opcjonalnie):</label>
      <input type="text" id="chAudio" value="${chapter?.audio || ''}" placeholder="https://example.com/audio.mp3">
      <div style="margin-top:14px;display:flex;gap:8px;justify-content:flex-end;">
        <button id="saveChapterBtn">${chapter ? 'Zapisz' : 'Dodaj'}</button>
        <button id="cancelChapterBtn">Anuluj</button>
      </div>
    </div>
  `;
  document.body.appendChild(form);
  form.style.display = 'flex';

  form.querySelector('#cancelChapterBtn').onclick = () => form.remove();

  form.querySelector('#saveChapterBtn').onclick = () => {
    const newCh = {
      title: form.querySelector('#chTitle').value.trim(),
      desc: form.querySelector('#chDesc').value.trim(),
      audio: form.querySelector('#chAudio').value.trim(),
    };

    if (!newCh.title) {
      alert('Podaj tytuł rozdziału.');
      return;
    }

    if (chapter) {
      editChapter(bookIndex, chapterIndex, newCh);
    } else {
      addChapter(bookIndex, newCh);
    }

    form.remove();
    if (modal) modal.remove();
  };
}

// ==========================================================
// 📤 Eksport / 📥 Import danych (UI)
// ==========================================================
function exportData() {
  const json = JSON.stringify(BOOKS, null, 2);
  navigator.clipboard.writeText(json);
  alert('📋 Dane zostały skopiowane do schowka!');
}

function importData() {
  const json = prompt('Wklej dane JSON:');
  if (!json) return;
  try {
    const parsed = JSON.parse(json);
    BOOKS.splice(0, BOOKS.length, ...parsed);
    saveAll();
    renderUI(BOOKS);
    alert('✅ Dane zaimportowane pomyślnie!');
  } catch (err) {
    alert('❌ Błąd importu danych.');
  }
}

// ==========================================================
// 🧩 Inicjalizacja UI
// ==========================================================
export function setupUI() {
  console.log('%c[UI ENGINE] Aktywny i gotowy.', 'color:#FFD700;font-weight:bold;');
}
