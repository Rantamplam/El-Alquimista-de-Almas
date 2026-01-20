
import React, { useState } from 'react';

export const Onboarding: React.FC<{ onStart: (name?: string) => void }> = ({ onStart }) => {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
      <div className="stars"></div>
      <div className="max-w-4xl w-full mystic-card rounded-[4rem] p-10 md:p-16 space-y-12 relative overflow-hidden border-amber-500/30 my-10">
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-8xl font-bold cinzel gold-text tracking-[0.3em]">ADYTUM</h1>
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"></div>
          <p className="text-2xl md:text-3xl serif italic text-violet-200 leading-relaxed">"La Gran Obra de tu Propio Despertar"</p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
           <p className="text-center cinzel text-amber-500/60 text-[10px] tracking-widest uppercase">¿Cómo debemos llamarte, buscador?</p>
           <input 
             type="text" 
             value={name} 
             onChange={(e) => setName(e.target.value)}
             placeholder="Tu nombre o alias..." 
             className="w-full bg-slate-900/80 border border-amber-500/30 p-6 rounded-3xl text-center text-white cinzel tracking-widest focus:outline-none focus:border-amber-500 transition-all"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-300">
          <div className="space-y-6 bg-slate-900/40 p-8 rounded-[3rem] border border-white/5">
            <h3 className="cinzel text-amber-400 font-bold tracking-widest uppercase text-lg">El Propósito</h3>
            <p className="serif text-lg leading-relaxed italic">
              Este curso no es información, es transmutación. Basado la sabiduría ancestral y de grandes investigadores y autores, el propósito es guiarte desde la confusión del ego hacia la soberanía de la Conciencia Pura.
            </p>
          </div>
          <div className="space-y-6 bg-slate-900/40 p-8 rounded-[3rem] border border-white/5">
            <h3 className="cinzel text-violet-400 font-bold tracking-widest uppercase text-lg">Tus Beneficios</h3>
            <ul className="serif text-lg leading-relaxed list-disc list-inside space-y-2 opacity-80">
              <li>Claridad mental absoluta ante el caos.</li>
              <li>Paz interior como estado base de ser.</li>
              <li>Capacidad de moldear tu realidad externa.</li>
              <li>Integración del cuerpo como templo vivo.</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-950/20 p-10 rounded-[3rem] border border-amber-500/20 text-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-all duration-1000"></div>
          <h3 className="cinzel text-amber-500 font-bold tracking-[0.2em] uppercase text-sm relative z-10">El Sagrado Compromiso</h3>
          <p className="text-slate-100 serif italic text-2xl leading-relaxed relative z-10">
            "No busques convertirte en algo nuevo; busca recordar lo que siempre has sido. El carbón no teme a la presión, pues sabe que es el abrazo necesario para volverse diamante. En 21 soles, el fuego de tu atención fundirá el óxido del olvido para revelar el Sol que ya habita en tu pecho. ¿Posees el coraje de mirar tu propia luz?"
          </p>
        </div>

        <button 
          onClick={() => onStart(name || 'Aprendiz')}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-8 rounded-full font-black cinzel tracking-[0.4em] text-xl hover:scale-105 transition-all shadow-[0_0_60px_rgba(245,158,11,0.2)] uppercase"
        >
          ACEPTO LA SENDA
        </button>
      </div>
    </div>
  );
};
