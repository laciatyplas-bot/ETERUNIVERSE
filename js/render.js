'use strict';

/*
  =========================================
  ETERNIVERSE TABLE RENDER
  - Obsługa interakcji tabeli
  - Klik → szczegóły księgi
  - ZERO zależności
  =========================================
*/

class EterniverseRenderer {
  constructor(app) {
    if (!app || !app.data) {
      console.error('❌ Renderer: brak app lub danych');
      return;
    }

    this.app = app;
    this.data = app.data;
    this.table = document.querySelector('table');
    this.detailsPanel = null;

    if (!this.table) {
      console.error('❌ Renderer: brak tabeli');
      return;
    }

    this.init();
  }

  init() {
    this.injectDetailsPanel();
    this.bindTableEvents();
    console.log('✅ Renderer: aktywny');
  }

  /* =========================
     PANEL SZCZEGÓŁÓW
  ========================= */

  injectDetailsPanel() {
    const panel = document.createElement('div');
    panel.id = 'book-details';
    panel.style.marginTop = '24px';
    panel.style.padding = '16px';
    panel.style.border = '1px solid var(--border, #333)';
    panel.style.borderRadius = '12px';
    panel.style.display = 'none';

    panel.innerHTML = `
      <h2 id="details-title"></h2>
      <p id="details-gate" style="opacity:.7;"></p>
      <p id="details-desc"></p>
      <p><strong>Status:</strong> <span id="details-status"></span></p>
    `;

    this.table.parentNode.appendChild(panel);
    this.detailsPanel = panel;
  }

  /* =========================
     EVENTY
  ========================= */

  bindTableEvents() {
    const rows = this.table.querySelectorAll('tbody tr');

    rows.forEach(row => {
      row.addEventListener('click', () => {
        this.clearSelection();
        row.classList.add('active');

        const bookTitle = row.children[1]?.textContent.trim();
        this.showBookDetails(bookTitle);
      });
    });
  }

  clearSelection() {
    this.table
      .querySelectorAll('tbody tr.active')
      .forEach(r => r.classList.remove('active'));
  }

  /* =========================
     LOGIKA
  ========================= */

  showBookDetails(title) {
    const found = this.findBookByTitle(title);

    if (!found) {
      console.warn('⚠️ Nie znaleziono księgi:', title);
      return;
    }

    const { gate, book } = found;

    this.detailsPanel.style.display = 'block';
    document.getElementById('details-title').textContent = book.title;
    document.getElementById('details-gate').textContent = gate.name;
    document.getElementById('details-desc').textContent = book.desc || '';
    document.getElementById('details-status').textContent = book.status;
  }

  findBookByTitle(title) {
    for (const gate of this.data.gates) {
      if (!gate.books) continue;

      for (const book of gate.books) {
        if (book.title === title) {
          return { gate, book };
        }
      }
    }
    return null;
  }
}

/* =========================
   BOOT
========================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.app) {
    console.error('❌ Renderer: window.app nie istnieje');
    return;
  }

  window.renderer = new EterniverseRenderer(window.app);
});