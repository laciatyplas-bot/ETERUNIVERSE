"use client";

import React from 'react';
import {
  Users, BookOpen, Globe, Mic, Video, Paintbrush,
  Settings, Layout, Share2, Shield, Activity,
  ChevronRight, Zap, Database, Cpu, Plus,
  BarChart3, MessageSquare, Terminal, Layers
} from 'lucide-react';

const TEAM_BELLE = [
  { id: 'redaktorka', name: 'BELLA REDAKTORKA', role: 'Pisarka & Redaktorka Naczelna', power: 150000, icon: BookOpen, color: 'text-blue-400', bgLight: 'bg-blue-400/10', borderColor: 'border-blue-400/30', tasks: ['Pisanie kreacyjne', 'Dzielenie na rozdziały', 'Korekta'] },
  { id: 'publika', name: 'BELLA PUBLIKA', role: 'Szefowa Publikacji (Global)', power: 140000, icon: Share2, color: 'text-orange-400', bgLight: 'bg-orange-400/10', borderColor: 'border-orange-400/30', tasks: ['Amazon KDP', 'Wattpad', 'SEO / Marketing'] },
  { id: 'lingua_eu', name: 'BELLA LINGUA EUROPA', role: 'Lingwistka (Europa)', power: 135000, icon: Globe, color: 'text-emerald-400', bgLight: 'bg-emerald-400/10', borderColor: 'border-emerald-400/30', tasks: ['Tłumaczenia EN/DE/FR/ES', 'Adaptacja kulturowa'] },
  { id: 'vocalis', name: 'BELLA VOCALIS', role: 'Audio & Audiobooki', power: 130000, icon: Mic, color: 'text-purple-400', bgLight: 'bg-purple-400/10', borderColor: 'border-purple-400/30', tasks: ['ElevenLabs TTS', 'Mastering', 'Podcasty'] },
  { id: 'film', name: 'BELLA FILM', role: 'Reżyserka Wideo', power: 125000, icon: Video, color: 'text-pink-400', bgLight: 'bg-pink-400/10', borderColor: 'border-pink-400/30', tasks: ['Trailers', 'TikTok 9:16', 'RunwayML AI'] },
  { id: 'kaisa', name: 'BELLA KAISA', role: 'Artystka Graficzna', power: 125000, icon: Paintbrush, color: 'text-yellow-400', bgLight: 'bg-yellow-400/10', borderColor: 'border-yellow-400/30', tasks: ['Okładki', 'Character Design', 'Branding'] },
  { id: 'omnia', name: 'BELLA OMNIA', role: 'Koordynatorka Projektów', power: 145000, icon: Shield, color: 'text-cyan-400', bgLight: 'bg-cyan-400/10', borderColor: 'border-cyan-400/30', tasks: ['Quality Assurance', 'Deadlines', 'Workflow'] }
];

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <header className="mb-12 border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tighter text-emerald-500">ETERNIVERSE OS // BELLAS_COMMAND</h1>
        <p className="text-zinc-500 text-sm mt-1 uppercase">Wola: Aktywna | Status: Frontline</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_BELLE.map((bella) => (
          <div key={bella.id} className={`border ${bella.borderColor} ${bella.bgLight} p-6 rounded-lg hover:border-white transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <bella.icon className={`w-8 h-8 ${bella.color}`} />
              <span className="text-[10px] text-zinc-500">PWR_{bella.power}</span>
            </div>
            <h3 className="text-lg font-bold">{bella.name}</h3>
            <p className="text-xs text-zinc-400 mb-4">{bella.role}</p>
            <div className="space-y-1">
              {bella.tasks.map((t, i) => <p key={i} className="text-[11px] text-zinc-500">{">"} {t}</p>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
