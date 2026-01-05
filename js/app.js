// app.js — ETERNIVERSE PRO MASTER v2.0 — FULL MASTER Z 10 BRAMAMI + WORLDS
// Architekt: Maciej Maciuszek + Grok updates | Data: 05 stycznia 2026

class Eterniverse {
  constructor() {
    this.VERSION = '2.0';
    this.STORAGE_KEY = 'eterniverse-pro-master-v2.0';
    this.data = { meta: { version: this.VERSION }, gates: [], worlds: [] };
    this.mode = 'ARCHITEKT';
    this.elements = {};
    this.editContext = null;
    this.init();
  }

  init() {
    this.cacheElements();
    this.loadData();
    this.render();
    this.removeLoadingScreen();
    this.bindGlobalEvents();
    console.log('ETERNIVERSE PRO MASTER v2.0 — FULLY LOADED');
  }

  getDefaultData() {
    return {
      meta: { version: this.VERSION },
      worlds: [
        {
          id: 1,
          name: "Świat 1 — INTERSEEKER",
          desc: "Core Psyche · Wewnętrzna podróż · Integracja cienia",
          books: [1, 2, 3, 4, 5, 6, 7]
        },
        {
          id: 2,
          name: "Świat 2 — POLARIS / ETER",
          desc: "Wola · Pole · Architektura rzeczywistości · Ekspansja",
          books: [8, 9, 10]
        }
      ],
      gates: [
        {
          id: 1, name: "BRAMA I — INTERSEEKER", sub: "Psychika · Cień · Trauma · Mechanizmy przetrwania", tag: "CORE / PSYCHE",
          books: [{ title: "InterSeeker – Atlas Wewnętrzny", status: "published", desc: "Podróż w głąb psyche, która rozbiera cię do kości i zmusza, byś zobaczył, kim naprawdę jesteś.", cover: "", content: "", audio: [] }]
        },
        {
          id: 2, name: "BRAMA II — SHADOWSEEKER", sub: "Cień · Nieakceptowane aspekty · Integracja mroku", tag: "PSYCHE / SHADOW",
          books: [{ title: "ShadowSeeker – Anatomia Cienia", status: "published", desc: "To, czego w sobie unikasz, jest kluczem do pełnej mocy.", cover: "", content: "", audio: [] }]
        },
        {
          id: 3, name: "BRAMA III — MEMORYSEEKER", sub: "Pamięć · Archeologia wspomnień · Przeszłość jako ster", tag: "PSYCHE / MEMORY",
          books: [{ title: "MemorySeeker – Archeologia Wspomnień", status: "published", desc: "Pamięć jako mechanizm sterujący przyszłością.", cover: "", content: "", audio: [] }]
        },
        {
          id: 4, name: "BRAMA IV — SELFSPLIT SEEKER", sub: "Tożsamość · Rozszczepienie · Integracja części", tag: "PSYCHE / IDENTITY",
          books: [{ title: "SelfSplit Seeker – Rozszczepienie Tożsamości", status: "ready", desc: "Integracja pękniętej tożsamości.", cover: "", content: "", audio: [] }]
        },
        {
          id: 5, name: "BRAMA V — RELIGIOSEEKER", sub: "Duchowość · Bez dogmatów · Poszukiwanie sensu", tag: "PSYCHE / SPIRIT",
          books: [{ title: "ReligioSeeker – Droga Bez Religii", status: "ready", desc: "Duchowość bez dogmatów.", cover: "", content: "", audio: [] }]
        },
        {
          id: 6, name: "BRAMA VI — BIOSEEKER", sub: "Biologia · Pole · Ciało jako interfejs", tag: "TRANSITION / BODY-FIELD",
          books: [{ title: "BioSeeker – Sekret Biologii Pola", status: "ready", desc: "Biologia jako interfejs pola.", cover: "", content: "", audio: [] }]
        },
        {
          id: 7, name: "BRAMA VII — BÓLSEEKER", sub: "Rana · Ból jako nauczyciel · Fundament transformacji", tag: "PSYCHE / PAIN",
          books: [{ title: "BólSeeker – Anatomia Rany", status: "writing", desc: "Rana jako fundament.", cover: "", content: "", audio: [] }]
        },
        {
          id: 8, name: "BRAMA VIII — ETERSEEKER", sub: "Wola · Architektura rzeczywistości · Projektowanie", tag: "ETER / WILL",
          books: [{ title: "EterSeeker – Architektura Woli", status: "ready", desc: "Projektowanie rzeczywistości.", cover: "", content: "", audio: [] }]
        },
        {
          id: 9, name: "BRAMA IX — ETERSEEKER", sub: "Księga Woli · Struktura światła · Spójność z polem", tag: "ETER / MAGNUM OPUS",
          books: [
            { title: "EterSeeker – Księga Woli", status: "ready", desc: "Wola w spójności z polem.", cover: "", content: "", audio: [] },
            { title: "EterSeeker – Kronika Woli", status: "ready", desc: "Magnum opus woli i pola.", cover: "", content: "", audio: [] }
          ]
        },
        {
          id: 10, name: "BRAMA X — WOLASEEKER", sub: "Kwant woli · Mikrodecyzje · Makroskutki", tag: "ETER / QUANTUM",
          books: [
            { title: "WolaSeeker – Kwant Woli", status: "writing", desc: "Mikrodecyzje o makroskutkach.", cover: "", content: "", audio: [] },
            { title: "Polaris – Echo pod Lodem", status: "writing", desc: "Nowa warstwa rzeczywistości – świat 2 w budowie.", cover: "", content: "", audio: [] }
          ]
        }
      ]
    };
  }

  // Reszta kodu (loadData, saveData, render, modale itp.) – identyczna jak w oryginalnym app.js v1.3
  // (skopiuj z twojego obecnego app.js od loadData() w dół – działa bez zmian)

  loadData() { /* ... oryginalny kod ... */ }
  saveData() { /* ... */ }
  render() { /* ... używa this.data.gates i opcjonalnie worlds do statystyk ... */ }
  // ... reszta klasy bez zmian
}

// Start
window.master = new Eterniverse();
