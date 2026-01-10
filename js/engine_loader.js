/* =====================================
   ETERNIVERSE ENGINE LOADER v2.3 – PEŁNY KOD 1:1
   Architekt: Maciej Maciuszek + AI Assistant
   Wszystkie silniki: core + book + chapters + console
   ===================================== */

(function () {
  // Singleton – kod wykonuje się TYLKO RAZ
  if (window.enginesLoaded) {
    console.log("🚀 Silniki ETERNIVERSE v2.3 już załadowane");
    return;
  }
  window.enginesLoaded = true;

  // POPRAWNA KOLEJNOŚĆ SILNIKÓW (krytyczna!)
  const ENGINES = [
    "js/world_psyche.js",     // 1️⃣ DANE – window.WORLD_PSYCHE (10 bram)
    "js/core.js",             // 2️⃣ RENDER + UI + initEterniverse()
    "js/book_editor.js",      // 3️⃣ ✏️🗑️ CRUD + modal actions
    "js/chapters_init.js",    // 4️⃣ AUTOMATYCZNE ROZDZIAŁY
    "js/chapter_editor.js",   // 5️⃣ 📖 MODAL ROZDZIAŁÓW
    "js/eter_console.js"      // 6️⃣ DEV TOOLS (Ctrl + `)
  ];

  function loadEngine(i = 0) {
    // KONIEC ŁADOWANIA = SUKCES
    if (i >= ENGINES.length) {
      console.log("✅ Wszystkie silniki ETERNIVERSE v2.3 załadowane!");
      
      // START GŁÓWNY – core.js musi być gotowy
      if (typeof window.initEterniverse === "function") {
        console.log("🌌 Uruchamiam initEterniverse...");
        window.initEterniverse();
      } else {
        console.error("❌ initEterniverse() nie istnieje – sprawdź js/core.js");
        showError("Core engine niezaładowany. Sprawdź konsolę F12.");
      }

      // Usuń loading screen
      const loading = document.querySelector('.loading');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 300);
      }
      return;
    }

    const src = ENGINES[i];

    // SKIP jeśli już załadowany
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`⏭️  Pomijam (już załadowany): ${src}`);
      loadEngine(i + 1);
      return;
    }

    // ŁADUJ NOWY SILNIK
    const script = document.createElement("script");
    script.src = src;
    script.async = false; // SEKWENCYJNE – WAŻNE!

    script.onload = () => {
      console.log(`✅ Załadowano: ${src}`);
      loadEngine(i + 1);
    };

    script.onerror = () => {
      console.warn(`⚠️  BRAK pliku: ${src} – KONTYNUUJĘ...`);
      loadEngine(i + 1); // NIGDY NIE ZATRZYMUJ SYSTEMU
    };

    document.head.appendChild(script);
  }

  // POKAŻ BŁĄD NA EKRANIE (fallback)
  function showError(msg) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div id="error-message" style="
          display: block; 
          color: #ff6b6b; 
          text-align: center; 
          padding: 3rem; 
          background: rgba(255,107,107,0.1);
          border-radius: 12px;
          border: 1px solid #ff6b6b;
          max-width: 600px;
          margin: 2rem auto;
        ">
          <h2>🚨 Błąd inicjalizacji</h2>
          <p>${msg}</p>
          <p><strong>F12 → Console → sprawdź błędy ładowania JS</strong></p>
          <details>
            <summary>Debug info (ładowane pliki)</summary>
            <pre>${ENGINES.map((s, i) => `${i+1}. ${s}`).join('\n')}</pre>
          </details>
        </div>
      `;
    }
  }

  // START AUTOMATYCZNY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log("🌌 ETERNIVERSE v2.3 – MASTER LOADER START");
      setTimeout(loadEngine, 50); // Lekkie opóźnienie dla stabilności
    });
  } else {
    console.log("🌌 ETERNIVERSE v2.3 – MASTER LOADER START");
    loadEngine();
  }
})();
