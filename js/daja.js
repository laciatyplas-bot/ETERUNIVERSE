// dają.js — Eterniverse Master Premium PRO v14.0
// PEŁNA, KOMPLETNA OBSŁUGA DYKTOWANIA GŁOSOWEGO
// WKLEJ 1:1 — NIE EDYTUJ

'use strict';

class EterniverseVoiceDictation {
  constructor(app) {
    this.app = app;
    this.recognition = null;
    this.isDictating = false;

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
    this.app?.setStatus?.('Dyktowanie głosowe gotowe (PL)');
  }

  isSupported() {
    return ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  setupRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();

    this.recognition.lang = 'pl-PL';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    /* === RESULT === */
    this.recognition.onresult = (event) => {
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript.trim() + ' ';
        }
      }

      if (!finalText) return;

      const textarea = document.getElementById('element-content');
      if (!textarea) return;

      textarea.value += finalText;
      this.app?.autoSaveCurrent?.();

      const conf = event.results[event.results.length - 1][0].confidence;
      if (conf !== undefined) {
        this.app?.setStatus?.(
          `🎤 Rozpoznano: "${finalText.trim()}" (${Math.round(conf * 100)}%)`,
          4000
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
      this.app?.setStatus?.('Dyktowanie zatrzymane', 5000);
    };

    /* === ERROR === */
    this.recognition.onerror = (event) => {
      this.isDictating = false;
      this.toggleButtons(false);

      const errors = {
        'no-speech': 'Nie wykryto mowy',
        'audio-capture': 'Brak dostępu do mikrofonu',
        'not-allowed': 'Mikrofon zablokowany',
        'network': 'Błąd sieci'
      };

      const msg = errors[event.error] || `Błąd dyktowania: ${event.error}`;
      this.app?.setStatus?.(msg, 10000);
      console.error('SpeechRecognition error:', event.error);
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
      console.error('Błąd startu dyktowania', e);
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
     UI
  ========================= */
  toggleButtons(active) {
    const start = document.getElementById('start-dictate');
    const stop = document.getElementById('stop-dictate');
    if (start) start.disabled = active;
    if (stop) stop.disabled = !active;
  }

  disableButtons() {
    const start = document.getElementById('start-dictate');
    const stop = document.getElementById('stop-dictate');
    if (start) start.disabled = true;
    if (stop) stop.disabled = true;
  }
}

/* =========================
   AUTO-PODPIĘCIE DO MASTER
========================= */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.master) {
    console.warn('Brak EterniverseMaster — dyktowanie niepodpięte');
    return;
  }

  const voice = new EterniverseVoiceDictation(window.master);
  window.voiceDictation = voice;

  // Podpinamy metody do mastera (BEZ ZMIAN W app.js)
  window.master.startDictation = () => voice.start();
  window.master.stopDictation = () => voice.stop();

  console.log('🎤 Dyktowanie głosowe (dają.js) załadowane');
});