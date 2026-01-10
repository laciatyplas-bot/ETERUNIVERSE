/* =====================================
   ETERCONSOLE — Konsola Architekta Woli v1.1
   Twórca: Maciej Maciuszek
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  // === TWORZENIE ELEMENTU KONSOLI ===
  const consoleBox = document.createElement("div");
  consoleBox.id = "eter-console";
  Object.assign(consoleBox.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "420px",
    height: "300px",
    background: "rgba(10, 15, 30, 0.95)",
    border: "1px solid #38bdf8",
    borderRadius: "12px",
    color: "#e2e8f0",
    fontFamily: "monospace",
    fontSize: "13px",
    display: "flex",
    flexDirection: "column",
    zIndex: "9999",
    backdropFilter: "blur(6px)",
    boxShadow: "0 0 20px rgba(56,189,248,0.3)",
    overflow: "hidden",
  });

  // === NAGŁÓWEK (przeciąganie) ===
  const header = document.createElement("div");
  header.textContent = "🌀 ETERCONSOLE v1.1 (Ctrl + ` aby schować/pokazać)";
  Object.assign(header.style, {
    background: "#0f172a",
    padding: "6px 10px",
    fontWeight: "bold",
    color: "#38bdf8",
    cursor: "move",
    userSelect: "none",
  });
  consoleBox.appendChild(header);

  // === POLE KODU ===
  const textarea = document.createElement("textarea");
  Object.assign(textarea.style, {
    flex: "1",
    background: "#0b1220",
    color: "#e2e8f0",
    border: "none",
    outline: "none",
    padding: "8px",
    resize: "none",
    fontFamily: "inherit",
    fontSize: "inherit",
  });
  textarea.placeholder = "// Wpisz lub wklej kod JavaScript...\n// Naciśnij Run lub Ctrl + Enter";
  consoleBox.appendChild(textarea);

  // === PASEK PRZYCISKÓW ===
  const footer = document.createElement("div");
  Object.assign(footer.style, {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 8px",
    background: "#1e293b",
  });

  const runBtn = document.createElement("button");
  runBtn.textContent = "▶️ Run";
  Object.assign(runBtn.style, {
    background: "#38bdf8",
    color: "#0f172a",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
  });
  footer.appendChild(runBtn);

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🧹 Clear";
  Object.assign(clearBtn.style, {
    background: "#475569",
    color: "#e2e8f0",
    border: "none",
    borderRadius: "6px",
    padding: "4px 10px",
    cursor: "pointer",
  });
  footer.appendChild(clearBtn);

  consoleBox.appendChild(footer);

  // === PRZECIĄGANIE KONSOLI ===
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - consoleBox.offsetLeft;
    offsetY = e.clientY - consoleBox.offsetTop;
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      consoleBox.style.left = `${e.clientX - offsetX}px`;
      consoleBox.style.top = `${e.clientY - offsetY}px`;
      consoleBox.style.right = "auto";
      consoleBox.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // === SKRÓT KLAWISZOWY Ctrl + ` ===
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      consoleBox.style.display = consoleBox.style.display === "none" ? "flex" : "none";
    }
  });

  // === WYKONANIE KODU ===
  function executeCode() {
    const code = textarea.value.trim();
    if (!code) return;

    try {
      // Bezpieczniejsze wykonanie kodu (bez eval)
      const result = new Function(code)();
      console.log("💠 Wynik wykonania:", result);
      alert("✅ Kod wykonany poprawnie!\nWynik w konsoli.");
    } catch (err) {
      console.error("❌ Błąd w kodzie:", err);
      alert("❌ Błąd wykonania kodu:\n" + err.message);
    }
  }

  runBtn.addEventListener("click", executeCode);

  // Ctrl + Enter też wykonuje
  textarea.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      executeCode();
    }
  });

  clearBtn.addEventListener("click", () => {
    textarea.value = "";
  });

  // Dodaj konsolę do strony
  document.body.appendChild(consoleBox);

  console.log("🌀 ETERCONSOLE v1.1 załadowany. Użyj Ctrl + ` aby schować/pokazać.");
});
