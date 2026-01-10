/* =====================================
   ETERNIVERSE — ŚWIAT I: PSYCHE / INTERSEEKER
   Architekt: Maciej Maciuszek
   ===================================== */

window.DATA = {
  id: 1,
  system: "ETHERUNIVERSE",
  worldCode: "PSYCHE",
  name: "ŚWIAT I — PSYCHE / INTERSEEKER",
  description:
    "Świat wejścia w psychikę. Przestrzeń prawdy o naturze jaźni. Kronika Cienia i Woli.",

  gates: [
    {
      id: "gate_1",
      name: "BRAMA I — INTERSEEKER",
      color: "#28D3C6",
      theme: "Psychika · Cień · Trauma · Tożsamość",
      books: [
        {
          id: "interseeker_atlas",
          title: "InterSeeker — Atlas Wewnętrzny",
          description:
            "Mapa wnętrza człowieka. Mechanizmy obronne i fałszywa tożsamość.",
          cover: "media/covers/interseeker.jpg",
          audio: "media/audio/interseeker_ch1.mp3"
        },
        {
          id: "shadowseeker",
          title: "ShadowSeeker — Anatomia Cienia",
          description:
            "Praca z cieniem bez duchowej ściemy. Agresja i wstyd jako paliwo świadomości.",
          cover: "media/covers/shadowseeker.jpg",
          audio: "media/audio/shadowseeker_ch1.mp3"
        },
        {
          id: "memoryseeker",
          title: "MemorySeeker — Archeologia Wspomnień",
          description:
            "Rozkodowanie pamięci i przeszłości jako aktywnego systemu sterowania.",
          cover: "media/covers/memoryseeker.jpg",
          audio: "media/audio/memoryseeker_ch1.mp3"
        }
      ]
    },
    {
      id: "gate_2",
      name: "BRAMA II — CUSTOS / GENEZA",
      color: "#FF6B6B",
      theme: "Strażnik · Rdzeń · Początek",
      books: [
        {
          id: "geneza",
          title: "Custos — Geneza Pola",
          description:
            "Początek świadomości pola. Pierwszy moment oddzielenia i narodzin jaźni.",
          cover: "media/covers/interseeker.jpg",
          audio: "media/audio/interseeker_ch1.mp3"
        }
      ]
    },
    {
      id: "gate_3",
      name: "BRAMA III — ETERSEEKER",
      color: "#D9A441",
      theme: "Wola · Pole · Architektura",
      books: [
        {
          id: "eterseeker_zero",
          title: "EterSeeker — Księga Zakazana (Tom Zero)",
          description:
            "Pierwsza manifestacja architektury woli. Struktura i energia decyzji.",
          cover: "media/covers/memoryseeker.jpg",
          audio: "media/audio/memoryseeker_ch1.mp3"
        }
      ]
    }
  ]
};

/* =====================================
   RENDER ENGINE
   ===================================== */

function renderWorld(world) {
  const root = document.getElementById("app");
  root.innerHTML = "";

  // Tytuł świata
  const h1 = document.createElement("h1");
  h1.textContent = world.name;
  root.appendChild(h1);

  const desc = document.createElement("p");
  desc.textContent = world.description;
  root.appendChild(desc);

  // Bramy
  world.gates.forEach((gate) => {
    const gateBox = document.createElement("div");
    gateBox.style.borderLeft = `6px solid ${gate.color}`;
    gateBox.style.background = "#0b1624";
    gateBox.style.padding = "16px";
    gateBox.style.margin = "24px 0";
    gateBox.style.borderRadius = "12px";
    gateBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

    const h2 = document.createElement("h2");
    h2.textContent = gate.name;
    h2.style.color = gate.color;
    gateBox.appendChild(h2);

    const theme = document.createElement("p");
    theme.textContent = gate.theme;
    theme.style.color = "#9BA9C8";
    theme.style.fontSize = "13px";
    gateBox.appendChild(theme);

    // Książki
    gate.books.forEach((book) => {
      const bookEl = document.createElement("div");
      bookEl.style.display = "flex";
      bookEl.style.alignItems = "center";
      bookEl.style.gap = "10px";
      bookEl.style.background = "rgba(255,255,255,0.05)";
      bookEl.style.padding = "8px";
      bookEl.style.margin = "8px 0";
      bookEl.style.borderRadius = "10px";
      bookEl.style.cursor = "pointer";

      // okładka
      const img = document.createElement("img");
      img.src = book.cover || "";
      img.alt = book.title;
      img.style.width = "60px";
      img.style.height = "90px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "6px";
      img.style.border = "1px solid rgba(255,255,255,0.1)";
      bookEl.appendChild(img);

      // główna sekcja
      const info = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = book.title;
      title.style.color = "#E9F4FF";
      title.style.fontSize = "15px";
      title.style.margin = "0";
      info.appendChild(title);

      const desc = document.createElement("p");
      desc.textContent = book.description;
      desc.style.color = "#9BA9C8";
      desc.style.fontSize = "12px";
      desc.style.margin = "4px 0";
      info.appendChild(desc);

      // audio player
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = book.audio;
      audio.style.width = "100%";
      audio.style.marginTop = "4px";
      info.appendChild(audio);

      bookEl.appendChild(info);
      gateBox.appendChild(bookEl);
    });

    root.appendChild(gateBox);
  });
}

/* =====================================
   INIT
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderWorld(window.DATA);
  console.log("🌀 ŚWIAT I — PSYCHE / INTERSEEKER załadowany.");
});
