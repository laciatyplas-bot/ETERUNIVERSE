// render.js — Renderowanie z edycją (FIXED / MOBILE SAFE)

function renderGates(data, container, filters = {}) {
  const { search = '', gateId = null, status = null } = filters;
  container.innerHTML = '';

  data.forEach(brama => {
    if (gateId !== null && brama.id !== gateId) return;

    const card = document.createElement('article');
    card.className = 'brama-card';

    card.innerHTML = `
      <div class="brama-header">
        <div>
          <div class="brama-title">${escapeHtml(brama.name)}</div>
          <div class="brama-sub">${escapeHtml(brama.sub)}</div>
        </div>
        <span class="badge">${escapeHtml(brama.tag || '')}</span>
      </div>
      <div class="books"></div>
    `;

    const booksWrap = card.querySelector('.books');

    let visibleBooks = brama.books || [];

    if (status && status !== 'all') {
      visibleBooks = visibleBooks.filter(b => b.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      visibleBooks = visibleBooks.filter(b =>
        (b.title || '').toLowerCase().includes(q)
      );
    }

    visibleBooks.forEach((book, bookIndex) => {
      const bookEl = document.createElement('div');
      bookEl.className = 'book';

      const coverStyle = book.cover
        ? `style="background-image:url('${book.cover}')"`
        : '';

      bookEl.innerHTML = `
        <div class="book-cover-thumb" ${coverStyle}>
          ${book.cover ? '' : 'okładka'}
        </div>

        <div class="book-main">
          <div class="book-title editable"
               data-gate="${brama.id}"
               data-index="${bookIndex}">
            ${escapeHtml(book.title)}
          </div>

          <div class="book-meta">
            <span>${escapeHtml(book.status || 'idea')}</span>
            <span class="status ${getStatusClass(book.status)}">
              ${(book.status || 'idea').toUpperCase()}
            </span>
          </div>
        </div>

        <button class="book-edit-btn"
                data-gate="${brama.id}"
                data-index="${bookIndex}">
          ✏️
        </button>
      `;

      // klik w tytuł
      bookEl.querySelector('.book-title').addEventListener('click', e => {
        e.stopPropagation();
        openEditModal(Number(e.target.dataset.gate), Number(e.target.dataset.index));
      });

      // klik w ikonę
      bookEl.querySelector('.book-edit-btn').addEventListener('click', e => {
        e.stopPropagation();
        openEditModal(Number(e.target.dataset.gate), Number(e.target.dataset.index));
      });

      // podgląd okładki
      const thumb = bookEl.querySelector('.book-cover-thumb');
      if (book.cover) {
        thumb.addEventListener('click', ev => {
          ev.stopPropagation();
          coverImg.src = book.cover;
          coverPreview.style.display = 'flex';
        });
      }

      booksWrap.appendChild(bookEl);
    });

    container.appendChild(card);
  });
}

/* ===== HELPERS ===== */

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