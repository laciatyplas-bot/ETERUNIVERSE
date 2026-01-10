// =============================================
// 🔥 ETERNIVERSE ENGINE LOADER — Maciej Maciuszek
// =============================================
// Ładuje silniki w odpowiedniej kolejności:
// 1. world_psyche.js
// 2. core.js
// 3. book_editor.js
// 4. eter_console.js
// =============================================

const ENGINES = [
  "js/world_psyche.js",
  "js/core.js",
  "js/book_editor.js",
  "js/eter_console.js"
];

function loadEnginesSequentially(index = 0) {
  if (index >= ENGINES.length) {
    console.log("✅ Wszystkie silniki załadowane — ETERNIVERSE gotowy.");
    if (typeof initEterniverse === "function") {
      initEterniverse();
    } else {
      console.warn("⚠️ initEterniverse() nie znaleziono — sprawdź core.js.");
    }
    return;
  }

  const script = document.createElement("script");
  script.src = ENGINES[index];
  script.onload = () => {
    console.log(`⚙️ Załadowano: ${ENGINES[index]}`);
    loadEnginesSequentially(index + 1);
  };
  script.onerror = () => {
    console.error(`❌ Nie udało się załadować: ${ENGINES[index]}`);
  };
  document.head.appendChild(script);
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("🌌 Inicjalizacja ETERNIVERSE...");
  loadEnginesSequentially();
});
