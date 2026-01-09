// ==========================================================
//  ETERNIVERSE UI ENGINE (z rozdziałami PRO)
// ==========================================================

import { playAudio } from './audioEngine.js';
import { addBook, updateBook, deleteBook } from './bookEngine.js';
import { addChapter, updateChapter, deleteChapter } from './chapterEngine.js';
import { ETERNIVERSE_DATA } from './core.js';

// === Elementy interfejsu ===
const gatesGrid = document.getElementById('gatesGrid');
const addModal = document.getElementById('addModal');
const modalGate = document.getElementById('modalGate');
const modalTitle = document.getElementById('modalTitle');
const modalStatus = document.getElementById('modalStatus');
const modalCover = document.getElementById('modalCover');

// === RENDEROWANIE WIDOKU ===
export function renderUI(data) {
  gatesGrid.innerHTML = '';

  // Uzupełnij listę bram w select
  modalGate.innerHTML = '';
  data.forEach(gate => {
    const opt = document.createElement('option');
    opt.value = gate.id;
    opt.textContent = gate.name;
    modalGate.appendChild(opt);
  });

  // Render każdej bramy
  data.forEach((gate) => {
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

    // Render książek
    gate.books.forEach((book, bookIndex) => {
      const el = document.createElement('div');
      el.className = 'book';
      el.innerHTML = `
        <div class="book-cover-thumb" style="${book.cover ? `background-image:url('${book.cover}')` : ''}"></div>
        <div class="book-main">
          <div class="book-title">${book.title}</div>
          <div class="book-meta"><span>${book.status}</span></div>
          ${book.audio ? `<audio controls src="${book.audio}"></audio>` : ''}
        </div>
      `;

      // Klik = otwórz panel książki
      el.addEventListener('click', () => openBookEditor(gate.id, bookIndex));
      booksWrap.appendChild(el);
    });

    gateEl.appendChild(booksWrap);
    gatesGrid.appendChild(gateEl);
  });
}

// === OBSŁUGA INTERAKCJI ===
export function setupUIEvents() {
  document.getElementById('addBookBtn').onclick = () => {
    modalTitle.value = '';
    modalCover.value = '';
    modalStatus.value = 'idea';
    addModal.style.display = 'flex';
  };

  document.getElementById('modalCancel').onclick = () => (addModal.style.display = 'none');

  document.getElementById('modalSave').onclick = () => {
    const gateId = Number(modalGate.value);
    const title = modalTitle.value.trim();
    const status = modalStatus.value;
    const cover = modalCover.value.trim();
    if (!title) return;
    addBook(gateId, { title, status, cover, chapters: [] });
    addModal.style.display = 'none';
  };
}

// === PANEL EDYCJI KSIĄŻKI I ROZDZIAŁÓW ===
export function openBookEditor(gateId, bookIndex) {
  const gate = ETERNIVERSE_DATA.find(g => g.id === gateId);
  const book = gate.books[bookIndex];
  if (!book.chapters) book.chapters = [];

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.style.cssText = 'display:flex;align-items:center;justify-content:center;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:2000;';
  modal.innerHTML = `
    <div class="modal" style="background:#050B16;border:1px solid #20324A;border-radius:18px;padding:16px;max-width:650px;width:100%;max-height:90vh;overflow:auto;">
      <h2>${book.title}</h2>
      <label>Okładka</label><input id="editCover" value="${book.cover || ''}" style="width:100%;margin-bottom:8px;">
      <label>Audio główne</label><input id="editAudio" value="${book.audio || ''}" style="width:100%;margin-bottom:8px;">
      <h3 style="margin-top:12px;">Rozdziały</h3>
      <div id="chapterList"></div>
      <button id="addChapter" style="margin-top:10px;background:#28D3C6;color:#000;border:none;padding:6px 10px;border-radius:6px;">+ Dodaj rozdział</button>
      <div style="margin-top:16px;text-align:right;">
        <button id="editDelete" style="background:#FF6B6B;color:#fff;border:none;padding:6px 12px;border-radius:6px;">Usuń książkę</button>
        <button id="editClose">Zamknij</button>
        <button id="editSave" style="background:#28D3C6;color:#000;border:none;padding:6px 12px;border-radius:6px;">Zapisz</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const renderChapters = () => {
    const container = modal.querySelector('#chapterList');
    container.innerHTML = '';
    book.chapters.forEach((ch, idx) => {
      const el = document.createElement('div');
      el.style.cssText = 'background:#0D1C30;padding:8px;margin-top:6px;border-radius:8px;';
      el.innerHTML = `
        <b>${ch.title}</b><br>
        <small>${ch.desc || ''}</small><br>
        ${ch.audio ? `<audio controls src="${ch.audio}" style="width:100%;margin-top:4px;"></audio>` : ''}
        <div style="margin-top:6px;text-align:right;">
          <button data-idx="${idx}" class="editCh" style="margin-right:6px;">✏️</button>
          <button data-idx="${idx}" class="delCh">🗑️</button>
        </div>
      `;
      container.appendChild(el);
    });

    container.querySelectorAll('.editCh').forEach(btn => {
      btn.onclick = () => {
        const i = btn.dataset.idx;
        const ch = book.chapters[i];
        const newTitle = prompt('Tytuł rozdziału:', ch.title);
        const newDesc = prompt('Opis:', ch.desc || '');
        const newAudio = prompt('URL audio:', ch.audio || '');
        updateChapter(gateId, bookIndex, i, { title: newTitle, desc: newDesc, audio: newAudio });
        modal.remove();
      };
    });

    container.querySelectorAll('.delCh').forEach(btn => {
      btn.onclick = () => {
        const i = btn.dataset.idx;
        if (confirm('Usunąć rozdział?')) {
          deleteChapter(gateId, bookIndex, i);
          modal.remove();
        }
      };
    });
  };

  renderChapters();

  modal.querySelector('#addChapter').onclick = () => {
    const title = prompt('Tytuł nowego rozdziału:');
    const desc = prompt('Opis:');
    const audio = prompt('URL audio (opcjonalnie):');
    if (title) {
      addChapter(gateId, bookIndex, { title, desc, audio });
      modal.remove();
    }
  };

  modal.querySelector('#editSave').onclick = () => {
    updateBook(gateId, bookIndex, {
      cover: modal.querySelector('#editCover').value.trim(),
      audio: modal.querySelector('#editAudio').value.trim()
    });
    modal.remove();
  };

  modal.querySelector('#editClose').onclick = () => modal.remove();

  modal.querySelector('#editDelete').onclick = () => {
    if (confirm('Na pewno usunąć tę książkę?')) {
      deleteBook(gateId, bookIndex);
      modal.remove();
    }
  };
}
