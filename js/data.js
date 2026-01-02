:root {
  --bg: #0a0a12;
  --panel: #12121a;
  --accent: #00e0ff;
  --gold: #f0c040;
  --text: #f0f8ff;
  --muted: #a0c0e0;
  --border: #283040;
  --shadow: 0 15px 40px rgba(0,0,0,0.6);
}

* { margin:0; padding:0; box-sizing:border-box; }
body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #0a0a12, #1a1a2e);
  color: var(--text);
  min-height: 100vh;
  padding: 2rem;
  position: relative;
}

header {
  text-align: center;
  padding: 3rem 0 4rem;
}

header h1 {
  font-family: 'Orbitron', sans-serif;
  font-size: 4rem;
  background: linear-gradient(90deg, var(--accent), var(--gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0,224,255,0.3);
}

header p {
  font-size: 1.4rem;
  color: var(--muted);
  margin-top: 1rem;
}

.stats {
  text-align: center;
  margin: 2rem 0;
  font-size: 1.3rem;
  color: var(--gold);
}

.gates-container, .memory-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto 4rem;
}

.gate, .memory-panel {
  background: var(--panel);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 2rem;
  box-shadow: var(--shadow);
  transition: all 0.4s ease;
  cursor: pointer;
}

.gate:hover, .memory-panel:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0,224,255,0.2);
  border-color: var(--accent);
}

.gate h2, .memory-panel h2 {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  color: var(--accent);
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(0,224,255,0.3);
}

.worlds {
  margin-top: 1.5rem;
}

.world {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  border-left: 4px solid var(--gold);
}

.world h3 {
  color: var(--gold);
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}

.books-count {
  font-size: 1rem;
  color: var(--muted);
  opacity: 0.9;
}

.memory-content {
  background: rgba(0,224,255,0.05);
  border-radius: 12px;
  padding: 1.2rem;
  max-height: 400px;
  overflow-y: auto;
  font-family: 'Consolas', monospace;
  font-size: 0.95rem;
}

.footer {
  text-align: center;
  margin-top: 5rem;
  padding: 2rem;
  color: var(--muted);
  font-size: 1.1rem;
}