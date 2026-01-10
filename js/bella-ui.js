/* =====================================
   BELLA-RED UI v9.1 – ZAKŁADKA STRONY (BEZ KONSOLI!)
   Redaktorka naczelna w UI | Tekst → Książka + Rozdziały
   ===================================== */

(function() {
  if (window.BELLA_UI) return;
  window.BELLA_UI = true;

  console.log("😈🔥 BELLA-RED v9.1 – ZAKŁADKA UI AKTYWNA!");

  // === BELLA REDAKTORKA LOGIKA ===
  window.BELLA_REDAKTOR = {
    power: 125000,
    processBook(text, bookTitle) {
      const chapters = this.splitIntoChapters(text, bookTitle);
      this.createBookWithChapters(bookTitle, chapters);
      return chapters;
    },

    splitIntoChapters(text, title) {
      const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
      const chapters = []; let chapterNum = 1; let current = { title: `Rozdział ${chapterNum}`, content: "" };

      paragraphs.forEach(para => {
        if (para.trim().length < 100 && para === para.toUpperCase().trim()) {
          if (current.content.length > 500) {
            chapters.push(current); chapterNum++; 
            current = { title: para.trim().slice(0, 60), content: "" };
          }
        } else {
          current.content += para + "\n\n";
        }
        if (current.content.length > 2800) {
          chapters.push(current); chapterNum++; 
          current = { title: `${title} ${chapterNum}`, content: para + "\n\n" };
        }
      });
      if (current.content.length > 200) chapters.push(current);
      return chapters;
    },

    createBookWithChapters(title, chapters) {
      if (!window.WORLD_PSYCHE?.gates?.[0]?.books) return;
      
      const newBook = {
        title: title.slice(0, 60),
        desc: `BELLA-RED v9.1 | ${chapters.length} rozdziałów`,
        coverImg: `https://via.placeholder.com/300x400/ff6b6b/fff?text=${title.slice(0,8).toUpperCase()}`,
        chapters: chapters.map(ch => ({
          title: ch.title.slice(0, 80),
          content: ch.content.trim().slice(0, 4000)
        }))
      };

      window.WORLD_PSYCHE.gates[0].books.unshift(newBook);
      if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
      if (window.saveWorldNow) window.saveWorldNow("BELLA-RED: Nowa książka");
    }
  };

  // === ZAKŁADKA BELLA UI ===
  function createBellaTab() {
    if (document.getElementById('bella-tab')) return;

    const tab = document.createElement('div');
    tab.id = 'bella-tab';
    tab.style.cssText = `
      position: fixed; bottom: 30px; right: 30px; z-index: 10002;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #ff0066, #8b5cf6);
      border: 3px solid rgba(255,255,255,0.4); cursor: pointer;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      box-shadow: 0 12px 40px rgba(255,0,102,0.5); backdrop-filter: blur(15px);
      transition: all 0.4s cubic-bezier(0.25,0.46,0.45,0.94); font-family: -apple-system, sans-serif;
      color: white; font-weight: bold; font-size: 14px; user-select: none;
    `;
    
    tab.innerHTML = `
      <div style="font-size: 20px;">😈</div>
      <div style="font-size: 10px; margin-top: 2px;">BELLA</div>
    `;
    
    tab.onclick = toggleBellaPanel;
    document.body.appendChild(tab);
  }

  // === GŁÓWNY PANEL BELLA ===
  function toggleBellaPanel() {
    let panel = document.getElementById('bella-panel');
    
    if (panel) {
      panel.remove();
      return;
    }

    panel = document.createElement('div');
    panel.id = 'bella-panel';
    panel.style.cssText = `
      position: fixed; bottom: 110px; right: 30px; z-index: 10001;
      width: 380px; max-height: 70vh; background: rgba(15,15,25,0.98);
      border-radius: 20px; border: 2px solid rgba(255,0,102,0.4);
      box-shadow: 0 20px 60px rgba(255,0,102,0.4); backdrop-filter: blur(25px);
      padding: 24px; overflow-y: auto; font-family: -apple-system, sans-serif;
      color: white; animation: slideIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94);
    `;
    
    panel.innerHTML = `
      <style>
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        #bella-panel button { transition: all 0.3s; border-radius: 12px; border: none; cursor: pointer; font-weight: 500; padding: 12px 20px; margin: 8px 4px 0 0; font-size: 14px; }
        #bella-process { background: linear-gradient(135deg, #ff0066, #8b5cf6); color: white; width: 100%; font-size: 16px; padding: 16px; }
        #bella-textarea { width: 100%; height: 160px; padding: 16px; border: 2px solid rgba(255,0,102,0.3); border-radius: 12px; background: rgba(255,255,255,0.05); 
                         color: white; font-family: monospace; font-size: 14px; resize: vertical; box-sizing: border-box; }
        #bella-textarea::placeholder { color: rgba(255,255,255,0.5); }
        .bella-status { background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #10b981; }
        .bella-error { background: rgba(239,68,68,0.2); border: 1px solid #ef4444; color: #ef4444; }
      </style>
      
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,0,102,0.3);">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #ff0066, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 24px;">😈</div>
        <div>
          <div style="font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #ff0066, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">BELLA-RED v9.1</div>
          <div style="font-size: 13px; opacity: 0.8;">Redaktorka naczelna | Tekst → Książka + Rozdziały</div>
        </div>
        <button onclick="this.closest('#bella-panel').remove()" title="Zamknij" style="margin-left: auto; background: none; border: 2px solid rgba(255,255,255,0.3); color: white; width: 36px; height: 36px; border-radius: 50%; font-size: 18px;">×</button>
      </div>

      <div style="margin-bottom: 16px; padding: 12px; background: rgba(255,0,102,0.1); border-radius: 12px; font-size: 14px;">
        📝 Wklej długi tekst → Kliknij "📚 Stwórz książkę" → BELLA podzieli na rozdziały i doda do PSYCHE!
      </div>

      <textarea id="bella-textarea" placeholder="Wklej tutaj długi tekst...&#10;• Automatyczne wykrywanie nagłówków (WIELKIE LITERY)&#10;• Max 3k znaków na rozdział&#10;• Okładka z tytułem automatycznie"></textarea>

      <div style="display: flex; gap: 12px; margin-top: 16px;">
        <input id="bella-title" placeholder="Tytuł książki (opcjonalnie)" style="flex: 1; padding: 12px 16px; border: 2px solid rgba(255,0,102,0.3); border-radius: 12px; background: rgba(255,255,255,0.05); color: white; font-size: 14px;">
        <button id="bella-process" onclick="processBellaBook()">📚 Stwórz książkę</button>
      </div>

      <div id="bella-status" style="margin-top: 16px; padding: 12px; border-radius: 12px; font-size: 13px; display: none;"></div>
    `;
    
    document.body.appendChild(panel);
  }

  // === PROCESS TEXT → BOOK ===
  window.processBellaBook = function() {
    const textarea = document.getElementById('bella-textarea');
    const titleInput = document.getElementById('bella-title');
    const status = document.getElementById('bella-status');
    
    const text = textarea.value.trim();
    const title = titleInput.value.trim() || `KSIĄŻKA_${Math.floor(Math.random()*9999)}`;
    
    if (text.length < 100) {
      status.textContent = "⚠️ Tekst za krótki (min. 100 znaków)";
      status.className = 'bella-error';
      status.style.display = 'block';
      return;
    }

    status.textContent = `😈 BELLA redaguje "${title}"...`;
    status.className = 'bella-status';
    status.style.display = 'block';

    try {
      const chapters = window.BELLA_REDAKTOR.processBook(text, title);
      status.innerHTML = `✅ <strong>${title}</strong><br>${chapters.length} rozdziałów dodane do PSYCHE Brama 1!`;
      status.className = 'bella-status';
      textarea.value = '';
      titleInput.value = '';
      
      // Zamknij po 3s
      setTimeout(() => {
        const panel = document.getElementById('bella-panel');
        if (panel) panel.remove();
      }, 3000);
      
    } catch (e) {
      status.textContent = `❌ Błąd: ${e.message}`;
      status.className = 'bella-error';
    }
  };

  // === START ===
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(createBellaTab, 1000));
    } else {
      setTimeout(createBellaTab, 500);
    }
  }

  init();
})();
