// Application State
const state = {
    currentScreen: 'home',
    audioPlaying: false,
    myBooks: [
        { id: 1, title: 'INTERSEEKER: Geneza', cover: '📘', progress: 67 },
        { id: 2, title: 'ARCHETYP SEEKER', cover: '👑', progress: 23 },
        { id: 3, title: 'WolaSeeker', cover: '⚡', progress: 89 },
        { id: 4, title: 'ObfitoSeeker', cover: '💎', progress: 45 }
    ],
    availableBooks: [
        { id: 5, title: 'ARCHETYP SEEKER', cover: '👑', premium: true },
        { id: 6, title: 'WolaSeeker', cover: '⚡', premium: false },
        { id: 7, title: 'ObfitoSeeker', cover: '💎', premium: false },
        { id: 8, title: 'Cosmic Journey', cover: '🌌', premium: false },
        { id: 9, title: 'Soul Navigator', cover: '🧭', premium: true },
        { id: 10, title: 'Mind Explorer', cover: '🧠', premium: false }
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeTrendingBooks();
    initializeLibrary();
    updateBooksCount();
});

// Navigation Function
function navigateTo(screenName) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Show selected screen
    const targetScreen = document.getElementById(screenName + '-screen');
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;
    }
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.screen === screenName) {
            btn.classList.add('active');
        }
    });
    
    // Update screen label
    const screenLabels = {
        'home': 'Home',
        'discover': 'Discover',
        'library': 'Library',
        'profile': 'Profile',
        'reading': 'Reading',
        'audio': 'Audio Player'
    };
    
    const label = document.getElementById('current-screen-label');
    if (label) {
        label.textContent = screenLabels[screenName] || screenName;
    }
    
    // Refresh library if navigating to library
    if (screenName === 'library') {
        initializeLibrary();
    }
}

// Initialize Trending Books
function initializeTrendingBooks() {
    const container = document.getElementById('trending-books');
    if (!container) return;
    
    container.innerHTML = '';
    
    state.availableBooks.slice(0, 3).forEach(book => {
        const bookCard = createBookCard(book);
        container.appendChild(bookCard);
    });
}

// Create Book Card
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    const cover = document.createElement('div');
    cover.className = 'book-cover';
    cover.textContent = book.cover;
    
    if (book.premium) {
        const badge = document.createElement('div');
        badge.className = 'premium-badge';
        badge.textContent = '👑';
        cover.appendChild(badge);
    }
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-button';
    addBtn.textContent = '+ Add';
    addBtn.onclick = (e) => {
        e.stopPropagation();
        addToLibrary(book);
    };
    cover.appendChild(addBtn);
    
    const title = document.createElement('p');
    title.className = 'book-title';
    title.textContent = book.title;
    
    card.appendChild(cover);
    card.appendChild(title);
    
    return card;
}

// Add Book to Library
function addToLibrary(book) {
    // Check if book already exists
    const exists = state.myBooks.find(b => b.id === book.id);
    if (exists) {
        alert('This book is already in your library!');
        return;
    }
    
    // Add book with 0% progress
    const newBook = { ...book, progress: 0 };
    state.myBooks.push(newBook);
    
    // Update UI
    initializeLibrary();
    updateBooksCount();
    
    // Show success message
    alert(`"${book.title}" added to your library!`);
}

// Initialize Library
function initializeLibrary() {
    const grid = document.getElementById('library-grid');
    const emptyState = document.getElementById('empty-library');
    
    if (!grid || !emptyState) return;
    
    if (state.myBooks.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        grid.innerHTML = '';
        
        state.myBooks.forEach(book => {
            const bookElement = createLibraryBookElement(book);
            grid.appendChild(bookElement);
        });
    }
}

// Create Library Book Element
function createLibraryBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'library-book';
    
    const cover = document.createElement('div');
    cover.className = 'library-book-cover';
    cover.textContent = book.cover;
    
    const info = document.createElement('div');
    info.className = 'library-book-info';
    
    const title = document.createElement('p');
    title.className = 'library-book-title';
    title.textContent = book.title;
    
    const progress = document.createElement('p');
    progress.className = 'library-book-progress';
    progress.textContent = `${book.progress}% read`;
    
    info.appendChild(title);
    info.appendChild(progress);
    
    bookDiv.appendChild(cover);
    bookDiv.appendChild(info);
    
    return bookDiv;
}

// Update Books Count in Profile
function updateBooksCount() {
    const countElement = document.getElementById('books-count');
    if (countElement) {
        countElement.textContent = state.myBooks.length;
    }
}

// Toggle Audio Play
function togglePlay() {
    state.audioPlaying = !state.audioPlaying;
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.textContent = state.audioPlaying ? '⏸️' : '▶️';
    }
}

// Tab Switching (Library)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab')) {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
    }
});
