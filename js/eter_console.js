/* =====================================
   ETERCONSOLE — Konsola Architekta Woli
   Twórca: Maciej Maciuszek
   ===================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Tworzymy element konsoli
  const consoleBox = document.createElement("div");
  consoleBox.style.position = "fixed";
  consoleBox.style.bottom = "20px";
  consoleBox.style.right = "20px";
  consoleBox.style.width = "420px";
  consoleBox.style.height = "300px";
  consoleBox.style.background = "rgba(10, 15, 30, 0.95)";
  consoleBox.style.border = "1px solid #38bdf8";
  consoleBox.style.borderRadius = "12px";
  consoleBox.style.color = "#e2e8f0";
  consoleBox.style.fontFamily = "monospace";
  consoleBox.style.fontSize = "13px";
  consoleBox.style.display = "flex";
  consoleBox.style.flexDirection = "column";
  consoleBox.style.zIndex = "9999";
  consoleBox.style.backdropFilter = "blur(6px)";
  consoleBox.style.boxShadow = "0 0 20px rgba(56,189,248,0.3)";

  // Pasek tytułu
  const header = document.createElement("div");
  header.textContent = "🌀 ETERCONSOLE (wklej kod JS i naciśnij Run)";
  header.style.background = "#0f172a";
  header.style.padding = "6px 10px";
  header.style.fontWeight = "bold";
  header.style.color = "#38bdf8";
  header.style.cursor = "move";
  header.style.userSelect = "none";
  consoleBox.appendChild(header);

  // Pole kodu
  const textarea = document.createElement("textarea");
  textarea.style.flex = "1";
  textarea.style.background = "#0b1220";
  textarea.style.color = "#e2e8f0";
  textarea.style.border = "none";
  textarea.style.outline = "none";
  textarea.style.padding = "8px";
  textarea.style.resize = "none";
  textarea.placeholder = "// wpisz lub wklej kod JS tutaj...";
  consoleBox.appendChild(textarea);

  // Pasek przycisków
  const footer = document.createElement("div");
  footer.style.display = "flex";
  footer.style.justifyContent = "space-between";
  footer.style.padding = "6px 8px";
  footer.style.background = "#1e293b";

  const runBtn = document.createElement("button");
  runBtn.textContent = "▶️ Run";
  runBtn.style.background = "#38bdf8";
  runBtn.style.color = "#0f172a";
  runBtn.style.fontWeight = "bold";
  runBtn.style.border = "none";
  runBtn.style.borderRadius = "6px";
  runBtn.style.padding = "4px 10px";
  runBtn.style.cursor = "pointer";

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🧹 Clear";
  clearBtn.style.background = "#475569";
  clearBtn.style.color = "#e2e8f0";
  clearBtn.style.border = "none";
  clearBtn.style.borderRadius = "6px";
  clearBtn.style.padding = "4px 10px";
  clearBtn.style.cursor = "pointer";

  footer.appendChild(runBtn);
  footer.appendChild(clearBtn);
  consoleBox.appendChild(footer);

  // Wykonaj kod po kliknięciu
  runBtn.addEventListener("click", () => {
    const code = textarea.value.trim();
    if (!code) return;
    try {
      const result = eval(code);
      console.log("💠 Wynik:", result);
      alert("✅ Kod wykonany poprawnie!");
    } catch (err) {
      console.error("❌ Błąd w kodzie:", err);
      alert("❌ Błąd w kodzie: " + err.message);
    }
  });

  clearBtn.addEventListener("click", () => {
    textarea.value = "";
  });

  // Przeciąganie konsoli myszką
  let isDragging = false;
  let offsetX, offsetY;

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - consoleBox.offsetLeft;
    offsetY = e.clientY - consoleBox.offsetTop;
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      consoleBox.style.left = e.clientX - offsetX + "px";
      consoleBox.style.top = e.clientY - offsetY + "px";
      consoleBox.style.right = "auto";
      consoleBox.style.bottom = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Skrót klawiaturowy: Ctrl + ~ (tylda)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "`") {
      consoleBox.style.display =
        consoleBox.style.display === "none" ? "flex" : "none";
    }
  });

  // Dodaj do strony
  document.body.appendChild(consoleBox);

  console.log("🌀 ETERCONSOLE załadowany. Użyj Ctrl + ` aby schować/pokazać.");
});
