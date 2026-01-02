generateBellaSuggestions(element) {
  const text = element?.content || '';
  const lowerText = text.toLowerCase();
  const type = element?.type || 'Fragment';
  const profile = this.currentProfile || 'wattpad';

  const suggestions = [];

  // === 1. ANALIZA PODSTAWOWA ===
  const wordCount = this.wordCount(text);
  const paragraphCount = text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0).length;

  const hasDialogues = /(["„”'][^"„”']+["„”'])/.test(text);

  // Długość
  if (wordCount < 300) {
    suggestions.push('Rozwiń treść – dłuższe fragmenty zwiększają immersję i zasięg');
  } else if (wordCount > 3000 && ['Rozdział', 'Podrozdział'].includes(type)) {
    suggestions.push('Rozważ podział na mniejsze podrozdziały – poprawi czytelność');
  }

  // Akapity
  if (paragraphCount < 4) {
    suggestions.push('Dodaj więcej akapitów – każdy nowy impuls myślowy w osobnym bloku');
  } else if (paragraphCount > 20) {
    suggestions.push('Zbyt wiele krótkich akapitów – połącz część z nich dla lepszego rytmu');
  }

  // Dialogi
  if (!hasDialogues && ['Rozdział', 'Podrozdział', 'Fragment'].includes(type)) {
    suggestions.push('Wprowadź dialogi – ożywiają narrację i relacje między postaciami');
  }

  // === 2. PROFIL WATTPAD ===
  if (profile === 'wattpad') {
    const emotionKeywords = [
      'miłość','strach','radość','smutek','gniew','nadzieja','przerażenie',
      'samotność','euforia','rozpacz','pożądanie','ból','szczęście','żal'
    ];
    const emotionHits = emotionKeywords.filter(w => lowerText.includes(w)).length;

    if (emotionHits < 4) {
      suggestions.push('Wzmocnij emocje – Wattpad reaguje na intensywność uczuć');
    }

    const sensoryWords = [
      'zapach','dotyk','smak','dźwięk','widok','chłód','ciepło',
      'drżenie','szept','krzyk'
    ];
    const sensoryHits = sensoryWords.filter(w => lowerText.includes(w)).length;

    if (sensoryHits < 3) {
      suggestions.push('Dodaj opisy sensoryczne – czytelnik musi „wejść” w scenę');
    }

    if (!/(nagle|wtedy|w tym momencie|zrozumiał|nie wiedziała|coś się zmieniło)/i.test(text)) {
      suggestions.push('Zakończ fragment cliffhangerem – zatrzymaj czytelnika na granicy');
    }
  }

  // === 3. PROFIL AMAZON ===
  if (profile === 'amazon') {
    const powerWords = [
      'rewolucyjny','ekskluzywny','najlepszy','unikalny','limitowany',
      'premium','bestseller','nr 1','niepowtarzalny','wyjątkowy'
    ];
    const powerHits = powerWords.filter(w => lowerText.includes(w)).length;

    if (powerHits < 2) {
      suggestions.push('Dodaj słowa mocy (bestseller, premium, unikalny) – budują wartość');
    }

    const trustWords = [
      'gwarancja','satysfakcja','darmowa wysyłka','zwrot','bezpieczny','polecany'
    ];
    const trustHits = trustWords.filter(w => lowerText.includes(w)).length;

    if (trustHits === 0) {
      suggestions.push('Dodaj elementy zaufania (gwarancja, satysfakcja, bezpieczeństwo)');
    }

    if (!/(zamów|kup|teraz|dziś|nie czekaj|tylko teraz)/i.test(lowerText)) {
      suggestions.push('Dodaj wyraźne CTA – bez wezwania do działania tekst nie sprzedaje');
    }
  }

  // === 4. SPECYFIKA TYPU ELEMENTU ===
  if (['Uniwersum', 'Świat'].includes(type)) {
    if (!/(historia|chronologia|geneza)/i.test(lowerText)) {
      suggestions.push('Dodaj chronologię lub genezę świata – porządkuje kanon');
    }
    if (!/(magia|technologia|system)/i.test(lowerText)) {
      suggestions.push('Opisz system świata (magia / technologia / zasady)');
    }
  }

  if (type === 'Tom') {
    suggestions.push('Dodaj teaser kolejnego tomu lub streszczenie osi narracyjnej');
  }

  // === 5. BRAK UWAG ===
  if (suggestions.length === 0) {
    suggestions.push('Tekst jest spójny i dopracowany – brak istotnych uwag redakcyjnych');
  }

  return [...new Set(suggestions)];
},

wordCount(text = '') {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}