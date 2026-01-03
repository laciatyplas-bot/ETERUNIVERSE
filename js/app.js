// app.js – Główny silnik ETERNIVERSE Mapa (2026)

const STORAGE_KEY = 'eterniverse_map_data';

// Domyślne dane (jeśli localStorage pusty)
const DEFAULT_DATA = [
  {
    id: 1,
    name: "BRAMA I — INTERSEEKER",
    sub: "Psychika · Cień · Trauma · Archetyp",
    tag: "CORE / PSYCHE",
    color: "#28D3C6",
    books: [
      { title: "InterSeeker – Atlas Wewnętrzny", status: "published", cover: "" },
      { title: "ShadowSeeker – Anatomia Cienia", status: "ready", cover: "" },
      { title: "MemorySeeker – Archeologia Wspomnień", status: "draft", cover: "" }
    ]
  },
  {
    id: 2,
    name: "BRAMA II — CUSTOS / GENEZA",
    sub: "Strażnik · Rdzeń · Początek",
    tag: "CORE / ORIGIN",
    color: "#FF6B6B",
    books: [
      { title: "Geneza", status: "ready", cover: "" },
      { title: "Custos: Kodeks Głębi", status: "idea", cover: "" }
    ]
  },
  // ... (pozostałe bramy z kodu HTML – dodaj analogicznie)
  {
    id: 10,
    name: "BRAMA X — ETERUNIVERSE",
    sub: "Integracja · Jedność · Architekt",
    tag: "INTEGRATION",
    color: "#D9A441",
    books: [
      { title: "Architekt Eteru — Manifest Twórcy", status: "writing", cover: "" },
      { title: "Mapa Uniwersum Eteru", status: "idea", cover: "" }
    ]
  }
];

// Ładowanie danych
let DATA = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;

// Zapis do localStorage
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
}

// Elementy DOM
const gatesGrid = document.getElementById('gatesGrid');
const gateFilter = document.getElementById('gateFilter');
const statusFilter = document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const addBookBtn = document.getElementById('addBookBtn');
const addModal = document.getElementById('addModal');
const modalGate = document.getElementById('modalGate');
const modalTitle = document.getElementById('modalTitle');
const modalStatus = document.getElementById('modalStatus');
const modalCover = document.getElementById('modalCover');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');
const coverPreview = document.getElementById('coverPreview');
const coverImg = document.getElementById('coverImg');
const coverClose = document.getElementById('coverClose');

// Klasa statusu
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

// Renderowanie (delegowane do render.js)
function render() {
  renderGates(DATA, gatesGrid, {
    search: searchInput.value.toLowerCase().trim(),
    gateId: gateFilter.value === 'all' ? null : Number(gateFilter.value),
    status: statusFilter.value === 'all' ? null : statusFilter.value
  });
}

// Obsługa filtrów
[searchInput, gateFilter, statusFilter].forEach(el => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

// Modal dodawania księgi
addBookBtn.onclick = () => {
  modalTitle.value = '';
  modalCover.value = '';
  modalStatus.value = 'idea';
  addModal.style.display = 'flex';
};

modalCancel.onclick = () => addModal.style.display = 'none';

modalSave.onclick = () => {
  const gateId = Number(modalGate.value);
  const title = modalTitle.value.trim();
  if (!title) return alert('Tytuł jest wymagany');

  const brama = DATA.find(b => b.id === gateId);
  if (!brama) return;

  brama.books.push({
    title,
    status: modalStatus.value,
    cover: modalCover.value.trim()
  });

  saveData();
  render();
  addModal.style.display = 'none';
};

// Podgląd okładki
document.addEventListener('click', e => {
  if (e.target.classList.contains('book-cover-thumb') && e.target.style.backgroundImage) {
    const url = e.target.style.backgroundImage.slice(5, -2); // extract url()
    coverImg.src = url;
    coverPreview.style.display = 'flex';
  }
});

coverClose.onclick = () => {
  coverPreview.style.display = 'none';
  coverImg.src = '';
};

coverPreview.onclick = e => {
  if (e.target === coverPreview) {
    coverPreview.style.display = 'none';
    coverImg.src = '';
  }
};

// Inicjalizacja
document.addEventListener('DOMContentLoaded', () => {
  render();
});