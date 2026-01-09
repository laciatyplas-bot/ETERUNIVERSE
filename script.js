// ========================================================
//  MAPA ETERNIVERSE v3.0 — PANEL ARCHITEKTA (edycja + audio)
// ========================================================

// Wczytaj dane z localStorage (jeśli istnieją)
let DATA = JSON.parse(localStorage.getItem("eterniverseData")) || [
  {
    id: 1,
    name: "BRAMA I — INTERSEEKER",
    sub: "Psychika · Cień · Trauma · Archetyp",
    tag: "CORE / PSYCHE",
    books: [
      {
        title: "InterSeeker – Atlas Wewnętrzny",
        status: "published",
        cover: "https://i.imgur.com/3UDr5kk.jpeg",
        audio: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_5b46f1b123.mp3?filename=calm-mind-ambient-122893.mp3"
      },
      {
        title: "ShadowSeeker – Anatomia Cienia",
        status: "ready",
        cover: "https://i.imgur.com/PR9xzMx.jpeg"
      }
    ]
  },
  {
    id: 2,
    name: "BRAMA II — CUSTOS / GENEZA",
    sub: "Strażnik · Rdzeń · Początek",
    tag: "CORE / ORIGIN",
    books: [
      {
        title: "Geneza",
        status: "ready",
        cover: "https://i.imgur.com/DuBvlOB.jpeg"
      }
    ]
  }
];

// ==============================================
//  ZAPIS / ODCZYT
// ==============================================

function saveData() {
  localStorage.setItem("eterniverseData", JSON.stringify(DATA));
}

// ==============================================
//  ELEMENTY DOM
// ==============================================

const gatesGrid = document.getElementById("gatesGrid");
const gateFilter = document.getElementById("gateFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");

const addModal = document.getElementById("addModal");
const modalGate = document.getElementById("modalGate");
const modalTitle = document.getElementById("modalTitle");
const modalStatus = document.getElementById("modalStatus");
const modalCover = document.getElementById("modalCover");

const coverPreview = document.getElementById("coverPreview");
const coverImg = document.getElementById("coverImg");

// Tworzymy dodatkowy modal do edycji
const editModal = document.createElement("div");
editModal.className = "modal-backdrop";
editModal.innerHTML = `
  <div class="modal">
    <h2>Edycja księgi</h2>
    <div class="modal-row">
      <label>Tytuł</label>
      <input id="editTitle">
    </div>
    <div class="modal-row">
      <label>Status</label>
      <select id="editStatus">
        <option value="idea">Idea</option>
        <option value="draft">Szkic</option>
        <option value="writing">W trakcie pisania</option>
        <option value="ready">Gotowe</option>
        <option value="published">Opublikowane</option>
      </select>
    </div>
    <div class="modal-row">
      <label>URL okładki</label>
      <input id="editCover">
    </div>
    <div class="modal-row">
      <label>URL audio (MP3)</label>
      <input id="editAudio">
    </div>
    <div class="modal-actions">
      <button id="editCancel">Anuluj</button>
      <button id="editDelete" style="background:#FF6B6B;border:none;color:#fff;">Usuń</button>
      <button class="primary" id="editSave">Zapisz zmiany</button>
    </div>
  </div>
`;
document.body.appendChild(editModal);

// ==============================================
//  GENEROWANIE DANYCH
// ==============================================

DATA.forEach((b) => {
  const opt = document.createElement("option");
  opt.value = b.id;
  opt.textContent = b.name;
  gateFilter.appendChild(opt);

  const opt2 = document.createElement("option");
  opt2.value = b.id;
  opt2.textContent = b.name;
  modalGate.appendChild(opt2);
});

function statusClass(st) {
  switch (st) {
    case "published": return "st-published";
    case "ready": return "st-ready";
    case "writing": return "st-writing";
    case "draft": return "st-draft";
    default: return "st-idea";
  }
}

// ==============================================
//  RENDEROWANIE
// ==============================================

