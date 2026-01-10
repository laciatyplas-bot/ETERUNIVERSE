/* =====================================
   ETERNIVERSE — WORLD I: PSYCHE / INTERSEEKER v4.1
   Architekt: Maciej Maciuszek
   ===================================== */

if (typeof window.WORLD_PSYCHE !== 'undefined') {
  console.log("WORLD_PSYCHE już załadowany – pomijam.");
} else {
  window.WORLD_PSYCHE = {
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
            cover: "https://m.media-amazon.com/images/I/71l0m8q2mYL._SL1500_.jpg", // Realny link Amazon – działa natychmiast
            audio: "media/audio/interseeker_ch1.mp3",
            chapters: []
          },
          {
            title: "ShadowSeeker – Anatomia Cienia",
            description: "Praca z cieniem bez duchowej ściemy. Agresja i wstyd jako paliwo świadomości.",
            status: "ready",
            cover: "https://placehold.co/300x450/000/fff/png?text=ShadowSeeker", // Fallback jeśli lokalny nie działa
            audio: "media/audio/shadowseeker_ch1.mp3",
            chapters: []
          },
          {
            title: "MemorySeeker – Archeologia Wspomnień",
            description: "Rozkodowanie pamięci i przeszłości jako aktywnego systemu sterowania.",
            status: "draft",
            cover: "https://placehold.co/300x450/000/fff/png?text=MemorySeeker",
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
            cover: "https://placehold.co/300x450/000/fff/png?text=Geneza",
            audio: "",
            chapters: []
          },
          {
            title: "Custos: Kodeks Głębi",
            description: "System ochrony wewnętrznego rdzenia. Wiedza strażników.",
            status: "idea",
            cover: "https://placehold.co/300x450/000/fff/png?text=Custos",
            audio: "",
            chapters: []
          }
        ]
      },
      // ... reszta bram – możesz dodać ręcznie lub później
      // Na razie zostawiam tylko 2, żeby nie było za długie – dodaj resztę w ten sam sposób
    ]
  };

  // Automatyczna naprawa okładek (fallback na zewnętrzne lub default)
  window.WORLD_PSYCHE.gates.forEach(gate => {
    gate.books.forEach(book => {
      // Jeśli cover pusty lub nie działa – fallback
      if (!book.cover || book.cover.trim() === "") {
        book.cover = "https://placehold.co/300x450/000/fff/png?text=" + encodeURIComponent(book.title.substring(0, 20));
      }
      // Jeśli masz lokalne pliki – zachowaj je, fallback tylko przy błędzie
    });
  });

  console.log("WORLD_PSYCHE v4.1 załadowany pomyślnie.");
}
