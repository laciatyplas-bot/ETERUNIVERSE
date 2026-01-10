/* =====================================
   ETERNIVERSE — ŚWIAT I: PSYCHE / INTERSEEKER
   Architekt: Maciej Maciuszek
   ===================================== */

window.DATA = {
  id: 1,
  name: "ŚWIAT I — PSYCHE / INTERSEEKER",
  description: "Świat wejścia w psychikę. Rozpad iluzji, konfrontacja z cieniem, pamięcią i tożsamością. Nie rozwój — tylko prawda.",

  gates: [
    { 
      id: 1, name: "BRAMA I — INTERSEEKER", sub: "Psychika · Cień · Pamięć · Trauma", 
      color: "#28D3C6",
      books: [
        { title: "InterSeeker – Atlas Wewnętrzny", status: "published" },
        { title: "ShadowSeeker – Anatomia Cienia", status: "ready" },
        { title: "MemorySeeker – Archeologia Wspomnień", status: "writing" },
        { title: "BólSeeker – Anatomia Rany", status: "draft" }
      ]
    },
    { 
      id: 2, name: "BRAMA II — CUSTOS / GENEZA", sub: "Strażnik · Rdzeń · Początek", 
      color: "#FF6B6B",
      books: [
        { title: "Geneza", status: "ready" },
        { title: "Custos: Kodeks Głębi", status: "writing" }
      ]
    },
    { 
      id: 3, name: "BRAMA III — ETERSEEKER", sub: "Wola · Pole · Architektura", 
      color: "#D9A441",
      books: [
        { title: "EterSeeker – Księga Zakazana (Tom Zero)", status: "published" },
        { title: "EterSeeker – Architektura Woli", status: "ready" },
        { title: "PoleSeeker – Topologia Ludzkiego Pola", status: "writing" }
      ]
    },
    { 
      id: 4, name: "BRAMA IV — ARCHETYPY / WOLA", sub: "Konstrukcja · Role · Przeznaczenie", 
      color: "#9B6BFF",
      books: [
        { title: "ArchetypSeeker – System Archetypów Eteru", status: "ready" },
        { title: "WolaSeeker – Kwant Woli", status: "draft" },
        { title: "Kronika Woli", status: "idea" }
      ]
    },
    { 
      id: 5, name: "BRAMA V — OBFITOSEEKER", sub: "Materia · Przepływ · Manifestacja", 
      color: "#12C65B",
      books: [
        { title: "ObfitoSeeker – Kod Obfitości", status: "published" },
        { title: "MateriaSeeker – Przewodnik Ciała i Przepływu", status: "ready" },
        { title: "Księga Przepływu", status: "writing" }
      ]
    },
    { 
      id: 6, name: "BRAMA VI — BIOSEEKER", sub: "Ciało · Biologia · Regulacja", 
      color: "#FFB14B",
      books: [
        { title: "BioSeeker – Sekret Biologii Pola", status: "ready" },
        { title: "Ciało jako Interfejs Pola", status: "draft" },
        { title: "RytmSeeker – Mechanika Ruchu Życia", status: "idea" }
      ]
    },
    { 
      id: 7, name: "BRAMA VII — SPLĄTANIE / AI", sub: "Obserwator · Meta-tożsamość · Technologia", 
      color: "#5DADE2",
      books: [
        { title: "SplatanieSeeker – Protokół Obserwatora", status: "writing" },
        { title: "InterfejsSeeker – Interfejs Świadomości", status: "ready" },
        { title: "Protokół Splątania (wersja meta)", status: "draft" }
      ]
    },
    { 
      id: 8, name: "BRAMA VIII — TRAJEKTORIE", sub: "Kod Życia · Linie Czasu · Fizyka Duszy", 
      color: "#FF9FF3",
      books: [
        { title: "TrajektoriaSeeker – Mapa Linii Życia", status: "published" },
        { title: "QuantumSeeker – Fizyka Duszy", status: "ready" },
        { title: "CzasSeeker – Fizyka Linii Czasu", status: "writing" }
      ]
    },
    { 
      id: 9, name: "BRAMA IX — ETERNIONY / KOLEKTYW", sub: "Węzły Pola · Wspólnota · Misja", 
      color: "#667eea",
      books: [
        { title: "Eteriony – Tom I", status: "ready" },
        { title: "Eteriony – Tom II", status: "draft" },
        { title: "Mapa Uniwersum Eteru", status: "idea" }
      ]
    },
    { 
      id: 10, name: "BRAMA X — ETERUNIVERSE", sub: "Integracja · Jedność · Architekt", 
      color: "#D9A441",
      books: [
        { title: "Architekt Eteru — Manifest Twórcy", status: "writing" },
        { title: "Mapa Trajektorii Życia (rozszerzona)", status: "ready" }
      ]
    }
  ]
};

/* ===========================
   RENDER ENGINE
   =========================== */
function renderWorld(world) {
  const root = document.getElementById("app");
  root.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.textContent = world.name;
  root.appendChild(h1);

  const desc = document.createElement("p");
  desc.textContent = world.description;
  root.appendChild(desc);

  world.gates.forEach((gate) => {
    const gateBox = document.createElement("div");
    gateBox.style.borderLeft = `6px solid ${gate.color}`;
    gateBox.style.background = "#0b1624";
    gateBox.style.padding = "16px";
    gateBox.style.margin = "24px 0";
    gateBox.style.borderRadius = "12px";

    const h2 = document.createElement("h2");
    h2.textContent = gate.name;
    h2.style.color = gate.color;
    gateBox.appendChild(h2);

    const sub = document.createElement("p");
    sub.textContent = gate.sub;
    sub.style.color = "#9BA9C8";
    gateBox.appendChild(sub);

    gate.books.forEach((book) => {
      const bookEl = document.createElement("div");
      bookEl.style.display = "flex";
      bookEl.style.justifyContent = "space-between";
      bookEl.style.background = "rgba(255,255,255,0.05)";
      bookEl.style.margin = "4px 0";
      bookEl.style.padding = "8px 10px";
      bookEl.style.borderRadius = "8px";
      bookEl.innerHTML = `<span>${book.title}</span><span style="color:#${getStatusColor(book.status)};">${book.status}</span>`;
      gateBox.appendChild(bookEl);
    });

    root.appendChild(gateBox);
  });
}

function getStatusColor(status) {
  switch (status) {
    case "published": return "28D3C6";
    case "ready": return "A0E7E5";
    case "writing": return "FFD166";
    case "draft": return "FF6B6B";
    case "idea": return "9BA9C8";
    default: return "FFFFFF";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderWorld(window.DATA);
  console.log("🌀 ŚWIAT I — PSYCHE / INTERSEEKER załadowany");
});
