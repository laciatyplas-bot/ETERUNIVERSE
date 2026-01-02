// script.js

// Prosta struktura książek przechowywana w pamięci na start
let books = [];
let currentBookId = null;

// Elementy DOM
const bookListEl = document.getElementById('book-list');
const addBookBtn = document.getElementById('add-book-btn');
const editorSection = document.getElementById('editor');
const bookTitleInput = document.getElementById('book-title');
const bookContentTextarea = document.getElementById('book-content');
const saveBookBtn = document.getElementById('save-book-btn');
const exportBookBtn = document.getElementById('export-book-btn');
const importBookBtn = document.getElementById('import-book-btn');
const importFileInput = document.getElementById('import-file');

function renderBookList() {
    bookListEl.innerHTML = '';
    if (books.length === 0) {
        bookListEl.innerHTML = '<p>Brak książek. Dodaj nową.</p>';
        return;
    }
    books.forEach(book => {
        const div = document.createElement('div');
        div.textContent = book.title;
        div.style.cursor = 'pointer';
        div.style.padding = '0.5rem 0';
        div.addEventListener('click', () => openEditor(book.id));
        bookListEl.appendChild(div);
    });
}

function openEditor(bookId) {
    currentBookId = bookId;
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    bookTitleInput.value = book.title;
    bookContentTextarea.value = book.content;
    editorSection.style.display = 'block';
}

function addNewBook() {
    const newBook = {
        id: Date.now(),
        title: 'Nowa książka',
        content: '',
        chapters: [],
        audiobooks: []
    };
    books.push(newBook);
    renderBookList();
    openEditor(newBook.id);
}

function saveBook() {
    if (currentBookId === null) return;
    const book = books.find(b => b.id === currentBookId);
    if (!book) return;
    book.title = bookTitleInput.value.trim() || 'Bez tytułu';
    book.content = bookContentTextarea.value;
    alert('Książka zapisana!');
    renderBookList();
}

function exportBook() {
    if (currentBookId === null) return;
    const book = books.find(b => b.id === currentBookId);
    if (!book) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(book));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", book.title + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importBook(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedBook = JSON.parse(e.target.result);
            importedBook.id = Date.now(); // Nadpisz id żeby nie kolidowało
            books.push(importedBook);
            renderBookList();
            alert('Książka zaimportowana!');
        } catch (err) {
            alert('Błąd podczas importu pliku: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Event listeners
addBookBtn.addEventListener('click', addNewBook);
saveBookBtn.addEventListener('click', saveBook);
exportBookBtn.addEventListener('click', exportBook);
importBookBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', importBook);

renderBookList();
