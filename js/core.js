/* =====================================
   ETERNIVERSE — CORE ENGINE v4.3
   Architekt: Maciej Maciuszek
   ===================================== */

// Jednorazowa inicjalizacja – zapobiega wielokrotnemu ładowaniu
if (!window.EterniverseCoreInitialized) {
  window.EterniverseCoreInitialized = true;

  let WORLD = null; // Jednorazowa deklaracja globalnego świata

  /* ==============================
     START SYSTEMU
  ============================== */
  function initEterniverse() {
    console.log("🌌 Uruchamiam ETERNIVERSE: PSYCHE / INTERSEEKER v4.3...");

    // Ładuj dane lub użyj domyślnego świata
    WORLD = loadWorldData() || getDefaultWorld();

    // Napraw brakujące okładki i rozdziały
    fixMissingCovers(WORLD);
    fixMissingChapters(WORLD);

    // Zapisz stan
    saveWorldData();

    // Renderuj świat
    renderWorld(WORLD);

    // Ustaw UI i Belle
    setupUI();
    belleSpeak("System Kroniki Woli aktywowany. Jestem gotowa, Architekcie.");
  }

  /* ==============================
     DOMYŚLNY ŚWIAT (fallback) – wszystkie 10 bram
  ============================== */
  function getDefaultWorld() {
    return {
      id: 1,
      name: "ŚWIAT I — PSYCHE / INTERSEEKER",
      description: "Świat wejścia w psychikę. Przestrzeń prawdy o naturze jaźni. Kronika Cienia i Woli.",
      gates: [
        {
          id: 1,
          name: "BRAMA I — INTERSEEKER",
          sub: "Psychika · Cień · Trauma · Archetyp",
          tag: "CORE / PSYCHE",
          color: "#28D3C6",
          books: [
            {
              title: "InterSeeker – Atlas Wewnętrzny",
              description: "Mapa wnętrza człowieka. Mechanizmy obronne, fałszywa tożsamość i pierwsze pęknięcie iluzji.",
              status: "published",
              cover: "https://img.wattpad.com/cover/405617436-288-k446508.jpg", // Twoja okładka z Wattpada
              audio: "media/audio/interseeker_ch1.mp3",
              chapters: []
            },
            {
              title: "ShadowSeeker – Anatomia Cienia",
              description: "Praca z cieniem bez duchowej ściemy. Agresja i wstyd jako paliwo świadomości.",
              status: "ready",
              cover: "media/covers/shadowseeker.jpg",
              audio: "media/audio/shadowseeker_ch1.mp3",
              chapters: []
            },
            {
              title: "MemorySeeker – Archeologia Wspomnień",
              description: "Rozkodowanie pamięci i przeszłości jako aktywnego systemu sterowania.",
              status: "draft",
              cover: "media/covers/memoryseeker.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 2,
          name: "BRAMA II — CUSTOS / GENEZA",
          sub: "Strażnik · Rdzeń · Początek",
          tag: "CORE / ORIGIN",
          color: "#FF6B6B",
          books: [
            {
              title: "Geneza",
              description: "Początek Kroniki Woli. Narodziny świadomości w eterze.",
              status: "ready",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "Custos: Kodeks Głębi",
              description: "System ochrony wewnętrznego rdzenia. Wiedza strażników.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 3,
          name: "BRAMA III — ETERSEEKER",
          sub: "Wola · Pole · Architektura",
          tag: "CORE / FIELD",
          color: "#D9A441",
          books: [
            {
              title: "EterSeeker – Księga Zakazana (Tom Zero)",
              description: "Początek architektury eteru i zapomniane protokoły pola.",
              status: "writing",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "EterSeeker – Architektura Woli",
              description: "Jak wola tworzy rzeczywistość w przestrzeni pola.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 4,
          name: "BRAMA IV — ARCHETYPY / WOLA",
          sub: "Konstrukcja · Role · Przeznaczenie",
          tag: "CORE / WILL",
          color: "#9B6BFF",
          books: [
            {
              title: "ArchetypSeeker – System Archetypów Eteru",
              description: "Analiza wewnętrznych ról, wzorców i kodów istnienia.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "Kronika Woli",
              description: "Centralny zapis ewolucji świadomości ludzkiej.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 5,
          name: "BRAMA V — OBFITOSEEKER",
          sub: "Materia · Przepływ · Manifestacja",
          tag: "EMBODIED / FLOW",
          color: "#12C65B",
          books: [
            {
              title: "ObfitoSeeker – Kod Obfitości",
              description: "Mechanizmy przepływu energii materialnej i manifestacji.",
              status: "published",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "MateriaSeeker – Przewodnik Ciała i Przepływu",
              description: "Jak ciało odbiera i przetwarza energię pola.",
              status: "draft",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 6,
          name: "BRAMA VI — BIOSEEKER",
          sub: "Ciało · Biologia · Regulacja",
          tag: "EMBODIED / BIO",
          color: "#FFB14B",
          books: [
            {
              title: "BioSeeker – Sekret Biologii Pola",
              description: "Biologia człowieka jako odbiornik i nadajnik pola.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 7,
          name: "BRAMA VII — SPLĄTANIE / AI",
          sub: "Obserwator · Meta-tożsamość · Technologia",
          tag: "META / TECH",
          color: "#5DADE2",
          books: [
            {
              title: "SplatanieSeeker – Protokół Obserwatora",
              description: "Kwantowe splątanie świadomości i rola obserwatora.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "InterfejsSeeker – Interfejs Świadomości",
              description: "Technologia jako rozszerzenie ludzkiej świadomości.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 8,
          name: "BRAMA VIII — TRAJEKTORIE",
          sub: "Kod Życia · Linie Czasu · Fizyka Duszy",
          tag: "META / PHYSICS",
          color: "#FF9FF3",
          books: [
            {
              title: "TrajektoriaSeeker – Mapa Linii Życia",
              description: "Mapowanie możliwych trajektorii rozwoju świadomości.",
              status: "ready",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "QuantumSeeker – Fizyka Duszy",
              description: "Kwantowa natura świadomości i mechanika duszy.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 9,
          name: "BRAMA IX — ETERNIONY / KOLEKTYW",
          sub: "Węzły Pola · Wspólnota · Misja",
          tag: "COLLECTIVE",
          color: "#667eea",
          books: [
            {
              title: "Eteriony – Tom I",
              description: "Pierwsi strażnicy i budowniczowie kolektywnego pola.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "Eteriony – Tom II",
              description: "Kontynuacja kroniki kolektywnej świadomości.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        },
        {
          id: 10,
          name: "BRAMA X — ETERUNIVERSE",
          sub: "Integracja · Jedność · Architekt",
          tag: "INTEGRATION",
          color: "#D9A441",
          books: [
            {
              title: "Architekt Eteru — Manifest Twórcy",
              description: "Podsumowanie całej architektury świata PSYCHE.",
              status: "writing",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            },
            {
              title: "Mapa Uniwersum Eteru",
              description: "Kompletna mapa wszystkich światów i bram Eterniverse.",
              status: "idea",
              cover: "media/covers/default.jpg",
              audio: "",
              chapters: []
            }
          ]
        }
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
          this.onerror = null;
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

    addBtn.onclick = () => openModal(null, WORLD.gates[0].id); // Domyślnie pierwsza brama

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
        cover: document.getElementById("bookCover").value.trim() || "media/covers/default.jpg",
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
     BELLE — GŁOS
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
  document.addEventListener("DOMContentLoaded", initEterniverse);
}
