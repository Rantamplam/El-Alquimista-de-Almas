
import React, { useState, useRef, useEffect } from 'react';
import { getMentorResponse } from '../services/geminiService';
import { MentorChatMessage } from '../types';

interface MentorChatProps {
  userProgress: string;
  preferredVoiceName?: string;
  onVoiceChange: (voiceName: string) => void;
  onSaveChat: (messages: MentorChatMessage[]) => void;
}

const INITIAL_GREETING = 'Bienvenido al Adytum, buscador. Mi visión ahora se extiende por los hilos de la red infinita y la sabiduría de los libros. ¿Qué misterio de tu ser deseas desvelar hoy? En la paz, la respuesta encontrarás.';
const YODA_GPT_URL = "https://chatgpt.com/g/g-693b1fd39130819197832cab6088c6bf-master-yoda";

export const MentorChat: React.FC<MentorChatProps> = ({ userProgress, preferredVoiceName, onVoiceChange, onSaveChat }) => {
  const [messages, setMessages] = useState<MentorChatMessage[]>([
    { role: 'model', text: INITIAL_GREETING }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const checkKey = () => {
    const key = process.env.API_KEY;
    return !!key && key !== "undefined" && key.length > 10;
  };

  const [hasApiKey, setHasApiKey] = useState(checkKey());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasSaved, setHasSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Buscamos voces en español preferentemente, pero si no, mostramos todas para no dejar el selector vacío
        const esVoices = allVoices.filter(v => v.lang.toLowerCase().includes('es'));
        const voicesToShow = esVoices.length > 0 ? esVoices : allVoices;
        setAvailableVoices(voicesToShow);
        
        if (voicesToShow.length > 0 && !preferredVoiceName) {
          onVoiceChange(voicesToShow[0].name);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Re-intento por si el navegador tarda
    const timer = setTimeout(loadVoices, 1000);
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearTimeout(timer);
    };
  }, [preferredVoiceName, onVoiceChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConnectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    } else {
      alert("⚠️ CONEXIÓN REQUERIDA:\n\n1. En Netlify > Site Settings > Environment variables, añade API_KEY.\n2. Luego ve a DEPLOYS > Trigger deploy > CLEAR CACHE AND DEPLOY SITE.\n\nSin esto, el Archimago no puede leer el éter.");
    }
  };

  const narrate = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    const voice = availableVoices.find(v => v.name === preferredVoiceName) || availableVoices[0];
    if (voice) utterance.voice = voice;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onstart = () => setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!hasApiKey && !checkKey()) {
      handleConnectKey();
      return;
    }

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const historyForApi = messages
        .filter(m => m.text !== INITIAL_GREETING)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const { text, sources } = await getMentorResponse(userMsg, historyForApi, userProgress);
      setMessages(prev => [...prev, { role: 'model', text: text, sources }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', text: `ERROR: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (messages.length <= 1) return;
    onSaveChat(messages);
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-w-5xl mx-auto mystic-card rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
      
      {!hasApiKey && !checkKey() && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center space-y-8">
          <div className="text-7xl">🕯️</div>
          <div className="space-y-4 max-w-md">
            <h3 className="text-3xl font-bold cinzel gold-text tracking-widest uppercase">Oráculo en Sombras</h3>
            <p className="serif italic text-slate-300">
              "El Archimago no detecta tu esencia. Si configuraste la clave en Netlify, el sitio debes reconstruir (Clear Cache & Deploy)."
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button 
              onClick={handleConnectKey}
              className="bg-amber-500 text-slate-900 px-10 py-5 rounded-full font-black cinzel tracking-widest hover:scale-110 transition-all uppercase text-xs"
            >
              Vincular con el Éter
            </button>
            <a 
              href={YODA_GPT_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-500/60 cinzel text-[10px] tracking-widest underline hover:text-amber-400 transition-colors"
            >
              Consultar al Maestro Yoda (GPT Externo)
            </a>
          </div>
        </div>
      )}

      {/* HEADER DEL CHAT CON ENLACE A YODA */}
      <div className="p-8 border-b border-white/5 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">👁️</div>
          <div>
            <h3 className="text-xl font-bold cinzel text-white tracking-widest uppercase">Voz del Oráculo</h3>
            <div className="flex items-center gap-3 mt-1">
              <select 
                value={preferredVoiceName || ''} 
                onChange={(e) => onVoiceChange(e.target.value)}
                className="bg-slate-950/90 border border-amber-500/30 rounded-lg text-[10px] text-slate-200 cinzel p-2 outline-none"
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map(v => (
                    <option key={v.name} value={v.name}>{v.name.replace(/Google|Spanish|Spain/g, '').trim()}</option>
                  ))
                ) : (
                  <option value="">Buscando voces...</option>
                )}
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href={YODA_GPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 px-6 py-2 rounded-full text-amber-400 cinzel text-[10px] tracking-widest hover:bg-amber-500 hover:text-slate-900 transition-all shadow-[0_0_15px_rgba(234,179,8,0.1)]"
          >
            <span>🟢 MAESTRO YODA GPT</span>
          </a>
          <button 
            onClick={handleSave}
            disabled={messages.length <= 1 || hasSaved}
            className={`px-6 py-2 rounded-full text-[10px] cinzel transition-all uppercase tracking-widest border ${
              hasSaved 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-violet-900/40 border-violet-500/30 text-violet-300 hover:bg-violet-900/60'
            }`}
          >
            {hasSaved ? '✨ SELLADO' : '✒️ SELLAR'}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-950/20 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] p-8 rounded-[2.5rem] shadow-2xl transition-all ${
              msg.role === 'user' 
                ? 'bg-amber-600/10 text-white border border-amber-500/20' 
                : 'bg-slate-900/80 text-violet-50 border border-white/10'
            }`}>
              <p className={`text-xl md:text-2xl leading-relaxed ${msg.role === 'model' ? 'serif italic font-light' : ''}`}>
                {msg.text}
              </p>
              
              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[10px] cinzel text-amber-500/60 font-bold uppercase tracking-widest">Fuentes del Éter:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, idx) => (
                      <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-amber-500/5 border border-amber-500/20 px-3 py-1 rounded-full text-amber-200 hover:bg-amber-500/20 transition-all">
                        📜 {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {msg.role === 'model' && (
                <button onClick={() => narrate(msg.text)} className="mt-4 text-amber-400 text-[10px] cinzel tracking-[0.2em] uppercase hover:text-white transition-colors flex items-center gap-2">
                  <span className="text-lg">{isSpeaking ? '🔇' : '🔊'}</span>
                  {isSpeaking ? 'Detener Voz' : 'Escuchar Maestro'}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/20 p-6 rounded-[2rem] border border-white/5 animate-pulse">
              <span className="text-amber-500 cinzel text-xs tracking-widest uppercase">Escudriñando el éter...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-slate-900/60 border-t border-white/5">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tu duda en el éter lanza, iniciado..."
            className="w-full p-6 pr-24 bg-slate-950/80 border border-amber-500/30 rounded-full focus:border-amber-500 outline-none text-white serif text-xl transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-4 bg-amber-500 text-slate-900 w-16 h-16 rounded-full hover:scale-110 disabled:opacity-30 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]"
          >
            <span className="text-2xl font-bold">⬥</span>
          </button>
        </div>
      </div>
    </div>
  );
};
