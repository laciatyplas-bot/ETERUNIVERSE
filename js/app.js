'use strict';

/*
  =========================================
  ETERNIVERSE TABLE ENGINE
  - ZERO frameworków
  - ZERO magii
  - Renderuje TABELĘ z danych
  =========================================
*/

/* =========================
   DANE (JEŚLI SĄ GLOBALNE)
   Jeśli masz je w innym pliku – TO USUŃ
========================= */

// window.ETERNIVERSE_DATA = { ... }

/* =========================
   APP
========================= */

class EterniverseApp {
  constructor(data) {
    if (!data || !data.gates) {
      console.error('❌ Brak danych ETERNIVERSE');
      return;
    }

    this.data = data;
    this.root = document.getElementById('app');

    if (!this.root) {
      console.error('❌ Brak #app w HTML');
      return;
    }

    this.init();
  }

  init() {
    this.clear();
    this.renderHeader();
    this.renderTable();
  }

  clear() {
    this.root.innerHTML = '';
  }

  renderHeader() {
    const header = document.createElement('div');
    header.innerHTML = `
      <h1>ETERNIVERSE</h1>
      <p>System Bram · Księgi · Status</p>
    `;
    this.root.appendChild(header);
  }

  renderTable() {
    const table = document.createElement('table');

    table.innerHTML = `
      <thead>
        <tr>
          <th>Brama</th>
          <th>Księga</th>
          <th>Opis</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${this.buildRows()}
      </tbody>
    `;

    this.root.appendChild(table);
  }

  buildRows() {
    const rows = [];

    this.data.gates.forEach(gate => {
      if (!gate.books || !gate.books.length) return;

      gate.books.forEach(book => {
        rows.push(`
          <tr>
            <td data-label="Brama">
              ${this.escape(gate.name)}
            </td>

            <td data-label="Księga">
              ${this.escape(book.title)}
            </td>

            <td data-label="Opis">
              ${this.escape(book.desc || '')}
            </td>

            <td data-label="Status" data-status="${book.status}">
              ${this.escape(book.status)}
            </td>
          </tr>
        `);
      });
    });

    return rows.join('');
  }

  escape(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }
}

/* =========================
   BOOT
========================= */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.ETERNIVERSE_DATA) {
    console.error('❌ window.ETERNIVERSE_DATA nie istnieje');
    return;
  }

  window.app = new EterniverseApp(window.ETERNIVERSE_DATA);
  console.log('✅ ETERNIVERSE TABLE — READY');
});