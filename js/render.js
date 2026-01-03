// render.js – Czysty silnik renderowania bram i ksiąg

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
          <div class="brama-sub">${escapeHtml(brama.sub || '')}</div>
        </div>
        <span class="badge">${escapeHtml(brama.tag)}</span>
      </div>
      <div class="books"></div>
    `;

    const booksWrap = card.querySelector('.books');

    let visibleBooks = brama.books;

    // Filtr status
    if (status) {
      visibleBooks = visibleBooks.filter(book => book.status === status);
    }

    // Wyszukiwanie
    if (search) {
      visibleBooks = visibleBooks.filter(book =>
        book.title.toLowerCase().includes(search)
      );
    }

    if (visibleBooks.length === 0) {
      booksWrap.innerHTML = '<div class="no-books">Brak tytułów pasujących do filtrów.</div>';
    } else {
      visibleBooks.forEach(book => {
        const bookEl = document.createElement('div');
        bookEl.className = 'book';

        const coverStyle = book.cover ? `background-image:url('${book.cover}')` : '';
        const coverText = book.cover ? '' : 'okładka';

        bookEl.innerHTML = `
          <div class="book-cover-thumb" style="\( {coverStyle}"> \){coverText}</div>
          <div class="book-main">
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-meta">
              <span>${escapeHtml(book.status || 'idea')}</span>
              <span class="status \( {getStatusClass(book.status)}"> \){(book.status || 'idea').toUpperCase()}</span>
            </div>
          </div>
        `;

        booksWrap.appendChild(bookEl);
      });
    }

    container.appendChild(card);
  });
}

// Bezpieczeństwo HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Klasa statusu (duplikat dla niezależności)
function getStatusClass(status) {
  const map = {
    published: 'st-published',
    ready: 'st-ready',
    writing: 'st-writing',
    draft: 'st-draft',
    idea: 'st-idea'
  };
  return map[status] || 'st-idea';
}