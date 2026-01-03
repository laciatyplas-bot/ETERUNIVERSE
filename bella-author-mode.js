generateBellaSuggestions(element) {
  const text = element?.content?.trim() || '';
  const lowerText = text.toLowerCase();
  const type = element?.type || 'Fragment';
  const profile = this.currentProfile || 'wattpad';

  const suggestions = new Set(); // Set zapewnia brak duplikatów

  // === PODSTAWOWA ANALIZA TEKSTU ===
  const wordCount = this.wordCount(text);
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  const hasDialogues = /["„”][^"„”']{10,}["„”]/.test(text); // dialogi dłuższe niż 10 znaków

  // Długość treści
  if (wordCount < 300) {
    suggestions.add('Rozwiń treść – dłuższe fragmenty zwiększają immersję i zasięg na platformie.');
  } else if (wordCount > 3000 && ['Rozdział', 'Podrozdział'].includes(type)) {
    suggestions.add('Rozważ podział na mniejsze podrozdziały – poprawi czytelność i retencję czytelnika.');
  }

  // Struktura akapitowa
  if (paragraphCount < 4) {
    suggestions.add('Dodaj więcej akapitów – każdy nowy impuls myślowy lub zmiana perspektywy w osobnym bloku.');
  } else if (paragraphCount > 20) {
    suggestions.add('Zbyt wiele krótkich akapitów – połącz część z nich, aby uzyskać lepszy rytm narracji.');
  }

  // Dialogi
  if (!hasDialogues && ['Rozdział', 'Podrozdział', 'Fragment'].includes(type)) {
    suggestions.add('Wprowadź dialogi – ożywiają postaci i dynamizują narrację.');
  }

  // === PROFIL WATTPAD ===
  if (profile === 'wattpad') {
    const emotionKeywords = [
      'miłość', 'strach', 'radość', 'smutek', 'gniew', 'nadzieja', 'przerażenie',
      'samotność', 'euforia', 'rozpacz', 'pożądanie', 'ból', 'szczęście', 'żal', 'tęsknota'
    ];
    const emotionHits = emotionKeywords.filter(w => lowerText.includes(w)).length;

    if (emotionHits < 4) {
      suggestions.add('Wzmocnij warstwę emocjonalną – Wattpad premiuje intensywność uczuć i relacje postaci.');
    }

    const sensoryWords = [
      'zapach', 'dotyk', 'smak', 'dźwięk', 'widok', 'chłód', 'ciepło',
      'drżenie', 'szept', 'krzyk', 'szum', 'blask', 'mrok'
    ];
    const sensoryHits = sensoryWords.filter(w => lowerText.includes(w)).length;

    if (sensoryHits < 3) {
      suggestions.add('Dodaj więcej opisów sensorycznych – czytelnik musi fizycznie „wejść” w scenę.');
    }

    const cliffhangerPatterns = /(nagle|wtedy|w tym momencie|zrozumiał|nie wiedziała|coś się zmieniło|drzwi się otworzyły|telefon zadzwonił)/i;
    if (!cliffhangerPatterns.test(text)) {
      suggestions.add('Zakończ fragment cliffhangerem lub otwartym pytaniem – zwiększy chęć przejścia do kolejnego rozdziału.');
    }
  }

  // === PROFIL AMAZON / SPRZEDAŻ ===
  if (profile === 'amazon') {
    const powerWords = [
      'rewolucyjny', 'ekskluzywny', 'najlepszy', 'unikalny', 'limitowany',
      'premium', 'bestseller', 'nr 1', 'niepowtarzalny', 'wyjątkowy', 'autentyczny'
    ];
    const powerHits = powerWords.filter(w => lowerText.includes(w)).length;

    if (powerHits < 2) {
      suggestions.add('Wpleć słowa mocy (np. „bestseller”, „unikalny”, „rewolucyjny”) – budują postrzeganą wartość produktu.');
    }

    const trustWords = [
      'gwarancja', 'satysfakcja', 'zwrot', 'bezpieczny', 'polecany', 'sprawdzony', 'recenzje'
    ];
    const trustHits = trustWords.filter(w => lowerText.includes(w)).length;

    if (trustHits === 0) {
      suggestions.add('Dodaj elementy budujące zaufanie (gwarancja satysfakcji, zwrot, opinie czytelników).');
    }

    const ctaPatterns = /(zamów|kup|teraz|dziś|nie czekaj|tylko teraz|ograniczona oferta)/i;
    if (!ctaPatterns.test(text)) {
      suggestions.add('Wstaw wyraźne wezwanie do działania (CTA) – bez niego opis nie konwertuje na sprzedaż.');
    }
  }

  // === SPECYFIKA TYPU ELEMENTU ===
  if (['Uniwersum', 'Świat'].includes(type)) {
    if (!/(historia|chronologia|geneza|timeline)/i.test(lowerText)) {
      suggestions.add('Dodaj chronologię lub genezę świata – uporządkuje kanon i ułatwi orientację czytelnikowi.');
    }
    if (!/(magia|technologia|system|zasady|reguły|prawa)/i.test(lowerText)) {
      suggestions.add('Opisz system świata (magia, technologia, reguły pola) – czytelnik potrzebuje jasnych zasad.');
    }
  }

  if (type === 'Tom') {
    suggestions.add('Dodaj teaser kolejnego tomu lub streszczenie głównej osi narracyjnej serii.');
  }

  // === BRAK UWAG ===
  if (suggestions.size === 0) {
    suggestions.add('Tekst jest spójny, dobrze zbalansowany i dopracowany – brak istotnych uwag redakcyjnych.');
  }

  return Array.from(suggestions);
},

wordCount(text = '') {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}