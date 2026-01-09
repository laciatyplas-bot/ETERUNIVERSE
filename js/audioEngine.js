let currentAudio = null;

export function setupAudioEngine() {
  console.log('[AUDIO ENGINE] aktywny');
}

export function playAudio(url) {
  stopAll();
  currentAudio = new Audio(url);
  currentAudio.volume = 0.9;
  currentAudio.play();
}

export function stopAll() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = null;
}
