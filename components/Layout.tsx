
import React from 'react';
import { AppView } from '../types';
import { AtmospherePlayer } from './AtmospherePlayer';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
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
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] cinzel text-amber-500/40 tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">V 1.0 • EN EVOLUCIÓN</span>
        </div>
        
        <nav className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
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
        </nav>

        <div className="mt-8 space-y-6">
          <AtmospherePlayer />
          
          <button 
            onClick={() => setView(AppView.MENTOR)}
            className="w-full p-4 bg-violet-950/20 rounded-2xl border border-violet-500/20 text-center group hover:border-violet-500/50 transition-all"
          >
             <p className="text-[8px] font-black text-violet-400 uppercase tracking-[0.2em]">Mejorar la Obra</p>
             <p className="text-[10px] text-slate-300 mt-1 serif italic group-hover:text-white transition-colors">¿Sugerencias para el Templo?</p>
          </button>

          <div className="p-6 bg-amber-950/20 rounded-[2rem] border border-amber-500/10 text-center">
             <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">Estado del Alma</p>
             <p className="text-xs font-bold text-slate-200 mt-2 cinzel italic">Neófito del Alba</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-72 p-6 md:p-16 pb-32 md:pb-16 min-h-screen relative">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
