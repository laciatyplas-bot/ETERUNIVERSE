/* =====================================
   MULTIWORLD.js v3.0 – PEŁNY KOD 1:1
   5 ŚWIATÓW + ➕ NOWE – PRODUCTION READY
   ===================================== */

(function() {
  // Singleton
  if (window.MULTIWORLD) {
    console.log("🌌 MultiWorld v3.0 już aktywny");
    return;
  }
  window.MULTIWORLD = true;

  console.log("🌌 MultiWorld v3.0 – budowa wielu światów aktywna!");

  // === STRUKTURA 5 ŚWIATÓW ===
  window.WORLDS = {
    "PSYCHE": { name: "🌌 PSYCHE", color: "#8b5cf6", gates: 10, active: true },
    "CIEN": { name: "🖤 CIEN", color: "#1f2937", gates: 8, active: false },
    "WOLA": { name: "🔥 WOLA", color: "#ef4444", gates: 12, active: false },
    "OBFITOSC": { name: "💎 OBFITOSC", color: "#10b981", gates: 6, active: false },
    "POLE": { name: "⚡ POLE", color: "#f59e0b", gates: 15, active: false }
  };

  // === ZAPIS ŚWIATA ===
  function saveCurrentWorld(worldId) {
    if (!window.WORLD_PSYCHE) return;
    
    const worldData = {
      id: worldId,
      data: JSON.parse(JSON.stringify(window.WORLD_PSYCHE)),
      timestamp: new Date().toISOString(),
      booksCount: window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0),
      gatesCount: window.WORLD_PSYCHE.gates.length
    };
    
    localStorage.setItem(`ETERNIVERSE_WORLD_${worldId}`, JSON.stringify(worldData));
    localStorage.setItem('activeWorld', worldId);
    
    console.log(`💾 Zapisano ${worldId}: ${worldData.booksCount} książek`);
  }

  // === WCZYTYWANIE ŚWIATA ===
  function loadWorld(worldId) {
    const worldData = localStorage.getItem(`ETERNIVERSE_WORLD_${worldId}`);
    
    if (!worldData) {
      console.log(`🌌 Tworzę nowy świat: ${worldId}`);
      // Kopiuj PSYCHE jako bazę
      const psycheData = localStorage.getItem('ETERNIVERSE_WORLD_PSYCHE') || 
                        localStorage.getItem('ETERNIVERSE_WORLD_PSYCHE_V4');
      if (psycheData) {
        window.WORLD_PSYCHE = JSON.parse(psycheData).data || JSON.parse(psycheData);
      }
      saveCurrentWorld(worldId);
    } else {
      const parsed = JSON.parse(worldData);
      window.WORLD_PSYCHE = parsed.data;
      console.log(`🌌 Wczytano ${worldId}: ${parsed.booksCount} książek`);
    }
    
    // Update UI
    window.WORLDS[worldId].active = true;
    Object.keys(window.WORLDS).forEach(id => {
      if (id !== worldId) window.WORLDS[id].active = false;
    });
    
    if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
    updateWorldSelector();
  }

  // === PRZEŁĄCZ ŚWIAT ===
  window.switchWorld = function(worldId) {
    if (window.WORLDS[worldId].active) {
      console.log(`🌌 Już w świecie ${worldId}`);
      return;
    }
    
    if (confirm(`🌌 Przełączyć do świata "${window.WORLDS[worldId].name}"?\nAktualny zapisze się automatycznie`)) {
      saveCurrentWorld(localStorage.getItem('activeWorld') || 'PSYCHE');
      loadWorld(worldId);
      
      if (window.BELLA) {
        window.BELLA.process(`PRZEŁĄCZONO DO ${worldId}`);
      }
    }
  };

  // === NOWY ŚWIAT ===
  window.createNewWorld = function() {
    const name = prompt("Nazwa nowego świata (np. NOWY1, CHAOS):")?.toUpperCase();
    if (!name || name.length < 2) return;
    
    if (confirm(`🌌 Utworzyć świat "${name}"?`)) {
      window.WORLDS[name] = { name: `🌟 ${name}`, color: "#6366f1", gates: 10, active: false };
      saveCurrentWorld(name);
      updateWorldSelector();
      
      if (window.BELLA) {
        window.BELLA.process(`NOWY ŚWIAT ${name} UTWORZONY!`);
      }
    }
  };

  // === UI SELEKTOR ===
  function updateWorldSelector() {
    const existing = document.getElementById('world-selector');
    if (existing) existing.remove();

    const selector = document.createElement('div');
    selector.id = 'world-selector';
    selector.innerHTML = `
      <div style="
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
        border: 2px solid #8b5cf6; border-radius: 16px; padding: 16px;
        backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(139,92,246,0.4);
        font-family: -apple-system, sans-serif; color: white; min-width: 240px;
        font-size: 14px;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <strong>🌌 MULTIŚWIAT v3.0</strong>
          <button onclick="createNewWorld()" title="Nowy świat" style="
            background: #ef4444; border: none; border-radius: 50%; width: 32px; height: 32px;
            color: white; font-size: 16px; cursor: pointer; font-weight: bold;
          ">➕</button>
        </div>
        ${Object.entries(window.WORLDS).map(([id, data]) => `
          <button onclick="switchWorld('${id}')" style="
            width: 100%; padding: 10px 12px; margin: 4px 0; border: none; border-radius: 10px;
            background: ${data.active ? data.color : data.color + '20'}; 
            color: ${data.active ? 'white' : data.color}; cursor: pointer; font-size: 13px;
            text-align: left; font-weight: ${data.active ? 'bold' : 'normal'};
            border: ${data.active ? '2px solid white' : 'none'};
            transition: all 0.3s;
          " onmouseover="this.style.transform='translateX(4px)'" onmouseout="this.style.transform=''">
            ${data.name} 
            <span style="float: right; opacity: 0.7; font-size: 11px;">
              ${localStorage.getItem(`ETERNIVERSE_WORLD_${id}`) ? 
                JSON.parse(localStorage.getItem(`ETERNIVERSE_WORLD_${id}`)).booksCount || 0 : 0} 📚
            </span>
          </button>
        `).join('')}
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #4b5563; font-size: 12px; opacity: 0.8; text-align: center;">
          Aktywny: <span id="active-world-name" style="color: #8b5cf6; font-weight: bold;">PSYCHE</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(selector);
    
    // Update active world name
    const activeId = localStorage.getItem('activeWorld') || 'PSYCHE';
    const activeName = document.getElementById('active-world-name');
    if (activeName) activeName.textContent = window.WORLDS[activeId]?.name || 'PSYCHE';
  }

  // === INTEGRACJA Z AUTOZAPIS ===
  const originalSave = window.saveWorldNow;
  window.saveWorldNow = function(reason = "Autozapis") {
    const activeWorld = localStorage.getItem('activeWorld') || 'PSYCHE';
    saveCurrentWorld(activeWorld);
    if (originalSave) originalSave(reason);
  };

  // === INICJALIZACJA ===
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    if (!document.body) {
      setTimeout(init, 500);
      return;
    }
    
    // Załaduj aktualny świat
    const activeWorld = localStorage.getItem('activeWorld') || 'PSYCHE';
    if (activeWorld && activeWorld !== 'PSYCHE') {
      loadWorld(activeWorld);
    }
    
    updateWorldSelector();
    
    console.log("🌌 MULTIŚWIAT v3.0 – 5 światów + nowe!");
    console.log("🎮 switchWorld('WOLA') | createNewWorld()");
    
    if (window.BELLA) {
      window.BELLA.process("MULTIŚWIAT v3.0 – gotowy do budowy imperium światów!");
    }
  }

  init();
})();
