export const WORLD_PSYCHE = {
  id: "world_psyche",
  name: "ŚWIAT I — PSYCHE / INTERSEEKER",
  description:
    "Świat introspekcji, cienia i pamięci. Pierwszy wymiar przebudzenia Woli.",
  gates: [
    {
      id: "gate_1",
      name: "BRAMA I — INTERSEEKER",
      color: "#28D3C6",
      theme: "Psychika · Cień · Trauma · Tożsamość",
      books: [
        {
          id: "book_1_1",
          title: "InterSeeker — Atlas Wewnętrzny",
          cover: "media/covers/interseeker.jpg",
          description:
            "Mapa wnętrza człowieka. Mechanizmy obronne i fałszywe ja. Pierwsze pęknięcie iluzji.",
          chapters: [
            {
              title: "Rozdział 1 — Początek",
              audio: "media/audio/interseeker_ch1.mp3"
            },
            {
              title: "Rozdział 2 — Mechanizmy",
              audio: "media/audio/interseeker_ch2.mp3"
            }
          ]
        },
        {
          id: "book_1_2",
          title: "ShadowSeeker — Anatomia Cienia",
          cover: "media/covers/shadowseeker.jpg",
          description:
            "Praca z cieniem bez duchowej ściemy. Wstyd, agresja, tabu jako energia transformacji.",
          chapters: [
            {
              title: "Rozdział 1 — Wprowadzenie",
              audio: "media/audio/shadowseeker_ch1.mp3"
            }
          ]
        },
        {
          id: "book_1_3",
          title: "MemorySeeker — Archeologia Wspomnień",
          cover: "media/covers/memoryseeker.jpg",
          description:
            "Rozkodowanie pamięci i traum. Odkrywanie przeszłości jako kodu Woli.",
          chapters: []
        }
      ]
    },
    {
      id: "gate_2",
      name: "BRAMA II — MEMORY SEEKER",
      color: "#1FB5A5",
      theme: "Pamięć · Archeologia Wspomnień",
      books: []
    }
  ]
};
