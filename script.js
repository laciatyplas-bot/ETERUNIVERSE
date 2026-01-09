// ========================================================
//  MAPA ETERNIVERSE — WERSJA 2.0 z AUDIOBOOKAMI
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
        cover: "https://i.imgur.com/PR9xzMx.jpeg",
        audio: "https://cdn.pixabay.com/download/audio/2023/03/06/audio_ae5985f344.mp3?filename=dark-mystery-soundscape-141085.mp3"
      },
      {
        title: "MemorySeeker – Archeologia Wspomnień",
        status: "draft",
        cover: "https://i.imgur.com/K5zEmZs.jpeg"
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
        cover: "https://i.imgur.com/DuBvlOB.jpeg",
        audio: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_358b5f2efb.mp3?filename=epic-cinematic-ambient-11089.mp3"
      },
      { title: "Custos: Kodeks Głębi", status: "idea", cover: "https://i.imgur.com/t1Ilvwz.jpeg" }
    ]
  },
  {
    id: 3,
    name: "BRAMA III — ETERSEEKER",
    sub: "Wola · Pole · Architektura",
    tag: "CORE / FIELD",
    books: [
      { title: "EterSeeker – Księga Zakazana (Tom Zero)", status: "writing", cover: "https://i.imgur.com/bKoQBSx.jpeg" },
      { title: "EterSeeker – Architektura Woli", status: "idea", cover: "https://i.imgur.com/NutdKPt.jpeg" }
    ]
  },
  {
    id: 4,
    name: "BRAMA IV — ARCHETYPY / WOLA",
    sub: "Konstrukcja · Role · Przeznaczenie",
    tag: "CORE / WILL",
    books: [
      { title: "ArchetypSeeker – System Archetypów Eteru", status: "idea", cover: "https://i.imgur.com/ALEsWoj.jpeg" },
      { title: "Kronika Woli", status: "idea", cover: "https://i.imgur.com/vHWU3mM.jpeg" }
    ]
  },
  {
    id: 5,
    name: "BRAMA V — OBFITOSEEKER",
    sub: "Materia · Przepływ · Manifestacja",
    tag: "EMBODIED / FLOW",
    books: [
      {
        title: "ObfitoSeeker – Kod Obfitości",
        status: "published",
        cover: "https://i.imgur.com/ctYMX2e.jpeg",
        audio: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_8a8b9d6ed5.mp3?filename=inspiring-meditation-ambient-122890.mp3"
      },
      { title: "MateriaSeeker – Przewodnik Ciała i Przepływu", status: "draft", cover: "https://i.imgur.com/HJ4zddT.jpeg" }
    ]
  },
  {
    id: 6,
    name: "BRAMA VI — BIOSEEKER",
    sub: "Ciało · Biologia · Regulacja",
    tag: "EMBODIED / BIO",
    books: [
      { title: "BioSeeker – Sekret Biologii Pola", status: "idea", cover: "https://i.imgur.com/RpknkSN.jpeg" }
    ]
  },
  {
    id: 7,
    name: "BRAMA VII — SPLĄTANIE / AI",
    sub: "Obserwator · Meta-tożsamość · Technologia",
    tag: "META / TECH",
    books: [
      { title: "SplatanieSeeker – Protokół Obserwatora", status: "idea", cover: "https://i.imgur.com/yBfABfn.jpeg" },
      { title: "InterfejsSeeker – Interfejs Świadomości", status: "idea", cover: "https://i.imgur.com/ekFuE6H.jpeg" }
    ]
  },
  {
    id: 8,
    name: "BRAMA VIII — TRAJEKTORIE",
    sub: "Kod Życia · Linie Czasu · Fizyka Duszy",
    tag: "META / PHYSICS",
    books: [
      {
        title: "TrajektoriaSeeker – Mapa Linii Życia",
        status: "ready",
        cover: "https://i.imgur.com/hiA0JHi.jpeg",
        audio: "https://cdn.pixabay.com/download/audio/2023/03/13/audio_017aef38c3.mp3?filename=ethereal-ambient-141711.mp3"
      },
      { title: "QuantumSeeker – Fizyka Duszy", status: "idea", cover: "https://i.imgur.com/vYUZH2U.jpeg" }
    ]
  },
  {
    id: 9,
    name: "BRAMA IX — ETERNIONY / KOLEKTYW",
    sub: "Węzły Pola · Wspólnota · Misja",
    tag: "COLLECTIVE",
    books: [
      { title: "Eteriony – Tom I", status: "idea", cover: "https://i.imgur.com/HrMTF5F.jpeg" },
      { title: "Eteriony – Tom II", status: "idea", cover: "https://i.imgur.com/x2uY3qq.jpeg" }
    ]
  },
  {
    id: 10,
    name: "BRAMA X — ETERUNIVERSE",
    sub: "Integracja · Jedność · Architekt",
    tag: "INTEGRATION",
    books: [
      {
        title: "Architekt Eteru — Manifest Twórcy",
        status: "writing",
        cover: "https://i.imgur.com/YrK1Jb3.jpeg",
        audio: "https://cdn.pixabay.com/download/audio/2023/03/10/audio_cfa5570c31.mp3?filename=space-soundscape-141470.mp3"
      },
      { title: "Mapa Uniwersum Eteru", status: "idea", cover: "https://i.imgur.com/FAdTuO5.jpeg" }
    ]
  }
];

// Zapis do localStorage
function saveData() {
  localStorage.setItem("eterniverseData", JSON.stringify(DATA));
}

// Elementy DOM
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

// Uzupełnij selecty bram
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

// Główne renderowanie
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
      filtered.forEach((book) => {
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
                ? `<audio controls preload="none" style="width:100%;margin-top:6px;"><source src="${book.audio}" type="audio/mpeg">Twoja przeglądarka nie obsługuje audio.</audio>`
                : ""
            }
          </div>
        `;
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

// Filtry
[searchInput, gateFilter, statusFilter].forEach((el) => {
  el.addEventListener("input", render);
  el.addEventListener("change", render);
});

// Modal dodawania książki
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

// Podgląd okładki fullscreen
document.getElementById("coverClose").onclick = () => {
  coverPreview.style.display = "none";
  coverImg.src = "";
};
coverPreview.addEventListener("click", () => {
  coverPreview.style.display = "none";
  coverImg.src = "";
});

// Inicjalizacja
render();
