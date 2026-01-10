/* =====================================
   ETERNIVERSE MULTIWORLD SYSTEM v3.0
   Możliwość budowy KOLEJNYCH ŚWIATÓW
   ===================================== */

(function() {
  // MULTIWORLD – sprawdź czy już istnieje
  if (window.MULTIWORLD) {
    console.log("🌌 MultiWorld v3.0 już aktywny");
    return;
  }
  window.MULTIWORLD = true;

  // === STRUKTURA WIECZNYCH ŚWIATÓW ===
  const DEFAULT_WORLDS = {
    "PSYCHE": { 
      name: "🌌 PSYCHE", 
      color: "#8b5cf6", 
      gates: 10,
      books: window.WORLD_PSYCHE ? window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0) : 0
    },
    "CIEN": { name: "🖤 CIEN", color: "#1f2937", gates: 8, books: 0 },
    "WOLA": { name: "🔥 WOLA", color: "#ef4444", gates: 12, books: 0 },
    "OBFITOSC": { name: "💎 OBFITOSC", color: "#10b981", gates: 6, books: 0 },
    "POLE": { name: "⚡ POLE", color: "#f59e0b", gates: 15, books: 0 }
  };

  // === ZAPIS/WCZYTYWANIE ŚWIATÓW ===
  function saveWorld(worldId) {
    if (!window.WORLD_PSYCHE) return;
    
    const worldData = {
      id: worldId,
      psyche: window.WORLD_PSYCHE,
      timestamp: new Date().toISOString(),
      booksCount: window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0)
    };
    
    localStorage.setItem(`ETERNIVERSE_WORLD_${worldId}`, JSON.stringify(worldData));
    console.log(`💾 Zapisano świat: ${worldId}`);
  }

  function loadWorld(worldId) {
    const worldData = localStorage.getItem(`ETERNIVERSE_WORLD_${worldId}`);
    if (!worldData) {
      console.log(`🌌 Nowy świat: ${worldId}`);
      window.WORLD_PSYCHE = JSON.parse(localStorage.getItem("ETERNIVERSE_WORLD_PSYCHE_V4") || '{}');
      saveWorld(worldId);
      return;
    }

    window.WORLD_PSYCHE = JSON.parse(worldData).psyche;
    console.log(`🌌 Wczytano świat: ${worldId} (${JSON.parse(worldData).booksCount} książek)`);
    
    if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
  }

  // === TWORZENIE NOWEGO ŚWIATU ===
  window.createNewWorld = function(worldId = prompt("Nazwa nowego świata (CIEN/WOLA/OBFITOSC/POLE):")) {
    if (!worldId) return;
    
    if (confirm(`🌌 UTWORZYĆ ŚWIAT "${worldId.toUpperCase()}"?\nTo skopiuje aktualny PSYCHE + doda nowe bramy`)) {
      saveWorld(worldId);
      loadWorld(worldId);
      
      if (window.BELLA) {
        window.BELLA.process(`NOWY ŚWIAT ${worldId.toUpperCase()} STWORZONY!`);
      }
    }
  };

  // === PRZEŁĄCZANIE ŚWIATÓW ===
  window.switchWorld = function(worldId) {
    if (confirm(`🌌 PRZEŁĄCZ SIĘ DO ŚWIATA "${worldId}"?\nAktualny świat zostanie zapisany`)) {
      saveWorld("PSYCHE"); // Zapisz obecny
      loadWorld(worldId);
      
      if (window.BELLA) {
        window.BELLA.process(`PRZEŁĄCZONO DO ŚWIATA ${worldId}`);
      }
    }
  };

  // === UI SELEKTOR ŚWIATÓW ===
  function createWorldSelector() {
    const selector = document.createElement("div");
    selector.id = "world-selector";
    selector.innerHTML = `
      <div style="
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
        border: 2px solid #8b5cf6; border-radius: 16px; padding: 16px;
        backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(139,92,246,0.3);
        font-family: -apple-system, sans-serif; color: white; min-width: 220px;
      ">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 12px; display: flex; align-items: center;">
          🌌 MULTIŚWIAT v3.0
          <button onclick="createNewWorld()" title="Nowy świat" style="
            margin-left: auto; background: #ef4444; border: none; border-radius: 50%; 
            width: 28px; height: 28px; color: white; font-size: 16px; cursor: pointer;
          ">➕</button>
        </div>
        ${Object.entries(DEFAULT_WORLDS).map(([id, data]) => `
          <button onclick="switchWorld('${id}')" style="
            width: 100%; padding: 8px 12px; margin: 4px 0; border: none; border-radius: 8px;
            background: ${data.color}20; color: white; cursor: pointer; font-size: 13px;
            transition: all 0.3s; text-align: left;
            ${window.WORLD_PSYCHE && localStorage.getItem('activeWorld') === id ? 'box-shadow: 0 0 0 2px #fff;' : ''}
          "
            onmouseover="this.style.background='${data.color}40'"
            onmouseout="this.style.background='${data.color}20'">
            ${data.name} (${data.books || 0} 📚)
          </button>
        `).join('')}
        <div style="font-size: 11px; opacity: 0.7; margin-top: 12px; text-align: center;">
          Aktywny: <span id="active-world" style="color: #8b5cf6;">PSYCHE</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(selector);
    
    // Ustaw aktywny świat
    const activeWorld = localStorage.getItem('activeWorld') || 'PSYCHE';
    document.getElementById('active-world').textContent = DEFAULT_WORLDS[activeWorld]?.name || 'PSYCHE';
  }

  // === INTEGRACJA Z AUTOZAPIS ===
  const originalSave = window.saveWorldNow;
  window.saveWorldNow = function(reason) {
    const activeWorld = localStorage.getItem('activeWorld') || 'PSYCHE';
    localStorage.setItem('activeWorld', activeWorld);
    originalSave ? originalSave(reason) : console.log('💾 Zapisano ' + reason);
  };

  // === START MULTIŚWIAT ===
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Czekaj na core
    if (!document.getElementById('app') && !window.initEterniverse) {
      setTimeout(init, 500);
      return;
    }
    
    createWorldSelector();
    console.log("🌌 MULTIŚWIAT v3.0 – 5 gotowych światów + tworzenie nowych!");
    console.log("🎮 createNewWorld('NOWY') | switchWorld('WOLA')");
    
    if (window.BELLA) {
      window.BELLA.process("MULTIŚWIAT v3.0 – budowa kolejnych światów aktywna!");
    }
  }

  init();
})();
