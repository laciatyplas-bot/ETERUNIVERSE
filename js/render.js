// render.js — ETERNIVERSE ENGINE
// Renderowanie Bram i Ksiąg (KANON / MOBILE SAFE)

'use strict';

function renderGates(data, container, filters = {}) {
  if (!container || !Array.isArray(data)) {
    console.warn('[renderGates] Brak danych lub kontenera');
    return;
  }

  const {
    search = '',
    gateId = null,
    status = null
  } = filters;

  container.innerHTML = '';

  data.forEach(brama => {
    if (!brama || typeof brama !== 'object') return;
    if (gateId !== null && brama.id !== gateId) return;

    const card = document.createElement('article');
    card.className = 'brama-card';
    card.dataset.gateId = brama.id;

    card.innerHTML = `
      <div class="brama-header">
        <div>
          <div class="brama-title">${escapeHtml(brama.name)}</div>
          <div class="brama-sub">${escapeHtml(brama.sub || '')}</div>
        </div>
        ${brama.tag ? `<span class="badge">${escapeHtml(brama.tag)}</span>` : ''}
      </div>
      <div class="books"></div>
    `;

    const booksWrap = card.querySelector('.books');

    let books = Array.isArray(brama.books) ? [...brama.books] : [];

    // filtr statusu
    if (status && status !== 'all') {
      books = books.filter(b => b.status === status);
    }

    // filtr tekstowy
    if (search) {
      const q = search.toLowerCase();
      books = books.filter(b =>
        (b.title || '').toLowerCase().includes(q)
      );
    }

    if (books.length === 0) {
      booksWrap.innerHTML = `
        <div class="no-books">Brak pozycji w tej Bramie</div>
      `;
    }

    books.forEach((book, bookIndex) => {
      if (!book) return;

      const bookEl = document.createElement('div');
      bookEl.className = 'book';
      bookEl.dataset.gateId = brama.id;
      bookEl.dataset.bookIndex = bookIndex;

      const hasCover = Boolean(book.cover);

      bookEl.innerHTML = `
        <div class="book-cover-thumb"
             ${hasCover ? `style="background-image:url('${book.cover}')"` : ''}>
          ${hasCover ? '' : 'okładka'}
        </div>

        <div class="book-main">
          <div class="book-title">
            ${escapeHtml(book.title || 'Bez tytułu')}
          </div>

          <div class="book-meta">
            <span>${escapeHtml(book.status || 'idea')}</span>
            <span class="status ${getStatusClass(book.status)}">
              ${(book.status || 'idea').toUpperCase()}
            </span>
          </div>
        </div>

        <button class="book-edit-btn" title="Edytuj">✏️</button>
      `;

      // ===== EDYCJA =====
      const editHandler = () => {
        if (typeof openEditModal === 'function') {
          openEditModal(brama.id, bookIndex);
        } else {
          console.warn('[renderGates] openEditModal nie istnieje');
        }
      };

      bookEl.querySelector('.book-title')
        .addEventListener('click', editHandler);

      bookEl.querySelector('.book-edit-btn')
        .addEventListener('click', editHandler);

      // ===== OKŁADKA =====
      if (hasCover) {
        const thumb = bookEl.querySelector('.book-cover-thumb');
        thumb.addEventListener('click', e => {
          e.stopPropagation();
          if (window.coverImg && window.coverPreview) {
            coverImg.src = book.cover;
            coverPreview.style.display = 'flex';
          }
        });
      }

      booksWrap.appendChild(bookEl);
    });

    container.appendChild(card);
  });
}

/* =========================
   HELPERS — KANON
========================= */

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function getStatusClass(status) {
  return {
    published: 'st-published',
    ready: 'st-ready',
    writing: 'st-writing',
    draft: 'st-draft',
    idea: 'st-idea'
  }[status] || 'st-idea';
}