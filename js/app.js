// app.js – Główny silnik ETERNIVERSE z pełną edycją ksiąg

const STORAGE_KEY = 'eterniverse_map_data';

const DEFAULT_DATA = [ /* ... (te same domyślne dane jak wcześniej) */ ];

// Ładowanie i zapis (bez zmian)
let DATA = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
}

// Elementy DOM (dodane nowe)
const editModal = document.getElementById('addModal'); // używamy tego samego modala
const modalTitleInput = document.getElementById('modalTitle');
const modalStatusSelect = document.getElementById('modalStatus');
const modalCoverInput = document.getElementById('modalCover');
const modalGateSelect = document.getElementById('modalGate');

// Zmienne do edycji
let editingBook = null; // { gateId, bookIndex }

// Otwieranie modala do edycji
function openEditModal(gateId, bookIndex) {
  const gate = DATA.find(g => g.id === gateId);
  const book = gate.books[bookIndex];

  editingBook = { gateId, bookIndex };

  modalGateSelect.value = gateId;
  modalTitleInput.value = book.title;
  modalStatusSelect.value = book.status || 'idea';
  modalCoverInput.value = book.cover || '';

  // Zmiana tytułu modala
  editModal.querySelector('h2').textContent = 'Edytuj księgę';

  editModal.style.display = 'flex';
}

// Zapisywanie (dodawanie lub edycja)
modalSave.onclick = () => {
  const title = modalTitleInput.value.trim();
  if (!title) return alert('Tytuł jest wymagany');

  if (editingBook) {
    // Edycja istniejącej
    const gate = DATA.find(g => g.id === editingBook.gateId);
    const book = gate.books[editingBook.bookIndex];
    book.title = title;
    book.status = modalStatusSelect.value;
    book.cover = modalCoverInput.value.trim();

    editingBook = null;
    editModal.querySelector('h2').textContent = 'Nowa księga';
  } else {
    // Dodawanie nowej (jak wcześniej)
    const gateId = Number(modalGateSelect.value);
    const gate = DATA.find(g => g.id === gateId);
    gate.books.push({
      title,
      status: modalStatusSelect.value,
      cover: modalCoverInput.value.trim()
    });
  }

  saveData();
  render();
  editModal.style.display = 'none';
};

// Anulowanie edycji
modalCancel.onclick = () => {
  editingBook = null;
  editModal.querySelector('h2').textContent = 'Nowa księga';
  editModal.style.display = 'none';
};

// Reszta kodu (render, filtry, podgląd okładki) – bez zmian
document.addEventListener('DOMContentLoaded', () => {
  render();
});