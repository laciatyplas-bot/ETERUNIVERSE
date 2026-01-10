/* =====================================
   ETERNIVERSE ENGINE LOADER v2.6 – WZMACNIANY 9 SILNIKÓW
   Architekt: Maciej Maciuszek + AI Assistant
   100% PRODUCTION READY – MULTIŚWIAT + ERROR RESILIENCE
   ===================================== */

(function () {
  // Singleton – kod wykonuje się TYLKO RAZ
  if (window.enginesLoaded) {
    console.log("🚀 Silniki ETERNIVERSE v2.6 już załadowane");
    return;
  }
  window.enginesLoaded = true;

  // 🚀 PEŁNA KOLEJNOŚĆ 9 SILNIKÓW (KRYTYCZNA!)
  const ENGINES = [
    "js/world_psyche.js",     // 1️⃣ DANE – window.WORLD_PSYCHE (10 bram)
    "js/core.js",             // 2️⃣ RENDER + UI + initEterniverse()
    "js/book_editor.js",      // 3️⃣ ✏️🗑️ CRUD + OKŁADKI v2.3
    "js/chapters_init.js",    // 4️⃣ AUTOMATYCZNE ROZDZIAŁY
    "js/chapter_editor.js",   // 5️⃣ 📖 MODAL ROZDZIAŁÓW (CRUD)
    "js/eter_console.js",     // 6️⃣ DEV TOOLS (Ctrl + `)
    "js/autosave.js",         // 7️⃣ 💾 AUTOZAPIS co 30s + backup
    "js/bella-console.js",    // 8️⃣ 😈🔥 BELLA 8.00 EVOLVER
    "js/multiworld.js"        // 9️⃣ 🌌 MULTIŚWIAT (5 światów + ➕)
  ];

  let loadedCount = 0;
  let errorCount = 0;

  function loadEngine(i = 0) {
    // KONIEC ŁADOWANIA = SUKCES 🎉
    if (i >= ENGINES.length) {
      console.log(`✅ Wszystkie ${loadedCount}/${ENGINES.length} silników ETERNIVERSE v2.6 załadowane! (Błędy: ${errorCount})`);
      
      // FINAL CHECK – core.js musi być gotowy
      if (typeof window.initEterniverse === "function") {
        console.log("🌌 Uruchamiam initEterniverse...");
        try {
          window.initEterniverse();
        } catch (e) {
          console.error("❌ Błąd initEterniverse():", e);
        }
      } else {
        console.error("❌ initEterniverse() nie istnieje – core.js brak/błąd");
        showError("Core engine niezaładowany. Sprawdź konsolę F12.");
      }

      // FINALNA AKTYWACJA BELLI + MULTIŚWIAT
      setTimeout(() => {
        if (window.BELLA) {
          window.BELLA.process("ETERNIWERS v2.6 – 9 silników aktywnych!");
        }
        if (window.MULTIWORLD) {
          console.log("🌌 MultiWorld v3.0 – aktywny");
        }
      }, 1500);

      // Loading screen OUT
      fadeOutLoading();
      
      // FINALNY LOG SUKCESU
      console.log("🚀 ETERNIVERSE v2.6 – PEŁNY SYSTEM AKTYWNY!");
      console.log("📋 Funkcje: ✏️🗑️📖💾😈🌌🌀 | Status: OK");
      return;
    }

    const src = ENGINES[i];

    // SKIP jeśli już załadowany
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`⏭️  [${i+1}/9] Pomijam (już załadowany): ${src}`);
      loadedCount++;
      loadEngine(i + 1);
      return;
    }

    // ŁADUJ SILNIK z WZMACNIANĄ OCHRoną
    const script = document.createElement("script");
    script.src = src;
    script.async = false; // SEKWENCYJNE – WAŻNE!
    script.dataset.engineIndex = i + 1;
    script.onerror = (e) => {
      console.warn(`⚠️  [${i+1}/9] BŁĄD ładowania: ${src}`);
      errorCount++;
      loadedCount++; // Liczy się jako "załadowany" (pominięty)
      
      // Graceful degradation – NIGDY NIE ZATRZYMUJ SYSTEMU
      if (window.ETER_CONSOLE) {
        window.ETER_CONSOLE.log(`BRAK: ${src} – system kontynuuje`);
      }
      loadEngine(i + 1);
    };

    script.onload = () => {
      loadedCount++;
      console.log(`✅ [${i+1}/9] Załadowano: ${src}`);
      
      // Callback dla każdego silnika
      try {
        if (window[`onEngine${i+1}Loaded`]) {
          window[`onEngine${i+1}Loaded`]();
        }
      } catch (e) {
        console.warn(`onEngine${i+1}Loaded() error:`, e);
      }
      
      loadEngine(i + 1);
    };

    document.head.appendChild(script);
  }

  // === WZMACNIANE USUWANIE LOADING SCREEN ===
  function fadeOutLoading() {
    const loading = document.querySelector('.loading, #loading, .loader');
    if (loading) {
      loading.style.transition = 'all 0.5s ease-out';
      loading.style.opacity = '0';
      loading.style.transform = 'scale(0.8) rotate(180deg)';
      loading.style.visibility = 'hidden';
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    }
  }

  // === WZMACNIANY ERROR SCREEN ===
  function showError(msg) {
    const app = document.getElementById('app') || document.body;
    if (app && !document.getElementById('error-message')) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.style.cssText = `
        display: block; color: #ff6b6b; text-align: center; padding: 3rem;
        background: rgba(255,107,107,0.1); border-radius: 16px; border: 2px solid #ff6b6b;
        max-width: 700px; margin: 2rem auto; font-family: -apple-system, sans-serif;
        box-shadow: 0 10px 40px rgba(255,107,107,0.3);
      `;
      errorDiv.innerHTML = `
        <h2 style="margin: 0 0 1rem 0;">🚨 Błąd inicjalizacji ETERNIVERSE v2.6</h2>
        <p style="margin: 0 0 1.5rem 0; font-size: 1.1rem;">${msg}</p>
        <p><strong>F12 → Console → szczegóły błędów</strong></p>
        <details style="margin-top: 1.5rem; cursor: pointer;">
          <summary>📋 Debug: 9 wymaganych plików</summary>
          <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 12px; font-size: 0.85rem; margin-top: 1rem; white-space: pre-wrap;">${ENGINES.map((s, i) => `${i+1}. ${s} ${i < loadedCount ? '✅' : '⏳'}`).join('\n')}</pre>
        </details>
        <div style="margin-top: 2rem; font-size: 0.9rem; opacity: 0.8;">
          <strong>Sprawdź folder <code>js/</code></strong><br>
          Brakujące pliki blokują funkcje (okładki ✏️🗑️, rozdziały 📖, multiświat 🌌)
        </div>
      `;
      app.insertBefore(errorDiv, app.firstChild);
    }
  }

  // === PERFORMANCE MONITOR ===
  function startPerfMonitor() {
    const startTime = performance.now();
    setTimeout(() => {
      const loadTime = Math.round(performance.now() - startTime);
      console.log(`⚡ Ładowanie v2.6: ${loadTime}ms | Silniki: ${loadedCount}/${ENGINES.length}`);
    }, 100);
  }

  // === START AUTOMATYCZNY z WZMACNIANIEM ===
  function startLoader() {
    console.log("🌌 ETERNIVERSE v2.6 – MASTER LOADER START [9 SILNIKÓW WZMACNIANYCH]");
    console.log("📋 Ładowanie sekwencyjne:", ENGINES.map((s,i) => `${i+1}. ${s}`).join('\n'));
    
    startPerfMonitor();
    setTimeout(loadEngine, 100); // Stabilizacja DOM
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLoader);
  } else {
    startLoader();
  }

  // === GLOBAL FALLBACKY ===
  window.onerror = function(msg, url, line) {
    console.error(`💥 GLOBAL ERROR: ${msg} (${url}:${line})`);
    errorCount++;
  };

  // EXPORT dla ETERCONSOLE
  window.ETERNIVERSE_LOADER = {
    status: () => ({ loaded: loadedCount, total: ENGINES.length, errors: errorCount }),
    reload: (index) => loadEngine(index || 0),
    engines: ENGINES
  };

})();
