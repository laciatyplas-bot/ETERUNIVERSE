// Pełny kod renderowania struktury – Eterniverse Master Premium PRO v13.0
// Funkcje do renderowania hierarchii (Uniwersum → Świat → Tom → Rozdział → Podrozdział → Fragment)

function renderStructure(structure, currentElementId = null, containerId = 'structure-tree') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Nie znaleziono kontenera:', containerId);
    return;
  }

  if (!structure || structure.length === 0) {
    container.innerHTML = `
      <p style="
        opacity:0.6;
        text-align:center;
        padding:3rem 2rem;
        font-size:1.1rem;
        color:var(--text-ethereal);
      ">
        Brak uniwersów w strukturze<br><br>
        Kliknij „+ Nowe Uniwersum”, by rozpocząć kreację
      </p>`;
    return;
  }

  container.innerHTML = structure.map(root => buildTreeNode(root, currentElementId)).join('');
}

// Główna funkcja budująca węzeł drzewa (rekurencyjna)
function buildTreeNode(node, currentElementId) {
  const icons = {
    'Uniwersum': '🌌',
    'Świat': '🌍',
    'Tom': '📚',
    'Rozdział': '📖',
    'Podrozdział': '📄',
    'Fragment': '📜'
  };

  const icon = icons[node.type] || '📄';
  const isSelected = node.id === currentElementId;

  let html = `
    <div class="tree-node \( {isSelected ? 'selected' : ''}" onclick="master.selectElement(' \){node.id}')">
      <span class="icon">${icon}</span>
      <strong>${escapeHtml(node.title || '(Bez tytułu)')}</strong>
      <small style="margin-left:8px; opacity:0.7; color:var(--quantum-gold);">
        ${node.type || 'Element'}
      </small>
  `;

  // Dzieci (rekurencja)
  if (node.children && node.children.length > 0) {
    html += `
      <div class="nested">
        ${node.children.map(child => buildTreeNode(child, currentElementId)).join('')}
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

// Funkcja wyboru elementu (z app.js lub globalna)
function selectElement(id) {
  if (window.master) {
    window.master.selectElement(id);
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

// Aktualizacja ścieżki bieżącego elementu
function updateCurrentPath(element, pathContainerId = 'current-path') {
  const pathEl = document.getElementById(pathContainerId);
  if (!pathEl) return;

  if (!element) {
    pathEl.textContent = '';
    return;
  }

  const path = getPathToElement(element, window.master?.data?.structure || []);
  pathEl.textContent = path.map(n => n.title || n.type).join(' → ');
}

// Pomocnicza funkcja do znajdowania ścieżki
function getPathToElement(target, structure) {
  const path = [];

  function traverse(nodes) {
    for (const node of nodes) {
      if (node.id === target.id) {
        path.unshift(node);
        return true;
      }
      if (node.children?.length) {
        if (traverse(node.children)) {
          path.unshift(node);
          return true;
        }
      }
    }
    return false;
  }

  traverse(structure);
  return path;
}

// Przykład użycia (po załadowaniu danych)
document.addEventListener('DOMContentLoaded', () => {
  // Zakładamy, że master jest już zainicjowany i ma strukturę
  if (window.master && window.master.data) {
    renderStructure(window.master.data.structure, window.master.currentElement?.id);
    updateCurrentPath(window.master.currentElement);
  }
});

// Eksport funkcji dla globalnego dostępu
window.renderStructure = renderStructure;
window.buildTreeNode = buildTreeNode;
window.updateCurrentPath = updateCurrentPath;
window.escapeHtml = escapeHtml;