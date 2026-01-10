const ENGINES = [
  "js/world_psyche.js",
  "js/core.js",
  "js/book_editor.js",
  "js/eter_console.js"
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

window.addEventListener("DOMContentLoaded", () => {
  console.log("🌌 Inicjalizacja ETERNIVERSE...");
  loadEnginesSequentially();
});
