
import React, { useState } from 'react';
import { UserProgress } from '../types';
import { EXERCISES } from '../data/exercises';

interface DashboardProps {
  progress: UserProgress;
  userName: string;
  onContinue: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, userName, onContinue }) => {
  const [hoveredKoan, setHoveredKoan] = useState<string | null>(null);
  const progressPercent = Math.round((progress.completedDays.length / 21) * 100);
  const crystallizationDays = 21 - (progress.streak % 21);

  // Obtener el ejercicio actual para el recordatorio
  const currentEx = EXERCISES.find(e => e.dayNumber === progress.currentDay) || EXERCISES[0];
  
  // Obtener los ejercicios de los días completados para los Koans
  const completedExercises = progress.completedDays
    .map(dayNum => EXERCISES.find(e => e.dayNumber === dayNum))
    .filter((e): e is typeof EXERCISES[0] => !!e)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <div className="space-y-12 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-6xl font-bold serif gold-text tracking-tight tracking-widest uppercase">Paz, {userName}</h2>
          <p className="text-violet-300/80 text-2xl serif italic font-light">"Tu constancia es la llave que abre los portales internos."</p>
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

        {/* Mapa de Ascensión con Koans Visibles */}
        <div className="md:col-span-12 mystic-card rounded-[4rem] p-12 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-8 max-w-xl">
              <h3 className="text-4xl font-bold cinzel text-white tracking-widest uppercase">Mapa de Ascensión</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Has iluminado <strong>{progress.completedDays.length} estaciones</strong>. Cada punto es una semilla de luz en tu subconsciente.
              </p>
              
              <div className="flex items-center space-x-6">
                 <span className="text-5xl font-bold gold-text cinzel">{progressPercent}%</span>
                 <div className="flex-1 h-4 bg-slate-950 rounded-full border border-white/5 p-1">
                   <div className="h-full bg-gradient-to-r from-violet-600 via-violet-400 to-amber-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
                 </div>
              </div>

              {/* Display para el Koan Seleccionado */}
              <div className={`min-h-[100px] p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 transition-all duration-500 ${hoveredKoan ? 'opacity-100 translate-y-0' : 'opacity-30'}`}>
                <p className="text-[10px] cinzel text-amber-500 font-bold tracking-widest uppercase mb-2">Semilla de Sabiduría:</p>
                <p className="text-white serif italic text-xl">"{hoveredKoan || 'Pasa sobre una estación iluminada'}"</p>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-6">
              {Array.from({length: 21}).map((_, i) => {
                const dayNum = i + 1;
                const isCompleted = progress.completedDays.includes(dayNum);
                const exercise = EXERCISES.find(e => e.dayNumber === dayNum);
                
                return (
                  <div 
                    key={i} 
                    onMouseEnter={() => isCompleted && exercise && setHoveredKoan(exercise.koan)}
                    onMouseLeave={() => setHoveredKoan(null)}
                    className="flex flex-col items-center space-y-2 group"
                  >
                    {isCompleted && exercise && (
                      <div className="absolute -translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-3 py-1 rounded-lg border border-amber-500/20 pointer-events-none">
                         <span className="text-[8px] text-amber-500 cinzel truncate max-w-[80px] block">"{exercise.koan.substring(0, 15)}..."</span>
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${
                      isCompleted 
                        ? 'bg-amber-500 shadow-[0_0_30px_#fbbf24] scale-110 cursor-help' 
                        : 'bg-slate-950 border border-white/5 text-slate-800'
                    }`}>
                      <span className={`text-xs font-bold cinzel ${isCompleted ? 'text-slate-950' : ''}`}>{dayNum}</span>
                      {isCompleted && (
                        <div className="absolute -inset-2 bg-amber-500/10 rounded-full animate-pulse -z-10"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
        </div>

        {/* Cosecha de Koans (Lista cronológica) */}
        {completedExercises.length > 0 && (
          <div className="md:col-span-12 space-y-8">
            <h3 className="text-3xl font-bold cinzel text-amber-500 tracking-widest uppercase text-center mt-12">Rosario de Semillas</h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {completedExercises.map((ex) => (
                <div key={ex.dayNumber} className="glass p-6 rounded-[2rem] border-white/5 flex items-center gap-8 group hover:border-amber-500/30 transition-all">
                  <span className="text-2xl cinzel font-bold text-amber-500/40">#{ex.dayNumber}</span>
                  <div className="h-10 w-px bg-white/5"></div>
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
