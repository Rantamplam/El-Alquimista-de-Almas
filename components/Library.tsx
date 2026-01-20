
import React, { useState, useEffect } from 'react';
import { TheoryChapter, DailyContent } from '../types';
import { DEFAULT_BOOK_CONTEXT } from '../constants';

const SAMPLE_THEORY: TheoryChapter[] = [
  {
    id: 'cap-1',
    title: 'La Realidad como Campo de Conciencia',
    sections: [
      { id: '1.1', title: 'La Naturaleza de la Realidad', content: 'Tu mundo no es algo que "sucede" fuera de ti, es una proyección de tu estado interno. Todo lo que percibes es filtrado por tu sistema de creencias. La conciencia no es un subproducto del cerebro, sino la base fundamental sobre la cual se construye la materia. Reconocer esto es el primer paso para dejar de ser una víctima de las circunstancias y convertirte en el arquitecto de tu vibración.' },
      { id: '1.4', title: 'La Metáfora del Océano y las Olas', content: 'Imagina un océano inmenso. En ese océano se forman olas: grandes, pequeñas, suaves, violentas. Cada ola tiene una forma, un tiempo de vida, una dirección. Pero ninguna ola deja de ser agua. El océano es la Vida, la Conciencia. Cada ola es una persona, una situación. Desde la ola, las otras parecen rivales. Desde el océano, son solo formas del agua.' },
      { id: '1.5', title: 'El Papel del Observador', content: 'La manera en que miras algo cambia lo que ves y cómo lo vives. En este curso, "observador" es esa parte de ti que puede mirar tus pensamientos y emociones. A medida que el observador se fortalece, la ola deja de vivir cada movimiento como catástrofe e intuye el océano.' }
    ]
  },
  {
    id: 'cap-2',
    title: 'Cuerpo y Presencia: El Templo Vivo',
    sections: [
      { id: '2.1', title: 'El Retorno al Origen', content: 'Porque el cuerpo está siempre en el presente. La mente puede viajar al ayer o al mañana, pero el cuerpo es la única ancla que solo existe en el Aquí y Ahora. Entrenar el cuerpo es calmar la base de tu sistema nervioso. Sin un cuerpo anclado, la mente espiritual vuela sin rumbo; el cuerpo es el puerto seguro para la conciencia expandida.' },
      { id: '2.2', title: 'El Cuerpo como Termómetro', content: 'Tu cuerpo no miente. Si hay tensión en los hombros, hay un pensamiento de carga. Si hay nudo en el estómago, hay una emoción de miedo. Aprender a leer el cuerpo es aprender a leer tu subconsciente en tiempo real. No ignores las señales; cada presión es un mensaje de tu alma pidiendo atención y presencia.' },
      { id: '2.3', title: 'La Biología del Hábito', content: 'La ciencia y la mística coinciden: los circuitos neuronales tardan aproximadamente 21 días en crear un nuevo surco de información. Por eso, la repetición diaria de estos textos no es monotonía, es ingeniería espiritual. Estamos tallando nuevas vías de luz en tu subconsciente para que la paz sea tu respuesta automática.' }
    ]
  }
];

