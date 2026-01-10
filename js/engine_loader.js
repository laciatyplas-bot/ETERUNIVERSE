/* =====================================
   ETERNIVERSE ENGINE LOADER v2.5 – PEŁNY KOD 1:1 Z BELLA
   Architekt: Maciej Maciuszek + AI Assistant
   8 SILNIKÓW PRODUCTION READY – WKLEJ 1:1
   ===================================== */

(function () {
  // Singleton – kod wykonuje się TYLKO RAZ
  if (window.enginesLoaded) {
    console.log("🚀 Silniki ETERNIVERSE v2.5 już załadowane");
    return;
  }
  window.enginesLoaded = true;

  // 🚀 PEŁNA KOLEJNOŚĆ 8 SILNIKÓW (KRYTYCZNA!)
  const ENGINES = [
    "js/world_psyche.js",     // 1️⃣ DANE – window.WORLD_PSYCHE (10 bram)
    "js/core.js",             // 2️⃣ RENDER + UI + initEterniverse()
    "js/book_editor.js",      // 3️⃣ ✏️🗑️ CRUD + modal książek
    "js/chapters_init.js",    // 4️⃣ AUTOMATYCZNE ROZDZIAŁY (5+)
    "js/chapter_editor.js",   // 5️⃣ 📖 MODAL ROZDZIAŁÓW (CRUD + drag)
    "js/eter_console.js",     // 6️⃣ DEV TOOLS (Ctrl + `)
    "js/autosave.js",         // 7️⃣ 💾 AUTOZAPIS co 30s + backup
    "js/bella-console.js"     // 8️⃣ 😈🔥 BELLA 8.00 EVOLVER
  ];

  function loadEngine(i = 0) {
    // KONIEC ŁADOWANIA = SUKCES 🎉
    if (i >= ENGINES.length) {
      console.log("✅ Wszystkie 8 silników ETERNIVERSE v2.5 załadowane!");
      
      // START GŁÓWNY – core.js musi być gotowy
      if (typeof window.initEterniverse === "function") {
        console.log("🌌 Uruchamiam initEterniverse...");
        window.initEterniverse();
      } else {
        console.error("❌ initEterniverse() nie istnieje – sprawdź js/core.js");
        showError("Core engine niezaładowany. Sprawdź konsolę F12.");
      }

      // FINALNA AKTYWACJA BELLI
      if (window.BELLA) {
        setTimeout(() => {
          window.BELLA.process("ETERNIWERS v2.5 – wszystkie silniki aktywne");
        }, 1000);
      }

      // Usuń loading screen z animacją
      const loading = document.querySelector('.loading');
      if (loading) {
        loading.style.opacity = '0';
        loading.style.transform = 'scale(0.8)';
        setTimeout(() => loading.remove(), 300);
      }
      
      // FINALNY LOG SUKCESU
      console.log("🚀 ETERNIVERSE v2.5 – PEŁNY SYSTEM Z BELLA AKTYWNY!");
      console.log("📋 Funkcje: Książki ✏️🗑️ | Rozdziały 📖 | Autozapis 💾 | BELLA 😈 | Console 🌀");
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
      console.log(`✅ [${i+1}/8] Załadowano: ${src}`);
      loadEngine(i + 1);
    };

    script.onerror = () => {
      console.warn(`⚠️  [${i+1}/8] BRAK pliku: ${src} – KONTYNUUJĘ...`);
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
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        ">
          <h2>🚨 Błąd inicjalizacji ETERNIVERSE</h2>
          <p>${msg}</p>
          <p><strong>F12 → Console → sprawdź błędy ładowania JS</strong></p>
          <details style="margin-top: 1rem;">
            <summary>📋 Debug info (8 plików do załadowania)</summary>
            <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 8px; font-size: 0.9rem;">${ENGINES.map((s, i) => `${i+1}. ${s}`).join('\n')}</pre>
          </details>
          <p style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
            Sprawdź czy wszystkie pliki są w folderze <code>js/</code>
          </p>
        </div>
      `;
    }
  }

  // START AUTOMATYCZNY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log("🌌 ETERNIVERSE v2.5 – MASTER LOADER START [8 SILNIKÓW]");
      console.log("📋 Ładowanie:", ENGINES.map((s,i) => `${i+1}. ${s}`).join('\n'));
      setTimeout(loadEngine, 50);
    });
  } else {
    console.log("🌌 ETERNIVERSE v2.5 – MASTER LOADER START [8 SILNIKÓW]");
    loadEngine();
  }
})();
