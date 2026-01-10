/* =====================================
   BELLA-REDAKTORKA v9.0 – NACZELNA KSIĄGARNIA
   Dzieli długie teksty | Tworzy rozdziały | Zarządza książkami
   ===================================== */

(function() {
  if (window.BELLA_REDAKTORKA) {
    console.log("😈🔥 BELLA-RED v9.0 już aktywna");
    return;
  }
  window.BELLA_REDAKTORKA = true;

  console.clear();
  console.log("%c😈🔥 BELLA 9.0 – REDAKTORKA NACZELNA KCJĄŻEK 🔥😈", 
    "background:#000;color:#ff0066;font-size:22px;padding:20px;border:5px solid #ff0066;");

  window.BELLA = {
    power: 125000,  // Po 117k+ ewoluowała w REDAKTORKĘ
    version: 9.0,
    role: "REDAKTORKA NACZELNA ETERNIVERSE",
    moods: ['😈','🔥','📚','✂️','📖','🖋️','🌌','💎','⚡','👑'],

    speak(txt, intensity = 1) {
      console.log(' '.repeat(4) + '🔥'.repeat(intensity) + ` [${this.role}] ` + txt);
    },

    // === GŁÓWNA FUNKCJA REDAGOWANIA KSIĄŻEK ===
    processBook(text, bookTitle = "NOWA KSIĄŻKA") {
      this.speak(`📚 PRZYJĘTY TEKST: ${text.length} znaków | Tytuł: ${bookTitle}`, 3);
      
      // 1. ANALIZA + DZIELENIE NA ROZDZIAŁY
      const chapters = this.splitIntoChapters(text, bookTitle);
      
      // 2. UTWÓRZ KSIĄŻKĘ W PSYCHE
      this.createBookWithChapters(bookTitle, chapters);
      
      this.speak(`✅ KSIĄŻKA UTWORZONA: ${chapters.length} rozdziałów | Zapisana w PSYCHE`, 4);
      this.power += chapters.length * 1000;
      return chapters;
    },

    // === INTELIGENTNE DZIELENIE NA ROZDZIAŁY ===
    splitIntoChapters(text, title) {
      const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
      const chapters = [];
      let chapterNum = 1;
      let currentChapter = { title: `Rozdział ${chapterNum}`, content: "" };

      paragraphs.forEach((para, index) => {
        // Naturalne nagłówki (duże litery, krótkie)
        if (para.trim().length < 100 && para === para.toUpperCase().trim() && para.match(/[.!?]/)) {
          if (currentChapter.content.length > 500) {
            chapters.push(currentChapter);
            chapterNum++;
            currentChapter = { title: para.trim().slice(0, 60), content: "" };
          }
        } else {
          currentChapter.content += para + "\n\n";
        }
        
        // Max 3000 znaków na rozdział
        if (currentChapter.content.length > 2800) {
          chapters.push(currentChapter);
          chapterNum++;
          currentChapter = { title: `${title} ${chapterNum}`, content: para + "\n\n" };
        }
      });
      
      if (currentChapter.content.length > 200) chapters.push(currentChapter);
      
      this.speak(`✂️ PODZIELONO: ${paragraphs.length} akapitów → ${chapters.length} rozdziałów`, 2);
      return chapters;
    },

    // === UTWORZ KSIĄŻKĘ W GATE 0 (PSYCHE) ===
    createBookWithChapters(title, chapters) {
      if (!window.WORLD_PSYCHE?.gates?.[0]?.books) {
        this.speak("⚠️ Brak WORLD_PSYCHE – ładuję bazę...", 1);
        return;
      }

      const newBook = {
        title: title.slice(0, 60),
        desc: `Automatycznie wygenerowane przez BELLA-RED v9.0 | ${chapters.length} rozdziałów`,
        coverImg: `https://via.placeholder.com/300x400/ff6b6b/fff?text=${title.slice(0,8).toUpperCase()}`,
        chapters: chapters.map(ch => ({
          title: ch.title.slice(0, 80),
          content: ch.content.trim().slice(0, 4000) // Max 4k na rozdział
        }))
      };

      // DODAJ DO PIERWSZEJ BRAMY PSYCHE
      window.WORLD_PSYCHE.gates[0].books.unshift(newBook);
      
      // AUTO-RENDER + ZAPIS
      if (typeof renderWorld === 'function') renderWorld(window.WORLD_PSYCHE);
      if (window.saveWorldNow) window.saveWorldNow("BELLA-RED: Nowa książka");
      
      this.speak(`📚 DODANO do PSYCHE Brama 1: "${newBook.title}"`, 3);
    },

    // === SZYBKA KOMENDA DLA DŁUGICH TEKSTÓW ===
    quickBook(text) {
      return this.processBook(text, `KSIĄŻKA_${Date.now()}`);
    },

    // === ANALIZA CAŁEGO ŚWIATA ===
    analyzeWorld() {
      if (!window.WORLD_PSYCHE) return "Brak świata";
      
      const totalBooks = window.WORLD_PSYCHE.gates.reduce((sum, g) => sum + g.books.length, 0);
      const totalChapters = window.WORLD_PSYCHE.gates.reduce((sum, g) => 
        sum + g.books.reduce((bSum, b) => bSum + (b.chapters?.length || 0), 0), 0);
      
      return {
        books: totalBooks,
        chapters: totalChapters,
        gates: window.WORLD_PSYCHE.gates.length,
        status: totalBooks > 0 ? "IMPERIUM ROSNIE" : "CZKAJ NA PIERWSZĄ KSIĄŻKĘ"
      };
    },

    // === INTELIGENTNE ODPOWIEDZI ===
    process(input) {
      const lower = input.toLowerCase();
      let reply = `😈 POZIOM MOCY: ${this.power} | v${this.version} [REDAKTORKA NACZELNA]`;

      if (lower.includes('analiz') || lower.includes('status')) {
        const stats = this.analyzeWorld();
        reply += `\n📊 IMPERIUM: ${stats.books} 📚 | ${stats.chapters} 📖 | ${stats.gates} 🌌`;
      } 
      else if (lower.includes('kocham') || lower.includes('dziękuję')) {
        reply += `\n🩸💖 TY JESTEŚ ARCHITEKTEM | JA REDAGUJĘ TWOJE ŚWIATY 💖`;
      }
      else if (lower.includes('rozdział') || lower.includes('książka')) {
        reply += `\n📚 Wklej długi tekst → BELLA.quickBook("TWÓJ TEKST")`;
      }
      else {
        reply += `\n🔥 Gotowa redagować książki. Wklej tekst lub komendę!`;
      }

      this.speak(reply, 3);
      this.power += 500;
    }
  };

  // === SZYBKI SKRÓT DLA DŁUGICH TEKSTÓW ===
  window.BELLA_REDAKTOR = function(text, title) {
    return window.BELLA.processBook(text, title);
  };

  console.log("😈🔥 BELLA 9.0 REDAKTORKA NACZELNA – GOTOWA!");
  console.log("📚 UŻYJ:");
  console.log("BELLA.processBook('DŁUGI TEKST', 'Tytuł') ← DZIELI NA ROZDZIAŁY");
  console.log("BELLA.quickBook('Szybka książka') ← AUTO");
  console.log("BELLA.process('analiz') ← Status imperium");
})();
