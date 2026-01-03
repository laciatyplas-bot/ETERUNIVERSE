// render.js – Renderowanie z edycją

function renderGates(data, container, filters = {}) {
  // ... (kod jak wcześniej)

  visibleBooks.forEach((book, bookIndex) => {
    const bookEl = document.createElement('div');
    bookEl.className = 'book';

    bookEl.innerHTML = `
      <div class="book-cover-thumb" style="\( {book.cover ? `background-image:url(' \){book.cover}')` : ''}">
        ${book.cover ? '' : 'okładka'}
      </div>
      <div class="book-main">
        <div class="book-title editable" data-gate="\( {brama.id}" data-index=" \){bookIndex}">${escapeHtml(book.title)}</div>
        <div class="book-meta">
          <span>${escapeHtml(book.status || 'idea')}</span>
          <span class="status \( {getStatusClass(book.status)}"> \){(book.status || 'idea').toUpperCase()}</span>
        </div>
      </div>
      <button class="book-edit-btn" data-gate="\( {brama.id}" data-index=" \){bookIndex}">✏️</button>
    `;

    // Klik w tytuł → edycja
    bookEl.querySelector('.book-title').addEventListener('click', (e) => {
      e.stopPropagation();
      const gateId = Number(e.target.dataset.gate);
      const index = Number(e.target.dataset.index);
      openEditModal(gateId, index);
    });

    // Przycisk edycji
    bookEl.querySelector('.book-edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const gateId = Number(e.target.dataset.gate);
      const index = Number(e.target.dataset.index);
      openEditModal(gateId, index);
    });

    // Podgląd okładki (bez zmian)
    const thumb = bookEl.querySelector('.book-cover-thumb');
    if (book.cover) {
      thumb.addEventListener('click', (ev) => {
        ev.stopPropagation();
        coverImg.src = book.cover;
        coverPreview.style.display = 'flex';
      });
    }

    booksWrap.appendChild(bookEl);
  });
}

// Dodatkowy styl przycisku edycji (dodaj do styles.css)