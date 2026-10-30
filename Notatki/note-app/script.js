const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');
const noteCategory = document.getElementById('noteCategory');
const notesGrid = document.getElementById('notesGrid');
const searchInput = document.getElementById('searchInput');
const themeToggleBtn = document.getElementById('themeToggleBtn');

let notes = JSON.parse(localStorage.getItem('math_notes')) || [];
let currentTheme = localStorage.getItem('math_theme') || 'light';

if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = '∫ theme';
}

function saveAndRender() {
    localStorage.setItem('math_notes', JSON.stringify(notes));
    renderNotes(notes);
}

function renderNotes(items) {
    notesGrid.innerHTML = '';

    if (items.length === 0) {
        notesGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted);">&empty; Set is empty</p>`;
        return;
    }

    const sortedItems = [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    sortedItems.forEach((note) => {
        const card = document.createElement('article');
        card.classList.add('note-card');
        if (note.pinned) card.classList.add('pinned');

        card.innerHTML = `
            <div>
                <div class="note-header">
                    <h3>${escapeHtml(note.title)}</h3>
                    <span class="badge">${escapeHtml(note.category)}</span>
                </div>
                <p class="note-body">${escapeHtml(note.text)}</p>
            </div>
            <div class="note-footer">
                <span class="note-date">t = ${note.date}</span>
                <div class="action-btns">
                    <button class="pin-btn ${note.pinned ? 'active' : ''}" onclick="togglePin(${note.id})">&infin;</button>
                    <button class="delete-btn" onclick="deleteNote(${note.id})">&empty;</button>
                </div>
            </div>
        `;

        notesGrid.appendChild(card);
    });
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newNote = {
        id: Date.now(),
        title: noteTitle.value.trim(),
        text: noteText.value.trim(),
        category: noteCategory.value,
        pinned: false,
        date: new Date().toLocaleDateString('en-GB')
    };

    notes.unshift(newNote);
    saveAndRender();
    noteForm.reset();
});

window.togglePin = function(id) {
    notes = notes.map(note => note.id === id ? { ...note, pinned: !note.pinned } : note);
    saveAndRender();
};

window.deleteNote = function(id) {
    notes = notes.filter(note => note.id !== id);
    saveAndRender();
};

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.text.toLowerCase().includes(query)
    );
    renderNotes(filtered);
});

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('math_theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '∫ theme' : '∑ theme';
});

function escapeHtml(text) {
    return text.replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
}

renderNotes(notes);