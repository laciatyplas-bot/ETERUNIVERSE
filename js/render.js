// Pełny kod renderowania Mapy Bram – Eterniverse Master Premium PRO v13.0
// Renderuje 10 eterycznych bram z książkami, ikonami i interakcją

function renderMapa(mapaData, containerId = 'mapa-grid') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Kontener mapy nie znaleziony:', containerId);
    return;
  }

  if (!mapaData || mapaData.length === 0) {
    container.innerHTML = `
      <p style="
        opacity:0.6;
        text-align:center;
        padding:3rem 2rem;
        font-size:1.1rem;
        color:var(--text-ethereal);
      ">
        Brak eterycznych bram w pamięci<br><br>
        Struktura mapy zostanie przywrócona przy następnym uruchomieniu
      </p>`;
    return;
  }

  // Sortuj bramy po ID (1-10)
  const sortedMapa = [...mapaData].sort((a, b) => a.id - b.id);

  container.innerHTML = sortedMapa.map(brama => buildBramaCard(brama)).join('');
}

// Buduje pojedynczą kartę bramy
function buildBramaCard(brama) {
  const bookCount = brama.books?.length || 0;
  const bookList = brama.books 
    ? brama.books.map(book => `• ${escapeHtml(book)}`).join('<br>')
    : '<em style="opacity:0.6;">Brak opublikowanych tytułów</em>';

  return `
    <div class="tree-node brama-card" onclick="master.insertBrama(${brama.id})">
      <div style="display:flex; align-items:center; margin-bottom:1rem;">
        <span class="icon" style="font-size:1.8rem; margin-right:1rem;">🔮</span>
        <strong style="font-size:1.4rem; color:var(--aether-glow); text-shadow:0 0 15px rgba(0,224,255,0.4);">
          ${escapeHtml(brama.name)}
        </strong>
      </div>
      
      <div style="
        background:rgba(30,20,80,0.4);
        border-radius:14px;
        padding:1.2rem;
        margin-top:1rem;
        border-left:4px solid var(--quantum-gold);
        font-size:0.95rem;
        line-height:1.6;
      ">
        <div style="margin-bottom:0.8rem; opacity:0.8;">
          <strong>${bookCount} opublikowanych ksiąg</strong>
        </div>
        <div style="opacity:0.9;">
          ${bookList}
        </div>
      </div>

      <div style="
        margin-top:1.2rem;
        font-size:0.9rem;
        opacity:0.7;
        text-align:center;
        padding:0.8rem;
        background:rgba(0,224,255,0.05);
        border-radius:12px;
      ">
        Kliknij, aby wstawić do bieżącego elementu
      </div>
    </div>
  `;
}

// Funkcja wstawiania treści bramy do edytora (z app.js lub globalna)
function insertBrama(bramaId) {
  if (window.master) {
    window.master.insertBrama(bramaId);
  } else {
    console.error('Master nie załadowany');
  }
}

// Bezpieczne escapowanie HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Przykład użycia po załadowaniu danych
document.addEventListener('DOMContentLoaded', () => {
  if (window.master && window.master.data) {
    renderMapa(window.master.data.mapa);
  }
});

// Eksport funkcji dla globalnego dostępu
window.renderMapa = renderMapa;
window.buildBramaCard = buildBramaCard;