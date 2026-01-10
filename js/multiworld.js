/* =====================================
   MULTIWORLD.js v3.2 – EDYCJA ŚWIATÓW 1:1
   ✏️ Edytuj nazwę/kolor/liczbę bram + 🗑️ Usuń
   ===================================== */

(function() {
  if (window.MULTIWORLD) {
    console.log("🌌 MultiWorld v3.2 już aktywny");
    return;
  }
  window.MULTIWORLD = true;

  console.log("🌌 MultiWorld v3.2 – EDYCJA ŚWIATÓW aktywna!");

  // === 5 ŚWIATÓW Z PEŁNĄ EDYCJĄ ===
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
      booksCount: window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0),
      gatesCount: window.WORLD_PSYCHE.gates.length,
      worldConfig: window.WORLDS[worldId]
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

  window.editWorld = function(worldId) {
    const world = window.WORLDS[worldId];
    const newName = prompt("Nazwa świata:", world.name);
    const newColor = prompt("Kolor HEX (#rrggbb):", world.color);
    const newGates = prompt("Liczba bram:", world.gates);
    
    if (newName && newColor && newGates) {
      window.WORLDS[worldId] = {
        name: newName.toUpperCase(),
        color: newColor,
        gates: parseInt(newGates) || 10,
        active: world.active
      };
      saveCurrentWorld(worldId);
      updateWorldUI();
      if (window.BELLA) window.BELLA.process(`ŚWIAT ${worldId} EDYTOWANY`);
    }
  };

  window.deleteWorld = function(worldId) {
    if (worldId === 'PSYCHE') {
      alert("🌌 PSYCHE nie może być usunięty!");
      return;
    }
    if (confirm(`🗑️ USUNĄĆ świat "${window.WORLDS[worldId].name}"?\nDane nieodwracalne!`)) {
      delete window.WORLDS[worldId];
      localStorage.removeItem(`ETERNIVERSE_WORLD_${worldId}`);
      updateWorldUI();
      if (window.BELLA) window.BELLA.process(`ŚWIAT ${worldId} USUNIĘTY`);
    }
  };

  window.createNewWorld = function() {
    const name = prompt("Nazwa nowego świata:").toUpperCase();
    if (name && !window.WORLDS[name]) {
      window.WORLDS[name] = { 
        name, 
        color: "#6366f1", 
        gates: 10, 
        active: false 
      };
      saveCurrentWorld(name);
      updateWorldUI();
    }
  };

  // === KOMPAKTNY UI Z EDYCJĄ ===
  function updateWorldUI() {
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
      " title="Multiświat 🌌 (Kliknij ✏️🗑️)" onclick="toggleWorldPanel()">
        🌌
      </div>
      
      <div id="world-panel" style="
        position: fixed; top: 80px; right: -320px; z-index: 10000; width: 300px; 
        height: calc(100vh - 100px); background: rgba(30,30,46,0.98); 
        backdrop-filter: blur(20px); border-radius: 16px 0 0 16px; 
        border: 1px solid rgba(139,92,246,0.3); box-shadow: -8px 0 32px rgba(0,0,0,0.5); 
        transition: right 0.4s cubic-bezier(0.25,0.46,0.45,0.94); padding: 20px; 
        overflow-y: auto; font-family: -apple-system, sans-serif; color: white;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #4b5563;">
          <strong style="font-size: 16px;">🌌 MULTIŚWIAT v3.2</strong>
          <div>
            <button onclick="createNewWorld()" title="Nowy" style="margin-left: 8px; background: #10b981; border: none; border-radius: 6px; color: white; width: 32px; height: 32px; cursor: pointer;">➕</button>
            <button onclick="toggleWorldPanel()" title="Zamknij" style="background: none; border: none; color: #8b5cf6; font-size: 20px; cursor: pointer; padding: 0;">×</button>
          </div>
        </div>
        
        <div id="world-list" style="max-height: calc(100vh - 220px); overflow-y: auto;"></div>
        
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #4b5563; text-align: center; font-size: 12px; opacity: 0.8;">
          Aktywny: <span id="active-world" style="color: #8b5cf6; font-weight: bold;">PSYCHE</span>
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
      <div style="margin-bottom: 12px; padding: 12px; background: ${data.color}15; border-radius: 10px; border-left: 4px solid ${data.color}; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="color: ${data.active ? 'white' : data.color}; font-size: 15px;">${data.name}</strong>
          <div style="display: flex; gap: 4px;">
            ${data.active ? '<span style="color: #10b981; font-size: 12px; font-weight: bold;">● AKTYWNY</span>' : ''}
            <span style="font-size: 12px; opacity: 0.7;">${localStorage.getItem(`ETERNIVERSE_WORLD_${id}`) ? JSON.parse(localStorage.getItem(`ETERNIVERSE_WORLD_${id}`)).booksCount || 0 : 0} 📚</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button onclick="switchWorld('${id}')" style="padding: 6px 12px; background: ${data.color}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">Przełącz</button>
          <button onclick="editWorld('${id}')" style="padding: 6px 12px; background: #8b5cf6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">✏️ Edytuj</button>
          <button onclick="deleteWorld('${id}')" style="padding: 6px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">🗑️ Usuń</button>
        </div>
        <div style="font-size: 11px; opacity: 0.6; margin-top: 6px;">
          Bram: ${data.gates} | Kolor: ${data.color}
        </div>
      </div>
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
      panel.style.right = '-320px';
      toggle.innerHTML = '🌌';
      toggle.title = 'Multiświat (kliknij otwórz)';
    } else {
      panel.style.right = '0px';
      toggle.innerHTML = '✕';
      toggle.title = 'Multiświat (kliknij zamknij)';
      updateWorldList(); // Refresh danych
    }
  };

  // === AUTOZAPIS ===
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
    
    console.log("🌌 MultiWorld v3.2 – ✏️🗑️ EDYCJA ŚWIATÓW aktywna!");
    if (window.BELLA) window.BELLA.process("Multiświat v3.2 – pełna edycja światów!");
  }

  init();
})();
