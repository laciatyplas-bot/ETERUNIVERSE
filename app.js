// app.js - Eterniverse Asystent Redakcyjny
(async () => {
  const { Document, Packer, Paragraph, HeadingLevel } = docx;

  const STORAGE_KEY = 'eterniverse_assistant_data_profiles';
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (!data.amazon) data.amazon = { acceptedSuggestions: [] };
  if (!data.wattpad) data.wattpad = { acceptedSuggestions: [] };

  const consoleEl = document.getElementById('console');
  const editorEl = document.getElementById('editor');
  const suggestionsEl = document.getElementById('suggestions');
  const outputEl = document.getElementById('output');
  const profileSelector = document.getElementById('profileSelector');
  const startRecBtn = document.getElementById('startRecBtn');
  const stopRecBtn = document.getElementById('stopRecBtn');
  const executeBtn = document.getElementById('executeBtn');
  const exportBtn = document.getElementById('exportBtn');

  let currentProfile = profileSelector.value;
  let recognition;
  let recognizing = false;

  // Przełączanie profili
  profileSelector.onchange = () => {
    currentProfile = profileSelector.value;
    suggestionsEl.innerHTML = '';
    outputEl.textContent = `Przełączono na profil: ${currentProfile.charAt(0).toUpperCase() + currentProfile.slice(1)}`;
    speakText(`Przełączono na profil ${currentProfile}`);
  };

  // Inicjalizacja rozpoznawania mowy
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'pl-PL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      consoleEl.value += (consoleEl.value ? ' ' : '') + transcript;
      speakText(`Rozpoznano: ${transcript}`);
    };

    recognition.onstart = () => {
      recognizing = true;
      startRecBtn.disabled = true;
      stopRecBtn.disabled = false;
      speakText('Rozpoczęto dyktowanie');
    };

    recognition.onend = () => {
      recognizing = false;
      startRecBtn.disabled = false;
      stopRecBtn.disabled = true;
      speakText('Zatrzymano dyktowanie');
    };

    recognition.onerror = (event) => {
      speakText('Wystąpił błąd rozpoznawania mowy: ' + event.error);
    };
  } else {
    startRecBtn.style.display = 'none';
    stopRecBtn.style.display = 'none';
  }

  // Event listeners dla przycisków
  startRecBtn.onclick = () => {
    if (!recognizing && recognition) recognition.start();
  };

  stopRecBtn.onclick = () => {
    if (recognizing && recognition) recognition.stop();
  };

  executeBtn.onclick = () => {
    processConsoleText(consoleEl.value);
  };

  exportBtn.onclick = () => {
    if (!editorEl.value.trim()) {
      outputEl.textContent = 'Edytor jest pusty. Nie można eksportować.';
      speakText('Edytor jest pusty. Nie można eksportować.');
      return;
    }
    exportToWord(`Opis_${currentProfile.charAt(0).toUpperCase() + currentProfile.slice(1)}`, editorEl.value.trim());
  };

  // Synteza mowy
  function speakText(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  // Sugestie dla profilu Amazon
  function amazonSuggestions(text) {
    const suggestions = [];

    // Powtarzające się słowa
    const words = text.toLowerCase().match(/\bw+\b/g) || [];
    const wordCounts = {};
    words.forEach(w => wordCounts[w] = (wordCounts[w] || 0) + 1);
    Object.entries(wordCounts).forEach(([word, count]) => {
      if (count > 5) {
        suggestions.push(`Słowo "${word}" powtarza się ${count} razy - rozważ użycie synonimów.`);
      }
    });

    // Długie zdania
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    sentences.forEach((s, i) => {
      const len = s.trim().split(/s+/).length;
      if (len > 25) {
        suggestions.push(`Zdanie nr ${i + 1} jest bardzo długie (${len} słów) - rozważ podział na krótsze.`);
      }
    });

    // Frazy marketingowe
    const marketingPhrases = [
      'najlepszy', 'idealny', 'unikalny', 'niezwykły', 'doskonały',
      'rewolucyjny', 'ekskluzywny', 'najwyższej jakości'
    ];
    marketingPhrases.forEach(phrase => {
      const reg = new RegExp(`\\b${phrase}\\b`, 'i');
      if (reg.test(text)) {
        suggestions.push(`Użyto frazy marketingowej: "${phrase}". Upewnij się, że jest adekwatna.`);
      }
    });

    // Sugestie SEO
    const seoKeywords = ['darmowa wysyłka', 'gwarancja', 'bezpieczne zakupy', 'promocja', 'nowość'];
    seoKeywords.forEach(keyword => {
      const reg = new RegExp(`\\b${keyword}\\b`, 'i');
      if (!reg.test(text)) {
        suggestions.push(`Brak frazy SEO: "${keyword}". Rozważ dodanie dla lepszej widoczności.`);
      }
    });

    return suggestions;
  }

  // Sugestie dla profilu Wattpad
  function wattpadSuggestions(text) {
    const suggestions = [];

    // Słowa emocjonalne
    const emotionWords = ['smutny', 'szczęśliwy', 'zły', 'zaskoczony', 'przerażony', 'zakochany'];
    let emotionCount = 0;
    emotionWords.forEach(word => {
      const reg = new RegExp(`\\b${word}\\b`, 'i');
      if (reg.test(text)) emotionCount++;
    });
    if (emotionCount < 2) {
      suggestions.push('Dodaj więcej emocji i opisów uczuć, by zaangażować czytelnika.');
    }

    // Krótkie zdania
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    sentences.forEach((s, i) => {
      const len = s.trim().split(/s+/).length;
      if (len < 4) {
        suggestions.push(`Zdanie nr ${i + 1} jest bardzo krótkie (${len} słów) - rozważ rozwinięcie.`);
      }
    });

    // Dialogi
    if (!/[„”"']/.test(text)) {
      suggestions.push('Dodaj dialogi, by tekst był bardziej dynamiczny i angażujący.');
    }

    // Elementy literackie
    if (!/metafora|porównanie|symbolika/i.test(text)) {
      suggestions.push('Rozważ użycie metafor, porównań lub symboliki dla wzbogacenia stylu.');
    }

    return suggestions;
  }

  // Generowanie przykładowego tekstu
  function generateSampleText(profile) {
    if (profile === 'amazon') {
      return `Ten produkt to doskonały wybór dla każdego, kto szuka najwyższej jakości i niezawodności. Zapewnia wyjątkową trwałość oraz komfort użytkowania. Skorzystaj z naszej promocji i ciesz się darmową wysyłką!`;
    }
    if (profile === 'wattpad') {
      return `Był to smutny wieczór, gdy Anna spojrzała w dal. W jej oczach kryła się tęsknota, której nie potrafiła wyrazić słowami. "Co jeśli wszystko się zmieni?" — zastanawiała się cicho, czując chłód na skórze.`;
    }
    return '';
  }

  // Zarządzanie zaakceptowanymi sugestiami
  function addAcceptedSuggestion(sug) {
    if (!data[currentProfile].acceptedSuggestions.includes(sug)) {
      data[currentProfile].acceptedSuggestions.push(sug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }

  // Pobieranie sugestii dla aktualnego profilu
  function getSuggestionsForProfile(text) {
    if (currentProfile === 'amazon') return amazonSuggestions(text);
    if (currentProfile === 'wattpad') return wattpadSuggestions(text);
    return [];
  }

  // Przetwarzanie poleceń z konsoli
  function processConsoleText(input) {
    const cmd = input.trim();
    if (!cmd) return;

    const parts = cmd.split(/s+/);
    const cmdUpper = parts[0].toUpperCase();

    // REDAGUJ / REDAGUJ TEKST
    if (cmdUpper === 'REDAGUJ' || cmdUpper === 'REDAGUJ TEKST') {
      editorEl.value = consoleEl.value;
      suggestionsEl.innerHTML = '';
      outputEl.textContent = 'Tekst przeniesiony do edytora. Kliknij "Wykonaj polecenie / Sprawdź tekst", aby zobaczyć sugestie.';
      speakText('Tekst przeniesiony do edytora. Możesz teraz sprawdzić sugestie.');
      return;
    }

    // PODPOWIEDŹ
    if (cmdUpper === 'PODPOWIEDŹ') {
      const text = editorEl.value.trim();
      if (!text) {
        outputEl.textContent = 'Edytor jest pusty. Wpisz tekst do redagowania.';
        speakText('Edytor jest pusty. Wpisz tekst do redagowania.');
        return;
      }
      let sug = getSuggestionsForProfile(text);
      sug = sug.filter(s => !data[currentProfile].acceptedSuggestions.includes(s));
      suggestionsEl.innerHTML = '';
      if (sug.length === 0) {
        suggestionsEl.textContent = 'Brak nowych sugestii.';
        speakText('Brak nowych sugestii.');
      } else {
        sug.forEach(str => {
          const div = document.createElement('div');
          div.classList.add('suggestion');
          div.textContent = str;
          const acceptBtn = document.createElement('button');
          acceptBtn.textContent = 'Akceptuj';
          acceptBtn.onclick = () => {
            addAcceptedSuggestion(str);
            div.style.opacity = '0.5';
            speakText('Sugestia zaakceptowana.');
          };
          div.appendChild(acceptBtn);
          suggestionsEl.appendChild(div);
        });
        speakText(`Znaleziono ${sug.length} sugestii.`);
      }
      return;
    }

    // EKSPORTUJ
    if (cmdUpper === 'EKSPORTUJ') {
      if (!editorEl.value.trim()) {
        outputEl.textContent = 'Edytor jest pusty. Nie można eksportować.';
        speakText('Edytor jest pusty. Nie można eksportować.');
        return;
      }
      exportToWord(`Opis_${currentProfile.charAt(0).toUpperCase() + currentProfile.slice(1)}`, editorEl.value.trim());
      return;
    }

    // GENERUJ TEKST
    if (cmdUpper === 'GENERUJ') {
      if (parts[1] && parts[1].toUpperCase() === 'TEKST') {
        const sampleText = generateSampleText(currentProfile);
        editorEl.value = sampleText;
        suggestionsEl.innerHTML = '';
        outputEl.textContent = `Wygenerowano przykładowy tekst dla profilu ${currentProfile}.`;
        speakText(`Wygenerowano przykładowy tekst dla profilu ${currentProfile}.`);
        return;
      }
    }

    // Domyślne załadowanie tekstu do edytora
    editorEl.value = input;
    suggestionsEl.innerHTML = '';
    outputEl.textContent = 'Tekst załadowany do edytora.';
    speakText('Tekst załadowany do edytora.');
  }

  // Eksport do Word (.docx)
  async function exportToWord(title, text) {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
          }),
          new Paragraph(text),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/s+/g, '_')}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    outputEl.textContent = `Eksportowano plik ${a.download}`;
    speakText('Plik został wyeksportowany.');
  }

  // Powitalna wiadomość
  speakText('Eterniverse Asystent Redakcyjny gotowy do pracy!');
})();