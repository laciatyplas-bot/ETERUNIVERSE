/* ==============================
   CORE RENDER ENGINE — PSYCHE
   ============================== */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  const data = window.WORLD_PSYCHE;

  if (!data) {
    root.innerHTML = "<p style='color:red'>Błąd: brak danych świata.</p>";
    return;
  }

  // Tytuł świata
  const h1 = document.createElement("h1");
  h1.textContent = data.name;
  root.appendChild(h1);

  // Opis świata
  const desc = document.createElement("p");
  desc.textContent = data.description;
  root.appendChild(desc);

  // Render bram
  data.gates.forEach(gate => {
    const gateDiv = document.createElement("div");
    gateDiv.className = "gate";
    gateDiv.style.borderLeftColor = gate.color;

    const h2 = document.createElement("h2");
    h2.textContent = gate.name;
    gateDiv.appendChild(h2);

    const theme = document.createElement("p");
    theme.textContent = gate.theme;
    gateDiv.appendChild(theme);

    // Książki
    gate.books.forEach(book => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "book";

      const img = document.createElement("img");
      img.src = book.cover;
      img.alt = book.title;
      bookDiv.appendChild(img);

      const details = document.createElement("div");
      details.className = "book-details";

      const title = document.createElement("div");
      title.className = "book-title";
      title.textContent = book.title;

      const desc = document.createElement("div");
      desc.className = "book-desc";
      desc.textContent = book.description;

      details.appendChild(title);
      details.appendChild(desc);
      bookDiv.appendChild(details);

      // Audio
      if (book.audio) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = book.audio;
        bookDiv.appendChild(audio);
      }

      gateDiv.appendChild(bookDiv);
    });

    root.appendChild(gateDiv);
  });
});
