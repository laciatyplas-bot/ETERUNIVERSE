// bella_author_mode_pro.js - Eterniverse Author Mode PRO v7.0
// Profesjonalny tryb autora: pełna hierarchia, edycja, backup, eksport

(() => {
  'use strict';

  // === KONFIGURACJA ===
  const STORAGE_KEY = 'bella_author_mode_universe_pro';
  const HIERARCHY_ORDER = ['Uniwersum', 'Świat', 'Tom', 'Rozdział', 'Podrozdział', 'Fragment'];

  // === STAN GLOBALNY ===
  let universeData = loadData();
  let selectedElementId = null;

  // === ELEMENTY DOM ===
  const els = {
    universeList: document.getElementById('universeList'),
    output: document.getElementById('output'),
    archiveOutput: document.getElementById('archiveOutput'),

    type: document.getElementById('elementType'),
    title: document.getElementById('elementTitle'),
    date: document.getElementById('elementDate'),
    version: document.getElementById('elementVersion'),
    language: document.getElementById('elementLanguage'),
    content: document.getElementById('elementContent'),
    notes: document.getElementById('elementNotes'),

    saveBtn: document.getElementById('saveElementBtn'),
    deleteBtn: document.getElementById('deleteElementBtn'),
    addUniverseBtn: document.getElementById('addUniverseBtn'),
    addChildBtn: document.getElementById('addChildBtn'),

    backupBtn: document.getElementById('backupAllBtn'),
    exportBtn: document.getElementById('exportBtn'),
    exportFormat: document.getElementById('exportSelect')
  };

  // === POMOCNICZE ===
  function generateId() {
    return 'el_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Błąd ładowania danych uniwersum:', e);
      return [];
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(universeData));
    } catch (e) {
      console.error('Błąd zapisu danych:', e);
      alert('Nie udało się zapisać danych (localStorage pełny?)');
    }
  }

  // Rekurencyjne wyszukiwanie elementu po ID
  function findElementById(id, nodes = universeData, parent = null) {
    for (const node of nodes) {
      if (node.id === id) return { node, parent };
      if (node.children?.length) {
        const found = findElementById(id, node.children, node);
        if (found) return found;
      }
    }
    return null;
  }

  // Określ następny typ w hierarchii
  function getNextChildType(currentType) {
    const idx = HIERARCHY_ORDER.indexOf(currentType);
    return idx >= 0 && idx < HIERARCHY_ORDER.length - 1 ? HIERARCHY_ORDER[idx + 1] : 'Fragment';
  }

  // === RENDEROWANIE ===
  function renderUniverseTree() {
    els.universeList.innerHTML = '';

    if (universeData.length === 0) {
      els.universeList.innerHTML = '<p style="padding:1.5rem; opacity:0.6; text-align:center;">Brak uniwersów – dodaj pierwsze</p>';
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'hierarchy-tree';

    universeData.forEach(root => ul.appendChild(createTreeNode(root)));
    els.universeList.appendChild(ul);
  }

  function createTreeNode(element) {
    const li = document.createElement('li');
    li.dataset.id = element.id;
    li.tabIndex = 0;

    const icon = {
      'Uniwersum': '🌌',
      'Świat': '🌍',
      'Tom': '📚',
      'Rozdział': '📖',
      'Podrozdział': '📄',
      'Fragment': '📜'
    }[element.type] || '📄';

    li.innerHTML = `
      <span class="node-label">
        \( {icon} <strong> \){escapeHtml(element.title || '(Bez tytułu)')}</strong>
        <small style="opacity:0.7; margin-left:8px;">
          v${element.version || '1'} • ${element.language || 'pl'}
        </small>
      </span>
    `;

    if (element.id === selectedElementId) li.classList.add('selected');

    li.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(element.id);
    });

    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectElement(element.id);
      }
    });

    if (element.children?.length > 0) {
      const childUl = document.createElement('ul');
      element.children.forEach(child => childUl.appendChild(createTreeNode(child)));
      li.appendChild(childUl);
    }

    return li;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // === EDYCJA ELEMENTU ===
  function selectElement(id) {
    selectedElementId = id;
    renderUniverseTree();

    const found = findElementById(id);
    if (!found) {
      clearEditor();
      return;
    }

    const { node } = found;

    els.type.value = node.type || '';
    els.title.value = node.title || '';
    els.date.value = node.dateCreated || new Date().toISOString().split('T')[0];
    els.version.value = node.version || 'v1';
    els.language.value = node.language || 'pl';
    els.content.value = node.content || '';
    els.notes.value = node.notes || '';

    // Aktywuj przyciski
    els.saveBtn.disabled = false;
    els.deleteBtn.disabled = false;
    els.addChildBtn.disabled = false;
  }

  function clearEditor() {
    selectedElementId = null;
    ['type', 'title', 'date', 'version', 'language', 'content', 'notes'].forEach(field => {
      els[field].value = '';
    });
    els.saveBtn.disabled = true;
    els.deleteBtn.disabled = true;
    els.addChildBtn.disabled = true;
  }

  function saveCurrentElement() {
    if (!selectedElementId) {
      alert('Nie wybrano elementu do zapisu.');
      return;
    }

    const found = findElementById(selectedElementId);
    if (!found) {
      alert('Element nie istnieje.');
      return;
    }

    const { node } = found;

    if (!els.type.value.trim() || !els.title.value.trim()) {
      alert('Typ i tytuł są wymagane.');
      return;
    }

    node.type = els.type.value.trim();
    node.title = els.title.value.trim();
    node.dateCreated = els.date.value || new Date().toISOString().split('T')[0];
    node.version = els.version.value.trim() || 'v1';
    node.language = els.language.value.trim() || 'pl';
    node.content = els.content.value;
    node.notes = els.notes.value;

    saveData();
    renderUniverseTree();
    alert('Element zapisany pomyślnie.');
  }

  function deleteCurrentElement() {
    if (!selectedElementId) return alert('Nie wybrano elementu.');

    const found = findElementById(selectedElementId);
    if (!found) return alert('Element nie istnieje.');

    const { node, parent } = found;
    const name = node.title || '(Bez tytułu)';

    if (!confirm(`Czy na pewno usunąć "${name}" wraz ze wszystkimi dziećmi?`)) return;

    if (parent) {
      parent.children = parent.children.filter(child => child.id !== node.id);
    } else {
      universeData = universeData.filter(el => el.id !== node.id);
    }

    saveData();
    clearEditor();
    renderUniverseTree();
  }

  // === DODAWANIE ===
  function addUniverse() {
    const newUniv = {
      id: generateId(),
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      dateCreated: new Date().toISOString().split('T')[0],
      version: 'v1',
      language: 'pl',
      content: '',
      notes: '',
      children: []
    };

    universeData.push(newUniv);
    saveData();
    renderUniverseTree();
    selectElement(newUniv.id);
  }

  function addChildToSelected() {
    if (!selectedElementId) return alert('Wybierz element nadrzędny.');

    const parentFound = findElementById(selectedElementId);
    if (!parentFound) return alert('Nie znaleziono rodzica.');

    const parent = parentFound.node;
    const childType = getNextChildType(parent.type);

    const newChild = {
      id: generateId(),
      type: childType,
      title: `Nowy ${childType}`,
      dateCreated: new Date().toISOString().split('T')[0],
      version: 'v1',
      language: 'pl',
      content: '',
      notes: '',
      children: []
    };

    parent.children = parent.children || [];
    parent.children.push(newChild);

    saveData();
    renderUniverseTree();
    selectElement(newChild.id);
  }

  // === BACKUP & EXPORT ===
  function backupAll() {
    const data = JSON.stringify(universeData, null, 2);
    downloadFile(data, `eterniverse_backup_${formatDate(new Date())}.json`, 'application/json');
  }

  function exportData() {
    if (universeData.length === 0) return alert('Brak danych do eksportu.');

    const format = els.exportFormat.value;
    let content = '';
    let filename = `eterniverse_${formatDate(new Date())}`;
    let mime = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(universeData, null, 2);
      filename += '.json';
      mime = 'application/json';
    } else if (format === 'txt') {
      content = exportToPlainText(universeData);
      filename += '.txt';
    }

    downloadFile(content, filename, mime);
  }

  function exportToPlainText(nodes, level = 0) {
    let text = '';
    nodes.forEach(node => {
      const indent = '  '.repeat(level);
      text += `\( {indent}( \){node.type}) ${node.title || '(Bez tytułu)'}\n`;
      if (node.children?.length) {
        text += exportToPlainText(node.children, level + 1);
      }
    });
    return text;
  }

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  // === INICJALIZACJA ===
  function init() {
    renderUniverseTree();
    clearEditor();

    els.saveBtn.addEventListener('click', saveCurrentElement);
    els.deleteBtn.addEventListener('click', deleteCurrentElement);
    els.addUniverseBtn.addEventListener('click', addUniverse);
    els.addChildBtn.addEventListener('click', addChildToSelected);
    els.backupBtn.addEventListener('click', backupAll);
    els.exportBtn.addEventListener('click', exportData);
  }

  // Start
  init();
})();