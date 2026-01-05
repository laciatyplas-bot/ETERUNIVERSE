/* =========================
   ETERNIVERSE — APP CORE
   ========================= */

const DATA = {
  system: "ETERNIVERSE",
  version: "3.0",
  architect: "Maciej Maciuszek",
  worlds: [
    {
      id: "core",
      name: "ETERUNIVERSE — RDZEŃ",
      description: "Mapa przejścia: ból → świadomość → wola → obfitość → integracja",
      gates: [
        {
          id: 1,
          name: "BRAMA I — INTERSEEKER",
          color: "#28D3C6",
          sub: "Psychika · Cień · Trauma",
          books: [
            {
              title: "InterSeeker – Atlas Wewnętrzny",
              status: "WYDANE",
              cover: "",
              content: "Mapa wejścia w psychikę. Konfrontacja z cieniem."
            },
            {
              title: "ShadowSeeker – Anatomia Cienia",
              status: "GOTOWE",
              cover: "",
              content: "Praca z mrokiem jako źródłem mocy."
            }
          ]
        },
        {
          id: 2,
          name: "BRAMA II — ETERSEEKER",
          color: "#D9A441",
          sub: "Wola · Pole · Architektura",
          books: [
            {
              title: "EterSeeker – Architektura Woli",
              status: "W TRAKCIE",
              cover: "",
              content: "System budowania rzeczywistości przez wolę."
            }
          ]
        },
        {
          id: 3,
          name: "BRAMA III — OBFITOSEEKER",
          color: "#12C65B",
          sub: "Obfitość · Przepływ · Materia",
          books: [
            {
              title: "ObfitoSeeker – Kod Obfitości",
              status: "WYDANE",
              cover: "",
              content: "Reguły gry materii i przepływu."
            }
          ]
        }
      ]
    }
  ]
};

/* ===== ELEMENTY ===== */

const worldList = document.getElementById("worldList");
const contentArea = document.getElementById("contentArea");
const logEl = document.getElementById("log");

/* ===== LOG ===== */

function log(msg){
  const time = new Date().toLocaleTimeString();
  logEl.textContent += `[${time}] ${msg}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

/* ===== RENDER ===== */

function renderWorlds(){
  DATA.worlds.forEach(world => {
    const btn = document.createElement("button");
    btn.className = "world-btn";
    btn.textContent = world.name;
    btn.onclick = () => openWorld(world);
    worldList.appendChild(btn);
  });
  log("ŚWIATY ZAŁADOWANE");
}

function openWorld(world){
  contentArea.innerHTML = `
    <h1 style="color:#D9A441;margin-bottom:20px;">${world.name}</h1>
    <p style="opacity:.8;margin-bottom:40px;">${world.description}</p>
  `;

  world.gates.forEach(gate => renderGate(gate));
  log(`OTWARTO ŚWIAT: ${world.name}`);
}

function renderGate(gate){
  const div = document.createElement("div");
  div.className = "gate";
  div.style.borderLeftColor = gate.color;

  div.innerHTML = `
    <h2 style="color:${gate.color};">${gate.name}</h2>
    <div class="sub">${gate.sub}</div>
  `;

  gate.books.forEach(book => {
    const b = document.createElement("div");
    b.className = "book";
    b.innerHTML = `
      <div class="book-cover" style="background-image:url('${book.cover || ""}')"></div>
      <div>
        <div class="book-title">${book.title}</div>
        <div class="book-status">${book.status}</div>
      </div>
    `;
    b.onclick = () => openBook(book);
    div.appendChild(b);
  });

  contentArea.appendChild(div);
}

function openBook(book){
  contentArea.innerHTML = `
    <h1 style="color:#FFB14B;">${book.title}</h1>
    <p style="opacity:.7;margin-bottom:20px;">Status: ${book.status}</p>
    <p style="line-height:1.7;font-size:18px;">${book.content}</p>
    <br><br>
    <button class="btn btn-gold" onclick="renderWorlds();contentArea.innerHTML=''">
      ⬅ POWRÓT
    </button>
  `;
  log(`OTWARTO KSIĄŻKĘ: ${book.title}`);
}

/* ===== START ===== */

document.addEventListener("DOMContentLoaded", () => {
  renderWorlds();
  log(`SYSTEM ${DATA.system} v${DATA.version} GOTOWY`);
});