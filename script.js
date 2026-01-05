class EterSeekerMaster {
    constructor() {
        this.power = 100;
        this.books = 54;
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
            console.log('ROZDZIAŁ ZAPISANY:', content);
            this.showToast('Rozdział zapisany w eterze! 🔥');
        };
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
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

new EterSeekerMaster();