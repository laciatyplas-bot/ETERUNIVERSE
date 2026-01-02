let currentBrama = 1;

// Pobierz książki z localStorage lub ustaw domyślne
let ksiazki = JSON.parse(localStorage.getItem('ksiazki')) || [
    { id: 1, bramaId: 1, tytul: "Książka 1", autor: "Autor A" },
    { id: 2, bramaId: 1, tytul: "Książka 2", autor: "Autor B" },
    { id: 3, bramaId: 2, tytul: "Książka 3", autor: "Autor C" },
];

// Elementy DOM
const bramyNav = document.getElementById('bramy-nav');
const ksiazkiContainer = document.getElementById('ksiazki-container');

function saveToLocalStorage() {
    localStorage.setItem('ksiazki', JSON.stringify(ksiazki));
}

function renderBramy() {
    bramyNav.innerHTML = '';
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Brama ${i}`;
        btn.dataset.bramaId = i;
        btn.className = (i === currentBrama) ? 'active-brama' : '';
        btn.addEventListener('click', () => {
            currentBrama = i;
            renderBramy();
            renderKsiazki();
            renderAddBookForm(); // odśwież formularz pod aktualną bramą
        });
        bramyNav.appendChild(btn);
    }
}

function renderKsiazki() {
    ksiazkiContainer.innerHTML = '';

    const filteredBooks = ksiazki.filter(k => k.bramaId === currentBrama);

    const title = document.createElement('h2');
    title.textContent = `Książki w Bramie ${currentBrama}`;
    ksiazkiContainer.appendChild(title);

    if (filteredBooks.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Brak książek w tej bramie.';
        ksiazkiContainer.appendChild(p);
    } else {
        const ul = document.createElement('ul');
        filteredBooks.forEach(book => {
            const li = document.createElement('li');
            li.textContent = `book.tytul−{book.tytul} -book.tytul−{book.autor} `;

            // Przycisk Edytuj
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edytuj';
            editBtn.addEventListener('click', () => {
                renderEditBookForm(book);
            });
            li.appendChild(editBtn);

            // Przycisk Usuń
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Usuń';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Czy na pewno chcesz usunąć "${book.tytul}"?`)) {
                    ksiazki = ksiazki.filter(k => k.id !== book.id);
                    saveToLocalStorage();
                    renderKsiazki();
                    renderAddBookForm();
                }
            });
            li.appendChild(deleteBtn);

            ul.appendChild(li);
        });
        ksiazkiContainer.appendChild(ul);
    }
}

function renderAddBookForm() {
    // Usuń istniejący formularz, jeśli jest
    const existingForm = document.getElementById('add-book-form');
    if (existingForm) {
        existingForm.remove();
    }

    const form = document.createElement('form');
    form.id = 'add-book-form';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Tytuł: ';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'tytul';
    titleInput.required = true;
    titleLabel.appendChild(titleInput);

    const authorLabel = document.createElement('label');
    authorLabel.textContent = 'Autor: ';
    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.name = 'autor';
    authorInput.required = true;
    authorLabel.appendChild(authorInput);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Dodaj książkę';

    form.appendChild(titleLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(authorLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(submitBtn);

    ksiazkiContainer.appendChild(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tytul = titleInput.value.trim();
        const autor = authorInput.value.trim();
        if (tytul && autor) {
            const newId = ksiazki.length ? Math.max(...ksiazki.map(k => k.id)) + 1 : 1;
            ksiazki.push({ id: newId, bramaId: currentBrama, tytul, autor });
            saveToLocalStorage();
            renderKsiazki();
            renderAddBookForm();
        } else {
            alert('Wypełnij wszystkie pola!');
        }
    });
}

function renderEditBookForm(book) {
    // Usuń istniejący formularz dodawania, jeśli jest
    const existingAddForm = document.getElementById('add-book-form');
    if (existingAddForm) {
        existingAddForm.remove();
    }

    // Usuń istniejący formularz edycji, jeśli jest
    const existingEditForm = document.getElementById('edit-book-form');
    if (existingEditForm) {
        existingEditForm.remove();
    }

    const form = document.createElement('form');
    form.id = 'edit-book-form';

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Tytuł: ';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'tytul';
    titleInput.value = book.tytul;
    titleInput.required = true;
    titleLabel.appendChild(titleInput);

    const authorLabel = document.createElement('label');
    authorLabel.textContent = 'Autor: ';
    const authorInput = document.createElement('input');
    authorInput.type = 'text';
    authorInput.name = 'autor';
    authorInput.value = book.autor;
    authorInput.required = true;
    authorLabel.appendChild(authorInput);

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Zapisz zmiany';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Anuluj';
    cancelBtn.addEventListener('click', () => {
        renderEditBookForm(null);
        renderAddBookForm();
        renderKsiazki();
    });

    form.appendChild(titleLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(authorLabel);
    form.appendChild(document.createElement('br'));
    form.appendChild(submitBtn);
    form.appendChild(cancelBtn);

    ksiazkiContainer.appendChild(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const tytul = titleInput.value.trim();
        const autor = authorInput.value.trim();
        if (tytul && autor) {
            const index = ksiazki.findIndex(k => k.id === book.id);
            if (index !== -1) {
                ksiazki[index].tytul = tytul;
                ksiazki[index].autor = autor;
                saveToLocalStorage();
                renderKsiazki();
                renderAddBookForm();
                form.remove();
            }
        } else {
            alert('Wypełnij wszystkie pola!');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBramy();
    renderKsiazki();
    renderAddBookForm();
});
