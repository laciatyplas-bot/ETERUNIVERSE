/* =====================================
   ETERNIVERSE ENGINE LOADER v2.8 – 11 SILNIKÓW POPRAWIONE
   100% SYNTAX CLEAN – XUI + BELLA + MULTIŚWIAT
   ===================================== */

(function () {
  if (window.enginesLoaded) {
    console.log("🚀 Silniki ETERNIVERSE v2.8 już załadowane");
    return;
  }
  window.enginesLoaded = true;

  const ENGINES = [
    "js/world_psyche.js",     // 1️⃣ DANE – window.WORLD_PSYCHE (10 bram)
    "js/core.js",             // 2️⃣ RENDER + UI + initEterniverse()
    "js/book_editor.js",      // 3️⃣ ✏️🗑️ CRUD + OKŁADKI v2.3
    "js/chapters_init.js",    // 4️⃣ AUTOMATYCZNE ROZDZIAŁY
    "js/chapter_editor.js",   // 5️⃣ 📖 MODAL ROZDZIAŁÓW (CRUD)
    "js/eter_console.js",     // 6️⃣ DEV TOOLS (Ctrl + `)
    "js/autosave.js",         // 7️⃣ 💾 AUTOZAPIS co 30s + backup
    "js/bella-console.js",    // 8️⃣ 😈🔥 BELLA-REDAKTORKA v9.0
    "js/bella-ui.js",         // 9️⃣ 😈 BELLA UI ZAKŁADKA (bez konsoli)
    "js/xui.js",              // 🔟 🔥 XUI POTĘŻNA REDAKCJA (master)
    "js/multiworld.js"        // 1️⃣1️⃣ 🌌 MULTIŚWIAT v3.2 (✏️🗑️)
  ];

  let loadedCount = 0;
  let errorCount = 0;

  function loadEngine(i = 0) {
    if (i >= ENGINES.length) {
      console.log(`✅ Wszystkie ${loadedCount}/${ENGINES.length} silników ETERNIVERSE v2.8 załadowane! (Błędy: ${errorCount})`);
      
      if (typeof window.initEterniverse === "function") {
        console.log("🌌 Uruchamiam initEterniverse...");
        window.initEterniverse();
      }

      setTimeout(() => {
        if (window.XUI) console.log("🔥 XUI v1.0 – POTĘŻNA REDAKCJA aktywna!");
        if (window.BELLA_UI) console.log("😈 BELLA-UI v9.1 – zakładka aktywna!");
        if (window.MULTIWORLD) console.log("🌌 MultiWorld v3.2 – ✏️🗑️ światy!");
      }, 2000);

      fadeOutLoading();
      console.log("🚀 ETERNIVERSE v2.8 – PEŁNY XUI STACK AKTYWNY!");
      return;
    }

    const src = ENGINES[i];
    if (document.querySelector(`script[src="${src}"]`)) {
      console.log(`⏭️ [${i+1}/11] Pomijam: ${src}`);
      loadedCount++; loadEngine(i + 1); return;
    }

    const script = document.createElement("script");
    script.src = src; script.async = false;
    script.dataset.engineIndex = i + 1;
    
    script.onerror = (e) => {
      console.warn(`⚠️ [${i+1}/11] BŁĄD: ${src}`);
      errorCount++; loadedCount++; loadEngine(i + 1);
    };
    
    script.onload = () => {
      loadedCount++;
      console.log(`✅ [${i+1}/11] Załadowano: ${src}`);
      loadEngine(i + 1);
    };
    
    document.head.appendChild(script);
  }

  function fadeOutLoading() {
    const loading = document.querySelector('.loading, #loading, .loader');
    if (loading) {
      loading.style.transition = 'all 0.6s ease-out';
      loading.style.opacity = '0'; loading.style.transform = 'scale(0.7)';
      setTimeout(() => loading.style.display = 'none', 600);
    }
  }

  function showError(msg) {
    const app = document.getElementById('app') || document.body;
    if (!document.getElementById('error-message')) {
      const errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
        background: rgba(255,107,107,0.95); color: white; padding: 2rem;
        border-radius: 16px; border: 2px solid #ff6b6b; max-width: 500px;
        text-align: center; backdrop-filter: blur(20px); z-index: 99999;
        box-shadow: 0 20px 60px rgba(255,107,107,0.5);
        font-family: -apple-system, sans-serif;
      `;
      
      // ✅ POPRAWIONE – BEZ template literals w problematycznej linii
      let debugList = '';
      for (let j = 0; j < ENGINES.length; j++) {
        const status = j < loadedCount ? '✅' : '❌';
        debugList += `${j+1}. ${ENGINES[j]} ${status}\n`;
      }
      
      errorDiv.innerHTML = `
        <h2>🚨 ETERNIVERSE v2.8 – BŁĄD</h2>
        <p>${msg}</p>
        <p><strong>F12 → Console → szczegóły</strong></p>
        <details>
          <summary>📋 Brakujące silniki (${errorCount}/${ENGINES.length})</summary>
          <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 12px; font-size: 0.85rem; white-space: pre-wrap;">${debugList}</pre>
        </details>
      `;
      document.body.appendChild(errorDiv);
    }
  }

  function startLoader() {
    console.log("🌌 ETERNIVERSE v2.8 – XUI MASTER LOADER [11 SILNIKÓW]");
    console.log("🔥 Kolejność:", ENGINES.map((s,i)=>`${i+1}. ${s}`).join('\n'));
    setTimeout(loadEngine, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLoader);
  } else {
    startLoader();
  }

  window.onerror = (msg, url, line) => {
    console.error(`💥 GLOBAL ERROR: ${msg} (${url}:${line})`);
  };

  window.ETERNIVERSE_LOADER = {
    status: () => ({ loaded: loadedCount, total: ENGINES.length, errors: errorCount }),
    reload: (index) => loadEngine(index || 0),
    engines: ENGINES
  };

})();
