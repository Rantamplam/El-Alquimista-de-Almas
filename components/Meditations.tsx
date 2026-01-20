
import React, { useState, useRef, useEffect } from 'react';
import { DailyContent } from '../types';

export const Meditations: React.FC<{ content: DailyContent; preferredVoiceName?: string }> = ({ content, preferredVoiceName }) => {
  const [isMeditating, setIsMeditating] = useState(false);
  const [isNarrating, setIsNarrating] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.25);
  const [voiceRate, setVoiceRate] = useState(0.8); 
  const [isBuffering, setIsBuffering] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const meditationAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ source: AudioBufferSourceNode; gain: GainNode } | null>(null);

  const STATIC_AUDIO_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3";

  useEffect(() => {
    if (meditationAudioRef.current) meditationAudioRef.current.volume = musicVolume;
    if (synthNodesRef.current) synthNodesRef.current.gain.gain.setTargetAtTime(musicVolume * 0.4, 0, 0.1);
  }, [musicVolume]);

  const stopAudio = () => {
    if (meditationAudioRef.current) {
      meditationAudioRef.current.pause();
      meditationAudioRef.current.src = "";
    }
    if (synthNodesRef.current) {
      try { synthNodesRef.current.source.stop(); } catch(e) {}
      synthNodesRef.current = null;
    }
  };

  const startSynth = () => {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(musicVolume * 0.4, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    synthNodesRef.current = { source, gain };
  };

  const toggleMeditation = () => {
    if (isMeditating) {
      stopAudio();
      if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
      setIsNarrating(false);
      setIsMeditating(false);
    } else {
      setAudioError(false);
      setIsBuffering(true);
      setIsMeditating(true);
      // Intentamos primero el audio real, si falla el evento onError disparará el sintetizador
      if (meditationAudioRef.current) {
        meditationAudioRef.current.src = STATIC_AUDIO_URL;
        meditationAudioRef.current.load();
      }
    }
  };

  const handleAudioError = () => {
    console.warn("Audio externo falló, activando éter sintético...");
    setIsBuffering(false);
    startSynth();
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
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    
    window.speechSynthesis.speak(utterance);
    if (!isMeditating) toggleMeditation();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn text-center pb-20">
      <header className="space-y-4">
        <h2 className="text-7xl font-bold cinzel gold-text tracking-widest uppercase">Santuario del Silencio</h2>
        <p className="text-violet-300 italic serif text-2xl">{content.meditation.title}</p>
      </header>

      <div className="relative py-20 flex flex-col items-center">
        <div className={`text-[10rem] transition-all duration-1000 filter drop-shadow-[0_0_60px_rgba(234,179,8,0.3)] ${isMeditating ? 'scale-110 opacity-100' : 'scale-90 opacity-30'} ${isBuffering ? 'animate-pulse' : ''}`}>🧘</div>
        <div className="mt-12 bg-slate-900/40 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/5 shadow-2xl max-w-2xl">
           <p className="text-4xl text-slate-100 serif italic leading-relaxed font-light">"{content.meditation.guidance}"</p>
           {isMeditating && !isBuffering && synthNodesRef.current && (
             <p className="text-amber-500 text-[10px] cinzel mt-4 uppercase font-bold tracking-widest animate-pulse">Sintonía Sintetizada Activa</p>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">
        <div className="glass p-10 rounded-[3.5rem] space-y-6 border-amber-500/20">
          <div className="flex justify-between items-center text-[10px] cinzel text-amber-500 font-black uppercase tracking-widest">
            <span>Volumen del Éter</span>
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          <button 
            onClick={toggleMeditation} 
            className={`w-full py-5 rounded-[2rem] font-black cinzel tracking-widest uppercase hover:scale-105 transition-all shadow-lg ${isMeditating ? 'bg-amber-600 text-slate-950' : 'bg-amber-500 text-slate-950'}`}
          >
            {isBuffering ? 'Conectando...' : isMeditating ? 'Pausar Silencio' : 'Entrar en Meditación'}
          </button>
        </div>

        <div className="glass p-10 rounded-[3.5rem] space-y-6 border-violet-500/20">
          <div className="flex justify-between items-center text-[10px] cinzel text-violet-400 font-black uppercase tracking-widest">
            <span>Ritmo del Guía</span>
            <span>{voiceRate.toFixed(1)}x</span>
          </div>
          <input type="range" min="0.5" max="1.5" step="0.1" value={voiceRate} onChange={(e) => setVoiceRate(parseFloat(e.target.value))} className="w-full accent-violet-500" />
          <button onClick={startNarrator} className={`w-full py-5 rounded-[2rem] border font-black cinzel tracking-widest uppercase transition-all hover:scale-105 ${isNarrating ? 'bg-violet-600 border-violet-400 text-white' : 'bg-white/5 border-white/10 text-white'}`}>
            {isNarrating ? 'Silenciar Guía' : 'Escuchar Guía'}
          </button>
        </div>
      </div>

      <audio 
        ref={meditationAudioRef} 
        loop 
        crossOrigin="anonymous" 
        onCanPlay={() => { setIsBuffering(false); meditationAudioRef.current?.play(); }}
        onError={handleAudioError}
      />
    </div>
  );
};
