// render.js — ETERNIVERSE ENGINE v2.1
// KANON / STABLE / FULL
// Render: Dashboard + Bramy (karty) + TABELA (na żądanie)

'use strict';

/* =========================
   DASHBOARD
========================= */
function renderDashboard(data, container) {
  if (!container || !data || !Array.isArray(data)) {
    console.warn('[renderDashboard] Brak danych');
    return;
  }

  const totalBooks = data.reduce((sum, g) => sum + (g.books?.length || 0), 0);

  const countByStatus = s =>
    data.reduce((sum, g) =>
      sum + (g.books?.filter(b => b.status === s).length || 0), 0);

  container.innerHTML = `
    <div class="dashboard-header">
      <h1>ETERNIVERSE PRO MASTER</h1>
      <div class="dashboard-subtitle">
        Bram: ${data.length} · Księgi: ${totalBooks}
      </div>

      <div class="stats-grid">
        <div class="stat-item"><span class="stat-value">${totalBooks}</span><span>Księgi</span></div>
        <div class="stat-item"><span class="stat-value st-published">${countByStatus('published')}</span><span>Published</span></div>
        <div class="stat-item"><span class="stat-value st-ready">${countByStatus('ready')}</span><span>Ready</span></div>
        <div class="stat-item"><span class="stat-value st-writing">${countByStatus('writing')}</span><span>Writing</span></div>
      </div>

      <div style="margin-top:16px;text-align:center;">
        <button id="toggle-view" class="add-book-btn">Widok: Karty / Tabela</button>
      </div>
    </div>
  `;
}

/* =========================
   BRAMY — KARTY
========================= */
function renderGates(data, container, options = {}) {
  if (!container || !Array.isArray(data)) return;

  container.innerHTML = '';
  container.dataset.view = container.dataset.view || 'cards';

  if (container.dataset.view === 'table') {
    renderTable(data, container);
    return;
  }

  data.forEach(brama => {
    const card = document.createElement('article');
    card.className = 'gate-card';

    card.innerHTML = `
      <div class="gate-header">
        <h3>${escapeHtml(brama.name)}</h3>
        <span class="gate-tag">${escapeHtml(brama.tag || '')}</span>
      </div>
      <div class="gate-sub">${escapeHtml(brama.sub || '')}</div>
      <div class="books-count">Księgi: ${brama.books?.length || 0}</div>
      <div class="books-list"></div>
    `;

    const list = card.querySelector('.books-list');

    if (!brama.books || !brama.books.length) {
      list.innerHTML = `<div class="no-books">Brak ksiąg</div>`;
    } else {
      brama.books.forEach((book, i) => {
        const el = document.createElement('div');
        el.className = 'book-item';
        el.innerHTML = `
          <div class="book-cover" style="${book.cover ? `background-image:url('${escapeHtml(book.cover)}')` : ''}">
            ${book.cover ? '' : 'brak'}
          </div>
          <div class="book-info">
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-desc">${escapeHtml(book.desc || '')}</div>
            <span class="status-tag ${getStatusClass(book.status)}">${(book.status || 'idea')}</span>
          </div>
        `;
        el.addEventListener('click', () => {
          if (typeof openEditModal === 'function') {
            openEditModal(brama.id, i);
          }
        });
        list.appendChild(el);
      });
    }

    container.appendChild(card);
  });
}

/* =========================
   TABELA — FULL
========================= */
function renderTable(data, container) {
  const rows = [];

  data.forEach(brama => {
    (brama.books || []).forEach(book => {
      rows.push({
        gate: brama.name,
        title: book.title,
        status: book.status || 'idea',
        desc: book.desc || ''
      });
    });
  });

  container.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:12px;">
      <thead>
        <tr style="background:#0A1727;">
          <th>Bramа</th>
          <th>Tytuł</th>
          <th>Status</th>
          <th>Opis</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td>${escapeHtml(r.gate)}</td>
            <td>${escapeHtml(r.title)}</td>
            <td><span class="status-tag ${getStatusClass(r.status)}">${r.status}</span></td>
            <td>${escapeHtml(r.desc)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

/* =========================
   TOGGLE VIEW
========================= */
document.addEventListener('click', e => {
  if (e.target.id === 'toggle-view') {
    const grid = document.getElementById('mapa-grid');
    if (!grid) return;
    grid.dataset.view = grid.dataset.view === 'table' ? 'cards' : 'table';
    renderGates(window.dataMaster.getMapa(), grid);
  }
});

/* =========================
   HELPERS
========================= */
function escapeHtml(text = '') {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
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