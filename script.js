// ====== Mapa ETERNIVERSE — pełna wersja z localStorage ======

// Wczytaj dane z localStorage (jeśli istnieją)
let DATA = JSON.parse(localStorage.getItem('eterniverseData')) || [
  {
    id:1, name:"BRAMA I — INTERSEEKER", sub:"Psychika · Cień · Trauma · Archetyp", tag:"CORE / PSYCHE", books:[]
  },
  { id:2, name:"BRAMA II — CUSTOS / GENEZA", sub:"Strażnik · Rdzeń · Początek", tag:"CORE / ORIGIN", books:[] },
  { id:3, name:"BRAMA III — ETERSEEKER", sub:"Wola · Pole · Architektura", tag:"CORE / FIELD", books:[] },
  { id:4, name:"BRAMA IV — ARCHETYPY / WOLA", sub:"Konstrukcja · Role · Przeznaczenie", tag:"CORE / WILL", books:[] },
  { id:5, name:"BRAMA V — OBFITOSEEKER", sub:"Materia · Przepływ · Manifestacja", tag:"EMBODIED / FLOW", books:[] },
  { id:6, name:"BRAMA VI — BIOSEEKER", sub:"Ciało · Biologia · Regulacja", tag:"EMBODIED / BIO", books:[] },
  { id:7, name:"BRAMA VII — SPLĄTANIE / AI", sub:"Obserwator · Meta-tożsamość · Technologia", tag:"META / TECH", books:[] },
  { id:8, name:"BRAMA VIII — TRAJEKTORIE", sub:"Kod Życia · Linie Czasu · Fizyka Duszy", tag:"META / PHYSICS", books:[] },
  { id:9, name:"BRAMA IX — ETERNIONY / KOLEKTYW", sub:"Węzły Pola · Wspólnota · Misja", tag:"COLLECTIVE", books:[] },
  { id:10, name:"BRAMA X — ETERUNIVERSE", sub:"Integracja · Jedność · Architekt", tag:"INTEGRATION", books:[] }
];

function saveData() {
  localStorage.setItem('eterniverseData', JSON.stringify(DATA));
}

// DOM elements
const gatesGrid   = document.getElementById('gatesGrid');
const gateFilter  = document.getElementById('gateFilter');
const statusFilter= document.getElementById('statusFilter');
const searchInput = document.getElementById('searchInput');
const addModal    = document.getElementById('addModal');
const modalGate   = document.getElementById('modalGate');
const modalTitle  = document.getElementById('modalTitle');
const modalStatus = document.getElementById('modalStatus');
const modalCover  = document.getElementById('modalCover');
const coverPreview= document.getElementById('coverPreview');
const coverImg    = document.getElementById('coverImg');

// wypełnij selecty bram
DATA.forEach(b => {
  const opt = document.createElement('option');
  opt.value = b.id;
  opt.textContent = b.name;
  gateFilter.appendChild(opt);

  const opt2 = document.createElement('option');
  opt2.value = b.id;
  opt2.textContent = b.name;
  modalGate.appendChild(opt2);
});

function statusClass(st) {
  switch(st) {
    case 'published': return 'st-published';
    case 'ready': return 'st-ready';
    case 'writing': return 'st-writing';
    case 'draft': return 'st-draft';
    default: return 'st-idea';
  }
}

function render() {
  const q = searchInput.value.toLowerCase().trim();
  const gate = gateFilter.value;
  const st = statusFilter.value;
  gatesGrid.innerHTML = '';

  DATA.forEach(brama => {
    if(gate !== 'all' && String(brama.id) !== gate) return;

    const card = document.createElement('article');
    card.className = 'brama-card';
    card.innerHTML = `
      <div class="brama-header">
        <div>
          <div class="brama-title">${brama.name}</div>
          <div class="brama-sub">${brama.sub}</div>
        </div>
        <span class="badge">${brama.tag}</span>
      </div>
    `;
    const booksWrap = document.createElement('div');
    booksWrap.className = 'books';

    const filtered = brama.books.filter(book => {
      if(st !== 'all' && book.status !== st) return false;
      if(q && !book.title.toLowerCase().includes(q)) return false;
      return true;
    });

    if(!filtered.length){
      const info = document.createElement('div');
      info.className = 'no-books';
      info.textContent = 'Brak tytułów.';
      booksWrap.appendChild(info);
    } else {
      filtered.forEach(book => {
        const el = document.createElement('div');
        el.className = 'book';
        el.innerHTML = `
          <div class="book-cover-thumb" style="${book.cover ? `background-image:url('${book.cover}')` : ''}">
            ${book.cover ? '' : 'okładka'}
          </div>
          <div class="book-main">
            <div class="book-title">${book.title}</div>
            <div class="book-meta">
              <span>${book.status}</span>
              <span class="status ${statusClass(book.status)}">${book.status.toUpperCase()}</span>
            </div>
          </div>
        `;
        const thumb = el.querySelector('.book-cover-thumb');
        if(book.cover) {
          thumb.addEventListener('click', ev => {
            ev.stopPropagation();
            coverImg.src = book.cover;
            coverPreview.style.display = 'flex';
          });
        }
        booksWrap.appendChild(el);
      });
    }

    card.appendChild(booksWrap);
    gatesGrid.appendChild(card);
  });
}

// eventy
[searchInput, gateFilter, statusFilter].forEach(el => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

// modal
document.getElementById('addBookBtn').onclick = () => {
  modalTitle.value = '';
  modalCover.value = '';
  modalStatus.value = 'idea';
  addModal.style.display = 'flex';
};

document.getElementById('modalCancel').onclick = () => {
  addModal.style.display = 'none';
};

document.getElementById('modalSave').onclick = () => {
  const gateId = Number(modalGate.value);
  const title  = modalTitle.value.trim();
  const status = modalStatus.value;
  const cover  = modalCover.value.trim();
  if(!title) return;
  const brama = DATA.find(b => b.id === gateId);
  if(!brama) return;
  brama.books.push({title, status, cover});
  saveData();
  render();
  addModal.style.display = 'none';
};

// okładka fullscreen
document.getElementById('coverClose').onclick = () => {
  coverPreview.style.display = 'none';
  coverImg.src = '';
};
coverPreview.addEventListener('click', () => {
  coverPreview.style.display = 'none';
  coverImg.src = '';
});

// init
render();
