
import React, { useState } from 'react';
import { DailyContent } from '../types';

export const WisdomPortal: React.FC<{ content: DailyContent; preferredVoiceName?: string }> = ({ content, preferredVoiceName }) => {
  const [isNarrating, setIsNarrating] = useState(false);
  const [rate, setRate] = useState(1.0);

  const narrate = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    
    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
    
    const voice = voices.find(v => v.name === preferredVoiceName) || esVoices[0];
    if (voice) {
      utterance.voice = voice;
      const isMale = /pablo|paco|jorge|david|enrique|alvaro|raul|masculino|male/gi.test(voice.name);
      utterance.pitch = isMale ? 0.8 : 1.0;
    }

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-20">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-bold cinzel gold-text tracking-widest uppercase">Atrio de Sabiduría</h2>
        <p className="text-slate-400 italic serif text-lg">Enseñanzas de la Estación {content.dayNumber}</p>
        
        <div className="flex items-center justify-center space-x-6 mt-6">
           <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full border-white/5">
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ritmo: {rate.toFixed(1)}</span>
             <input type="range" min="0.5" max="1.5" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-20 accent-amber-500" />
           </div>
           <button 
             onClick={() => narrate(`${content.wisdom.fableTitle}. ${content.wisdom.fable}. Consejo del Maestro: ${content.wisdom.advice}`)}
             className={`px-8 py-3 rounded-full font-bold cinzel text-xs tracking-widest transition-all ${isNarrating ? 'bg-amber-600 text-slate-900 shadow-xl' : 'bg-white/5 text-amber-500 border border-amber-500/20'}`}
           >
             {isNarrating ? '⏹ DETENER ORÁCULO' : '🔊 ESCUCHAR AL GUÍA'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="mystic-card rounded-[3rem] p-10 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/40 to-transparent"></div>
          <h3 className="text-2xl font-bold cinzel text-amber-400 uppercase tracking-wider">{content.wisdom.fableTitle}</h3>
          <p className="text-slate-200 serif italic text-2xl leading-relaxed first-letter:text-7xl first-letter:float-left first-letter:mr-4 first-letter:gold-text first-letter:cinzel">
            {content.wisdom.fable}
          </p>
        </div>

        <div className="space-y-8">
          <div className="glass rounded-[3rem] p-10 border-violet-500/20 space-y-6 relative">
            <h4 className="text-violet-300 cinzel font-bold text-xs tracking-widest uppercase">Palabra Maestro</h4>
            <p className="text-white text-3xl serif leading-relaxed italic">"{content.wisdom.advice}"</p>
            <div className="absolute -bottom-4 -right-4 text-6xl opacity-10">🦉</div>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-500/10 rounded-[3rem] p-10 space-y-4">
            <h4 className="text-emerald-400 cinzel font-bold text-xs tracking-widest uppercase">Aplicación en la Senda</h4>
            <p className="text-slate-300 text-xl leading-relaxed serif">
              La sabiduría sin acción es un tesoro enterrado. Hoy, aplica esta parábola cuando el mundo profano intente perturbar tu centro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
