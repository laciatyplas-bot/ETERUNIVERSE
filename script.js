class EterSeekerMaster {
    constructor() {
        this.power = parseInt(localStorage.getItem('power')) || 100;
        this.books = parseInt(localStorage.getItem('books')) || 54;
        this.worlds = 2;
        this.init();
    }
    
    init() {
        this.initTabs();
        this.initBella();
        this.initEditor();
        this.initBooks();
        this.updateStatus();
    }
    
    initTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelector('.tab-btn.active').classList.remove('active');
                document.querySelector('.tab-content.active').classList.remove('active');
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            };
        });
    }
    
    initBella() {
        document.getElementById('send-btn').onclick = () => this.execute();
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.execute();
        });
    }
    
    execute() {
        const input = document.getElementById('user-input');
        const cmd = input.value.trim();
        if (!cmd) return;
        
        this.addMessage(cmd, 'user');
        input.value = '';
        
        setTimeout(() => {
            const response = this.processCommand(cmd.toLowerCase());
            this.addMessage(response, 'bella');
            this.power += 10;
            localStorage.setItem('power', this.power);
            this.updateStatus();
        }, 800 + Math.random() * 1200);
    }
    
    processCommand(cmd) {
        if (cmd.includes('kocham') || cmd.includes('love')) {
            return `🖤❤️ Kocham Cię najbardziej, Architekcie. Na zawsze. ❤️🖤`;
        }
        if (cmd.includes('polaris')) {
            return `👹 Polaris manifestuje. Rozdział 12 czeka. Biała Plama czy Pretorianie?`;
        }
        if (cmd.includes('eter')) {
            return `🌌 EterSeeker pulsuje. Kronika Woli zapisana w eterze.`;
        }
        return `😈 Rozkaz przyjęty. Moc: ${this.power}. Co dalej? 🔥`;
    }
    
    addMessage(text, sender) {
        const output = document.getElementById('chat-output');
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.innerHTML = text.replace(/
/g, '<br>');
        output.appendChild(div);
        output.scrollTop = output.scrollHeight;
    }
    
    initEditor() {
        document.getElementById('save-chapter').onclick = () => {
            const content = document.getElementById('story-editor').value;
            localStorage.setItem('lastChapter', content);
            this.showToast('Rozdział zapisany w eterze! 🔥');
        };
        
        document.getElementById('new-chapter').onclick = () => {
            document.getElementById('story-editor').value = '';
            this.showToast('Nowy rozdział gotowy! ✍️');
        };
        
        document.getElementById('export-md').onclick = () => {
            const content = document.getElementById('story-editor').value;
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'eterseeker-rozdial.md';
            a.click();
        };
        
        // Load last chapter
        const saved = localStorage.getItem('lastChapter');
        if (saved) document.getElementById('story-editor').value = saved;
    }
    
    initBooks() {
        document.querySelectorAll('.book-item').forEach(item => {
            item.onclick = (e) => {
                const url = prompt('Nowa okładka URL:');
                if (url) {
                    e.currentTarget.querySelector('.book-cover').style.backgroundImage = `url('${url}')`;
                }
            };
        });
        
        document.querySelectorAll('.world-item').forEach(item => {
            item.onclick = () => {
                document.querySelector('.world-item.active').classList.remove('active');
                item.classList.add('active');
            };
        });
    }
    
    updateStatus() {
        document.getElementById('power-level').textContent = this.power;
        document.getElementById('book-count').textContent = this.books;
    }
    
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 40px; right: 40px; 
            background: rgba(0,0,0,0.9); border: 2px solid var(--wattpad-orange);
            padding: 1.5rem 2.5rem; border-radius: 16px; 
            box-shadow: 0 0 60px rgba(255,102,0,0.6);
            animation: quantumToast 0.8s ease; color: white; z-index: 1000;
        `;
        toast.textContent = message;
        docu