
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

export const MentorChat: React.FC<MentorChatProps> = ({ userProgress, preferredVoiceName, onVoiceChange, onSaveChat }) => {
  const [messages, setMessages] = useState<MentorChatMessage[]>([
    { role: 'model', text: INITIAL_GREETING }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Verificación más estricta de la API KEY
  const [hasApiKey, setHasApiKey] = useState(() => {
    const key = process.env.API_KEY;
    return !!key && key !== "null" && key !== "undefined";
  });

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasSaved, setHasSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-verificar periódicamente si la clave se ha inyectado (por si el usuario acaba de vincularla)
    const interval = setInterval(() => {
      const key = process.env.API_KEY;
      if (key && key !== "null" && key !== "undefined") {
        setHasApiKey(true);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const esVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
        setAvailableVoices(esVoices.length > 0 ? esVoices : voices);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleConnectKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Pequeño retardo para que el sistema inyecte la clave
      setTimeout(() => setHasApiKey(true), 500);
    } else {
      alert("Asegúrate de estar en el entorno correcto para vincular tu clave.");
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
    if (!input.trim() || loading || !hasApiKey) return;

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
      console.error(error);
      if (error.message?.includes("clave") || error.message?.includes("API key")) {
        setHasApiKey(false);
      }
      setMessages(prev => [...prev, { role: 'model', text: `⚠️ ERROR EN EL ORÁCULO: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-w-5xl mx-auto mystic-card rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
      
      {!hasApiKey && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center space-y-8 animate-fadeIn">
          <div className="text-8xl animate-pulse">👁️</div>
          <h3 className="text-4xl font-bold cinzel gold-text tracking-widest uppercase">Portal Desconectado</h3>
          <p className="serif italic text-slate-300 text-xl max-w-md">
            "Para que el Archimago pueda manifestarse, debes vincular tu esencia con el éter digital."
          </p>
          <button 
            onClick={handleConnectKey}
            className="bg-amber-500 text-slate-900 px-12 py-5 rounded-full font-black cinzel tracking-widest hover:scale-110 transition-all shadow-[0_0_40px_rgba(245,158,11,0.4)] uppercase text-sm"
          >
            Vincular con el Éter
          </button>
        </div>
      )}

      <div className="p-8 border-b border-white/5 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">👁️</div>
          <div>
            <h3 className="text-lg font-bold cinzel text-white tracking-widest uppercase">Voz del Archimago</h3>
            <select 
              value={preferredVoiceName || ''} 
              onChange={(e) => onVoiceChange(e.target.value)}
              className="mt-1 bg-slate-950/90 border border-amber-500/20 rounded-lg text-[10px] text-amber-200 cinzel p-1.5 outline-none hover:border-amber-500/50 transition-all"
            >
              {availableVoices.length > 0 ? (
                availableVoices.map(v => (
                  <option key={v.name} value={v.name}>{v.name.replace(/Google|Spanish|Spain/g, '').trim()}</option>
                ))
              ) : (
                <option value="">Detectando voces...</option>
              )}
            </select>
          </div>
        </div>
        
        <button 
          onClick={() => { onSaveChat(messages); setHasSaved(true); setTimeout(() => setHasSaved(false), 3000); }}
          disabled={messages.length <= 1 || hasSaved}
          className={`px-8 py-3 rounded-full text-[10px] cinzel transition-all uppercase tracking-widest border ${
            hasSaved 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-violet-900/40 border-violet-500/30 text-violet-300 hover:bg-violet-500'
          }`}
        >
          {hasSaved ? '✨ DIÁLOGO SELLADO' : '✒️ SELLAR DIÁLOGO'}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 bg-slate-950/20 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] p-8 rounded-[2.5rem] shadow-2xl transition-all ${
              msg.role === 'user' 
                ? 'bg-amber-600/5 border-amber-500/20 text-white' 
                : 'bg-slate-900/80 border-white/5 text-slate-100'
            }`}>
              <p className={`text-xl md:text-2xl leading-relaxed ${msg.role === 'model' ? 'serif italic font-light' : ''}`}>
                {msg.text}
              </p>
              
              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[10px] cinzel text-amber-500/60 font-bold uppercase tracking-widest">Visiones del Éter:</p>
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
                <button 
                  onClick={() => narrate(msg.text)} 
                  className="mt-6 flex items-center gap-2 text-amber-400 text-[10px] cinzel tracking-widest uppercase hover:text-white transition-all"
                >
                  <span className="text-xl">{isSpeaking ? '🔇' : '🔊'}</span>
                  {isSpeaking ? 'Detener' : 'Escuchar Guía'}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/20 px-8 py-4 rounded-full border border-white/5 animate-pulse">
              <span className="text-amber-500 cinzel text-[10px] tracking-widest uppercase">Consultando las constelaciones...</span>
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
            disabled={!hasApiKey}
            placeholder={hasApiKey ? "Tu pregunta lanza al éter..." : "Conecta el oráculo para preguntar..."}
            className="w-full p-6 pr-24 bg-slate-950/80 border border-amber-500/30 rounded-full focus:border-amber-500 outline-none text-white serif text-xl transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading || !hasApiKey}
            className="absolute right-3 bg-amber-500 text-slate-900 w-16 h-16 rounded-full hover:scale-110 disabled:opacity-30 transition-all flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">⬥</span>
          </button>
        </div>
      </div>
    </div>
  );
};
