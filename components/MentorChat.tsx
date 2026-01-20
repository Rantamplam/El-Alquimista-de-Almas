
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
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasSaved, setHasSaved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      const esVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
      const sortedVoices = [...esVoices].sort((a, b) => {
        if (a.localService && !b.localService) return -1;
        if (!a.localService && b.localService) return 1;
        return a.name.localeCompare(b.name);
      });
      setAvailableVoices(sortedVoices);
      if (sortedVoices.length > 0 && !preferredVoiceName) {
        onVoiceChange(sortedVoices[0].name);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const retryInterval = setInterval(() => {
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
        clearInterval(retryInterval);
      }
    }, 500);
    return () => {
      clearInterval(retryInterval);
      if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null;
    };
  }, [preferredVoiceName, onVoiceChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getVoiceLabel = (v: SpeechSynthesisVoice) => {
    const name = v.name.replace(/Google|Microsoft|Apple|Spanish|Spain|Mexico|Natural/gi, '').trim();
    const isFemale = /helena|laura|sara|lucia|elena|paulina|zira|femenino|female/gi.test(v.name);
    const isMale = /pablo|paco|jorge|david|enrique|alvaro|raul|masculino|male/gi.test(v.name);
    let type = '🎙️';
    if (isFemale) type = '🚺';
    if (isMale) type = '🚹';
    return `${type} ${name}`;
  };

  const narrate = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = voiceRate;
    const voice = availableVoices.find(v => v.name === preferredVoiceName) || availableVoices[0];
    if (voice) {
      utterance.voice = voice;
      const isMale = /pablo|paco|jorge|david|enrique|alvaro|raul|masculino|male/gi.test(voice.name);
      utterance.pitch = isMale ? 0.75 : 1.0; 
    }
    utterance.onend = () => setIsSpeaking(false);
    utterance.onstart = () => setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    
    // Actualizamos UI inmediatamente
    const newUserMessage: MentorChatMessage = { role: 'user', text: userMsg };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);
    setHasSaved(false);

    try {
      // Preparamos el historial filtrando el saludo inicial para evitar conflictos de roles
      // Gemini espera que el primer mensaje de 'contents' sea 'user' o que el flujo sea coherente.
      // Al mover las instrucciones al sistema, podemos enviar un historial más limpio.
      const historyForApi = messages
        .filter(m => m.text !== INITIAL_GREETING) // Opcional: limpiar saludos estáticos
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const { text, sources } = await getMentorResponse(userMsg, historyForApi, userProgress);
      setMessages(prev => [...prev, { role: 'model', text: text, sources }]);
    } catch (error) {
      console.error("Error al obtener respuesta del Archimago:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Interferencia en la Fuerza detecto. Tu conexión con el éter débil está hoy. Intenta de nuevo, debes.' }]);
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
    <div className="flex flex-col h-[calc(100vh-14rem)] max-w-5xl mx-auto mystic-card rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">👁️</div>
          <div className="min-w-[240px]">
            <h3 className="text-xl font-bold cinzel text-white tracking-widest uppercase">Voz del Oráculo</h3>
            <div className="flex flex-col mt-1">
              <select 
                value={preferredVoiceName || ''} 
                onChange={(e) => onVoiceChange(e.target.value)}
                className="bg-slate-950/90 border border-amber-500/30 rounded-lg text-[11px] text-slate-200 cinzel p-2 focus:outline-none focus:border-amber-500 transition-all cursor-pointer w-full"
              >
                {availableVoices.length > 0 ? (
                  availableVoices.map(v => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                      {getVoiceLabel(v)}
                    </option>
                  ))
                ) : (
                  <option value="">Detectando voces...</option>
                )}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleSave}
            disabled={messages.length <= 1 || hasSaved}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full text-[10px] cinzel transition-all uppercase tracking-widest border ${
              hasSaved 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                : 'bg-violet-900/40 border-violet-500/30 text-violet-300 hover:bg-violet-900/60'
            }`}
          >
            <span>{hasSaved ? '✨ DIÁLOGO SELLADO' : '✒️ SELLAR DIÁLOGO'}</span>
          </button>
          <a 
            href="https://chatgpt.com/g/g-693b1fd39130819197832cab6088c6bf-master-yoda" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-2 bg-emerald-900/40 border border-emerald-500/30 px-4 py-2 rounded-full text-[10px] cinzel text-emerald-300 hover:bg-emerald-900/60 transition-all uppercase tracking-widest"
          >
            <span>🟢 Portal Master Yoda</span>
          </a>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-950/20 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[90%] md:max-w-[80%] p-8 rounded-[2.5rem] shadow-2xl transition-all ${
              msg.role === 'user' 
                ? 'bg-amber-600/10 text-white rounded-tr-none border border-amber-500/20' 
                : 'bg-slate-900/80 text-violet-50 border border-white/10 rounded-tl-none backdrop-blur-md'
            }`}>
              <p className={`text-xl md:text-2xl leading-relaxed ${msg.role === 'model' ? 'serif italic' : 'font-medium'}`}>
                {msg.text}
              </p>
              
              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[10px] cinzel text-amber-500/60 font-bold uppercase tracking-widest">Pergaminos Arcanos de Verdad:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, idx) => (
                      <a 
                        key={idx} 
                        href={s.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/20 px-3 py-1 rounded-full text-amber-200 transition-all flex items-center space-x-1"
                      >
                        <span>📜</span>
                        <span className="max-w-[120px] truncate">{s.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {msg.role === 'model' && (
                <button 
                  onClick={() => narrate(msg.text)}
                  className={`mt-6 flex items-center space-x-2 text-xs font-bold cinzel transition-colors uppercase tracking-widest ${isSpeaking ? 'text-amber-200' : 'text-amber-400 hover:text-amber-200'}`}
                >
                  <span className="text-lg">{isSpeaking ? '🔇 Detener' : '🔊 Escuchar'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/20 p-8 rounded-[2.5rem] flex space-x-4 items-center border border-white/5">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
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
            placeholder="Tu duda en el éter lanza..."
            className="w-full p-6 pr-24 bg-slate-950/80 border border-amber-500/30 rounded-full focus:ring-4 focus:ring-amber-600/20 outline-none text-white serif text-xl placeholder:text-slate-700 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 w-16 h-16 rounded-full hover:scale-110 disabled:opacity-30 transition-all flex items-center justify-center shadow-2xl"
          >
            <span className="text-2xl">⬥</span>
          </button>
        </div>
      </div>
    </div>
  );
};
