/* =====================================
   MULTIWORLD.js v3.1 – KOMPАКTNY UI 1:1
   Mały przycisk + wysuwany panel – NIE ZASłania!
   ===================================== */

(function() {
  if (window.MULTIWORLD) {
    console.log("🌌 MultiWorld v3.1 już aktywny");
    return;
  }
  window.MULTIWORLD = true;

  console.log("🌌 MultiWorld v3.1 – KOMPAKTNY UI aktywny!");

  // === 5 ŚWIATÓW ===
  window.WORLDS = {
    "PSYCHE": { name: "PSYCHE", color: "#8b5cf6", gates: 10, active: true },
    "CIEN": { name: "CIEN", color: "#1f2937", gates: 8, active: false },
    "WOLA": { name: "WOLA", color: "#ef4444", gates: 12, active: false },
    "OBFITOSC": { name: "OBFITOSC", color: "#10b981", gates: 6, active: false },
    "POLE": { name: "POLE", color: "#f59e0b", gates: 15, active: false }
  };

  // === ZAPIS/WCZYTYWANIE ===
  function saveCurrentWorld(worldId) {
    if (!window.WORLD_PSYCHE) return;
    const worldData = {
      id: worldId,
      data: JSON.parse(JSON.stringify(window.WORLD_PSYCHE)),
      timestamp: new Date().toISOString(),
      booksCount: window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0)
    };
    localStorage.setItem(`ETERNIVERSE_WORLD_${worldId}`, JSON.stringify(worldData));
    localStorage.setItem('activeWorld', worldId);
  }

  function loadWorld(worldId) {
    const worldData = localStorage.getItem(`ETERNIVERSE_WORLD_${worldId}`);
    if (!worldData) {
      const psycheData = localStorage.getItem('ETERNIVERSE_WORLD_PSYCHE_V4') || '{}';
      window.WORLD_PSYCHE = JSON.parse(psycheData);
      saveCurrentWorld(worldId);
    } else {
      window.WORLD_PSYCHE = JSON.parse(worldData).data;
    }
    
    window.WORLDS[worldId].active = true;
    Object.keys(window.WORLDS).forEach(id => id !== worldId && (window.WORLDS[id].active = false));
    
    if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
    updateWorldUI();
  }

  // === FUNKCJE GLOBALNE ===
  window.switchWorld = function(worldId) {
    if (window.WORLDS[worldId].active) return;
    if (confirm(`Przełączyć do ${window.WORLDS[worldId].name}?`)) {
      saveCurrentWorld(localStorage.getItem('activeWorld') || 'PSYCHE');
      loadWorld(worldId);
      if (window.BELLA) window.BELLA.process(`${worldId} AKTYWNY`);
    }
  };

  window.createNewWorld = function() {
    const name = prompt("Nazwa świata:").toUpperCase();
    if (name) {
      window.WORLDS[name] = { name, color: "#6366f1", gates: 10, active: false };
      saveCurrentWorld(name);
      updateWorldUI();
    }
  };

  // === KONKRETNY KOMPAKTNY UI ===
  function updateWorldUI() {
    // Usuń stare
    const oldUI = document.getElementById('multiworld-ui');
    if (oldUI) oldUI.remove();

    const ui = document.createElement('div');
    ui.id = 'multiworld-ui';
    
    ui.innerHTML = `
      <div id="world-toggle" style="
        position: fixed; top: 20px; right: 20px; z-index: 10001;
        width: 50px; height: 50px; border-radius: 12px;
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        border: 2px solid rgba(255,255,255,0.3); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 32px rgba(139,92,246,0.4);
        backdrop-filter: blur(10px); transition: all 0.3s;
        font-weight: bold; color: white; font-size: 18px;
      " title="Multiświat 🌌" onclick="toggleWorldPanel()">
        🌌
      </div>
      
      <div id="world-panel" style="
        position: fixed; top: 80px; right: -300px; z-index: 10000; width: 280px; height: calc(100vh - 100px);
        background: rgba(30,30,46,0.98); backdrop-filter: blur(20px);
        border-radius: 16px 0 0 16px; border: 1px solid rgba(139,92,246,0.3);
        box-shadow: -8px 0 32px rgba(0,0,0,0.5); transition: right 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
        padding: 20px; overflow-y: auto; font-family: -apple-system, sans-serif;
        color: white;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #4b5563;">
          <strong style="font-size: 16px;">🌌 MULTIŚWIAT</strong>
          <button onclick="toggleWorldPanel()" style="background: none; border: none; color: #8b5cf6; font-size: 20px; cursor: pointer; padding: 0;">×</button>
        </div>
        
        <div id="world-list"></div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #4b5563; text-align: center;">
          <button onclick="createNewWorld()" style="
            width: 100%; padding: 12px; background: linear-gradient(135deg, #ef4444, #dc2626);
            border: none; border-radius: 10px; color: white; font-weight: 500; cursor: pointer;
            transition: all 0.3s;
          " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            ➕ Nowy świat
          </button>
          <div style="font-size: 12px; opacity: 0.7; margin-top: 12px;">
            Aktywny: <span id="active-world" style="color: #8b5cf6;">PSYCHE</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(ui);
    updateWorldList();
  }

  function updateWorldList() {
    const list = document.getElementById('world-list');
    if (!list) return;
    
    list.innerHTML = Object.entries(window.WORLDS).map(([id, data]) => `
      <button onclick="switchWorld('${id}')" style="
        width: 100%; padding: 14px 12px; margin: 6px 0; border: none; border-radius: 12px;
        background: ${data.active ? data.color : data.color + '20'};
        color: ${data.active ? 'white' : data.color}; cursor: pointer; font-size: 14px;
        text-align: left; font-weight: ${data.active ? 'bold' : 'normal'};
        border: ${data.active ? '2px solid rgba(255,255,255,0.5)' : 'none'};
        transition: all 0.3s; position: relative; overflow: hidden;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${data.name}</span>
          <span style="font-size: 12px; opacity: 0.8;">
            ${localStorage.getItem(`ETERNIVERSE_WORLD_${id}`) ? 
              JSON.parse(localStorage.getItem(`ETERNIVERSE_WORLD_${id}`)).booksCount || 0 : 0} 📚
          </span>
        </div>
        ${data.active ? '<div style="position: absolute; top: 4px; right: 8px; font-size: 10px;">●</div>' : ''}
      </button>
    `).join('');
    
    const activeId = localStorage.getItem('activeWorld') || 'PSYCHE';
    const activeEl = document.getElementById('active-world');
    if (activeEl) activeEl.textContent = window.WORLDS[activeId]?.name || 'PSYCHE';
  }

  // === TOGGLE PANEL ===
  window.toggleWorldPanel = function() {
    const panel = document.getElementById('world-panel');
    const toggle = document.getElementById('world-toggle');
    
    if (panel.style.right === '0px') {
      panel.style.right = '-300px';
      toggle.innerHTML = '🌌';
    } else {
      panel.style.right = '0px';
      toggle.innerHTML = '✕';
    }
  };

  // === AUTOZAPIS INTEGRACJA ===
  const originalSave = window.saveWorldNow;
  window.saveWorldNow = function(reason) {
    const activeWorld = localStorage.getItem('activeWorld') || 'PSYCHE';
    saveCurrentWorld(activeWorld);
    if (originalSave) originalSave(reason);
  };

  // === START ===
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    if (!document.body) {
      setTimeout(init, 500);
      return;
    }
    
    const activeWorld = localStorage.getItem('activeWorld') || 'PSYCHE';
    if (activeWorld !== 'PSYCHE') loadWorld(activeWorld);
    
    updateWorldUI();
    
    console.log("🌌 MultiWorld v3.1 – KOMPAKTNY UI (50px przycisk)");
    if (window.BELLA) window.BELLA.process("Multiświat v3.1 – kompaktowy UI gotowy!");
  }

  init();
})();
