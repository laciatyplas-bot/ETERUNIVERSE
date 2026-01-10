// js/engine_loader.js – Bezpieczne ładowanie silników (wersja odporna na wielokrotne wykonanie)

if (window.enginesLoaded) {
  console.log("Silniki już załadowane – pomijam");
} else {
  window.enginesLoaded = true;

  const ENGINES = [
    "js/world_psyche.js",
    "js/core.js",
    "js/book_editor.js",
    "js/eter_console.js"
    // Dodaj kolejne jeśli potrzeba
  ];

  function loadEnginesSequentially(i = 0) {
    if (i >= ENGINES.length) {
      console.log("✅ Wszystkie silniki ETERNIVERSE załadowane.");
      if (typeof initEterniverse === "function") initEterniverse();
      return;
    }

    const s = document.createElement("script");
    s.src = ENGINES[i];
    s.onload = () => {
      console.log(`⚙️ Załadowano: ${ENGINES[i]}`);
      loadEnginesSequentially(i + 1);
    };
    s.onerror = () => console.error(`❌ Nie można załadować ${ENGINES[i]}`);
    document.head.appendChild(s);
  }

  console.log("🌌 Start ładowania silników...");
  loadEnginesSequentially();
}
