/* =====================================
   ETERNIVERSE — CORE ENGINE v4.4 (PEŁNY SPRAWNY)
   Architekt: Maciej Maciuszek + AI Assistant
   KOMPATYBILNY: world_psyche.js + book_editor.js v2.1 + engine_loader.js
   ===================================== */

(function() {
  // Singleton – tylko raz
  if (window.EterniverseCoreInitialized) {
    console.log("Core v4.4 już załadowany");
    return;
  }
  window.EterniverseCoreInitialized = true;

  let WORLD = null;

  /* ==============================
     GŁÓWNA INICJALIZACJA
  ============================== */
  window.initEterniverse = function() {
    console.log("🌌 ETERNIVERSE CORE v4.4: PSYCHE / INTERSEEKER START");

    // Czekaj na world_psyche.js
    if (!window.WORLD_PSYCHE) {
      console.log("⏳ Czekam na WORLD_PSYCHE...");
      setTimeout(window.initEterniverse, 200);
      return;
    }

    WORLD = window.WORLD_PSYCHE;
    
    // Ładuj zapisany stan lub użyj domyślnego
    const saved = loadWorldData();
    if (saved) WORLD = saved;

    // Napraw dane
    fixWorldData(WORLD);
    saveWorldData();

    // Render + UI + Belle
    renderWorld(WORLD);
    setupUI();
    
    // Włącz book_editor.js actions
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('worldRendered'));
    }, 100);

    belleSpeak("🌌 System Kroniki Woli v4.4 aktywny. 10 bram PSYCHE gotowych.");
  };

  /* ==============================
     RENDER ŚWIATA (CSS gotowy)
  ============================== */
  function renderWorld(world) {
    const app = document.getElementById("app");
    if (!app) return;

    app.innerHTML = `
      <h2 style="color: #D9A441; text-align: center;">${world.name}</h2>
      <p style="text-align: center; color: #9BA9C8; font-style: italic;">${world.description}</p>
    `;

    world.gates.forEach(gate => {
      const gateDiv = document.createElement("div");
      gateDiv.className = "gate";
      gateDiv.style.borderLeftColor = gate.color || "#28D3C6";

      gateDiv.innerHTML = `
        <h3 style="color: ${gate.color}">${gate.name}</h3>
        <p style="color: #9BA9C8; font-size: 0.95rem;">${gate.sub} • ${gate.tag}</p>
      `;

      gate.books.forEach((book, index) => {
        gateDiv.innerHTML += `
          <div class="book">
            <div class="book-left">
              <img src="${book.cover}" alt="${book.title}" 
                   onerror="this.onerror=null; this.src='https://placehold.co/80x120/333/fff/png?text=${book.title.substring(0,8)}'" 
                   style="width:80px;height:120px;">
              <div>
                <h4 style="margin: 0 0 0.5rem 0; color: #E8EEFA;">${book.title}</h4>
                <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #9BA9C8;">${book.description}</p>
                <span class="status">${book.status?.toUpperCase() || 'IDEA'}</span>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: flex-start;">
              ${book.audio ? `<audio controls src="${book.audio}" style="width: 120px;"></audio>` : ''}
              <button class="edit-btn" data-gate="${gate.id}" data-index="${index}" 
                      style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">✏️</button>
              <button class="delete-btn" data-gate="${gate.id}" data-index="${index}"
                      style="padding: 0.4rem 0.8rem; font-size: 0.85rem; background: #ff6b6b;">🗑️</button>
            </div>
          </div>
        `;
      });

      app.appendChild(gateDiv);
    });

    console.log("✅ Render zakończony – 10 bram PSYCHE");
  }

  /* ==============================
     NAPRAWA DANYCH
  ============================== */
  function fixWorldData(world) {
    (world.gates || []).forEach(gate => {
      (gate.books || []).forEach(book => {
        if (!book.cover) book.cover = "media/covers/default.jpg";
        if (!book.chapters) book.chapters = [];
        if (!book.status) book.status = "idea";
        if (!book.description) book.description = "";
      });
    });
  }

  /* ==============================
     UI + EVENTY
  ============================== */
  function setupUI() {
    // Export JSON
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
      exportBtn.onclick = exportWorldJSON;
    }

    // Konsola Belle
    const consoleBtn = document.getElementById("openConsoleBtn");
    if (consoleBtn) {
      consoleBtn.onclick = () => {
        console.log("🪐 Konsola Belle: F12 → sprawdź logi");
        belleSpeak("Konsola deweloperska otwarta w F12");
      };
    }
  }

  /* ==============================
     ZAPIS/ODCZYT (V4 standard)
  ============================== */
  function saveWorldData() {
    try {
      localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE_V4", JSON.stringify(WORLD));
    } catch (e) {
      console.error("Błąd zapisu:", e);
    }
  }

  function loadWorldData() {
    try {
      const data = localStorage.getItem("ETERNIVERSE_WORLD_PSYCHE_V4");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Błąd odczytu:", e);
      return null;
    }
  }

  /* ==============================
     EKSPOST JSON
  ============================== */
  function exportWorldJSON() {
    try {
      const dataStr = JSON.stringify(WORLD, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = 'ETERNIVERSE_PSYCHE_v4.4.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      belleSpeak("💾 Eksport JSON zapisany");
    } catch (e) {
      alert("Błąd eksportu: " + e.message);
    }
  }

  /* ==============================
     BELLE AI
  ============================== */
  function belleSpeak(msg) {
    const speechEl = document.getElementById("belleSpeech");
    if (speechEl) {
      speechEl.textContent = msg;
      setTimeout(() => {
        speechEl.textContent = "Gotowa na Twoje intencje, Architekcie...";
      }, 4000);
    }
  }

  console.log("🌌 Core v4.4 załadowany – czeka na initEterniverse()");
})();
