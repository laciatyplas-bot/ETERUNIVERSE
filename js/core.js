/* =====================================
   ETERNIVERSE — CORE ENGINE v4.1
   Architekt: Maciej Maciuszek
   ===================================== */

let WORLD = null; // Jednorazowa deklaracja

/* ==============================
   START SYSTEMU
============================== */
function initEterniverse() {
  console.log("🌌 Uruchamiam ETERNIVERSE: PSYCHE / INTERSEEKER...");

  // Ładuj dane lub użyj domyślnego
  WORLD = loadWorldData() || getDefaultWorld();

  // Napraw brakujące okładki i inne braki
  fixMissingCovers(WORLD);
  fixMissingChapters(WORLD);

  // Zapisz stan
  saveWorldData();

  // Renderuj
  renderWorld(WORLD);

  // UI + Belle
  setupUI();
  belleSpeak("System Kroniki Woli aktywowany. Jestem gotowa.");
}

/* ==============================
   DOMYŚLNY ŚWIAT (fallback)
============================== */
function getDefaultWorld() {
  return {
    name: "Świat I: PSYCHE",
    description: "Pierwszy poziom – konfrontacja z cieniem i mechanizmami przetrwania.",
    gates: [
      {
        id: 1,
        name: "BRAMA I — INTERSEEKER",
        color: "#28D3C6",
        sub: "Psychika · Cień · Trauma · Konfrontacja",
        books: [
          {
            title: "INTERSEEKER: Geneza",
            description: "Surowa autobiograficzna historia spod pieca.",
            cover: "https://m.media-amazon.com/images/I/71l0m8q2mYL._SL1500_.jpg",
            audio: "",
            status: "opublikowana",
            chapters: []
          },
          {
            title: "InterSeeker – Atlas Wewnętrzny",
            description: "Praktyczny podręcznik konfrontacji z Cieniem.",
            cover: "https://m.media-amazon.com/images/I/71+some-other-amazon-id.jpg",
            audio: "",
            status: "opublikowana",
            chapters: []
          }
        ]
      }
      // Dodaj resztę bram ręcznie lub z JSONa jeśli kiedyś będzie
    ]
  };
}

/* ==============================
   RENDER ŚWIATA (bezpieczny)
============================== */
function renderWorld(world) {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = ""; // Czyść przed renderem

  const title = document.createElement("h2");
  title.textContent = world.name;
  app.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = world.description;
  app.appendChild(desc);

  (world.gates || []).forEach(gate => {
    const gateBox = document.createElement("div");
    gateBox.className = "gate";
    gateBox.style.borderColor = gate.color || "#444";

    const gateTitle = document.createElement("h3");
    gateTitle.textContent = gate.name;
    gateTitle.style.color = gate.color || "#eee";
    gateBox.appendChild(gateTitle);

    const gateSub = document.createElement("p");
    gateSub.textContent = gate.sub || "";
    gateBox.appendChild(gateSub);

    (gate.books || []).forEach(book => {
      const bookBox = document.createElement("div");
      bookBox.className = "book";

      // Lewa strona - okładka + info
      const left = document.createElement("div");
      left.className = "book-left";

      const img = document.createElement("img");
      img.alt = book.title;
      img.src = book.cover || "media/covers/default.jpg";

      // Bezpieczny onerror – tylko raz
      img.onerror = function() {
        this.onerror = null; // Wyłącz po pierwszym błędzie
        this.src = "https://placehold.co/200x300/000/fff/png?text=" + encodeURIComponent(book.title.substring(0, 20));
      };

      left.appendChild(img);

      const info = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = book.title;
      info.appendChild(name);

      const stat = document.createElement("div");
      stat.className = "status";
      stat.textContent = book.status ? book.status.toUpperCase() : "IDEA";
      info.appendChild(stat);

      left.appendChild(info);
      bookBox.appendChild(left);

      // Prawa strona - audio + przyciski
      const right = document.createElement("div");
      right.className = "book-right";

      if (book.audio) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = book.audio;
        right.appendChild(audio);
      }

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️ Edytuj";
      editBtn.onclick = () => openEditor(gate, book);
      right.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️ Usuń";
      delBtn.onclick = () => deleteBook(gate, book);
      right.appendChild(delBtn);

      bookBox.appendChild(right);
      gateBox.appendChild(bookBox);
    });

    app.appendChild(gateBox);
  });
}

