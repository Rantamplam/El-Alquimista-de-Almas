
import React, { useState } from 'react';
import { AppView } from '../types';
import { AtmospherePlayer } from './AtmospherePlayer';
import { SupportModal } from './SupportModal';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
}

const YODA_GPT_URL = "https://chatgpt.com/g/g-693b1fd39130819197832cab6088c6bf-master-yoda";

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const [showSupport, setShowSupport] = useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Portal de Iniciado', icon: '🌌' },
    { id: AppView.TODAY, label: 'Ritual del Alba', icon: '🕯️' },
    { id: AppView.MEDITATION, label: 'El Santuario', icon: '🧘' },
    { id: AppView.WISDOM, label: 'Atrio de Sabiduría', icon: '🦉' },
    { id: AppView.LIBRARY, label: 'Grimorio Arcano', icon: '📜' },
    { id: AppView.MENTOR, label: 'Interrogar Archimago', icon: '👁️' },
    { id: AppView.JOURNAL, label: 'Libro de Sombras', icon: '✒️' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-72 bg-slate-950/60 backdrop-blur-3xl border-r border-amber-500/10 p-8 fixed h-full z-40">
        <div className="mb-12 text-center relative group">
          <h1 className="text-4xl font-black cinzel gold-text tracking-[0.3em] drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">ADYTUM</h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mt-2"></div>
        </div>
        
        <nav className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-3xl transition-all duration-500 group ${
                activeView === item.id
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                  : 'text-slate-500 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <span className={`text-xl transition-transform duration-500 ${activeView === item.id ? 'scale-125' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="font-bold text-[10px] tracking-[0.2em] uppercase">{item.label}</span>
            </button>
          ))}

          {/* ENLACE DIRECTO A YODA GPT */}
          <a
            href={YODA_GPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center space-x-4 px-6 py-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all duration-500 mt-4"
          >
            <span className="text-xl">🟢</span>
            <span className="font-bold text-[10px] tracking-[0.2em] uppercase">Maestro Yoda (GPT)</span>
          </a>
        </nav>

        <div className="mt-6 space-y-4">
          <AtmospherePlayer />
          
          <button 
            onClick={() => setShowSupport(true)}
            className="w-full p-4 bg-amber-950/20 rounded-2xl border border-amber-500/20 text-center group hover:border-amber-500/50 transition-all"
          >
             <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em]">Ofrenda al Archimago</p>
             <p className="text-[10px] text-slate-300 mt-1 serif italic group-hover:text-white transition-colors">Invitar a un café ☕</p>
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-6 md:p-16 pb-32 md:pb-16 min-h-screen relative">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {showSupport && <SupportModal onClose={() => setShowSupport(false)} />}
    </div>
  );
};
