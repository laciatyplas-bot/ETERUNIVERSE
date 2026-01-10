/* =====================================
   XUI v1.3 – POTĘŻNA REDAKCJA + JSON IMPORTER
   Import PSYCHE 80 + Tekst → Książki + Stats
   ===================================== */

(function() {
  if (window.XUI) return;
  window.XUI = true;

  console.log("🔥🚀 XUI v1.3 – POTĘŻNA REDAKCJA + JSON IMPORTER aktywna!");

  window.XUI_MASTER = {
    activeTab: 'redactor',
    stats: {books:0, chapters:0, gates:0},
    updateStats() {
      if (!window.WORLD_PSYCHE) return;
      const totalBooks = window.WORLD_PSYCHE.gates.reduce((s,g)=>s+g.books.length,0);
      const totalChapters = window.WORLD_PSYCHE.gates.reduce((s,g)=>s+g.books.reduce((b,c)=>b+(c.chapters?.length||0),0),0);
      this.stats = {books:totalBooks, chapters:totalChapters, gates:window.WORLD_PSYCHE.gates.length};
    }
  };

  // === FAB BUTTON ===
  function createXuiFab() {
    if (document.getElementById('xui-fab')) return;
    const fab = document.createElement('div');
    fab.id = 'xui-fab';
    fab.style.cssText = `
      position:fixed;top:20px;right:20px;z-index:10005;width:70px;height:70px;
      border-radius:50%;background:linear-gradient(135deg,#ff6b6b,#4ecdc4);
      border:4px solid rgba(255,255,255,0.9);cursor:pointer;display:flex;
      flex-direction:column;align-items:center;justify-content:center;
      box-shadow:0 20px 60px rgba(255,107,107,0.6);backdrop-filter:blur(20px);
      font-family:-apple-system,sans-serif;color:white;font-weight:bold;font-size:28px;
    `;
    fab.innerHTML = '🔥<div style="font-size:10px;margin-top:4px;">XUI</div>';
    fab.onclick = toggleXuiMaster;
    document.body.appendChild(fab);
  }

  // === MASTER PANEL ===
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
      position:fixed;top:0;right:0;width:480px;height:100vh;z-index:10004;
      background:rgba(15,15,25,0.98);backdrop-filter:blur(30px);
      border-left:3px solid #ff6b6b;box-shadow:-20px 0 80px rgba(0,0,0,0.8);
      transform:translateX(100%);transition:transform 0.4s;padding:0;overflow-y:auto;
      font-family:-apple-system,sans-serif;color:white;
    `;
    
    panel.innerHTML = `
      <style>
        .xui-tab{padding:16px 24px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.1);transition:all 0.3s;font-weight:500;display:flex;align-items:center;gap:12px;}
        .xui-tab.active{background:rgba(255,107,107,0.3);color:#ff6b6b;}
        .xui-panel{display:none;padding:24px;}
        .xui-panel.active{display:block;}
        .xui-btn{padding:12px 24px;border:none;border-radius:12px;cursor:pointer;font-weight:600;font-size:14px;transition:all 0.3s;margin:8px 4px 0 0;}
        .xui-btn-primary{background:linear-gradient(135deg,#ff6b6b,#ff8e8e);color:white;}
        .xui-textarea{width:100%;height:200px;padding:16px;border:2px solid rgba(255,107,107,0.4);border-radius:16px;background:rgba(255,255,255,0.03);color:white;font-family:monospace;font-size:14px;resize:vertical;box-sizing:border-box;}
      </style>
      <div style="height:70px;background:linear-gradient(135deg,#ff6b6b,#4ecdc4);display:flex;align-items:center;padding:0 24px;">
        <div style="font-size:24px;font-weight:bold;flex:1;">🚀 XUI v1.3</div>
        <div style="font-size:13px;opacity:0.9;">📚 ${window.XUI_MASTER.stats.books}</div>
        <button id="xui-close" style="background:rgba(255,255,255,0.2);border:none;border-radius:50%;width:36px;height:36px;color:white;cursor:pointer;">×</button>
      </div>
      <div style="padding:0 24px 24px;">
        <div class="xui-tab active" data-tab="redactor">📝 Redaktorka</div>
        <div class="xui-tab" data-tab="worlds">🌌 Światy JSON</div>
        <div class="xui-tab" data-tab="stats">📊 Stats</div>
        
        <input id="xui-title" placeholder="Tytuł książki" style="width:100%;padding:12px 16px;border:2px solid rgba(255,107,107,0.4);border-radius:12px;background:rgba(255,255,255,0.05);color:white;box-sizing:border-box;margin:20px 0;">
        <textarea id="xui-textarea" class="xui-textarea" placeholder="Wklej długi tekst..."></textarea>
        
        <!-- 🔥 NOWE BUTTONY JSON + TEKST -->
        <button class="xui-btn xui-btn-primary" onclick="XUI.importWorldJSON('psyche-world1')" style="background:linear-gradient(135deg,#8b5cf6,#7c3aed)!important;">🌌 IMPORT PSYCHE 80</button>
        <button class="xui-btn xui-btn-primary" onclick="XUI.processText()">🚀 STWÓRZ KSIĄŻKĘ</button>
        
        <div id="worlds" class="xui-panel">
          <h4 style="margin:0 0 16px 0;color:#ff6b6b;">🌌 IMPORTER ŚWIATÓW JSON</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <button class="xui-btn" onclick="XUI.importWorldJSON('psyche-world1')" style="background:#8b5cf6;color:white;">PSYCHE 80</button>
            <button class="xui-btn" onclick="XUI.importWorldJSON('multiworld2')" style="background:#10b981;color:white;">MULTIŚWIAT 2</button>
          </div>
        </div>
        
        <div id="xui-status" style="margin-top:16px;padding:12px;border-radius:12px;font-size:14px;display:none;"></div>
        <div id="stats" class="xui-panel">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0;">
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;text-align:center;">
              <div style="font-size:32px;color:#ff6b6b;">📚 ${window.XUI_MASTER.stats.books}</div><div style="font-size:14px;opacity:0.8;">Książki</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;text-align:center;">
              <div style="font-size:32px;color:#4ecdc4;">📖 ${window.XUI_MASTER.stats.chapters}</div><div style="font-size:14px;opacity:0.8;">Rozdziały</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    setTimeout(() => panel.style.transform = 'translateX(0)', 50);
    
    document.getElementById('xui-close').onclick = () => panel.remove();
    bindTabEvents();
  }

  // === FUNKCJE GŁÓWNE ===
  window.XUI = {
    processText() {
      const textarea = document.getElementById('xui-textarea');
      const titleInput = document.getElementById('xui-title');
      const status = document.getElementById('xui-status');
      
      const text = textarea.value.trim();
      const title = titleInput.value.trim() || `XBOOK_${Date.now()}`;
      
      if (text.length < 100) {
        status.textContent = "⚠️ Min. 100 znaków";
        status.style.display = 'block';
        status.style.color = '#ff8e8e';
        return;
      }
      
      status.textContent = "🚀 Tworzę książkę...";
      status.style.display = 'block';
      status.style.color = '#4ecdc4';
      
      try {
        const chapters = text.split('\n\n').slice(0,8).map((p,i) => ({
          title: `Rozdział ${i+1}`,
          content: p.slice(0,3500)
        })).filter(c => c.content.length > 100);
        
        const book = {
          title: title.slice(0,60),
          description: `XUI v1.3 | ${chapters.length} rozdziałów`,
          cover: `https://placehold.co/300x400/ff6b6b/fff?text=${title.slice(0,6)}`,
          chapters
        };
        
        if (window.WORLD_PSYCHE?.gates?.[0]) {
          window.WORLD_PSYCHE.gates[0].books.unshift(book);
          
          if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
          if (window.saveWorldNow) window.saveWorldNow("XUI: Nowa książka");
          
          status.innerHTML = `✅ ${title}<br>${chapters.length} rozdziałów → PSYCHE`;
          status.style.color = '#10b981';
          textarea.value = ''; titleInput.value = '';
        } else {
          status.textContent = "❌ Brak WORLD_PSYCHE";
          status.style.color = '#ff6b6b';
        }
      } catch(e) {
        status.textContent = `❌ Błąd: ${e.message}`;
        status.style.color = '#ff6b6b';
      }
    },

    // 🌌 GŁÓWNY IMPORTER JSON ŚWIATÓW
    importWorldJSON: async function(filename = 'psyche-world1') {
      const status = document.getElementById('xui-status');
      status.innerHTML = `🚀 Ładuję <strong>ŚWIAT ${filename.toUpperCase()}</strong>...`;
      status.style.color = '#ff6b6b';
      status.style.display = 'block';

      try {
        const response = await fetch(`js/${filename}.json`);
        if (!response.ok) throw new Error(`Plik js/${filename}.json nie istnieje`);
        
        const worldData = await response.json();
        console.log('✅ JSON załadowany:', worldData.name, worldData.gates.length, 'bram');

        // NAWRTÓĆ/ROZSZERZ BRAMY
        worldData.gates.forEach((gateData, index) => {
          if (window.WORLD_PSYCHE?.gates[index]) {
            // NAWRTÓĆ istniejącą bramę
            window.WORLD_PSYCHE.gates[index].name = gateData.name;
            window.WORLD_PSYCHE.gates[index].color = gateData.color;
            window.WORLD_PSYCHE.gates[index].sub = gateData.sub || '';
            window.WORLD_PSYCHE.gates[index].tag = gateData.tag || '';
            window.WORLD_PSYCHE.gates[index].books = gateData.books;
          } else {
            // DODAJ nową bramę
            window.WORLD_PSYCHE.gates[index] = gateData;
          }
        });

        // RENDER + SAVE
        if (window.renderWorld) window.renderWorld(window.WORLD_PSYCHE);
        if (window.saveWorldNow) window.saveWorldNow(`Import: ${worldData.name}`);
        
        const totalBooks = worldData.gates.reduce((sum,g)=>sum+g.books.length,0);
        status.innerHTML = `✅ <strong>${worldData.name}</strong><br>📚 ${totalBooks} książek | ${worldData.gates.length} bram`;
        status.style.color = '#10b981';
        
        window.XUI_MASTER.updateStats();
        console.log(`🌌 ${totalBooks} KSIĄŻĘK ${worldData.name} zaimportowanych!`);
        
      } catch(error) {
        status.innerHTML = `❌ Błąd: ${error.message}<br>Sprawdź czy plik <code>js/${filename}.json</code> istnieje`;
        status.style.color = '#ef4444';
        console.error('Import error:', error);
      }
    }
  };

  function bindTabEvents() {
    document.querySelectorAll('.xui-tab').forEach(tab => {
      tab.onclick = function() {
        document.querySelectorAll('.xui-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.xui-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const targetPanel = document.getElementById(this.dataset.tab);
        if (targetPanel) targetPanel.classList.add('active');
      };
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(createXuiFab, 1000));
    } else {
      setTimeout(createXuiFab, 500);
    }
  }

  init();
})();