/* ==============================
   NAPRAWA OKŁADEK I ROZDZIAŁÓW
============================== */
function fixMissingCovers(world) {
  (world.gates || []).forEach(gate => {
    (gate.books || []).forEach(book => {
      if (!book.cover || book.cover.trim() === "") {
        book.cover = "media/covers/default.jpg";
      }
      // Zawsze fallback na zewnętrzny placeholder jeśli lokalny nie działa
      book.cover = book.cover || "https://placehold.co/200x300/000/fff/png?text=" + encodeURIComponent(book.title);
    });
  });
}

function fixMissingChapters(world) {
  (world.gates || []).forEach(gate => {
    (gate.books || []).forEach(book => {
      if (!book.chapters) book.chapters = [];
    });
  });
}

/* ==============================
   EDYCJA KSIĄŻKI
============================== */
let currentEdit = null;

function openEditor(gate, book) {
  const modal = document.getElementById("modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  document.getElementById("modalTitle").textContent = book ? "Edytuj książkę" : "Nowa książka";

  const select = document.getElementById("gateSelect");
  select.value = gate.id;

  document.getElementById("bookTitle").value = book?.title || "";
  document.getElementById("bookDesc").value = book?.description || "";
  document.getElementById("bookCover").value = book?.cover || "";
  document.getElementById("bookAudio").value = book?.audio || "";

  currentEdit = book || null;
}

function setupUI() {
  const modal = document.getElementById("modal");
  const addBtn = document.getElementById("addBookBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");

  addBtn.onclick = () => openEditor(WORLD.gates[0], null); // Domyślnie pierwsza brama

  cancelBtn.onclick = () => modal.classList.add("hidden");

  saveBtn.onclick = () => {
    const title = document.getElementById("bookTitle").value.trim();
    if (!title) {
      alert("Tytuł jest wymagany!");
      return;
    }

    const gateId = parseInt(document.getElementById("gateSelect").value);
    const gate = WORLD.gates.find(g => g.id === gateId);

    const bookData = {
      title,
      description: document.getElementById("bookDesc").value.trim(),
      cover: document.getElementById("bookCover").value.trim(),
      audio: document.getElementById("bookAudio").value.trim(),
      status: "idea",
      chapters: currentEdit?.chapters || []
    };

    if (currentEdit) {
      Object.assign(currentEdit, bookData);
    } else {
      gate.books.push(bookData);
    }

    saveWorldData();
    renderWorld(WORLD);
    modal.classList.add("hidden");
  };
}

/* ==============================
   ZAPIS / ODCZYT
============================== */
function saveWorldData() {
  try {
    localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", JSON.stringify(WORLD));
  } catch (e) {
    console.error("Błąd zapisu do localStorage", e);
  }
}

function loadWorldData() {
  try {
    const data = localStorage.getItem("ETERNIVERSE_WORLD_PSYCHE_V4");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Błąd odczytu z localStorage", e);
    return null;
  }
}

/* ==============================
   EKSPORT
============================== */
function exportWorldJSON() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(WORLD, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = "ETERNIVERSE_WORLD_PSYCHE.json";
    a.click();
  } catch (e) {
    alert("Błąd eksportu");
  }
}

/* ==============================
   BELLE – GŁOS
============================== */
function belleSpeak(msg) {
  const el = document.getElementById("belleSpeech");
  if (el) {
    el.textContent = msg;
    setTimeout(() => el.textContent = "Czekam na Twoje intencje...", 5000);
  }
}

/* ==============================
   START – zabezpieczony
============================== */
if (!window.EterniverseInitialized) {
  window.EterniverseInitialized = true;
  document.addEventListener("DOMContentLoaded", initEterniverse);
}
