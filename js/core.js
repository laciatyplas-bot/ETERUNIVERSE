import { WORLD_PSYCHE } from './world_psyche.js';

const app = document.getElementById('app');

// Renderowanie całego świata
function renderWorld(world) {
  app.innerHTML = `
    <h1>${world.name}</h1>
    <p style="text-align:center;color:#9BA9C8;margin-bottom:20px;">
      ${world.description}
    </p>
  `;

  world.gates.forEach(gate => {
    const gateBox = document.createElement('div');
    gateBox.className = 'gate';
    gateBox.innerHTML = `
      <h2>${gate.name}</h2>
      <p>${gate.theme}</p>
      <div class="books"></div>
    `;

    const booksDiv = gateBox.querySelector('.books');

    if (gate.books.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Brak książek w tej bramie.';
      empty.style.color = '#777';
      empty.style.fontSize = '0.9em';
      booksDiv.appendChild(empty);
    } else {
      gate.books.forEach(book => {
        const bookEl = document.createElement('div');
        bookEl.className = 'book';
        bookEl.innerHTML = `
          <strong>${book.title}</strong>
          <p>${book.description}</p>
        `;
        bookEl.addEventListener('click', () => {
          alert(`📘 ${book.title}\n\n${book.description}`);
        });
        booksDiv.appendChild(bookEl);
      });
    }

    app.appendChild(gateBox);
  });
}

renderWorld(WORLD_PSYCHE);
