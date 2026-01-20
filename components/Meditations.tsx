
import React, { useState, useRef, useEffect } from 'react';
import { DailyContent } from '../types';

export const Meditations: React.FC<{ content: DailyContent; preferredVoiceName?: string }> = ({ content, preferredVoiceName }) => {
  const [isMeditating, setIsMeditating] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [voiceRate, setVoiceRate] = useState(0.9); 
  const meditationAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (meditationAudioRef.current) {
      meditationAudioRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  const toggleMeditation = () => {
    if (!meditationAudioRef.current) return;
    if (isMeditating) {
      meditationAudioRef.current.pause();
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      meditationAudioRef.current.play();
    }
    setIsMeditating(!isMeditating);
  };

  const startNarrator = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(`${content.meditation.title}. ${content.meditation.guidance}`);
    utterance.lang = 'es-ES';
    utterance.rate = voiceRate;
    
    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
    
    const voice = voices.find(v => v.name === preferredVoiceName) || esVoices[0];
    if (voice) {
      utterance.voice = voice;
      const isMale = /pablo|paco|jorge|david|enrique|alvaro|raul|masculino|male/gi.test(voice.name);
      utterance.pitch = isMale ? 0.7 : 1.0; 
    }

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    
    window.speechSynthesis.speak(utterance);
    if (!isMeditating) toggleMeditation();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn text-center pb-20">
      <header className="space-y-4">
        <h2 className="text-6xl font-bold cinzel gold-text tracking-widest uppercase">Santuario del Silencio</h2>
        <p className="text-violet-300 italic serif text-xl">{content.meditation.title}</p>
      </header>

      <div className="relative py-20 flex flex-col items-center">
        <div className={`text-9xl transition-all duration-1000 filter drop-shadow-[0_0_40px_rgba(234,179,8,0.2)] ${isMeditating ? 'scale-110 opacity-100' : 'scale-90 opacity-40'}`}>🧘</div>
        <div className="mt-12 bg-slate-900/40 backdrop-blur-xl p-12 rounded-[4rem] border border-white/5 shadow-2xl">
           <p className="text-3xl text-slate-100 serif italic leading-relaxed">"{content.meditation.guidance}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="glass p-8 rounded-[3rem] space-y-6">
          <div className="flex justify-between items-center text-[10px] cinzel text-amber-500 font-black uppercase">
            <span>Música</span>
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          <button onClick={toggleMeditation} className="w-full py-4 rounded-2xl bg-amber-500 text-slate-950 font-black cinzel tracking-widest uppercase">
            {isMeditating ? 'Pausar' : 'Música'}
          </button>
        </div>

        <div className="glass p-8 rounded-[3rem] space-y-6">
          <div className="flex justify-between items-center text-[10px] cinzel text-violet-400 font-black uppercase">
            <span>Ritmo del Oráculo</span>
            <span>{voiceRate.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.5" max="1.5" step="0.1" value={voiceRate} onChange={(e) => setVoiceRate(parseFloat(e.target.value))} className="w-full accent-violet-500" />
          <button onClick={startNarrator} className={`w-full py-4 rounded-2xl border font-black cinzel tracking-widest uppercase transition-all ${isNarrating ? 'bg-violet-600 border-violet-400 text-white' : 'bg-white/5 border-white/10 text-white'}`}>
            {isNarrating ? 'Detener Voz' : 'Escuchar Guía'}
          </button>
        </div>
      </div>
      <audio ref={meditationAudioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" loop />
    </div>
  );
};
