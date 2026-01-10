/* =====================================
   ETERCONSOLE — Konsola Architekta Woli v1.2
   Architekt: Maciej Maciuszek + AI Assistant
   PEŁNY POPRAWIONY – kompatybilny z engine_loader v2.2
   ===================================== */

(function() {
  // Singleton – wykonuje się tylko raz
  if (window.eterConsoleLoaded) {
    console.log("🌀 ETERCONSOLE v1.2 już załadowany");
    return;
  }
  window.eterConsoleLoaded = true;

  console.log("🌀 Inicjalizacja ETERCONSOLE v1.2...");

  // Czekaj na DOM
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    createConsole();
  }

  function createConsole() {
    // Usuń poprzednią konsolę jeśli istnieje
    const existing = document.getElementById('eter-console');
    if (existing) existing.remove();

    // === GŁÓWNY KONTENER ===
    const consoleBox = document.createElement("div");
    consoleBox.id = "eter-console";
    Object.assign(consoleBox.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "420px",
      height: "320px",
      background: "rgba(10, 15, 30, 0.97)",
      border: "2px solid #38bdf8",
      borderRadius: "16px",
      color: "#e2e8f0",
      fontFamily: "'Fira Code', 'Roboto Mono', monospace",
      fontSize: "13px",
      display: "none", // Schowana na start
      flexDirection: "column",
      zIndex: "10000",
      backdropFilter: "blur(12px)",
      boxShadow: "0 20px 40px rgba(56,189,248,0.25)",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    });

    // === NAGŁÓWEK (przeciąganie + przycisk zamknij) ===
    const header = document.createElement("div");
    header.innerHTML = `
      <span style="font-weight: bold; color: #38bdf8;">🌀 ETERCONSOLE v1.2</span>
      <span style="font-size: 11px; color: #94a3b8; margin-left: auto;">Ctrl + \` (toggle)</span>
    `;
    Object.assign(header.style, {
      background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)",
      padding: "10px 14px",
      cursor: "move",
      userSelect: "none",
      borderBottom: "1px solid rgba(56,189,248,0.2)",
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
    });

    // Przycisk zamknij
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    Object.assign(closeBtn.style, {
      background: "rgba(239,68,68,0.8)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "22px",
      height: "22px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      marginLeft: "8px",
    });
    closeBtn.onclick = () => consoleBox.style.display = "none";
    header.appendChild(closeBtn);

    consoleBox.appendChild(header);

    // === OBSZAR KODU ===
    const textarea = document.createElement("textarea");
    Object.assign(textarea.style, {
      flex: "1",
      background: "rgba(11,18,32,0.9)",
      color: "#e2e8f0",
      border: "none",
      outline: "none",
      padding: "14px",
      resize: "none",
      fontFamily: "inherit",
      fontSize: "13px",
      lineHeight: "1.5",
    });
    textarea.placeholder = `// 🌀 ETERCONSOLE v1.2 – Konsola Architekta Woli
// Wpisz JavaScript i naciśnij ▶️ Run lub Ctrl+Enter

// Przykłady:
window.WORLD_PSYCHE.gates[0].books.push({
  title: "Testowa Księga",
  description: "Dodana przez ETERCONSOLE",
  status: "idea"
});

console.log("Liczba książek:", window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0));

// renderWorld(window.WORLD_PSYCHE); // Odśwież widok`;

    consoleBox.appendChild(textarea);

    // === PASEK NARZĘDZI ===
    const toolbar = document.createElement("div");
    Object.assign(toolbar.style, {
      display: "flex",
      gap: "6px",
      padding: "8px 12px",
      background: "rgba(30,41,59,0.8)",
      borderTop: "1px solid rgba(56,189,248,0.1)",
    });

    // Run
    const runBtn = document.createElement("button");
    runBtn.textContent = "▶️ Run";
    Object.assign(runBtn.style, {
      background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
      color: "#0f172a",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      padding: "6px 14px",
      cursor: "pointer",
      fontSize: "12px",
      boxShadow: "0 2px 8px rgba(56,189,248,0.3)",
    });
    runBtn.onmouseover = () => runBtn.style.transform = "scale(1.05)";
    runBtn.onmouseout = () => runBtn.style.transform = "scale(1)";

    // Clear
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "🧹 Clear";
    Object.assign(clearBtn.style, {
      background: "rgba(71,85,105,0.8)",
      color: "#e2e8f0",
      border: "none",
      borderRadius: "8px",
      padding: "6px 14px",
      cursor: "pointer",
      fontSize: "12px",
    });

    // Export state
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "💾 State";
    Object.assign(exportBtn.style, {
      background: "rgba(34,197,94,0.8)",
      color: "#0f172a",
      border: "none",
      borderRadius: "8px",
      padding: "6px 14px",
      cursor: "pointer",
      fontSize: "12px",
    });

    toolbar.append(runBtn, clearBtn, exportBtn);
    consoleBox.appendChild(toolbar);

    // === FUNKCJE ===
    function executeCode() {
      const code = textarea.value.trim();
      if (!code) {
        textarea.placeholder = "// Wpisz kod przed wykonaniem...";
        setTimeout(() => textarea.focus(), 100);
        return;
      }

      try {
        // Izolowane wykonanie z dostępem do globali ETERNIVERSE
        const func = new Function(`
          try {
            ${code};
            return "✅ Wykonano pomyślnie";
          } catch(e) {
            throw e;
          }
        `);
        const result = func();
        console.log("🌀 ETERCONSOLE:", result);
        textarea.style.background = "rgba(34,197,94,0.2)";
        setTimeout(() => textarea.style.background = "", 1000);
      } catch (err) {
        console.error("🌀 ETERCONSOLE ERROR:", err);
        textarea.style.background = "rgba(239,68,68,0.2)";
        alert("❌ Błąd: " + err.message);
        setTimeout(() => textarea.style.background = "", 1000);
      }
    }

    function exportState() {
      if (window.WORLD_PSYCHE) {
        const dataStr = JSON.stringify(window.WORLD_PSYCHE, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = 'ETERIVERSE_PSYCHE_STATE.json';
        link.click();
      }
    }

    // === EVENTY ===
    runBtn.onclick = executeCode;
    clearBtn.onclick = () => {
      textarea.value = "";
      textarea.placeholder = "// Kod wyczyszczony. Wklej nowy kod...";
    };
    exportBtn.onclick = exportState;

    // Skróty klawiszowe
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        const isVisible = consoleBox.style.display !== "none";
        consoleBox.style.display = isVisible ? "none" : "flex";
        if (!isVisible) textarea.focus();
      }
      
      if (e.ctrlKey && e.key === "Enter" && consoleBox.style.display !== "none") {
        e.preventDefault();
        executeCode();
      }
    });

    // Przeciąganie
    let isDragging = false, offsetX, offsetY;
    header.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - consoleBox.offsetLeft;
      offsetY = e.clientY - consoleBox.offsetTop;
      document.body.style.userSelect = "none";
      e.preventDefault();
    };

    document.onmousemove = (e) => {
      if (isDragging) {
        consoleBox.style.right = "auto";
        consoleBox.style.bottom = "auto";
        consoleBox.style.left = e.clientX - offsetX + "px";
        consoleBox.style.top = e.clientY - offsetY + "px";
      }
    };

    document.onmouseup = () => {
      isDragging = false;
      document.body.style.userSelect = "";
    };

    // === INTEGRACJA Z BELLE ===
    if (typeof window.belleSpeak === 'function') {
      window.belleSpeak("🌀 ETERCONSOLE v1.2 gotowy. Ctrl + `");
    }

    // Dodaj do body
    document.body.appendChild(consoleBox);
    console.log("🌀 ETERCONSOLE v1.2 – pełna integracja z ETERNIVERSE!");

    // Otwórz przycisk Belle jeśli istnieje
    const belleBtn = document.getElementById("openConsoleBtn");
    if (belleBtn) {
      belleBtn.onclick = () => {
        consoleBox.style.display = "flex";
        textarea.focus();
        if (typeof window.belleSpeak === 'function') {
          window.belleSpeak("🌀 ETERCONSOLE otwarty");
        }
      };
    }
  }

  // START
  init();
})();
