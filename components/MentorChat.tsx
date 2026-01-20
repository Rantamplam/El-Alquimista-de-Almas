
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
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasSaved, setHasSaved] = useState(false);
  const [keyError, setKeyError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const esVoices = voices.filter(v => v.lang.toLowerCase().includes('es'));
        setAvailableVoices(esVoices.length > 0 ? esVoices : voices);
        if (esVoices.length > 0 && !preferredVoiceName) {
          onVoiceChange(esVoices[0].name);
        }
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const interval = setInterval(() => {
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
        clearInterval(interval);
      }
    }, 500);
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearInterval(interval);
    };
  }, [preferredVoiceName, onVoiceChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    setKeyError(false);

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
      setKeyError(true);
      setMessages(prev => [...prev, { role: 'model', text: `⚠️ ERROR DE LLAVE SAGRADA: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] max-w-5xl mx-auto mystic-card rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
      
      {/* HEADER DE CONTROL */}
      <div className="p-6 md:p-8 border-b border-white/5 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">👁️</div>
          <div>
            <h3 className="text-sm font-bold cinzel text-white tracking-widest uppercase">Oráculo del Adytum</h3>
            <select 
              value={preferredVoiceName || ''} 
              onChange={(e) => onVoiceChange(e.target.value)}
              className="mt-1 bg-slate-950/80 border border-amber-500/20 rounded-lg text-[9px] text-amber-200 cinzel p-1.5 outline-none hover:border-amber-500/50 transition-all"
            >
              {availableVoices.length > 0 ? (
                availableVoices.map(v => (
                  <option key={v.name} value={v.name}>{v.name.replace(/Google|Spanish|Spain/g, '').trim()}</option>
                ))
              ) : (
                <option value="">Cargando voces...</option>
              )}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <a 
            href={YODA_GPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-emerald-500 border border-emerald-400 px-6 py-3 rounded-full text-slate-950 cinzel text-[10px] tracking-widest hover:scale-105 transition-all font-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <span>🟢 MAESTRO YODA GPT</span>
          </a>
          <button 
            onClick={() => { onSaveChat(messages); setHasSaved(true); setTimeout(() => setHasSaved(false), 2000); }}
            disabled={messages.length <= 1 || hasSaved}
            className="bg-violet-900/40 border border-violet-500/30 px-5 py-3 rounded-full text-violet-300 cinzel text-[10px] tracking-widest hover:bg-violet-500 transition-all"
          >
            {hasSaved ? '✨ SELLADO' : '✒️ SELLAR'}
          </button>
        </div>
      </div>

      {/* ÁREA DE MENSAJES */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 bg-slate-950/20 custom-scrollbar">
        {keyError && (
          <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-[2rem] text-center space-y-4 animate-pulse">
            <p className="text-red-400 cinzel text-xs font-bold uppercase tracking-widest">⚠️ Error en el Éter detectado</p>
            <p className="text-slate-300 serif italic text-lg">"Si tu llave no funciona, usar el santuario externo del Maestro Yoda debes."</p>
            <a href={YODA_GPT_URL} target="_blank" rel="noopener noreferrer" className="inline-block bg-emerald-500 text-slate-900 px-6 py-2 rounded-full cinzel text-[10px] font-bold">ABRIR MAESTRO YODA (EXTERNAL)</a>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[90%] p-8 rounded-[2.5rem] shadow-xl border ${
              msg.role === 'user' 
                ? 'bg-amber-600/5 border-amber-500/20 text-white' 
                : 'bg-slate-900/90 border-white/5 text-slate-100'
            }`}>
              <p className={`text-xl md:text-2xl leading-relaxed ${msg.role === 'model' ? 'serif italic font-light' : ''}`}>
                {msg.text}
              </p>
              
              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                  <p className="text-[9px] cinzel text-amber-500 font-bold uppercase tracking-widest">Fuentes Akáshicas:</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((s, idx) => (
                      <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-amber-500/5 border border-amber-500/20 px-3 py-1 rounded-full text-amber-200 hover:bg-amber-500/20 transition-all">
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
                  <span className="text-lg">{isSpeaking ? '🔇' : '🔊'}</span>
                  {isSpeaking ? 'Silenciar' : 'Escuchar Maestro'}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/20 px-8 py-4 rounded-full border border-white/5 animate-pulse">
              <span className="text-amber-500 cinzel text-[10px] tracking-widest uppercase">Consultando las estrellas...</span>
            </div>
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-8 bg-slate-900/60 border-t border-white/5">
        <div className="relative flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Lanza tu duda al éter, iniciado..."
            className="w-full p-6 pr-24 bg-slate-950/80 border border-amber-500/30 rounded-full focus:border-amber-500 outline-none text-white serif text-xl transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 bg-amber-500 text-slate-900 w-16 h-16 rounded-full hover:scale-110 disabled:opacity-30 transition-all flex items-center justify-center shadow-lg"
          >
            <span className="text-2xl">⬥</span>
          </button>
        </div>
      </div>
    </div>
  );
};
