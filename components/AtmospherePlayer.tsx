
import React, { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 'none', name: 'Silencio', url: '' },
  { id: 'synth', name: 'Sintetizador Alquímico (Generado)', url: 'synth' },
  { id: 'zen', name: 'Alba Zen', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3' },
  { id: 'nature', name: 'Atrio Natural', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c1c1833535.mp3' },
];

export const AtmospherePlayer: React.FC = () => {
  const [selected, setSelected] = useState('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isBuffering, setIsBuffering] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Referencias para el Sintetizador Procedural (Web Audio API)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ source: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode } | null>(null);

  // Efecto para el volumen del sintetizador y del audio nativo
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (synthNodesRef.current) synthNodesRef.current.gain.gain.setTargetAtTime(volume * 0.5, 0, 0.1);
  }, [volume]);

  const stopAll = () => {
    // Detener Audio Nativo
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    // Detener Sintetizador
    if (synthNodesRef.current) {
      try {
        synthNodesRef.current.source.stop();
        synthNodesRef.current.source.disconnect();
      } catch (e) {}
      synthNodesRef.current = null;
    }
    setIsPlaying(false);
  };

  const startSynthesizer = () => {
    stopAll();
    
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Crear ruido marrón (más profundo y relajante)
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Ajuste de volumen
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    // Oscilación lenta del filtro para emular respiración/olas
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
    synthNodesRef.current = { source, filter, gain };
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (selected === 'none') return;
    if (selected === 'synth') {
      if (isPlaying) { stopAll(); setIsPlaying(false); }
      else { startSynthesizer(); }
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(() => setLoadError(true));
    }
  };

  const changeTrack = (id: string) => {
    stopAll();
    setSelected(id);
    setLoadError(false);
    
    if (id === 'none') return;
    
    if (id === 'synth') {
      startSynthesizer();
    } else {
      const track = TRACKS.find(t => t.id === id);
      if (track && track.url && audioRef.current) {
        setIsBuffering(true);
        audioRef.current.src = track.url;
        audioRef.current.load();
      }
    }
  };

  return (
    <div className="glass p-6 rounded-[2.5rem] border border-amber-500/20 flex flex-col space-y-4 shadow-inner relative">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
            Frecuencia Sagrada
            {isBuffering && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>}
          </p>
        </div>
        <div className="flex space-x-3">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="text-[10px] bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors text-slate-400"
             title="Usar archivo propio (100% fiable)"
           >
             📁
           </button>
           {selected !== 'none' && (
             <button onClick={togglePlay} className={`transition-colors text-xl ${loadError ? 'text-red-500' : 'text-white hover:text-amber-400'}`}>
               {loadError ? '⚠️' : isPlaying ? '⏸' : '▶'}
             </button>
           )}
        </div>
      </div>
      
      <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          stopAll();
          const localUrl = URL.createObjectURL(file);
          setSelected('custom');
          if (audioRef.current) {
            audioRef.current.src = localUrl;
            audioRef.current.play();
            setIsPlaying(true);
          }
        }
      }} />

      <div className="grid grid-cols-2 gap-2">
        {TRACKS.map(track => (
          <button
            key={track.id}
            onClick={() => changeTrack(track.id)}
            disabled={isBuffering && selected === track.id}
            className={`text-[9px] py-3 rounded-2xl transition-all border font-bold cinzel tracking-widest ${
              selected === track.id 
                ? 'bg-amber-500/20 border-amber-500/40 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
            }`}
          >
            {isBuffering && selected === track.id ? 'Sintonizando...' : track.name}
          </button>
        ))}
      </div>

      {loadError && (
        <div className="text-center bg-red-500/10 p-2 rounded-xl">
          <p className="text-[8px] text-red-400 cinzel font-bold uppercase">Error de Recurso Externo</p>
          <button 
            onClick={() => changeTrack('synth')} 
            className="text-[7px] text-amber-500 underline cinzel uppercase font-black"
          >
            Usar Sintetizador (Sin red)
          </button>
        </div>
      )}

      {selected !== 'none' && (
        <div className="pt-2">
          <input 
            type="range" min="0" max="1" step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      )}

      <audio 
        ref={audioRef} 
        loop 
        crossOrigin="anonymous" 
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => { setIsBuffering(false); audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {}); }}
        onError={() => { if(selected !== 'synth' && selected !== 'none') setLoadError(true); setIsBuffering(false); }}
      />
    </div>
  );
};