function render() {
  const q = searchInput.value.toLowerCase().trim();
  const gate = gateFilter.value;
  const st = statusFilter.value;
  gatesGrid.innerHTML = "";

  DATA.forEach((brama) => {
    if (gate !== "all" && String(brama.id) !== gate) return;

    const card = document.createElement("article");
    card.className = "brama-card";
    card.innerHTML = `
      <div class="brama-header">
        <div>
          <div class="brama-title">${brama.name}</div>
          <div class="brama-sub">${brama.sub}</div>
        </div>
        <span class="badge">${brama.tag}</span>
      </div>
    `;

    const booksWrap = document.createElement("div");
    booksWrap.className = "books";

    const filtered = brama.books.filter((book) => {
      if (st !== "all" && book.status !== st) return false;
      if (q && !book.title.toLowerCase().includes(q)) return false;
      return true;
    });

    if (!filtered.length) {
      const info = document.createElement("div");
      info.className = "no-books";
      info.textContent = "Brak tytułów.";
      booksWrap.appendChild(info);
    } else {
      filtered.forEach((book, index) => {
        const el = document.createElement("div");
        el.className = "book";
        el.innerHTML = `
          <div class="book-cover-thumb" style="${book.cover ? `background-image:url('${book.cover}')` : ""}">
            ${book.cover ? "" : "okładka"}
          </div>
          <div class="book-main">
            <div class="book-title">${book.title}</div>
            <div class="book-meta">
              <span>${book.status}</span>
              <span class="status ${statusClass(book.status)}">${book.status.toUpperCase()}</span>
            </div>
            ${
              book.audio
                ? `<audio controls preload="none" style="width:100%;margin-top:6px;"><source src="${book.audio}" type="audio/mpeg">Audio</audio>`
                : ""
            }
          </div>
        `;

        // Kliknięcie książki = edycja
        el.addEventListener("click", () => openEditModal(brama.id, index));

        // Kliknięcie okładki = podgląd
        const thumb = el.querySelector(".book-cover-thumb");
        if (book.cover) {
          thumb.addEventListener("click", (ev) => {
            ev.stopPropagation();
            coverImg.src = book.cover;
            coverPreview.style.display = "flex";
          });
        }

        booksWrap.appendChild(el);
      });
    }

    card.appendChild(booksWrap);
    gatesGrid.appendChild(card);
  });
}

// ==============================================
//  OBSŁUGA PANELI
// ==============================================

// FILTRY
[searchInput, gateFilter, statusFilter].forEach((el) => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

// MODAL DODAWANIA
document.getElementById("addBookBtn").onclick = () => {
  modalTitle.value = "";
  modalCover.value = "";
  modalStatus.value = "idea";
  addModal.style.display = "flex";
};

document.getElementById("modalCancel").onclick = () => {
  addModal.style.display = "none";
};

document.getElementById("modalSave").onclick = () => {
  const gateId = Number(modalGate.value);
  const title = modalTitle.value.trim();
  const status = modalStatus.value;
  const cover = modalCover.value.trim();
  if (!title) return;
  const brama = DATA.find((b) => b.id === gateId);
  if (!brama) return;
  brama.books.push({ title, status, cover });
  saveData();
  render();
  addModal.style.display = "none";
};

// MODAL EDYCJI
function openEditModal(gateId, bookIndex) {
  const brama = DATA.find((b) => b.id === gateId);
  const book = brama.books[bookIndex];

  editModal.style.display = "flex";
  const titleInput = editModal.querySelector("#editTitle");
  const statusInput = editModal.querySelector("#editStatus");
  const coverInput = editModal.querySelector("#editCover");
  const audioInput = editModal.querySelector("#editAudio");

  titleInput.value = book.title;
  statusInput.value = book.status;
  coverInput.value = book.cover || "";
  audioInput.value = book.audio || "";

  editModal.querySelector("#editCancel").onclick = () => {
    editModal.style.display = "none";
  };

  editModal.querySelector("#editSave").onclick = () => {
    book.title = titleInput.value.trim();
    book.status = statusInput.value;
    book.cover = coverInput.value.trim();
    book.audio = audioInput.value.trim();
    saveData();
    render();
    editModal.style.display = "none";
  };

  editModal.querySelector("#editDelete").onclick = () => {
    if (confirm("Na pewno usunąć tę księgę?")) {
      brama.books.splice(bookIndex, 1);
      saveData();
      render();
      editModal.style.display = "none";
    }
  };
}

// PODGLĄD OKŁADKI
document.getElementById("coverClose").onclick = () => {
  coverPreview.style.display = "none";
  coverImg.src = "";
};
coverPreview.addEventListener("click", () => {
  coverPreview.style.display = "none";
  coverImg.src = "";
});

// START
render();
