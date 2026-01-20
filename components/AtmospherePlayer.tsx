
import React, { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 'none', name: 'Silencio', url: '' },
  { id: 'zen', name: 'Flauta Zen', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
  { id: 'sitar', name: 'Sitar Místico', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
  { id: 'bowls', name: 'Cuencos Sagrados', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
];

export const AtmospherePlayer: React.FC = () => {
  const [selected, setSelected] = useState('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [customTrackName, setCustomTrackName] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (id: string) => {
    setSelected(id);
    setCustomTrackName(null);
    const track = TRACKS.find(t => t.id === id);
    if (track && track.url && audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play();
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
      setSelected('custom');
      setCustomTrackName(file.name);
    }
  };

  return (
    <div className="glass p-5 rounded-3xl border border-amber-500/20 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Esfera Sonora</p>
        <div className="flex space-x-2">
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="text-[10px] bg-white/5 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
             title="Subir tu propia música"
           >
             📁
           </button>
           {selected !== 'none' && (
             <button onClick={togglePlay} className="text-white hover:text-amber-400 transition-colors text-sm">
               {isPlaying ? '⏸' : '▶'}
             </button>
           )}
        </div>
      </div>
      
      <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFileUpload} />

      <div className="grid grid-cols-2 gap-2">
        {TRACKS.map(track => (
          <button
            key={track.id}
            onClick={() => changeTrack(track.id)}
            className={`text-[9px] py-2 rounded-xl transition-all border font-bold ${
              selected === track.id 
                ? 'bg-amber-500/20 border-amber-500/40 text-white shadow-[0_0_10px_rgba(251,191,36,0.2)]' 
                : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
            }`}
          >
            {track.name}
          </button>
        ))}
        {selected === 'custom' && (
          <button className="col-span-2 text-[9px] py-2 rounded-xl border bg-violet-500/20 border-violet-500/40 text-white truncate px-2">
            🎵 {customTrackName}
          </button>
        )}
      </div>

      {selected !== 'none' && (
        <div className="flex items-center space-x-3 pt-2">
          <input 
            type="range" min="0" max="1" step="0.05" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      )}
      <audio ref={audioRef} loop />
    </div>
  );
};
