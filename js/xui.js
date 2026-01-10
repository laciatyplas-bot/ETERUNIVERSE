/* =====================================
   XUI v1.0 – POTĘŻNA REDAKCJA ETERNIVERSE
   🔥 ALL-IN-ONE Redaktorka + Multiświat + Analityka + Eksport
   ===================================== */

(function() {
  if (window.XUI) return;
  window.XUI = true;

  console.log("🔥🚀 XUI v1.0 – POTĘŻNA REDAKCJA AKTYWNA!");

  // === XUI MASTER CONTROLER ===
  window.XUI_MASTER = {
    activeTab: 'redactor',
    worlds: window.WORLDS || {PSYCHE: {name:"PSYCHE", active:true}},
    stats: {books:0, chapters:0, words:0},
    
    updateStats() {
      if (!window.WORLD_PSYCHE) return;
      const totalBooks = window.WORLD_PSYCHE.gates.reduce((s,g)=>s+g.books.length,0);
      const totalChapters = window.WORLD_PSYCHE.gates.reduce((s,g)=>s+g.books.reduce((b,c)=>b+(c.chapters?.length||1),0),0);
      this.stats = {books:totalBooks, chapters:totalChapters, gates:window.WORLD_PSYCHE.gates.length};
    }
  };

  // === GŁÓWNY HOTKEY + FAB BUTTON ===
  function createXuiFab() {
    if (document.getElementById('xui-fab')) return;

    const fab = document.createElement('div');
    fab.id = 'xui-fab';
    fab.innerHTML = `
      <div style="
        position: fixed; top: 20px; right: 20px; z-index: 10005;
        width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
        background-size: 300% 300%; animation: gradientShift 4s ease infinite; border: 4px solid rgba(255,255,255,0.9);
        cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center;
        box-shadow: 0 20px 60px rgba(255,107,107,0.6); backdrop-filter: blur(20px); transition: all 0.4s;
        font-family: -apple-system, sans-serif; color: white; font-weight: bold; font-size: 28px; user-select: none;
      " onmouseover="this.style.transform='scale(1.1) rotate(360deg)'; this.style.boxShadow='0 25px 80px rgba(255,107,107,0.8)'"
        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 20px 60px rgba(255,107,107,0.6)'"
        title="🚀 XUI v1.0 – Potężna Redakcja">
        🔥
        <div style="font-size: 10px; margin-top: 4px; font-weight: 600;">XUI</div>
      </div>
    `;
    
    fab.onclick = toggleXuiMaster;
    document.body.appendChild(fab);
  }

  // === MASTER PANEL XUI ===
  function toggleXuiMaster() {
    let panel = document.getElementById('xui-master');
    if (panel) {
      panel.style.transform = 'translateX(100%)';
      setTimeout(() => panel?.remove(), 400);
      return;
    }

    window.XUI_MASTER.updateStats();
    
    panel = document.createElement('div');
    panel.id = 'xui-master';
    panel.style.cssText = `
      position: fixed; top: 0; right: 0; width: 480px; height: 100vh; z-index: 10004;
      background: linear-gradient(180deg, rgba(15,15,25,0.98) 0%, rgba(25,25,45,0.98) 100%);
      backdrop-filter: blur(30px); border-left: 3px solid linear-gradient(45deg, #ff6b6b, #4ecdc4);
      box-shadow: -20px 0 80px rgba(0,0,0,0.8); transform: translateX(100%); transition: transform 0.4s;
      padding: 0; overflow-y: auto; font-family: -apple-system, sans-serif; color: white;
    `;
    
    panel.innerHTML = masterPanelHTML();
    document.body.appendChild(panel);
    
    setTimeout(() => panel.style.transform = 'translateX(0)', 50);
    
    // Bind events
    document.getElementById('xui-close')?.onclick = () => panel.remove();
    bindTabEvents();
    bindRedactorEvents();
  }

  // === MASTER PANEL HTML ===
  function masterPanelHTML() {
    const stats = window.XUI_MASTER.stats;
    return `
      <style>
        @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .xui-tab { padding: 16px 24px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.1); 
                   transition: all 0.3s; font-weight: 500; display: flex; align-items: center; gap: 12px; }
        .xui-tab.active { background: rgba(255,107,107,0.3); color: #ff6b6b; }
        .xui-panel { display: none; padding: 24px; }
        .xui-panel.active { display: block; animation: slideDown 0.4s; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .xui-btn { padding: 12px 24px; border: none; border-radius: 12px; cursor: pointer; font-weight: 600; 
                   font-size: 14px; transition: all 0.3s; margin: 8px 4px 0 0; }
        .xui-btn-primary { background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; }
        .xui-btn-secondary { background: rgba(255,255,255,0.1); color: white; border: 2px solid rgba(255,255,255,0.3); }
        .xui-textarea { width: 100%; height: 200px; padding: 16px; border: 2px solid rgba(255,107,107,0.4); 
                        border-radius: 16px; background: rgba(255,255,255,0.03); color: white; font-family: monospace; 
                        font-size: 14px; resize: vertical; box-sizing: border-box; margin-top: 12px; }
        .xui-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
        .xui-stat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); 
                         border-radius: 12px; padding: 20px; text-align: center; }
      </style>
      
      <div style="height: 70px; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); display: flex; align-items: center; padding: 0 24px; position: sticky; top: 0; z-index: 10;">
        <div style="font-size: 24px; font-weight: bold; flex: 1;">🚀 XUI v1.0</div>
        <div style="font-size: 13px; opacity: 0.9;">
          📚 ${stats.books} | 📖 ${stats.chapters} | 🌌 ${stats.gates}
        </div>
        <button id="xui-close" style="background: rgba(255,255,255,0.2); border: none; border-radius: 50%; width: 36px; height: 36px; color: white; cursor: pointer; margin-left: 16px;">×</button>
      </div>
      
      <div style="padding: 0 24px 24px;">
        <!-- TABS -->
        <div class="xui-tab active" data-tab="redactor">📝 Redaktorka</div>
        <div class="xui-tab" data-tab="worlds">🌌 Światy</div>
        <div class="xui-tab" data-tab="stats">📊 Analityka</div>
        <div class="xui-tab" data-tab="export">💾 Eksport</div>
        
        <!-- REDAKTORKA -->
        <div id="redactor" class="xui-panel active">
          <div style="font-size: 16px; font-weight: 600; margin-bottom: 16px;">✂️ BELLA-RED: Tekst → Książka + Rozdziały</div>
          <input id="xui-title" placeholder="Tytuł książki" style="width: 100%; padding: 12px 16px; border: 2px solid rgba(255,107,107,0.4); border-radius: 12px; background: rgba(255,255,255,0.05); color: white; box-sizing: border-box; margin-bottom: 12px;">
          <textarea id="xui-textarea" class="xui-textarea" placeholder="Wklej długi tekst...&#10;• Automatyczne rozdziały (max 3k znaków)&#10;• Nagłówki WIELKIMI literami&#10;• Okładka automatyczna"></textarea>
          <button class="xui-btn xui-btn-primary" onclick="XUI.processText()">🚀 STWÓRZ KSIĄŻKĘ</button>
          <div id="xui-status" style="margin-top: 16px; padding: 12px; border-radius: 12px; font-size: 14px; display: none;"></div>
        </div>
        
        <!-- ŚWIATY -->
        <div id="worlds" class="xui-panel">
          <div id="xui-world-list" style="max-height: 400px; overflow-y: auto;"></div>
        </div>
        
        <!-- ANALITYKA -->
        <div id="stats" class="xui-panel">
          <div class="xui-stats">
            <div class="xui-stat-card">
              <div style="font-size: 32px; color: #ff6b6b;">📚 ${stats.books}</div>
              <div style="font-size: 14px; opacity: 0.8;">Książki</div>
            </div>
            <div class="xui-stat-card">
              <div style="font-size: 32px; color: #4ecdc4;">📖 ${stats.chapters}</div>
              <div style="font-size: 14px; opacity: 0.8;">Rozdziały</div>
            </div>
            <div class="xui-stat-card">
              <div style="font-size: 32px; color: #45b7d1;">🌌 ${stats.gates}</div>
              <div style="font-size: 14px; opacity: 0.8;">Bramy</div>
            </div>
            <div class="xui-stat-card">
              <div style="font-size: 32px; color: #feca57;">✨</div>
              <div style="font-size: 14px; opacity: 0.8;">XUI Active</div>
            </div>
          </div>
          <button class="xui-btn xui-btn-secondary" onclick="XUI.refreshStats()">🔄 Odśwież</button>
        </div>
        
        <!-- EKSPORT -->
        <div id="export" class="xui-panel">
          <button class="xui-btn xui-btn-primary" onclick="XUI.exportWorld()">💾 Pobierz cały świat JSON</button>
          <button class="xui-btn xui-btn-secondary" onclick="XUI.exportMarkdown()">📄 Markdown (książki)</button>
        </div>
      </div>
    `;
    
    return panel.outerHTML;
  }

  // === XUI GLOBAL FUNKCJE ===
  window.XUI = {
    processText() {
      const textarea = document.getElementById('xui-textarea');
      const title = document.getElementById('xui-title').value || `XBOOK_${Date.now()}`;
      const status = document.getElementById('xui-status');
      const text = textarea.value.trim();
      
      if (text.length < 100) {
        status.textContent = "⚠️ Min. 100 znaków"; status.style.display = 'block'; status.style.color = '#ff8e8e';
        return;
      }
      
      status.textContent = "🚀 BELLA-RED przetwarza..."; status.style.display = 'block'; status.style.color = '#4ecdc4';
      
      // BELLA LOGIC (skrócona)
      const chapters = text.split('\n\n').slice(0,8).map((p,i) => ({
        title: `Rozdział ${i+1}`,
        content: p.slice(0,3500)
      })).filter(c => c.content.length > 100);
      
      const book = {
        title: title.slice(0,60),
        desc: `XUI v1.0 | ${chapters.length} rozdziałów`,
        coverImg: `https://via.placeholder.com/300x400/ff6b6b/fff?text=${title.slice(0,6)}`,
        chapters
      };
      
      window.WORLD_PSYCHE.gates[0].books.unshift(book);
      if (typeof renderWorld === 'function') renderWorld();
      if (window.saveWorldNow) window.saveWorldNow("XUI: Nowa książka");
      
      status.innerHTML = `✅ ${title}<br>${chapters.length} rozdziałów → PSYCHE`; 
      status.style.color = '#10b981'; textarea.value = '';
    },
    
    refreshStats() {
      window.XUI_MASTER.updateStats();
      window.XUI.updateWorldsUI();
    },
    
    exportWorld() {
      const data = JSON.stringify(window.WORLD_PSYCHE, null, 2);
      const blob = new Blob([data], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `eterniverse_${Date.now()}.json`; a.click();
    }
  };

  // === EVENTS ===
  function bindTabEvents() {
    document.querySelectorAll('.xui-tab').forEach(tab => {
      tab.onclick = function() {
        document.querySelectorAll('.xui-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.xui-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(this.dataset.tab).classList.add('active');
        window.XUI_MASTER.activeTab = this.dataset.tab;
      };
    });
  }

  function bindRedactorEvents() {
    document.getElementById('xui-textarea')?.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'Enter') XUI.processText();
    });
  }

  // === START ===
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(createXuiFab, 1000));
    } else {
      setTimeout(createXuiFab, 500);
    }
  }

  init();
})();