export const Library: React.FC<{ currentExercise?: DailyContent }> = ({ currentExercise }) => {
  const [activeChapter, setActiveChapter] = useState(SAMPLE_THEORY[0].id);
  const [readSections, setReadSections] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adytum_read_sections');
    if (saved) {
      try {
        setReadSections(JSON.parse(saved));
      } catch (e) {
        console.error("Error cargando secciones leídas", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('adytum_read_sections', JSON.stringify(readSections));
  }, [readSections]);

  useEffect(() => {
    if (currentExercise?.bridge.chapter) {
      const match = SAMPLE_THEORY.find(c => 
        currentExercise.bridge.chapter.toLowerCase().includes(c.id.toLowerCase().replace('cap-', ''))
      );
      if (match) setActiveChapter(match.id);
    }
  }, [currentExercise]);

  const toggleReadSection = (sectionId: string) => {
    setReadSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };

  const totalSections = SAMPLE_THEORY.reduce((acc, cap) => acc + cap.sections.length, 0);
  const integratedCount = readSections.length;

  return (
    <div className="space-y-16 animate-fadeIn pb-20">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-bold cinzel gold-text tracking-widest uppercase">Grimorio de Sabiduría Arcaica</h2>
        <div className="h-px w-48 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto"></div>
        <p className="text-slate-400 italic serif text-lg">"La repetición graba la luz en la piedra del subconsciente."</p>
      </header>

      {/* SECCIÓN DE MONETIZACIÓN: COMPRA DE LIBROS */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {DEFAULT_BOOK_CONTEXT.map((book, idx) => (
          <div key={idx} className="glass p-8 rounded-[3rem] border-amber-500/20 flex flex-col justify-between hover:border-amber-500/50 transition-all group">
            <div>
               <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Obra Original del Autor</p>
               <h4 className="text-2xl cinzel font-bold text-white mb-4">{book.title}</h4>
               <p className="text-slate-400 serif italic text-sm leading-relaxed mb-6">{book.summary}</p>
            </div>
            <a 
              href={book.amazonLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-amber-600/10 border border-amber-500/50 py-3 rounded-full text-center text-amber-400 cinzel font-bold text-[10px] tracking-widest uppercase hover:bg-amber-500 hover:text-slate-900 transition-all"
            >
              Adquirir en Papel / Digital 📖
            </a>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-[2.5rem] flex items-center space-x-4">
           <span className="text-3xl">📜</span>
           <div>
             <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Enfoque de Hoy</p>
             <h4 className="text-white font-bold cinzel">{currentExercise?.bridge.chapter || 'Códice General'}</h4>
           </div>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[2.5rem] flex items-center space-x-4">
           <span className="text-3xl">✅</span>
           <div>
             <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Conocimiento Integrado</p>
             <h4 className="text-white font-bold cinzel">{integratedCount} / {totalSections} Secciones</h4>
           </div>
        </div>
        <div className="bg-violet-500/5 border border-violet-500/20 p-6 rounded-[2.5rem] flex items-center space-x-4">
           <span className="text-3xl">💎</span>
           <div>
             <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Meta de Cristalización</p>
             <h4 className="text-white font-bold cinzel">Día 21: El Nuevo Hábito</h4>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-6">
          <h4 className="font-bold cinzel text-amber-500/70 text-xs tracking-[0.3em] uppercase ml-4">Índice de Códices</h4>
          <nav className="space-y-3">
            {SAMPLE_THEORY.map(cap => (
              <button 
                key={cap.id} 
                onClick={() => setActiveChapter(cap.id)}
                className={`w-full text-left p-6 rounded-3xl transition-all duration-500 group ${
                  activeChapter === cap.id 
                  ? 'bg-violet-600/20 border border-violet-400/30 text-white shadow-2xl' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-[10px] cinzel mb-1 opacity-50 tracking-widest">CAPÍTULO COMPLETO</span>
                    <span className="font-bold cinzel text-sm leading-tight">{cap.title}</span>
                  </div>
                  {cap.sections.every(s => readSections.includes(s.id)) && (
                    <span className="text-emerald-400 text-xs">⭐</span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-9">
          {SAMPLE_THEORY.filter(c => c.id === activeChapter).map(cap => (
            <div key={cap.id} className="mystic-card rounded-[4rem] p-12 md:p-16 space-y-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-bold cinzel select-none">
                {cap.id.split('-')[1]}
              </div>
              <div className="relative z-10 space-y-20">
                {cap.sections.map(sec => {
                  const isRead = readSections.includes(sec.id);
                  return (
                    <div 
                      key={sec.id} 
                      className={`space-y-8 group p-8 rounded-[3rem] transition-all duration-700 border ${
                        isRead 
                        ? 'bg-amber-500/5 border-amber-500/40 shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
                        : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-6">
                        <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${isRead ? 'to-amber-500/40' : 'to-amber-500/20'}`}></div>
                        <div className="flex items-center space-x-3">
                          <h5 className={`text-3xl font-bold cinzel tracking-widest uppercase transition-colors ${isRead ? 'text-amber-400' : 'text-violet-100'}`}>
                            {sec.title}
                          </h5>
                          {isRead && <span className="text-2xl animate-fadeIn">📜✨</span>}
                        </div>
                        <div className={`h-px flex-1 bg-gradient-to-l from-transparent ${isRead ? 'to-amber-500/40' : 'to-amber-500/20'}`}></div>
                      </div>
                      
                      <p className={`leading-relaxed serif text-3xl transition-all duration-500 ${isRead ? 'text-slate-100' : 'text-slate-300'} first-letter:text-8xl first-letter:font-bold first-letter:mr-6 first-letter:float-left first-letter:cinzel ${isRead ? 'first-letter:gold-text' : 'first-letter:text-violet-400'} first-letter:leading-[0.8]`}>
                        {sec.content}
                      </p>

                      <div className="flex justify-end pt-4">
                        <button 
                          onClick={() => toggleReadSection(sec.id)}
                          className={`flex items-center space-x-3 px-8 py-3 rounded-full font-bold cinzel text-[10px] tracking-widest transition-all ${
                            isRead 
                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50 hover:bg-amber-500/30' 
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:border-amber-500/30 hover:text-amber-200'
                          }`}
                        >
                          <span>{isRead ? 'SABIDURÍA INTEGRADA' : 'SELLAR CONOCIMIENTO'}</span>
                          {isRead ? <span>✨</span> : <span>✒️</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
