// ==========================================================
//  ETERNIVERSE AUDIO ENGINE
// ==========================================================
//  Globalna kontrola dźwięku i odtwarzaczy
// ==========================================================

let currentAudio = null;

export function setupAudioEngine() {
  console.log('[AUDIO ENGINE] Aktywny');
}

// ▶️ Odtwórz plik audio
export function playAudio(url) {
  stopAll();
  currentAudio = new Audio(url);
  currentAudio.volume = 0.9;
  currentAudio.play();
  console.log('[AUDIO] ▶️ Start', url);
}

// ⏹️ Zatrzymaj wszystko
export function stopAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    console.log('[AUDIO] ⏹️ Stop');
  }
  currentAudio = null;
}
