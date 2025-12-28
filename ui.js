class UI {
    constructor(storage) {
        this.storage = storage;
        this.currentEdit = null;
        this.init();
    }
    
    init() {
        this.bindButtons();
        this.renderGates();
    }
    
    bindButtons() {
        document.getElementById('exportAll').onclick = () => this.exportAll();
        document.getElementById('backup').onclick = () => this.backup();
        document.getElementById('restore').onclick = () => this.restore();
        document.getElementById('reset').onclick = () => this.reset();
        document.getElementById('save').onclick = () => this.saveBook();
        document.getElementById('cancel').onclick = () => this.closeModal();
        document.getElementById('export').onclick = () => this.exportCurrent();
        document.getElementById('delete').onclick = () => this.deleteBook();
        document.getElementById('close').onclick = () => this.closeModal();
    }
    
    renderGates() {
        const gatesDiv = document.getElementById('gates');
        gatesDiv.innerHTML = '';
        const gates = this.storage.getGates();
        
        Object.entries(gates).forEach(([name, books]) => {
            const gate = document.createElement('div');
            gate.className = 'gate';
            gate.innerHTML = `<h3 onclick="ui.openGate('${name}')">${name} (+)</h3>`;
            const booksDiv = document.createElement('div');
            booksDiv.className = 'books';
            
            if (books.length > 0) {
                books.forEach((book, i) => {
                    const bookEl = document.createElement('div');
                    bookEl.className = 'book';
                    bookEl.onclick = () => this.editBook(name, i);
                    bookEl.innerHTML = `
                        <div class="book-title">${book.title}</div>
                        <div class="book-status">${book.status}</div>
                    `;
                    booksDiv.appendChild(bookEl);
                });
            } else {
                booksDiv.innerHTML = '<div style="color:#666">Brak książek</div>';
            }
            
            gate.appendChild(booksDiv);
            gatesDiv.appendChild(gate);
        });
    }
}