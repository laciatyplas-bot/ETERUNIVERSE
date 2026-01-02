(() => {
  // Model danych: Hierarchia Uniwersum
  // Struktura: Uniwersum -> Świat -> Tom -> Rozdział -> Podrozdział/Fragment
  // Każdy element: { id, parentId, type, title, dateCreated, version, language, content, notes, children: [] }
  const STORAGE_KEY = 'bella_author_mode_universe';

  // Globalny przełącznik fabular generation OFF - system nie generuje fabuły
  const FABULAR_GENERATION = false; // permanentnie OFF w AUTHOR MODE

  // Obecny zaznaczony element
  let selectedElementId = null;

  // Dane całego uniwersum
  let universeData = loadData();

  // Elementy DOM
  const universeListEl = document.getElementById('universeList');
  const outputEl = document.getElementById('output');
  const archiveOutputEl = document.getElementById('archiveOutput');

  const elementTypeEl = document.getElementById('elementType');
  const elementTitleEl = document.getElementById('elementTitle');
  const elementDateEl = document.getElementById('elementDate');
  const elementVersionEl = document.getElementById('elementVersion');
  const elementLanguageEl = document.getElementById('elementLanguage');
  const elementContentEl = document.getElementById('elementContent');
  const elementNotesEl = document.getElementById('elementNotes');

  const saveElementBtn = document.getElementById('saveElementBtn');
  const deleteElementBtn = document.getElementById('deleteElementBtn');
  const addUniverseBtn = document.getElementById('addUniverseBtn');
  const addChildBtn = document.getElementById('addChildBtn');

  const backupAllBtn = document.getElementById('backupAllBtn');
  const exportBtn = document.getElementById('exportBtn');
  const exportSelectEl = document.getElementById('exportSelect');

  // Pomocnicze - unikalne ID
  function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  // Załaduj dane z localStorage lub utwórz pustą strukturę
  function loadData() {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) return JSON.parse(json);
    } catch (e) {
      console.error('Błąd ładowania danych:', e);
    }
    return [];
  }

  // Zapisz dane do localStorage
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(universeData));
    } catch (e) {
      console.error('Błąd zapisu danych:', e);
    }
  }

  // Znajdź element po ID w strukturze rekurencyjnie (zwraca obiekt oraz rodzica)
  function findElementById(id, elements = universeData, parent = null) {
    for (const el of elements) {
      if (el.id === id) return { element: el, parent };
      if (el.children && el.children.length) {
        const found = findElementById(id, el.children, el);
        if (found) return found;
      }
    }
    return null;
  }

  // Renderuj listę uniwersum w panelu struktury
  function renderUniverseList() {
    universeListEl.innerHTML = '';
    if (!universeData.length) {
      universeListEl.textContent = 'Brak Uniwersów. Dodaj nowy.';
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'hierarchy';
    universeData.forEach(universe => {
      ul.appendChild(renderElementNode(universe));
    });
    universeListEl.appendChild(ul);
  }

  // Render pojedynczego elementu oraz jego dzieci
  function renderElementNode(element) {
    const li = document.createElement('li');
    li.textContent = `[element.type]{element.type}]element.type]{element.title || '(Bez tytułu)'}`;
    li.title = `Wersja: element.version∣∣′v1′,Język:{element.version || 'v1'}, Język:element.version∣∣′v1′,Język:{element.language || 'pl'}`;
    li.dataset.id = element.id;
    li.tabIndex = 0;
    if (element.id === selectedElementId) li.classList.add('selected');

    // Kliknięcie zaznacza element
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

    if (element.children && element.children.length > 0) {
      const ul = document.createElement('ul');
      element.children.forEach(child => {
        ul.appendChild(renderElementNode(child));
      });
      li.appendChild(ul);
    }
    return li;
  }

  // Zaznacz element i pokaż jego dane w formularzu
  function selectElement(id) {
    selectedElementId = id;
    renderUniverseList();

    const found = findElementById(id);
    if (!found) {
      clearForm();
      return;
    }
    const { element } = found;

    elementTypeEl.value = element.type || '';
    elementTitleEl.value = element.title || '';
    elementDateEl.value = element.dateCreated || '';
    elementVersionEl.value = element.version || '';
    elementLanguageEl.value = element.language || '';
    elementContentEl.value = element.content || '';
    elementNotesEl.value = element.notes || '';

    // Włącz przyciski edycji i usuwania
    saveElementBtn.disabled = false;
    deleteElementBtn.disabled = false;
    addChildBtn.disabled = false;
  }

  // Wyczyść formularz edycji
  function clearForm() {
    selectedElementId = null;
    elementTypeEl.value = '';
    elementTitleEl.value = '';
    elementDateEl.value = '';
    elementVersionEl.value = '';
    elementLanguageEl.value = '';
    elementContentEl.value = '';
    elementNotesEl.value = '';

    saveElementBtn.disabled = true;
    deleteElementBtn.disabled = true;
    addChildBtn.disabled = true;
  }

  // Zapisz zmiany w zaznaczonym elemencie
  function saveElement() {
    if (!selectedElementId) return alert('Nie wybrano elementu do zapisu.');

    const found = findElementById(selectedElementId);
    if (!found) return alert('Nie znaleziono elementu.');

    const { element } = found;

    // Walidacja podstawowa
    if (!elementTypeEl.value.trim()) return alert('Typ elementu jest wymagany.');
    if (!elementTitleEl.value.trim()) return alert('Tytuł elementu jest wymagany.');

    // Aktualizuj dane
    element.type = elementTypeEl.value.trim();
    element.title = elementTitleEl.value.trim();
    element.dateCreated = elementDateEl.value.trim();
    element.version = elementVersionEl.value.trim();
    element.language = elementLanguageEl.value.trim();
    element.content = elementContentEl.value.trim();
    element.notes = elementNotesEl.value.trim();

    saveData();
    renderUniverseList();
    alert('Element zapisany.');
  }

  // Usuń zaznaczony element
  function deleteElement() {
    if (!selectedElementId) return alert('Nie wybrano elementu do usunięcia.');

    const found = findElementById(selectedElementId);
    if (!found) return alert('Nie znaleziono elementu.');

    const { element, parent } = found;

    if (!confirm(`Usunąć element "${element.title || '(Bez tytułu)'}" i wszystkie jego dzieci?`)) return;

    if (parent) {
      parent.children = parent.children.filter(child => child.id !== element.id);
    } else {
      // Usuwamy element z root
      universeData = universeData.filter(el => el.id !== element.id);
    }

    saveData();
    clearForm();
    renderUniverseList();
  }

  // Dodaj nowy Uniwersum (root)
  function addUniverse() {
    const newUniverse = {
      id: generateId(),
      parentId: null,
      type: 'Uniwersum',
      title: 'Nowe Uniwersum',
      dateCreated: new Date().toISOString().split('T')[0],
      version: 'v1',
      language: 'pl',
      content: '',
      notes: '',
      children: []
    };
    universeData.push(newUniverse);
    saveData();
    renderUniverseList();
  }

  // Dodaj dziecko do zaznaczonego elementu
  function addChild() {
    if (!selectedElementId) return alert('Nie wybrano elementu, do którego dodać dziecko.');

    const found = findElementById(selectedElementId);
    if (!found) return alert('Nie znaleziono elementu.');

    const { element } = found;

    // Określamy typ dziecka na podstawie bieżącego typu (prosty przykład)
    let childType = '';
    switch (element.type) {
      case 'Uniwersum':
        childType = 'Świat';
        break;
      case 'Świat':
        childType = 'Tom';
        break;
      case 'Tom':
        childType = 'Rozdział';
        break;
      case 'Rozdział':
        childType = 'Podrozdział';
        break;
      case 'Podrozdział':
        childType = 'Fragment';
        break;
      default:
        childType = 'Fragment';
    }

    const newChild = {
      id: generateId(),
      parentId: element.id,
      type: childType,
      title: `Nowy ${childType}`,
      dateCreated: new Date().toISOString().split('T')[0],
      version: 'v1',
      language: 'pl',
      content: '',
      notes: '',
      children: []
    };

    element.children = element.children || [];
    element.children.push(newChild);

    saveData();
    renderUniverseList();
    selectElement(newChild.id);
  }

  // Backup całej bazy do pliku JSON
  function backupAll() {
    const dataStr = JSON.stringify(universeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `universe_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  // Export danych wg wybranego formatu (prosty przykład)
  function exportData() {
    if (!universeData.length) return alert('Brak danych do eksportu.');

    const format = exportSelectEl.value;
    let dataStr = '';

    switch(format) {
      case 'json':
        dataStr = JSON.stringify(universeData, null, 2);
        break;
      case 'txt':
        dataStr = exportAsText(universeData);
        break;
      default:
        alert('Nieznany format eksportu.');
        return;
    }

    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `universe_export_newDate().toISOString().slice(0,10).{new Date().toISOString().slice(0,10)}.newDate().toISOString().slice(0,10).{format}`;
    a.click();

    URL.revokeObjectURL(url);
  }

  // Przykład eksportu jako tekst (rekurencyjny)
  function exportAsText(elements, indent = 0) {
    let result = '';
    elements.forEach(el => {
      result += ' '.repeat(indent) + `[el.type]{el.type}]el.type]{el.title || '(Bez tytułu)'}\n`;
      if (el.children && el.children.length) {
        result += exportAsText(el.children, indent + 2);
      }
    });
    return result;
  }

  // Inicjalizacja UI i eventów
  function init() {
    renderUniverseList();
    clearForm();

    saveElementBtn.addEventListener('click', saveElement);
    deleteElementBtn.addEventListener('click', deleteElement);
    addUniverseBtn.addEventListener('click', addUniverse);
    addChildBtn.addEventListener('click', addChild);
    backupAllBtn.addEventListener('click', backupAll);
    exportBtn.addEventListener('click', exportData);
  }

  init();
})();
