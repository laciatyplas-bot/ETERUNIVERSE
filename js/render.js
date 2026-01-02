// Pełny kod renderowania Panelu Edycji – Eterniverse Master Premium PRO v13.0
// Renderuje tytuł, treść, ścieżkę i metadane bieżącego elementu

function renderEditPanel(currentElement, options = {}) {
  const {
    titleContainerId = 'element-title',
    contentContainerId = 'element-content',
    pathContainerId = 'current-path',
    metaContainerId = 'element-meta' // opcjonalny kontener na metadane
  } = options;

  // === TYTUŁ ===
  const titleInput = document.getElementById(titleContainerId);
  if (titleInput) {
    titleInput.value = currentElement?.title || '';
    titleInput.placeholder = currentElement?.type 
      ? `Tytuł ${currentElement.type.toLowerCase()}...` 
      : 'Tytuł elementu...';
    
    // Dodatkowe atrybuty dla lepszego UX
    titleInput.dataset.elementId = currentElement?.id || '';
  }

  // === TREŚĆ ===
  const contentTextarea = document.getElementById(contentContainerId);
  if (contentTextarea) {
    contentTextarea.value = currentElement?.content || '';
    contentTextarea.placeholder = currentElement 
      ? `Tu rozwija się \( {currentElement.type.toLowerCase()} „ \){currentElement.title || 'nowy element'}”...\nAI może przyspieszyć kreację.`
      : 'Wybierz element w hierarchii, aby edytować jego treść...';
  }

  // === ŚCIEŻKA BIEŻĄCEGO ELEMENTU ===
  const pathEl = document.getElementById(pathContainerId);
  if (pathEl) {
    if (!currentElement) {
      pathEl.textContent = '';
      pathEl.style.opacity = '0.5';
    } else {
      const path = getPathToElement(currentElement, window.master?.data?.structure || []);
      pathEl.innerHTML = path.map((node, index) => {
        const icon = {
          'Uniwersum': '🌌',
          'Świat': '🌍',
          'Tom': '📚',
          'Rozdział': '📖',
          'Podrozdział': '📄',
          'Fragment': '📜'
        }[node.type] || '📄';

        const isLast = index === path.length - 1;
        return `
          <span style="opacity:\( {isLast ? '1' : '0.7'}; font-weight: \){isLast ? '700' : '500'};">
            ${icon} ${escapeHtml(node.title || node.type)}
          </span>
          ${!isLast ? '<span style="margin:0 12px; opacity:0.5;">→</span>' : ''}
        `;
      }).join('');
      pathEl.style.opacity = '1';
    }
  }

  // === METADANE (opcjonalne – typ, ID, data utworzenia, słowo count) ===
  const metaEl = document.getElementById(metaContainerId);
  if (metaEl) {
    if (!currentElement) {
      metaEl.innerHTML = '<em style="opacity:0.5;">Wybierz element, aby zobaczyć metadane</em>';
    } else {
      const wordCount = wordCount(currentElement.content || '');
      const createdDate = currentElement.created 
        ? new Date(currentElement.created).toLocaleDateString('pl-PL') 
        : 'nieznana';

      metaEl.innerHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:1.5rem; font-size:0.95rem; opacity:0.8; margin-top:1rem;">
          <div><strong>Typ:</strong> ${escapeHtml(currentElement.type || 'Nieznany')}</div>
          <div><strong>ID:</strong> <code style="background:rgba(0,224,255,0.1); padding:2px 8px; border-radius:6px;">${currentElement.id}</code></div>
          <div><strong>Utworzono:</strong> ${createdDate}</div>
          <div><strong>Słów:</strong> ${wordCount}</div>
          <div><strong>Profil:</strong> ${window.master?.currentProfile?.toUpperCase() || 'WATTPAD'}</div>
        </div>
      `;
    }
  }

  // Focus na tytuł jeśli nowy element
  if (currentElement && titleInput && document.activeElement !== titleInput) {
    titleInput.focus();
  }
}

// Pomocnicza funkcja do ścieżki (jeśli nie ma w app.js)
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

// Liczenie słów
function wordCount(text = '') {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

// Bezpieczne escapowanie
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Przykład użycia po zmianie elementu
function onElementSelected(element) {
  renderEditPanel(element, {
    titleContainerId: 'element-title',
    contentContainerId: 'element-content',
    pathContainerId: 'current-path',
    metaContainerId: 'element-meta' // opcjonalnie dodaj <div id="element-meta"></div> w HTML
  });
}

// Globalny eksport
window.renderEditPanel = renderEditPanel;
window.onElementSelected = onElementSelected;