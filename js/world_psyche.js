/* =====================================
   ETERNIVERSE — WORLD I: PSYCHE / INTERSEEKER v4.5
   Architekt: Maciej Maciuszek + AI Assistant
   PEŁNY POPRAWIONY – kompatybilny z engine_loader v2.2
   ===================================== */

(function() {
  // Singleton IIFE – wykonuje się tylko raz
  if (typeof window.WORLD_PSYCHE !== 'undefined') {
    console.log("🌌 WORLD_PSYCHE v4.5 już załadowany – pomijam.");
    return;
  }

  console.log("🌌 Ładowanie WORLD_PSYCHE v4.5 – 10 bram PSYCHE...");

  window.WORLD_PSYCHE = {
    id: 1,
    name: "ŚWIAT I — PSYCHE / INTERSEEKER",
    description: "Świat wejścia w psychikę. Przestrzeń prawdy o naturze jaźni. Kronika Cienia i Woli.",
    version: "4.5",
    
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
            cover: "https://img.wattpad.com/cover/405617436-288-k446508.jpg",
            audio: "media/audio/interseeker_ch1.mp3",
            chapters: [],
            created: "2026-01-10"
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

  // AUTOMATYCZNA NAPRAWA DANYCH (bezpiecznik)
  function fixDataIntegrity() {
    window.WORLD_PSYCHE.gates.forEach(gate => {
      if (!Array.isArray(gate.books)) gate.books = [];
      gate.books.forEach(book => {
        if (!book.cover || book.cover.trim() === "") {
          book.cover = "media/covers/default.jpg";
        }
        if (!book.chapters) book.chapters = [];
        if (!book.status) book.status = "idea";
        if (!book.description) book.description = "";
      });
    });
  }

  fixDataIntegrity();
  
  // STATYSTYKI dla debug
  const totalBooks = window.WORLD_PSYCHE.gates.reduce((sum, gate) => sum + gate.books.length, 0);
  
  console.log(`✅ WORLD_PSYCHE v4.5 załadowany!`);
  console.log(`📊 10 bram | ${totalBooks} książek | 1 Wattpad + lokalne pliki`);
  console.log(`🎨 Kolory: teal→gold→red→purple→green→orange→blue→pink→violet→gold`);

})();
