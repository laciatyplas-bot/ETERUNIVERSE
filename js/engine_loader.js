// js/engine_loader.js – Bezpieczne ładowanie silników ETERNIVERSE (v2.0 – odporny na wielokrotne wykonanie)

(function () {
  // Zapobieganie wielokrotnemu uruchomieniu (singleton)
  if (window.enginesLoaded) {
    console.log("Silniki już załadowane – pomijam ponowne wykonanie.");
    return;
  }
  window.enginesLoaded = true;

  const ENGINES = [
    "js/world_psyche.js",
    "js/core.js",
    "js/book_editor.js",
    "js/eter_console.js"
    // Dodaj tu kolejne pliki JS jeśli pojawią się nowe
  ];

  function loadEngine(i = 0) {
    if (i >= ENGINES.length) {
      console.log("✅ Wszystkie silniki ETERNIVERSE załadowane pomyślnie.");
      // Uruchom główną funkcję inicjalizacyjną (jeśli istnieje)
      if (typeof window.initEterniverse === "function") {
        window.initEterniverse();
      } else {
        console.warn("Funkcja initEterniverse nie została znaleziona – sprawdź core.js");
      }
      return;
    }

    const src = ENGINES[i];

    // Sprawdź, czy skrypt już nie jest załadowany (unikamy duplikatów)
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`Pomijam już załadowany: ${src}`);
      loadEngine(i + 1);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    script.onload = () => {
      console.log(`⚙️ Załadowano pomyślnie: ${src}`);
      loadEngine(i + 1);
    };

    script.onerror = () => {
      console.error(`❌ Błąd ładowania: ${src} – plik nie istnieje lub ścieżka jest błędna`);
      // Kontynuujemy mimo błędu, żeby nie zatrzymywać całego łańcucha
      loadEngine(i + 1);
    };

    document.head.appendChild(script);
  }

  console.log("🌌 Rozpoczynam sekwencyjne ładowanie silników ETERNIVERSE...");
  loadEngine();
})();
