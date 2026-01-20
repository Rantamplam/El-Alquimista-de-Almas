
import React, { useState } from 'react';
import { DailyContent } from '../types';
import { WisdomPortal } from './WisdomPortal';
import { Meditations } from './Meditations';
import { Library } from './Library';

interface TodayProps {
  content: DailyContent;
  onComplete: (reflection: string) => void;
  onFinish: () => void;
  onConsultMentor?: () => void;
  preferredVoiceName?: string;
}

type LessonStep = 'intro' | 'theory' | 'wisdom' | 'meditation' | 'ritual' | 'journal' | 'success';

export const Today: React.FC<TodayProps> = ({ content, onComplete, onFinish, onConsultMentor, preferredVoiceName }) => {
  const [reflection, setReflection] = useState('');
  const [step, setStep] = useState<LessonStep>('intro');

  const nextStep = () => {
    const steps: LessonStep[] = ['intro', 'theory', 'wisdom', 'meditation', 'ritual', 'journal', 'success'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Indicador de Progreso en la Lección */}
      {step !== 'intro' && step !== 'success' && (
        <div className="flex justify-center space-x-4 mb-12">
          {['theory', 'wisdom', 'meditation', 'ritual', 'journal'].map((s, idx) => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-500 ${
                step === s ? 'w-12 bg-amber-500 shadow-[0_0_10px_#fbbf24]' : 
                ['theory', 'wisdom', 'meditation', 'ritual', 'journal'].indexOf(step) > idx ? 'w-8 bg-amber-800' : 'w-4 bg-slate-800'
              }`}
            />
          ))}
        </div>
      )}

      {step === 'intro' && (
        <div className="text-center space-y-12 animate-fadeIn py-20">
          <div className="space-y-4">
            <span className="text-amber-500 cinzel font-bold tracking-[0.4em] uppercase text-sm">Estación {content.dayNumber}</span>
            <h2 className="text-7xl font-bold serif text-white leading-tight gold-text tracking-wide">{content.theme}</h2>
          </div>
          <div className="relative py-20 px-12 max-w-3xl mx-auto">
             <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-full"></div>
             <p className="text-4xl text-violet-100 serif italic leading-relaxed relative z-10 font-light">
               "{content.quote}"
             </p>
          </div>
          <button 
            onClick={nextStep}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-16 py-6 rounded-full font-black cinzel tracking-[0.3em] hover:scale-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.2)] text-lg"
          >
            ENTRAR EN EL ESTUDIO
          </button>
        </div>
      )}

      {step === 'theory' && (
        <div className="space-y-12 animate-fadeIn">
          <Library currentExercise={content} />
          <div className="flex justify-center pt-8">
            <button onClick={nextStep} className="bg-amber-500 text-slate-950 px-12 py-4 rounded-full font-bold cinzel tracking-widest uppercase hover:scale-105 transition-all">
              He integrado el conocimiento →
            </button>
          </div>
        </div>
      )}

      {step === 'wisdom' && (
        <div className="space-y-12 animate-fadeIn">
          <WisdomPortal content={content} preferredVoiceName={preferredVoiceName} />
          <div className="flex justify-center pt-8">
            <button onClick={nextStep} className="bg-amber-500 text-slate-950 px-12 py-4 rounded-full font-bold cinzel tracking-widest uppercase hover:scale-105 transition-all">
              Comprendo la enseñanza →
            </button>
          </div>
        </div>
      )}

      {step === 'meditation' && (
        <div className="space-y-12 animate-fadeIn">
          <Meditations content={content} preferredVoiceName={preferredVoiceName} />
          <div className="flex justify-center pt-8">
            <button onClick={nextStep} className="bg-amber-500 text-slate-950 px-12 py-4 rounded-full font-bold cinzel tracking-widest uppercase hover:scale-105 transition-all">
              Regresar del Silencio →
            </button>
          </div>
        </div>
      )}

      {step === 'ritual' && (
        <div className="space-y-12 animate-fadeIn">
          <header className="text-center space-y-4">
             <h3 className="text-5xl font-bold cinzel text-white">Ritual de Transmutación</h3>
             <p className="text-amber-500 cinzel text-xs tracking-[0.4em] uppercase">Donde la luz se vuelve acción</p>
          </header>
          
          <div className="glass rounded-[3.5rem] p-12 space-y-10 border-white/5 shadow-inner max-w-3xl mx-auto">
            <ul className="space-y-8">
              {content.formalPractice.instructions.map((ins, idx) => (
                <li key={idx} className="flex items-start space-x-8 group">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-amber-500/30 flex items-center justify-center text-amber-500 font-black cinzel">{idx + 1}</span>
                  <p className="text-slate-200 text-2xl leading-relaxed font-light">{ins}</p>
                </li>
              ))}
            </ul>
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-[2.5rem] p-10 text-center space-y-4">
              <h4 className="text-amber-500 cinzel text-[10px] tracking-[0.4em] font-bold uppercase">Ancla para hoy</h4>
              <p className="text-amber-200 text-3xl serif italic leading-relaxed">"{content.reminderPractice}"</p>
            </div>
          </div>
          <div className="flex justify-center">
            <button onClick={nextStep} className="bg-amber-500 text-slate-950 px-12 py-4 rounded-full font-bold cinzel tracking-widest uppercase hover:scale-105 transition-all">
              Ritual Completado →
            </button>
          </div>
        </div>
      )}

      {step === 'journal' && (
        <div className="space-y-10 animate-fadeIn max-w-3xl mx-auto">
          <div className="text-center space-y-4">
            <h3 className="text-5xl font-bold cinzel text-white tracking-widest">LIBRO DE SOMBRAS</h3>
            <p className="text-slate-400 text-lg serif italic">Sella tu evolución antes de cerrar la estación.</p>
          </div>
          <textarea 
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Hoy mi alma ha transmutado..."
            className="w-full h-80 p-12 bg-slate-950/80 border border-violet-500/30 rounded-[4rem] text-slate-100 serif text-2xl placeholder:text-slate-800 transition-all shadow-2xl"
          />
          <button 
            disabled={!reflection.trim()}
            onClick={() => {
              onComplete(reflection);
              setStep('success');
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-700 text-slate-950 py-8 rounded-[3rem] font-black cinzel tracking-[0.4em] shadow-2xl hover:scale-105 disabled:opacity-30 transition-all text-xl"
          >
            GUARDAR Y SELLAR
          </button>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center space-y-12 animate-fadeIn py-10 max-w-3xl mx-auto">
          <div className="text-9xl">✨</div>
          <div className="space-y-6">
            <h3 className="text-6xl font-bold cinzel gold-text tracking-widest uppercase">¡Ritual Exitoso!</h3>
            <div className="p-8 bg-slate-900/60 rounded-[3rem] border border-amber-500/30">
               <p className="text-amber-500 cinzel text-[10px] tracking-[0.3em] font-bold uppercase mb-4">Nueva Semilla de Sabiduría:</p>
               <p className="text-white text-3xl serif italic leading-tight">"{content.koan}"</p>
            </div>
          </div>

          <div className="bg-amber-950/30 border border-amber-500/30 rounded-[3rem] p-10 space-y-4">
            <h4 className="text-amber-500 cinzel font-bold text-xs tracking-[0.4em] uppercase">No olvides tu Ancla:</h4>
            <p className="text-white text-2xl serif italic">"{content.reminderPractice}"</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button 
              onClick={onFinish} 
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-12 py-6 rounded-full cinzel font-black tracking-[0.3em] transition-all uppercase text-lg hover:scale-105 shadow-2xl flex-1"
            >
              SIGUIENTE LECCIÓN →
            </button>
            <button 
              onClick={onConsultMentor}
              className="bg-slate-900/80 text-violet-300 border border-violet-500/30 px-12 py-6 rounded-full cinzel font-black tracking-[0.3em] transition-all uppercase text-lg hover:scale-105 shadow-2xl flex-1 flex items-center justify-center gap-3"
            >
              <span>👁️ INTERROGAR ARCHIMAGO</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
