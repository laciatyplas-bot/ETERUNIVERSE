'use strict';

/*
  =========================================
  ETERNIVERSE RENDER ENGINE v2.1
  - Czyta window.app.data
  - Obsługa klików w tabeli
  - Panel szczegółów książki
  - ZERO logiki danych (tylko render)
  =========================================
*/

class EterniverseRender {
  constructor() {
    this.tableBody = null;
    this.detailPanel = null;

    this.init();
  }

  init() {
    this.cache();
    this.bindTableClicks();
    console.log('✅ RenderEngine v2.1 READY');
  }

  cache() {
    this.tableBody = document.querySelector('table tbody');
    this.detailPanel = document.getElementById('details');

    if (!this.tableBody) {
      console.error('❌ Brak <tbody> tabeli');
    }
    if (!this.detailPanel) {
      console.warn('⚠️ Brak #details — panel szczegółów nie będzie widoczny');
    }
  }

  /* =========================
     TABLE INTERACTION
  ========================= */

  bindTableClicks() {
    if (!this.tableBody) return;

    this.tableBody.addEventListener('click', e => {
      const row = e.target.closest('tr');
      if (!row) return;

      const index = row.dataset.index;
      if (index === undefined) return;

      const flat = this.flattenBooks();
      const book = flat[index];

      if (!book) return;

      this.highlightRow(row);
      this.renderDetails(book);
    });
  }

  highlightRow(row) {
    this.tableBody.querySelectorAll('tr').forEach(tr =>
      tr.classList.remove('active')
    );
    row.classList.add('active');
  }

  /* =========================
     DETAILS
  ========================= */

  renderDetails(book) {
    if (!this.detailPanel) return;

    this.detailPanel.innerHTML = `
      <h2>${this.escape(book.title)}</h2>
      <p><strong>Status:</strong> ${this.escape(book.status)}</p>
      <p><strong>Brama:</strong> ${this.escape(book.gate)}</p>
      <p style="opacity:.8;margin-top:1rem;">
        ${this.escape(book.desc || 'Brak opisu')}
      </p>
    `;
  }

  /* =========================
     DATA FLATTEN
  ========================= */

  flattenBooks() {
    if (!window.app || !window.app.data) return [];

    const out = [];

    window.app.data.gates.forEach(gate => {
      gate.books.forEach(book => {
        out.push({
          title: book.title,
          status: book.status,
          desc: book.desc || '',
          gate: gate.name
        });
      });
    });

    return out;
  }

  /* =========================
     UTIL
  ========================= */

  escape(t = '') {
    const d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
  }
}

/* =========================
   BOOT
========================= */

document.addEventListener('DOMContentLoaded', () => {
  window.renderEngine = new EterniverseRender();
});