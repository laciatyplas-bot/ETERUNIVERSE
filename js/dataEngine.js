// ==========================================================
//  ETERNIVERSE DATA ENGINE
// ==========================================================
//  Odpowiada za: wczytywanie, zapisywanie, reset danych
// ==========================================================

const LOCAL_KEY = 'eterniverseData';

// 📥 Wczytaj dane z localStorage lub domyślne
export function loadData() {
  let data = localStorage.getItem(LOCAL_KEY);
  if (data) {
    console.log('[DATA] Dane odczytane z localStorage');
    return JSON.parse(data);
  }

  console.log('[DATA] Brak danych — ładuję domyślne bramy');
  return getDefaultData();
}

// 💾 Zapisz dane do localStorage
export function saveData(data) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  console.log('[DATA] Zapisano dane lokalnie');
}

// 🔄 Reset danych
export function resetData() {
  localStorage.removeItem(LOCAL_KEY);
  console.log('[DATA] Dane wyczyszczone');
}

// 📚 Dane startowe
function getDefaultData() {
  return [
    {
      id: 1,
      name: "BRAMA I — INTERSEEKER",
      sub: "Psychika · Cień · Archetyp",
      tag: "CORE / PSYCHE",
      books: [
        {
          title: "InterSeeker – Atlas Wewnętrzny",
          status: "published",
          cover: "https://i.imgur.com/3UDr5kk.jpeg",
          audio: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_5b46f1b123.mp3"
        }
      ]
    },
    {
      id: 2,
      name: "BRAMA II — CUSTOS / GENEZA",
      sub: "Strażnik · Rdzeń · Początek",
      tag: "CORE / ORIGIN",
      books: [
        {
          title: "Geneza",
          status: "ready",
          cover: "https://i.imgur.com/DuBvlOB.jpeg"
        }
      ]
    }
  ];
}
