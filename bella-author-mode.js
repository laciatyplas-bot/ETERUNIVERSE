generateBellaSuggestions(element) {
  // Pobranie danych wejściowych
  const text = element.content || '';
  const lowerText = text.toLowerCase();
  const type = element.type || 'Fragment';
  const profile = this.currentProfile; // 'wattpad' lub 'amazon'

  // Inicjalizacja listy sugestii
  const suggestions = [];

  // === 1. ANALIZA PODSTAWOWA (dla wszystkich profili) ===
  const wordCount = this.wordCount(text);
  const paragraphCount = text.split('\n\n').filter(p => p.trim().length > 0).length;
  const hasDialogues = /["„][^"„”]*["”]/.test(text); // proste wykrywanie dialogów

  // Długość tekstu
  if (wordCount < 300) {
    suggestions.push('Rozwiń treść – dłuższe fragmenty mają większy zasięg i głębię');
  } else if (wordCount > 3000 && ['Rozdział', 'Podrozdział'].includes(type)) {
    suggestions.push('Rozważ podzielenie na mniejsze podrozdziały – lepsza czytelność');
  }

  // Akapity i struktura
  if (paragraphCount < 4) {
    suggestions.push('Dodaj więcej akapitów – każdy nowy pomysł w nowym akapicie poprawia rytm');
  }
  if (paragraphCount > 20) {
    suggestions.push('Zbyt wiele krótkich akapitów – połącz niektóre, by stworzyć płynniejszy przepływ');
  }

  // Dialogi
  if (!hasDialogues && ['Rozdział', 'Podrozdział', 'Fragment'].includes(type)) {
    suggestions.push('Wprowadź dialogi – ożywiają postaci i dynamizują narrację');
  }

  // === 2. ANALIZA SPECJFICZNA DLA PROFILU WATTPAD (emocje, immersja) ===
  if (profile === 'wattpad') {
    // Słowa kluczowe emocji
    const emotionKeywords = ['miłość', 'strach', 'radość', 'smutek', 'gniew', 'nadzieja', 'przerażenie', 'zakochać', 'samotność', 'euforia', 'rozpacz', 'pożądanie', 'ból', 'szczęście', 'żal'];
    const emotionMatches = emotionKeywords.filter(word => lowerText.includes(word)).length;

    if (emotionMatches < 4) {
      suggestions.push('Wzmocnij warstwę emocjonalną – Wattpad żyje uczuciami czytelników');
    }

    // Opisy sensoryczne
    const sensoryWords = ['zapach', 'dotyk', 'smak', 'dźwięk', 'widok', 'chłód', 'ciepło', 'drżenie', 'szept', 'krzyk'];
    const sensoryMatches = sensoryWords.filter(word => lowerText.includes(word)).length;

    if (sensoryMatches < 3) {
      suggestions.push('Dodaj opisy sensoryczne – czytelnik musi czuć, słyszeć, widzieć Twój świat');
    }

    // Napięcie i cliffhanger
    if (!/(co dalej\?|nagle|wtedy|w tym momencie|nie spodziewał|nie wiedziała)/i.test(text)) {
      suggestions.push('Zakończ rozdział cliffhangerem – zostaw czytelnika w napięciu');
    }
  }

  // === 3. ANALIZA SPECJFICZNA DLA PROFILU AMAZON (marketing, konwersja) ===
  if (profile === 'amazon') {
    // Słowa mocy i unikalności
    const powerWords = ['rewolucyjny', 'ekskluzywny', 'najlepszy', 'unikalny', 'limitowany', 'premium', 'bestseller', 'nr 1', 'niepowtarzalny', 'wyjątkowy'];
    const powerMatches = powerWords.filter(word => lowerText.includes(word)).length;

    if (powerMatches < 2) {
      suggestions.push('Użyj słów mocy: rewolucyjny, ekskluzywny, bestseller – budują wartość');
    }

    // Elementy zaufania i konwersji
    const trustPhrases = ['gwarancja', 'satysfakcja', 'darmowa wysyłka', 'zwrot', 'bezpieczny', 'sprawdzony', 'polecany'];
    const trustMatches = trustPhrases.filter(phrase => lowerText.includes(phrase)).length;

    if (trustMatches === 0) {
      suggestions.push('Dodaj elementy zaufania: gwarancja satysfakcji, darmowa wysyłka');
    }

    // Call to Action
    if (!/(zamów|kup|teraz|dziś|nie czekaj|tylko teraz)/i.test(lowerText)) {
      suggestions.push('Zakończ mocnym wezwaniem do działania (CTA) – zachęć do zakupu');
    }
  }

  // === 4. SUGESTIE SPECJFICZNE DLA TYPU ELEMENTU ===
  if (['Uniwersum', 'Świat'].includes(type)) {
    if (!lowerText.includes('historia') && !lowerText.includes('chronologia')) {
      suggestions.push('Dodaj krótką chronologię lub historię świata – pomaga w orientacji');
    }
    if (!lowerText.includes('magia') && !lowerText.includes('technologia') && !lowerText.includes('system')) {
      suggestions.push('Opisz system magii/technologii – fundament Twojego świata');
    }
  }

  if (type === 'Tom') {
    suggestions.push('Dodaj streszczenie poprzedniego tomu lub teaser następnego');
  }

  // === 5. FINALNA WALIDACJA – jeśli brak sugestii ===
  if (suggestions.length === 0) {
    suggestions.push('Tekst jest bardzo dobry – brak istotnych sugestii redakcyjnych');
    suggestions.push('Gratulacje! Twój styl jest spójny i angażujący');
  }

  // Zwróć unikalne sugestie (bez duplikatów)
  return [...new Set(suggestions)];
},

// Pomocnicza metoda do liczenia słów
wordCount(text = '') {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}