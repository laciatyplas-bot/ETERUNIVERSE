// script.js

// Dane książek przechowywane w pamięci (tymczasowo)
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

// Nawigacja między sekcjami
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('main section');

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = e.target.getAttribute('data-section');
        sections.forEach(sec => {
            sec.classList.toggle('active', sec.id === target);
        });
    });
});

// Funkcja renderująca listę książek
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

// Otwórz edytor dla wybranej książki
function openEditor(bookId) {
    currentBookId = bookId;
    const book = books.find(b => b.id === bookId);
    if (!book) return;
    bookTitleInput.value = book.title;
    bookContentTextarea.value = book.content;
    // Przełącz na edytor
    sections.forEach(sec => sec.classList.remove('active'));
    editorSection.classList.add('active');
}

// Dodaj nową książkę
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

// Zapisz aktualną książkę
function saveBook() {
    if (currentBookId === null) return alert('Nie wybrano książki do zapisu.');
    const book = books.find(b => b.id === currentBookId);
    if (!book) return;
    book.title = bookTitleInput.value.trim() || 'Bez tytułu';
    book.content = bookContentTextarea.value;
    alert('Książka zapisana!');
    renderBookList();
}

// Eksportuj aktualną książkę do pliku JSON
function exportBook() {
    if (currentBookId === null) return alert('Nie wybrano książki do eksportu.');
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

// Importuj książkę z pliku JSON
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
    importFileInput.value = ''; // Reset input
}

// Event listeners
addBookBtn.addEventListener('click', addNewBook);
saveBookBtn.addEventListener('click', saveBook);
exportBookBtn.addEventListener('click', exportBook);
importBookBtn.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', importBook);

// Inicjalne wyświetlenie listy książek
renderBookList();