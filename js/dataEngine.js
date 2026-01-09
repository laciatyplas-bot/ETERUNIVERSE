// ==========================================================
//  ETERNIVERSE DATA ENGINE
// ==========================================================
//  Ten moduł odpowiada za:
//   ✅ wczytywanie danych z localStorage
//   ✅ zapisywanie całej struktury danych (książki, rozdziały)
//   ✅ resetowanie danych do wersji początkowej
// ==========================================================

const STORAGE_KEY = 'eterniverseBooksData_v1';

/**
 * 📦 Ładuje dane z localStorage lub zwraca pustą tablicę,
 * jeśli użytkownik jeszcze nic nie dodał.
 */
export function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      console.log('[DATA ENGINE] Brak danych — tworzenie pustej bazy.');
      return getDefaultData();
    }

    const parsed = JSON.parse(data);
    console.log(`[DATA ENGINE] Załadowano ${parsed.length} książek.`);
    return parsed;
  } catch (err) {
    console.error('[DATA ENGINE] Błąd ładowania danych:', err);
    return getDefaultData();
  }
}

/**
 * 💾 Zapisuje aktualny stan systemu ETERNIVERSE do localStorage.
 */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('[DATA ENGINE] Dane zapisane pomyślnie.');
  } catch (err) {
    console.error('[DATA ENGINE] Błąd zapisu danych:', err);
  }
}

/**
 * ♻️ Usuwa dane z localStorage i przywraca domyślny stan.
 */
export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  console.warn('[DATA ENGINE] Dane zostały zresetowane.');
  return getDefaultData();
}

/**
 * 🌱 Domyślne dane (dla pierwszego uruchomienia).
 * Możesz tutaj dodać przykładowe książki, jeśli chcesz mieć
 * coś na start po instalacji projektu.
 */
function getDefaultData() {
  return [
    {
      title: "InterSeeker – Atlas Wewnętrzny",
      cover: "https://i.imgur.com/3UDr5kk.jpeg",
      status: "published",
      chapters: [
        {
          title: "Rozdział I — Początek Woli",
          desc: "Wprowadzenie do pola świadomości i struktury eteru.",
          audio: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_5b46f1b123.mp3"
        },
        {
          title: "Rozdział II — Cień",
          desc: "Analiza głębokiej psychiki i trajektorii energii.",
          audio: ""
        }
      ]
    },
    {
      title: "EterSeeker — Księga Zakazana (Tom Zero)",
      cover: "",
      status: "writing",
      chapters: [
        {
          title: "Rozdział I — Przebudzenie Eteru",
          desc: "Pierwsze zrozumienie pola wolnej woli.",
          audio: ""
        }
      ]
    }
  ];
}

/**
 * 🔍 Narzędzie debugowe — wypisuje aktualny stan danych.
 */
export function debugDump(data) {
  console.log('%c=== ETERNIVERSE DATA DUMP ===', 'color:#28D3C6;font-weight:bold;');
  console.log(JSON.stringify(data, null, 2));
}
