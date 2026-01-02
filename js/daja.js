// Pełna i kompletna implementacja dyktowania głosowego – Eterniverse Master Premium PRO v14.0
// Obsługa SpeechRecognition API z fallbackiem, walidacją, statusami i autosave

initSpeechRecognition() {
  // Sprawdź dostępność API
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    this.status('Dyktowanie głosowe nie jest obsługiwane w tej przeglądarce', 10000);
    document.getElementById('start-dictate').disabled = true;
    document.getElementById('stop-dictate').disabled = true;
    console.warn('SpeechRecognition API nieobsługiwane');
    return false;
  }

  // Utwórz instancję rozpoznawania
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  this.recognition = new SpeechRecognition();

  // Konfiguracja
  this.recognition.lang = 'pl-PL';                    // Język polski
  this.recognition.continuous = true;                 // Ciągłe słuchanie
  this.recognition.interimResults = true;             // Wyniki pośrednie (na żywo)
  this.recognition.maxAlternatives = 1;               // Tylko najlepsza alternatywa

  // === EVENT: Wynik rozpoznawania ===
  this.recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript.trim();
      const confidence = event.results[i][0].confidence;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    const textarea = document.getElementById('element-content');
    if (!textarea) return;

    // Usuń poprzedni interim (jeśli istnieje) i dodaj nowy
    if (interimTranscript) {
      // Prosty sposób: dodajemy tylko final, interim pokazujemy wizualnie
      textarea.value += finalTranscript;
      this.autoSaveCurrent();

      // Opcjonalnie: pokaż interim jako placeholder lub overlay
      // (tu prosty sposób – nie mieszamy z finalnym tekstem)
    } else if (finalTranscript) {
      textarea.value += finalTranscript;
      this.autoSaveCurrent();
      this.status(`Rozpoznano: "${finalTranscript.trim()}" (pewność: ${(confidence * 100).toFixed(0)}%)`, 4000);
    }
  };

  // === EVENT: Start ===
  this.recognition.onstart = () => {
    this.isDictating = true;
    document.getElementById('start-dictate').disabled = true;
    document.getElementById('stop-dictate').disabled = false;
    this.status('🎤 Dyktowanie aktywne – mów teraz', 0);
  };

  // === EVENT: Koniec ===
  this.recognition.onend = () => {
    this.isDictating = false;
    document.getElementById('start-dictate').disabled = false;
    document.getElementById('stop-dictate').disabled = true;
    this.status('Dyktowanie zatrzymane – kliknij „Dyktuj”, aby kontynuować', 5000);
  };

  // === EVENT: Błąd ===
  this.recognition.onerror = (event) => {
    this.isDictating = false;
    document.getElementById('start-dictate').disabled = false;
    document.getElementById('stop-dictate').disabled = true;

    let errorMsg = 'Błąd dyktowania';
    switch (event.error) {
      case 'no-speech':
        errorMsg = 'Nie wykryto mowy – spróbuj ponownie';
        break;
      case 'audio-capture':
        errorMsg = 'Brak dostępu do mikrofonu – sprawdź uprawnienia';
        break;
      case 'not-allowed':
        errorMsg = 'Mikrofon zablokowany – zezwól na dostęp w przeglądarce';
        break;
      case 'network':
        errorMsg = 'Błąd sieci – sprawdź połączenie';
        break;
      case 'bad-grammar':
        errorMsg = 'Błąd gramatyki rozpoznawania';
        break;
      default:
        errorMsg = `Błąd: ${event.error}`;
    }

    this.status(errorMsg, 10000);
    console.error('SpeechRecognition error:', event.error);
  };

  // === EVENT: Brak dźwięku po starcie ===
  this.recognition.onspeechend = () => {
    // Automatyczne zatrzymanie jeśli użytkownik przestał mówić
    // (opcjonalnie – można wyłączyć)
    // this.recognition.stop();
  };

  this.status('Dyktowanie głosowe gotowe (język: polski)');
  return true;
},

// Start dyktowania
startDictation() {
  if (!this.recognition) {
    this.status('Dyktowanie nie zainicjalizowane');
    return;
  }

  if (this.isDictating) {
    this.status('Dyktowanie już aktywne');
    return;
  }

  try {
    this.recognition.start();
  } catch (e) {
    if (e.name === 'InvalidStateError') {
      this.status('Dyktowanie już trwa – zatrzymaj najpierw');
    } else {
      this.status('Błąd startu dyktowania');
      console.error(e);
    }
  }
},

// Zatrzymaj dyktowanie
stopDictation() {
  if (!this.recognition || !this.isDictating) {
    this.status('Dyktowanie nie jest aktywne');
    return;
  }

  try {
    this.recognition.stop();
  } catch (e) {
    console.error('Błąd zatrzymania dyktowania', e);
  }
},