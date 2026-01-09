import { WORLD_PSYCHE } from './world_psyche.js';

const app = document.getElementById('app');

function renderWorld(world) {
  app.innerHTML = `
    <h1>${world.name}</h1>
    <p>${world.description}</p>
  `;

  world.gates.forEach(gate => {
    const gateDiv = document.createElement('div');
    gateDiv.className = 'gate';
    gateDiv.style.borderLeftColor = gate.color;

    gateDiv.innerHTML = `
      <h2>${gate.name}</h2>
      <p>${gate.theme}</p>
    `;

    if (gate.books.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Brak książek w tej bramie.';
      gateDiv.appendChild(empty);
    } else {
      gate.books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';

        bookDiv.innerHTML = `
          <div class="book-row">
            <img src="${book.cover}" alt="${book.title}">
            <div class="book-info">
              <strong>${book.title}</strong>
              <p>${book.description}</p>
            </div>
          </div>
        `;

        // Dodaj audio rozdziały
        book.chapters.forEach(ch => {
          const audioBox = document.createElement('div');
          audioBox.className = 'audio-player';
          audioBox.innerHTML = `
            <p><strong>${ch.title}</strong></p>
            <audio controls preload="none" src="${ch.audio}" style="width:100%"></audio>
          `;
          bookDiv.appendChild(audioBox);
        });

        gateDiv.appendChild(bookDiv);
      });
    }

    app.appendChild(gateDiv);
  });
}

renderWorld(WORLD_PSYCHE);
