// js/engine_loader.js – Bezpieczne ładowanie silników ETERNIVERSE (v2.1 – singleton + debug + kontynuacja przy błędzie)

(function () {
  // Singleton – kod wykonuje się tylko raz (nawet przy wielokrotnym include)
  if (window.enginesLoaded) {
    console.log("Silniki już załadowane – pomijam ponowne wykonanie.");
    return;
  }
  window.enginesLoaded = true;

  // Lista silników – kolejność ważna!
  const ENGINES = [
    "js/world_psyche.js",     // Dane świata (najpierw!)
    "js/core.js",             // Główny engine + render
    "js/book_editor.js",      // Edycja/usuwanie książek
    "js/eter_console.js"      // Konsola deweloperska
    // Dodaj tu nowe pliki w przyszłości, np. "js/chapter_manager.js"
  ];

  function loadEngine(i = 0) {
    if (i >= ENGINES.length) {
      console.log("✅ Wszystkie silniki załadowane pomyślnie.");
      
      // Uruchom główną funkcję inicjalizacyjną (z core.js)
      if (typeof window.initEterniverse === "function") {
        window.initEterniverse();
      } else {
        console.warn("⚠️ Funkcja initEterniverse nie znaleziona – sprawdź core.js");
      }

      // Usuń loading po sukcesie
      const loading = document.querySelector('.loading');
      if (loading) loading.remove();

      return;
    }

    const src = ENGINES[i];

    // Nie ładuj ponownie tego samego pliku
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
      console.error(`❌ Błąd ładowania: ${src} – plik nie istnieje lub ścieżka błędna`);
      // Kontynuuj mimo błędu – nie zatrzymuj całego systemu
      loadEngine(i + 1);
    };

    document.head.appendChild(script);
  }

  console.log("🌌 Rozpoczynam sekwencyjne ładowanie silników ETERNIVERSE...");
  loadEngine();
})();
