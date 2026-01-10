/* =====================================
   ETERNIVERSE — CORE ENGINE v2
   Architekt: Maciej Maciuszek
   ===================================== */

let WORLD = null;

/* ==============================
   START SYSTEMU
============================== */
function initEterniverse() {
  console.log("🌌 Uruchamiam ETERNIVERSE: PSYCHE / INTERSEEKER...");
  WORLD = loadWorldData() || WORLD_PSYCHE;
  renderWorld(WORLD);
  setupUI();
  belleSpeak("System Kroniki Woli aktywowany.");
}

/* ==============================
   RENDER ŚWIATA
============================== */
function renderWorld(world) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = world.name;
  app.appendChild(title);

  const desc = document.createElement("p");
  desc.textContent = world.description;
  app.appendChild(desc);

  world.gates.forEach((gate) => {
    const gateBox = document.createElement("div");
    gateBox.className = "gate";
    gateBox.style.borderColor = gate.color;

    const gateTitle = document.createElement("h3");
    gateTitle.textContent = gate.name;
    gateTitle.style.color = gate.color;
    gateBox.appendChild(gateTitle);

    const gateSub = document.createElement("p");
    gateSub.textContent = gate.sub;
    gateBox.appendChild(gateSub);

    gate.books.forEach((book, i) => {
      const bookBox = document.createElement("div");
      bookBox.className = "book";

      const left = document.createElement("div");
      left.className = "book-left";

      const img = document.createElement("img");
      img.src = book.cover || "media/covers/default.jpg";
      img.alt = book.title;
      img.onerror = () => (img.src = "media/covers/default.jpg");

      const info = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = book.title;

      const stat = document.createElement("div");
      stat.className = "status";
      stat.textContent = book.status ? book.status.toUpperCase() : "IDEA";

      info.appendChild(name);
      info.appendChild(stat);
      left.appendChild(img);
      left.appendChild(info);

      const right = document.createElement("div");
      if (book.audio) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = book.audio;
        right.appendChild(audio);
      }

      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = () => openEditor(gate, book);
      right.appendChild(editBtn);

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = () => deleteBook(gate, book);
      right.appendChild(delBtn);

      bookBox.appendChild(left);
      bookBox.appendChild(right);
      gateBox.appendChild(bookBox);
    });

    app.appendChild(gateBox);
  });
}

/* ==============================
   EDYTOR I UI
============================== */
function setupUI() {
  const addBtn = document.getElementById("addBookBtn");
  const exportBtn = document.getElementById("exportBtn");
  const modal = document.getElementById("modal");
  const cancelBtn = document.getElementById("cancelBtn");
  const saveBtn = document.getElementById("saveBtn");
  const select = document.getElementById("gateSelect");

  // Załaduj bramy
  select.innerHTML = "";
  WORLD.gates.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    select.appendChild(opt);
  });

  addBtn.onclick = () => {
    currentEdit = null;
    document.getElementById("modalTitle").textContent = "Nowa książka";
    modal.classList.remove("hidden");
    belleSpeak("Nowa księga pojawia się w świadomości...");
  };

  cancelBtn.onclick = () => modal.classList.add("hidden");

  saveBtn.onclick = () => {
    const gid = parseInt(select.value);
    const gate = WORLD.gates.find((g) => g.id === gid);
    const title = document.getElementById("bookTitle").value;
    const desc = document.getElementById("bookDesc").value;
    const cover = document.getElementById("bookCover").value;
    const audio = document.getElementById("bookAudio").value;

    if (!title.trim()) {
      alert("Podaj tytuł książki!");
      return;
    }

    if (currentEdit) {
      Object.assign(currentEdit, { title, description: desc, cover, audio });
      belleSpeak(`Zaktualizowano książkę: ${title}`);
    } else {
      gate.books.push({
        title,
        description: desc,
        cover,
        audio,
        status: "idea",
      });
      belleSpeak(`Dodano nową książkę: ${title}`);
    }

    modal.classList.add("hidden");
    saveWorldData();
    renderWorld(WORLD);
  };

  exportBtn.onclick = () => exportWorldJSON();
}

let currentEdit = null;

function openEditor(gate, book) {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  document.getElementById("modalTitle").textContent = "Edytuj książkę";

  const select = document.getElementById("gateSelect");
  select.value = gate.id;
  document.getElementById("bookTitle").value = book.title;
  document.getElementById("bookDesc").value = book.description || "";
  document.getElementById("bookCover").value = book.cover || "";
  document.getElementById("bookAudio").value = book.audio || "";

  currentEdit = book;
}

/* ==============================
   ZAPIS I ODCZYT
============================== */
function saveWorldData() {
  localStorage.setItem("ETERNIVERSE_WORLD_PSYCHE", JSON.stringify(WORLD));
}

function loadWorldData() {
  const data = localStorage.getItem("ETERNIVERSE_WORLD_PSYCHE");
  return data ? JSON.parse(data) : null;
}

/* ==============================
   EKSPORT JSON
============================== */
function exportWorldJSON() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(WORLD, null, 2));
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "ETERNIVERSE_WORLD_PSYCHE.json";
  a.click();
  belleSpeak("Eksport ukończony. Kronika zapisana w pamięci pola.");
}

/* ==============================
   USUWANIE KSIĄŻEK
============================== */
function deleteBook(gate, book) {
  if (confirm(`Usunąć książkę "${book.title}"?`)) {
    gate.books = gate.books.filter((b) => b !== book);
    saveWorldData();
    renderWorld(WORLD);
    belleSpeak(`Usunięto książkę ${book.title}`);
  }
}

/* ==============================
   BELLE — HOLOGRAFICZNY ASYSTENT
============================== */
function belleSpeak(msg) {
  const el = document.getElementById("belleSpeech");
  if (!el) return;
  el.textContent = msg;
  setTimeout(() => {
    el.textContent = "Czekam na Twoje intencje...";
  }, 6000);
}
