/* ============================
   ETHERUNIVERSE — WORLD I
   ŚWIAT I: INTERSEEKER
   Architekt: Maciej Maciuszek
   ============================ */

const DATA = {
  system: "ETHERUNIVERSE",
  version: "1.0",
  architect: "Maciej Maciuszek",

  worlds: [
    {
      id: "world_1",
      name: "ŚWIAT I — INTERSEEKER",
      description:
        "Świat wejścia w psychikę. Rozpad iluzji, konfrontacja z cieniem, pamięcią i tożsamością. Nie rozwój — tylko prawda.",

      gates: [
        {
          id: "gate_1",
          name: "BRAMA I — INTERSEEKER",
          color: "#28D3C6", // turkus eteru
          theme: "Psychika · Cień · Trauma · Tożsamość",
          systemRole:
            "Brama wejścia. Odpowiada za uświadomienie mechanizmów przetrwania, fałszywego ja i bólu zapisanego w pamięci.",

          books: [
            {
              id: "interseeker_atlas",
              title: "InterSeeker — Atlas Wewnętrzny",
              trilogy: true,
              description:
                "Mapa wnętrza człowieka. Mechanizmy obronne, fałszywa tożsamość, pierwsze pęknięcie iluzji."
            },
            {
              id: "shadowseeker",
              title: "ShadowSeeker — Anatomia Cienia",
              trilogy: true,
              description:
                "Praca z cieniem bez duchowej ściemy. Agresja, wstyd, tabu jako paliwo świadomości."
            },
            {
              id: "memoryseeker",
              title: "MemorySeeker — Archeologia Wspomnień",
              trilogy: true,
              description:
                "Rozkodowanie pamięci. Przeszłość jako aktywny system sterowania teraźniejszością."
            },
            {
              id: "selfsplit",
              title: "SelfSplit Seeker — Rozszczepienie Tożsamości",
              trilogy: true,
              description:
                "Moment pęknięcia jaźni. Jak powstaje fałszywe ja i jak je zintegrować."
            },
            {
              id: "bolseeker",
              title: "BólSeeker — Anatomia Rany",
              trilogy: false,
              description:
                "Ból jako wejście, nie kara. Rany jako portale świadomości."
            },
            {
              id: "mirrorseeker",
              title: "MirrorSeeker — Twoje Prawdziwe Odbicie",
              trilogy: false,
              description:
                "Relacje jako lustra. To, co widzisz w innych, jest kodem ciebie."
            },
            {
              id: "underseeker",
              title: "UnderSeeker — Podświadomość, która steruje tobą",
              trilogy: true,
              description:
                "Automaty, skrypty i impulsy, które rządzą decyzjami zanim pomyślisz."
            },
            {
              id: "senseeker",
              title: "SenSeeker — Mechanika Snów",
              trilogy: true,
              description:
                "Sny jako system komunikacji. Instrukcja czytania sygnałów nocnych."
            }
          ]
        }
      ]
    }
  ]
};

/* ============================
   RENDER ENGINE (MINIMAL)
   ============================ */

function renderWorld(world) {
  const root = document.getElementById("app");
  root.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.textContent = world.name;
  root.appendChild(h1);

  const p = document.createElement("p");
  p.textContent = world.description;
  root.appendChild(p);

  world.gates.forEach(gate => {
    const gateBox = document.createElement("div");
    gateBox.style.borderLeft = `6px solid ${gate.color}`;
    gateBox.style.padding = "16px";
    gateBox.style.margin = "24px 0";
    gateBox.style.background = "#0b1624";

    const h2 = document.createElement("h2");
    h2.textContent = gate.name;
    h2.style.color = gate.color;
    gateBox.appendChild(h2);

    const theme = document.createElement("p");
    theme.textContent = gate.theme;
    gateBox.appendChild(theme);

    gate.books.forEach(book => {
      const bookEl = document.createElement("div");
      bookEl.style.padding = "8px";
      bookEl.style.margin = "6px 0";
      bookEl.style.cursor = "pointer";
      bookEl.style.background = "rgba(255,255,255,0.05)";
      bookEl.textContent =
        book.title + (book.trilogy ? " (TRYLOGIA)" : "");

      bookEl.onclick = () => {
        alert(book.description);
      };

      gateBox.appendChild(bookEl);
    });

    root.appendChild(gateBox);
  });
}

/* ============================
   INIT
   ============================ */

document.addEventListener("DOMContentLoaded", () => {
  const world = DATA.worlds[0];
  renderWorld(world);
});
