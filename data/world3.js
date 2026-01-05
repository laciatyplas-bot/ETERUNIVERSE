// world3.js — ETERNIVERSE — ŚWIAT 3
// KANON 1:1 | ZGODNY Z MAPA_ETERNIVERSE / app.js / render.js
// WKLEJ BEZ ZMIAN

'use strict';

const WORLD_3 = {
  id: 3,
  name: "Świat 3 — NUTOSEEKER",
  sub: "Rezonans · Dźwięk · Ciało · Przekaz",
  tag: "RESONANCE / SOUND",
  desc: "Świat częstotliwości. Biografia układu nerwowego zapisana w dźwięku. Przejście od nadwrażliwości, przez przetrwanie, do osadzenia i przekazu dalej.",
  books: [
    11, 12, 13
  ],
  extraBooks: [
    {
      id: 11,
      title: "NUTOSEEKER — Tom I: Otwarty Kanał",
      hook: "Zanim nauczył się mówić, świat już do niego krzyczał.",
      pitch: "Narodziny rezonansu. Dziecko bez filtrów, które słyszy więcej niż inni.",
      status: "writing"
    },
    {
      id: 12,
      title: "NUTOSEEKER — Tom II: System Przetrwania",
      hook: "Jak nie umrzeć, kiedy czujesz za dużo.",
      pitch: "Muzyka jako silnik przetrwania w świecie pracy, samotności i prędkości.",
      status: "idea"
    },
    {
      id: 13,
      title: "NUTOSEEKER — Tom III: Ziemia i Przekaz",
      hook: "Nie musiał już iść dalej. Musiał zostać.",
      pitch: "Ojcostwo, zakorzenienie i dźwięk jako spokojny przekaz dalej.",
      status: "idea"
    }
  ]
};

/* =========================
   EXPORT / INTEGRACJA
========================= */

// jeśli używasz globalnej MAPA_ETERNIVERSE
window.MAPA_ETERNIVERSE = window.MAPA_ETERNIVERSE || {};
window.MAPA_ETERNIVERSE.worlds = window.MAPA_ETERNIVERSE.worlds || [];
window.MAPA_ETERNIVERSE.worlds.push(WORLD_3);

console.log('🌍 Świat 3 — NUTOSEEKER załadowany');