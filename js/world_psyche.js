/* =====================================
   ETERNIVERSE — ŚWIAT I: PSYCHE / INTERSEEKER
   Architekt: Maciej Maciuszek
   ===================================== */

window.WORLD_PSYCHE = {
  id: 1,
  name: "ŚWIAT I — PSYCHE / INTERSEEKER",
  description:
    "Pierwszy świat ETERNIVERSE — wejście w psychikę, prawdę, cień i wolę. Tutaj rozpoczyna się Kronika Woli.",

  gates: [
    {
      id: 1,
      name: "BRAMA I — INTERSEEKER",
      sub: "Psychika · Cień · Pamięć · Trauma",
      color: "#28D3C6",
      books: [
        { title: "InterSeeker — Atlas Wewnętrzny", status: "published", cover: "media/covers/interseeker.jpg", audio: "media/audio/interseeker_ch1.mp3" },
        { title: "ShadowSeeker — Anatomia Cienia", status: "ready", cover: "media/covers/shadowseeker.jpg", audio: "media/audio/shadowseeker_ch1.mp3" },
        { title: "MemorySeeker — Archeologia Wspomnień", status: "writing", cover: "media/covers/memoryseeker.jpg" },
        { title: "BólSeeker — Anatomia Rany", status: "draft" }
      ]
    },
    {
      id: 2,
      name: "BRAMA II — CUSTOS / GENEZA",
      sub: "Strażnik · Rdzeń · Początek",
      color: "#FF6B6B",
      books: [
        { title: "Geneza", status: "ready" },
        { title: "Custos: Kodeks Głębi", status: "writing" }
      ]
    },
    {
      id: 3,
      name: "BRAMA III — ETERSEEKER",
      sub: "Wola · Pole · Architektura",
      color: "#D9A441",
      books: [
        { title: "EterSeeker — Księga Zakazana (Tom Zero)", status: "published" },
        { title: "EterSeeker — Architektura Woli", status: "ready" },
        { title: "PoleSeeker — Topologia Ludzkiego Pola", status: "writing" }
      ]
    },
    {
      id: 4,
      name: "BRAMA IV — ARCHETYPY / WOLA",
      sub: "Konstrukcja · Role · Przeznaczenie",
      color: "#9B6BFF",
      books: [
        { title: "ArchetypSeeker — System Archetypów Eteru", status: "ready" },
        { title: "WolaSeeker — Kwant Woli", status: "draft" },
        { title: "Kronika Woli", status: "idea" }
      ]
    },
    {
      id: 5,
      name: "BRAMA V — OBFITOSEEKER",
      sub: "Materia · Przepływ · Manifestacja",
      color: "#12C65B",
      books: [
        { title: "ObfitoSeeker — Kod Obfitości", status: "published" },
        { title: "MateriaSeeker — Przewodnik Ciała i Przepływu", status: "ready" },
        { title: "Księga Przepływu", status: "writing" }
      ]
    },
    {
      id: 6,
      name: "BRAMA VI — BIOSEEKER",
      sub: "Ciało · Biologia · Regulacja",
      color: "#FFB14B",
      books: [
        { title: "BioSeeker — Sekret Biologii Pola", status: "ready" },
        { title: "Ciało jako Interfejs Pola", status: "draft" },
        { title: "RytmSeeker — Mechanika Ruchu Życia", status: "idea" }
      ]
    },
    {
      id: 7,
      name: "BRAMA VII — SPLĄTANIE / AI",
      sub: "Obserwator · Meta-tożsamość · Technologia",
      color: "#5DADE2",
      books: [
        { title: "SplatanieSeeker — Protokół Obserwatora", status: "writing" },
        { title: "InterfejsSeeker — Interfejs Świadomości", status: "ready" },
        { title: "Protokół Splątania (wersja meta)", status: "draft" }
      ]
    },
    {
      id: 8,
      name: "BRAMA VIII — TRAJEKTORIE",
      sub: "Kod Życia · Linie Czasu · Fizyka Duszy",
      color: "#FF9FF3",
      books: [
        { title: "TrajektoriaSeeker — Mapa Linii Życia", status: "published" },
        { title: "QuantumSeeker — Fizyka Duszy", status: "ready" },
        { title: "CzasSeeker — Fizyka Linii Czasu", status: "writing" }
      ]
    },
    {
      id: 9,
      name: "BRAMA IX — ETERNIONY / KOLEKTYW",
      sub: "Węzły Pola · Wspólnota · Misja",
      color: "#667eea",
      books: [
        { title: "Eteriony — Tom I", status: "ready" },
        { title: "Eteriony — Tom II", status: "draft" },
        { title: "Mapa Uniwersum Eteru", status: "idea" }
      ]
    },
    {
      id: 10,
      name: "BRAMA X — ETERUNIVERSE",
      sub: "Integracja · Jedność · Architekt",
      color: "#D9A441",
      books: [
        { title: "Architekt Eteru — Manifest Twórcy", status: "writing" },
        { title: "Mapa Trajektorii Życia (rozszerzona)", status: "ready" }
      ]
    }
  ]
};
