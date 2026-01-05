'use strict';

/*
  =========================================
  ETERNIVERSE APP CORE v2.1
  - Jedno źródło prawdy: window.app
  - Dane: gates / books
  - Render TABELI
  - Zgodny z render.js (table click → details)
  =========================================
*/

class EterniverseApp {
  constructor() {
    this.VERSION = '2.1';
    this.STORAGE_KEY = 'eterniverse_app_v2_1';
    this.data = this.loadData();
    this.table = null;

    this.init();
  }

  init() {
    this.cache();
    this.renderTable();
    this.bindGlobal();
    console.log('✅ EterniverseApp v2.1 READY');
  }

  cache() {
    this.table = document.querySelector('table');
    if (!this.table) {
      console.error('❌ Brak <table> w HTML');
    }
  }

  /* =========================
     DANE
  ========================= */

  loadData() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('⚠️ Storage error, ładuję domyślne');
    }
    return this.getDefaultData();
  }

  saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  getDefaultData() {
    return {
      meta: { version: this.VERSION },
      gates: [
        {
          id: 1,
          name: 'BRAMA I — INTERSEEKER',
          books: [
            {
              title: 'INTERSEEKER: Geneza',
              status: 'published',
              desc: 'Podstawa psyche'
            }
          ]
        },
        {
          id: 2,
          name: 'BRAMA II — ETERSEEKER',
          books: [
            {
              title: 'EterSeeker: Kronika Woli',
              status: 'ready',
              desc: 'Architektura woli i pola'
            }
          ]
        }
      ]
    };
  }

  /* =========================
     TABELA
  ========================= */

  renderTable() {
    if (!this.table) return;

    const thead = this.table.querySelector('thead');
    const tbody = this.table.querySelector('tbody');

    if (!thead || !tbody) {
      console.error('❌ Tabela musi mieć thead i tbody');
      return;
    }

    thead.innerHTML = `
      <tr>
        <th>#</th>
        <th>Tytuł</th>
        <th>Brama</th>
        <th>Status</th>
      </tr>
    `;

    tbody.innerHTML = '';

    let idx = 1;

    this.data.gates.forEach(gate => {
      gate.books.forEach(book => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td>${idx++}</td>
          <td>${this.escape(book.title)}</td>
          <td>${this.escape(gate.name)}</td>
          <td>${this.escape(book.status)}</td>
        `;

        tbody.appendChild(tr);
      });
    });
  }

  /* =========================
     GLOBAL
  ========================= */

  bindGlobal() {
    window.addEventListener('beforeunload', () => {
      this.saveData();
    });
  }

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
  window.app = new EterniverseApp();
});