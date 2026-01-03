// app.js — Główny silnik ETERNIVERSE (STABLE, MOBILE-SAFE)

'use strict';

const STORAGE_KEY = 'eterniverse_map_data';

/* ===========================
   DANE
=========================== */
const DEFAULT_DATA = [
  {
    id: 1,
    name: "BRAMA I — INTERSEEKER",
    sub: "Psychika · Cień · Trauma",
    tag: "CORE / PSYCHE",
    color: "#28D3C6",
    books: [
      { title: "InterSeeker – Atlas Wewnętrzny", status: "published", cover: "" },
      { title: "ShadowSeeker – Anatomia Cienia", status: "ready", cover: "" }
    ]
  },
  {
    id: 2,
    name: "BRAMA II — ETERSEEKER",
    sub: "Wola · Pole · Architektura",
    tag: "CORE / FIELD",
    color: "#D9A441",
    books: [
      { title: "EterSeeker – Architektura Woli", status: "writing", cover: "" }
    ]
  }
];

let DATA = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
}

/* ===========================
   MODAL – ELEMENTY DOM
=========================== */
const editModal = document.getElementById('editModal');
const modalGateSelect = document.getElementById('modalGate');
const modalTitleInput = document.getElementById('modalTitle');
const modalStatusSelect = document.getElementById('modalStatus');
const modalCoverInput = document.getElementById('modalCover');
const modalSave = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');

/* ===========================
   STAN EDYCJI
=========================== */
let editingBook = null; // { gateId, bookIndex }

/* ===========================
   MODAL – FUNKCJE
=========================== */
function fillGateSelect() {
  modalGateSelect.innerHTML = '';
  DATA.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = g.name;
    modalGateSelect.appendChild(opt);
  });
}

function openEditModal(gateId, bookIndex) {
  const gate = DATA.find(g => g.id === gateId);
  if (!gate || !gate.books[bookIndex]) return;

  const book = gate.books[bookIndex];
  editingBook = { gateId, bookIndex };

  fillGateSelect();
  modalGateSelect.value = gateId;
  modalTitleInput.value = book.title || '';
  modalStatusSelect.value = book.status || 'idea';
  modalCoverInput.value = book.cover || '';

  editModal.querySelector('h2').textContent = 'Edytuj księgę';
  editModal.style.display = 'flex';
}

window.openEditModal = openEditModal; // 🔴 KRYTYCZNE – render.js tego używa

function resetModal() {
  editingBook = null;
  modalTitleInput.value = '';
  modalCoverInput.value = '';
  modalStatusSelect.value = 'idea';
  editModal.querySelector('h2').textContent = 'Nowa księga';
}

/* ===========================
   ZAPIS / ANULUJ
=========================== */
modalSave.onclick = () => {
  const title = modalTitleInput.value.trim();
  if (!title) return alert('Tytuł jest wymagany');

  const gateId = Number(modalGateSelect.value);
  const gate = DATA.find(g => g.id === gateId);
  if (!gate) return;

  if (editingBook) {
    const book = gate.books[editingBook.bookIndex];
    if (!book) return;

    book.title = title;
    book.status = modalStatusSelect.value;
    book.cover = modalCoverInput.value.trim();
  } else {
    gate.books.push({
      title,
      status: modalStatusSelect.value,
      cover: modalCoverInput.value.trim()
    });
  }

  saveData();
  render();
  resetModal();
  editModal.style.display = 'none';
};

modalCancel.onclick = () => {
  resetModal();
  editModal.style.display = 'none';
};

/* ===========================
   RENDER (MINIMALNY)
=========================== */
function render() {
  if (typeof renderGates === 'function') {
    const container = document.getElementById('gatesGrid');
    renderGates(DATA, container, {});
  }
}

/* ===========================
   START
=========================== */
document.addEventListener('DOMContentLoaded', () => {
  fillGateSelect();
  render();
});