// Kontynuacja UI - funkcje modalu
UI.prototype.openGate = function(gateName) {
    this.currentEdit = { gate: gateName, book: null };
    document.getElementById('title').textContent = 'Nowa: ' + gateName;
    document.getElementById('titleInput').value = '';
    document.getElementById('status').value = 'idea';
    document.getElementById('desc').value = '';
    document.getElementById('content').value = '';
    document.getElementById('delete').style.display = 'none';
    document.getElementById('modal').style.display = 'block';
};

UI.prototype.editBook = function(gateName, bookIdx) {
    const book = this.storage.getGates()[gateName][bookIdx];
    this.currentEdit = { gate: gateName, book: bookIdx };
    document.getElementById('title').textContent = 'Edytuj: ' + book.title;
    document.getElementById('titleInput').value = book.title;
    document.getElementById('status').value = book.status;
    document.getElementById('desc').value = book.desc || '';
    document.getElementById('content').value = book.content || '';
    document.getElementById('delete').style.display = 'inline-block';
    document.getElementById('modal').style.display = 'block';
};

UI.prototype.saveBook = function() {
    const title = document.getElementById('titleInput').value.trim();
    if (!title) return this.toast('Tytuł wymagany!');
    
    const book = {
        title: title,
        status: document.getElementById('status').value,
        desc: document.getElementById('desc').value,
        content: document.getElementById('content').value
    };
    
    if (this.currentEdit.book !== null) {
        this.storage.updateBook(this.currentEdit.gate, this.currentEdit.book, book);
    } else {
        this.storage.addBook(this.currentEdit.gate, book);
    }
    
    this.renderGates();
    this.closeModal();
    this.toast('Zapisano!');
};