
import React, { useState } from 'react';
import { UserProgress } from '../types';
import { EXERCISES } from '../data/exercises';
import { BENEFACTORS } from '../constants';
import { SacredLogo } from './SacredLogo';

interface DashboardProps {
  progress: UserProgress;
  userName: string;
  onContinue: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, userName, onContinue }) => {
  const [hoveredKoan, setHoveredKoan] = useState<string | null>(null);
  const progressPercent = Math.round((progress.completedDays.length / 21) * 100);

  const currentEx = EXERCISES.find(e => e.dayNumber === progress.currentDay) || EXERCISES[0];
  const completedExercises = progress.completedDays
    .map(dayNum => EXERCISES.find(e => e.dayNumber === dayNum))
    .filter((e): e is typeof EXERCISES[0] => !!e)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <div className="space-y-12 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center space-x-6">
          <SacredLogo size="w-20 h-20" />
          <div className="space-y-2">
            <h2 className="text-6xl font-bold serif gold-text tracking-tight tracking-widest uppercase">Paz, {userName}</h2>
            <p className="text-violet-300/80 text-2xl serif italic font-light">"Tu constancia es la llave que abre los portales internos."</p>
          </div>
        </div>
        <div className="flex space-x-6">
           <div className="glass p-6 rounded-[2.5rem] text-center min-w-[140px] border-amber-500/20 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
             <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] mb-1">Racha de Luz</p>
             <p className="text-5xl font-bold cinzel">{progress.streak}</p>
             <p className="text-[10px] text-slate-400 mt-1 uppercase">Días Seguidos</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Recordatorio del día (Ancla) */}
        <div className="md:col-span-12 glass border-amber-500/30 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 pointer-events-none">⚓</div>
          <div className="text-center md:text-left space-y-2 flex-1">
            <h4 className="text-amber-500 cinzel font-bold text-xs tracking-[0.3em] uppercase">Tu Ancla para hoy:</h4>
            <p className="text-white text-3xl serif italic leading-tight">"{currentEx.reminderPractice}"</p>
          </div>
          <button 
            onClick={onContinue}
            className="bg-amber-500 text-slate-900 px-8 py-4 rounded-full font-bold cinzel text-xs tracking-widest hover:scale-110 transition-all uppercase shadow-lg shadow-amber-500/20 shrink-0"
          >
            Iniciar Sendero →
          </button>
        </div>

        {/* Mapa de Ascensión */}
        <div className="md:col-span-8 mystic-card rounded-[4rem] p-12 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full gap-8">
            <div className="space-y-6">
              <h3 className="text-4xl font-bold cinzel text-white tracking-widest uppercase">Mapa de Ascensión</h3>
              <div className="flex items-center space-x-6">
                 <span className="text-5xl font-bold gold-text cinzel">{progressPercent}%</span>
                 <div className="flex-1 h-4 bg-slate-950 rounded-full border border-white/5 p-1">
                   <div className="h-full bg-gradient-to-r from-violet-600 via-violet-400 to-amber-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {Array.from({length: 21}).map((_, i) => {
                const dayNum = i + 1;
                const isCompleted = progress.completedDays.includes(dayNum);
                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted ? 'bg-amber-500 shadow-[0_0_20px_#fbbf24] scale-110' : 'bg-slate-950 border border-white/5 text-slate-800'
                    }`}>
                      <span className={`text-[10px] font-bold cinzel ${isCompleted ? 'text-slate-950' : ''}`}>{dayNum}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tarjeta de Apoyo al Templo */}
        <div className="md:col-span-4 glass rounded-[3.5rem] p-10 border-violet-500/20 flex flex-col justify-center space-y-6 text-center">
           <div className="text-5xl">☕</div>
           <h4 className="cinzel text-white font-bold tracking-widest uppercase text-sm">Sostén el Templo</h4>
           <p className="serif text-slate-400 italic text-sm leading-relaxed">
             "Este conocimiento fluye libre para todos. Tu apoyo permite que la lámpara siga ardiendo para otros buscadores."
           </p>
           <button 
             onClick={() => (window as any).dispatchEvent(new CustomEvent('openSupport'))}
             className="w-full py-3 bg-violet-600/20 border border-violet-500/30 rounded-full text-violet-300 cinzel font-bold text-[9px] tracking-[0.2em] uppercase hover:bg-violet-600 hover:text-white transition-all"
           >
             Hacer Ofrenda
           </button>
        </div>

        {/* MURAL DE LOS BENEFACTORES */}
        <div className="md:col-span-12 mystic-card rounded-[4rem] p-12 space-y-10 border-amber-500/10">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold cinzel gold-text tracking-widest uppercase">Mural de los Benefactores</h3>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto"></div>
            <p className="text-slate-400 serif italic text-sm">"Almas nobles que han sellado su gratitud con el Templo."</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFACTORS.map((ben, idx) => (
              <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] text-center group hover:bg-amber-500/5 hover:border-amber-500/20 transition-all">
                <div className="text-xl mb-3 opacity-40 group-hover:opacity-100 transition-opacity">🛡️</div>
                <h5 className="text-white cinzel font-bold text-[11px] tracking-widest truncate">{ben.name}</h5>
                <p className="text-amber-500/60 cinzel text-[8px] uppercase tracking-tighter mt-1">{ben.contribution}</p>
              </div>
            ))}
            <div className="border border-dashed border-white/10 p-6 rounded-[2.5rem] flex flex-col items-center justify-center opacity-40 hover:opacity-100 cursor-pointer transition-all group" onClick={() => (window as any).dispatchEvent(new CustomEvent('openSupport'))}>
               <span className="text-xs cinzel text-slate-500 group-hover:text-amber-500 tracking-widest uppercase">Tu Nombre Aquí</span>
            </div>
          </div>
        </div>

        {/* Cosecha de Koans */}
        {completedExercises.length > 0 && (
          <div className="md:col-span-12 space-y-8">
            <h3 className="text-3xl font-bold cinzel text-amber-500 tracking-widest uppercase text-center mt-12">Rosario de Semillas</h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {completedExercises.map((ex) => (
                <div key={ex.dayNumber} className="glass p-6 rounded-[2rem] border-white/5 flex items-center gap-8 group hover:border-amber-500/30 transition-all">
                  <span className="text-2xl cinzel font-bold text-amber-500/40">#{ex.dayNumber}</span>
                  <p className="text-white serif italic text-xl leading-tight">"{ex.koan}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
