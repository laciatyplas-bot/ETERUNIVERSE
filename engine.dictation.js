// dają.js — Eterniverse Master Premium PRO v14.2
// PEŁNA, KOMPLETNA OBSŁUGA DYKTOWANIA GŁOSOWEGO (PL)
// WKLEJ 1:1

'use strict';

class EterniverseVoiceDictation {
  constructor(app) {
    this.app = app;
    this.recognition = null;
    this.isDictating = false;
    this.interimTranscript = '';

    this.init(); 
  }

  /* =========================
     INIT
  ========================= */
  init() {
    if (!this.isSupported()) {
      this.disableButtons();
      this.app?.setStatus?.('Dyktowanie głosowe nieobsługiwane w tej przeglądarce', 10000);
      console.warn('SpeechRecognition API nieobsługiwane');
      return;
    }

    this.setupRecognition();
    this.app?.setStatus?.('Dyktowanie głosowe gotowe (język: polski)', 5000);
  }

  isSupported() {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }

  setupRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    /* === WYNIK === */
    this.recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // Tymczasowy podgląd
      if (interim) {
        this.interimTranscript = interim;
        this.app?.setStatus?.(`🎤 Słucham... "${interim}"`, 0);
      }

      // Finalny tekst
      if (final) {
        const textarea = document.getElementById('element-content');
        if (textarea) {
          const start = textarea.selectionStart || textarea.value.length;
          const end = textarea.selectionEnd || textarea.value.length;

          textarea.value =
            textarea.value.substring(0, start) +
            final.trim() +
            ' ' +
            textarea.value.substring(end);

          textarea.selectionStart = textarea.selectionEnd = start + final.trim().length + 1;

          textarea.focus();
          this.app?.autoSaveCurrent?.();
        }

        const confidence = event.results[event.results.length - 1][0].confidence;
        const confPercent = confidence !== undefined ? Math.round(confidence * 100) : '?';

        this.app?.setStatus?.(
          `🎤 Rozpoznano: "\( {final.trim()}" ( \){confPercent}%)`,
          5000
        );
      }
    };

    /* === START === */
    this.recognition.onstart = () => {
      this.isDictating = true;
      this.toggleButtons(true);
      this.app?.setStatus?.('🎤 Dyktowanie aktywne — mów teraz', 0);
    };

    /* === END === */
    this.recognition.onend = () => {
      this.isDictating = false;
      this.toggleButtons(false);
      this.interimTranscript = '';
      this.app?.setStatus?.('Dyktowanie zatrzymane', 4000);
    };

    /* === ERROR === */
    this.recognition.onerror = (event) => {
      this.isDictating = false;
      this.toggleButtons(false);
      this.interimTranscript = '';

      const errors = {
        'no-speech': 'Nie wykryto mowy – spróbuj głośniej',
        'audio-capture': 'Brak dostępu do mikrofonu',
        'not-allowed': 'Mikrofon zablokowany – zezwól w ustawieniach przeglądarki',
        'network': 'Błąd sieci – sprawdź połączenie',
        'service-not-allowed': 'Usługa rozpoznawania mowy niedostępna',
        'bad-grammar': 'Błąd gramatyki rozpoznawania',
        'language-not-supported': 'Język polski nieobsługiwany w tej przeglądarce'
      };

      const msg = errors[event.error] || `Nieznany błąd: ${event.error}`;
      this.app?.setStatus?.(`Błąd dyktowania: ${msg}`, 10000);
      console.error('SpeechRecognition error:', event);
    };

    /* === NOMATCH === */
    this.recognition.onnomatch = () => {
      this.app?.setStatus?.('Nie rozpoznano mowy – spróbuj ponownie', 5000);
    };
  }

  /* =========================
     KONTROLA
  ========================= */
  start() {
    if (!this.recognition || this.isDictating) return;

    try {
      this.recognition.start();
    } catch (e) {
      if (e.name === 'InvalidStateError') {
        // Już uruchomione – ignorujemy
      } else {
        console.error('Błąd startu dyktowania', e);
        this.app?.setStatus?.('Nie można uruchomić dyktowania', 8000);
      }
    }
  }

  stop() {
    if (!this.recognition || !this.isDictating) return;

    try {
      this.recognition.stop();
    } catch (e) {
      console.error('Błąd zatrzymania dyktowania', e);
    }
  }

  /* =========================
     UI PRZYCISKI
  ========================= */
  toggleButtons(active) {
    const startBtn = document.getElementById('start-dictate');
    const stopBtn = document.getElementById('stop-dictate');

    if (startBtn) startBtn.disabled = active;
    if (stopBtn) stopBtn.disabled = !active;
  }

  disableButtons() {
    const startBtn = document.getElementById('start-dictate');
    const stopBtn = document.getElementById('stop-dictate');

    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = true;
  }
}

/* =========================
   AUTO-PODPIĘCIE DO MASTER
========================= */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.master) {
    console.warn('Brak instancji EterniverseMaster — dyktowanie niepodpięte');
    return;
  }

  const voice = new EterniverseVoiceDictation(window.master);
  window.voiceDictation = voice;

  // Udostępnienie metod masterowi
  window.master.startDictation = () => voice.start();
  window.master.stopDictation = () => voice.stop();

  console.log('🎤 Dyktowanie głosowe (dają.js v14.2) załadowane i gotowe');
});
