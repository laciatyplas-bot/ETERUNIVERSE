/* =====================================
   ETERNIVERSE — CHAPTER INIT v1.0
   Automatycznie wczytuje ROZDZIAŁY przy starcie
   ===================================== */

(function() {
  // Singleton – tylko raz
  if (window.chaptersInitLoaded) return;
  window.chaptersInitLoaded = true;

  console.log("📖 Chapter Init v1.0 – automatyczne wczytywanie rozdziałów...");

  // Czekaj na WORLD_PSYCHE
  function init() {
    if (!window.WORLD_PSYCHE) {
      setTimeout(init, 100);
      return;
    }

    loadChapters();
  }

  function loadChapters() {
    const world = window.WORLD_PSYCHE;
    
    // === ROZDZIAŁY DO WCZYTANIA ===
    const ROZDZIAŁY = {
      // Brama 1 → InterSeeker (książka 0)
      0: [
        { title: "Rozdział 1: Pierwsze pęknięcie", content: "Iluzja ego pęka pod naporem prawdy...", status: "written" },
        { title: "Rozdział 2: Mechanizmy obronne", content: "Denial, projekcja, racjonalizacja – pełna analiza.", status: "draft" },
        { title: "Rozdział 3: Cień wychodzi", content: "Pierwsze spotkanie z tym, co wyparto.", status: "idea" }
      ],
      // Brama 1 → ShadowSeeker (książka 1)
      1: [
        { title: "Rozdział 1: Anatomia agresji", content: "Agresja jako strażnik ran i mechanizm ochronny.", status: "written" },
        { title: "Rozdział 2: Wstyd i kontrola", content: "Mechanizmy kontroli przez wstyd i perfekcjonizm.", status: "written" }
      ],
      // Brama 3 → EterSeeker (książka 0)
      2: [
        { title: "Rozdział 1: Pole eteru", content: "Podstawy architektury pola świadomości.", status: "ready" },
        { title: "Rozdział 2: Protokoły woli", content: "Pierwsze prawa manifestacji w eterze.", status: "draft" }
      ]
    };

    // === WCZYTAJ ROZDZIAŁY ===
    Object.keys(ROZDZIAŁY).forEach(bookIndex => {
      const gateIndex = Math.floor(parseInt(bookIndex) / 10); // Brama
      const localBookIndex = parseInt(bookIndex) % 10;        // Książka w bramie
      
      if (world.gates[gateIndex]?.books[localBookIndex]) {
        world.gates[gateIndex].books[localBookIndex].chapters = ROZDZIAŁY[bookIndex];
        console.log(`📚 Brama ${gateIndex+1}, książka ${localBookIndex}: ${ROZDZIAŁY[bookIndex].length} rozdziałów`);
      }
    });

    // === ZAPISZ DO LOCALSTORAGE ===
    localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", JSON.stringify(world));
    
    console.log("✅ 5+ rozdziałów automatycznie wczytanych i zapisanych!");
    
    // Belle
    if (typeof window.belleSpeak === 'function') {
      window.belleSpeak("📖 Rozdziały zainicjowane – InterSeeker, ShadowSeeker, EterSeeker gotowe.");
    }
  }

  // START
  init();
})();
