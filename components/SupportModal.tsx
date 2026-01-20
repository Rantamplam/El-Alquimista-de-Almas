
import React, { useState } from 'react';
import { DONATION_URL } from '../constants';

interface SupportModalProps {
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  const [donorName, setDonorName] = useState('');
  const [consent, setConsent] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn overflow-y-auto">
      <div className="max-w-2xl w-full mystic-card rounded-[4rem] p-10 md:p-16 space-y-8 relative border-amber-500/30 my-auto">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors text-2xl"
        >
          ✕
        </button>

        <div className="text-center space-y-4">
          <div className="text-5xl">🏺</div>
          <h2 className="text-4xl font-bold cinzel gold-text tracking-widest uppercase">Ofrenda de Gratitud</h2>
          <p className="text-lg serif italic text-slate-300 leading-relaxed">
            "Tu apoyo mantiene la llama encendida para todos."
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
             <p className="text-[10px] cinzel text-amber-500 font-bold uppercase tracking-widest ml-4">Nombre en el Mural (Opcional)</p>
             <input 
               type="text" 
               value={donorName}
               onChange={(e) => setDonorName(e.target.value)}
               placeholder="¿Cómo quieres ser recordado?"
               className="w-full bg-slate-900/50 border border-white/10 p-5 rounded-2xl text-white cinzel text-xs tracking-widest focus:border-amber-500/50 outline-none transition-all"
             />
          </div>

          <label className="flex items-start space-x-4 cursor-pointer group">
            <div className={`mt-1 w-5 h-5 rounded border transition-all flex items-center justify-center ${consent ? 'bg-amber-500 border-amber-500' : 'border-white/20 group-hover:border-amber-500/50'}`}>
              {consent && <span className="text-slate-950 text-[10px]">✓</span>}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={consent}
              onChange={() => setConsent(!consent)}
            />
            <span className="text-[10px] text-slate-400 cinzel tracking-widest leading-relaxed">
              Doy mi consentimiento para que mi nombre aparezca en el <span className="text-amber-500">Mural de Benefactores</span> del Templo.
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-3 bg-white text-slate-950 py-5 rounded-full font-black cinzel tracking-widest hover:scale-105 transition-all text-[10px]"
          >
            <span>💳 VISA / MASTER</span>
          </a>
          <a 
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-3 bg-[#4285F4] text-white py-5 rounded-full font-black cinzel tracking-widest hover:scale-105 transition-all text-[10px]"
          >
            <span>📱 GOOGLE PAY</span>
          </a>
        </div>

        <p className="text-[9px] text-slate-500 text-center serif italic px-4">
          Nota: Las donaciones son procesadas externamente. Una vez realizada, el Archimago actualizará el Mural en los próximos ciclos solares.
        </p>
      </div>
    </div>
  );
};
