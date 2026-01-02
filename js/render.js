// Pełny kod renderowania i zarządzania Panelem Edycji z walidacją i autosave
// Eterniverse Master Premium PRO v13.0

class EditPanelManager {
  constructor(app) {
    this.app = app; // odniesienie do głównej aplikacji (master/daja)
    this.autoSaveDelay = 1000; // 1 sekunda po ostatnim wpisywaniu
    this.autoSaveTimeout = null;
    this.isValid = true;

    this.elements = {
      title: document.getElementById('element-title'),
      content: document.getElementById('element-content'),
      path: document.getElementById('current-path'),
      meta: document.getElementById('element-meta'),
      status: document.getElementById('status')
    };

    this.bindEvents();
  }

  // Renderowanie całego panelu edycji
  render(currentElement) {
    this.currentElement = currentElement;

    // Tytuł
    if (this.elements.title) {
      this.elements.title.value = currentElement?.title || '';
      this.elements.title.placeholder = currentElement?.type 
        ? `Tytuł ${currentElement.type.toLowerCase()}...` 
        : 'Tytuł elementu...';

      // Walidacja tytułu
      this.validateTitle();
    }

    // Treść
    if (this.elements.content) {
      this.elements.content.value = currentElement?.content || '';
      this.elements.content.placeholder = currentElement
        ? `Tu rozwija się \( {currentElement.type?.toLowerCase()} „ \){currentElement.title || 'nowy element'}”...\nAI może przyspieszyć kreację.`
        : 'Wybierz element w hierarchii, aby edytować jego treść...';
    }

    // Ścieżka
    this.renderPath(currentElement);

    // Metadane
    this.renderMeta(currentElement);

    // Focus na tytuł jeśli nowy element
    if (currentElement && this.elements.title && document.activeElement !== this.elements.title) {
      setTimeout(() => this.elements.title.focus(), 100);
    }
  }

  // Renderowanie ścieżki
  renderPath(element) {
    if (!this.elements.path) return;

    if (!element) {
      this.elements.path.innerHTML = '<em style="opacity:0.5;">Brak wybranego elementu</em>';
      return;
    }

    const path = this.app.getPathToElement(element);
    this.elements.path.innerHTML = path.map((node, idx) => {
      const icon = {
        'Uniwersum': '🌌', 'Świat': '🌍', 'Tom': '📚',
        'Rozdział': '📖', 'Podrozdział': '📄', 'Fragment': '📜'
      }[node.type] || '📄';

      const isLast = idx === path.length - 1;
      return `
        <span style="opacity:\( {isLast ? '1' : '0.7'}; font-weight: \){isLast ? '700' : '500'};">
          ${icon} ${this.escape(node.title || node.type)}
        </span>
        ${!isLast ? '<span style="margin:0 12px; opacity:0.5;">→</span>' : ''}
      `;
    }).join('');
  }

  // Renderowanie metadanych
  renderMeta(element) {
    if (!this.elements.meta) return;

    if (!element) {
      this.elements.meta.innerHTML = '<em style="opacity:0.5;">Wybierz element, aby zobaczyć metadane</em>';
      return;
    }

    const wordCount = this.wordCount(element.content || '');
    const charCount = (element.content || '').length;
    const created = element.created ? new Date(element.created).toLocaleString('pl-PL') : 'nieznana';

    this.elements.meta.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; font-size:0.95rem; opacity:0.9;">
        <div><strong>Typ:</strong> ${this.escape(element.type || 'Nieznany')}</div>
        <div><strong>ID:</strong> <code style="background:rgba(0,224,255,0.1); padding:2px 8px; border-radius:6px;">${element.id}</code></div>
        <div><strong>Utworzono:</strong> ${created}</div>
        <div><strong>Słów:</strong> ${wordCount}</div>
        <div><strong>Znaków:</strong> ${charCount}</div>
        <div><strong>Profil:</strong> ${this.app.currentProfile?.toUpperCase() || 'WATTPAD'}</div>
      </div>
    `;
  }

  // === WALIDACJA ===
  validateTitle() {
    if (!this.elements.title || !this.currentElement) return true;

    const value = this.elements.title.value.trim();
    const minLength = 1;
    const maxLength = 200;

    let valid = true;
    let message = '';

    if (value.length < minLength) {
      valid = false;
      message = 'Tytuł jest wymagany';
    } else if (value.length > maxLength) {
      valid = false;
      message = `Tytuł zbyt długi (max ${maxLength} znaków)`;
    }

    // Stylizacja walidacji
    this.elements.title.style.borderColor = valid ? 'var(--quantum-gold)' : '#ff4060';
    this.elements.title.title = message;

    this.isValid = valid;
    return valid;
  }

  validateAll() {
    return this.validateTitle();
  }

  // === AUTOSAVE ===
  bindEvents() {
    if (this.elements.title) {
      this.elements.title.addEventListener('input', () => {
        this.validateTitle();
        this.triggerAutoSave();
      });
    }

    if (this.elements.content) {
      this.elements.content.addEventListener('input', () => {
        this.triggerAutoSave();
        this.renderMeta(this.currentElement); // aktualizuj liczbę słów na żywo
      });
    }
  }

  triggerAutoSave() {
    if (!this.app.autoSaveCurrent) return;

    clearTimeout(this.autoSaveTimeout);

    this.autoSaveTimeout = setTimeout(() => {
      if (this.validateAll()) {
        this.app.autoSaveCurrent();
        this.status('Zapisano automatycznie', 3000);
      } else {
        this.status('Nie zapisano – popraw błędy', 5000);
      }
    }, this.autoSaveDelay);
  }

  // === POMOCNICZE ===
  escape(text = '') {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  wordCount(text = '') {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }

  status(message, duration = 4000) {
    if (this.elements.status) {
      this.elements.status.textContent = message;
      if (duration > 0) {
        setTimeout(() => {
          if (this.elements.status.textContent === message) {
            this.elements.status.textContent = 'Gotowy';
          }
        }, duration);
      }
    }
  }
}

// === INICJALIZACJA ===
document.addEventListener('DOMContentLoaded', () => {
  if (window.master) {
    window.editPanel = new EditPanelManager(window.master);
    
    // Renderuj panel po każdej zmianie elementu
    const originalSelect = window.master.selectElement.bind(window.master);
    window.master.selectElement = function(id) {
      originalSelect(id);
      if (window.editPanel) {
        window.editPanel.render(this.currentElement);
      }
    };

    // Początkowe renderowanie
    if (window.editPanel && window.master.currentElement) {
      window.editPanel.render(window.master.currentElement);
    }
  }
});