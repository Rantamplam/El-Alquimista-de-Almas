
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Today } from './components/Today';
import { MentorChat } from './components/MentorChat';
import { Library } from './components/Library';
import { WisdomPortal } from './components/WisdomPortal';
import { Meditations } from './components/Meditations';
import { Onboarding } from './components/Onboarding';
import { AppView, UserProgress, MentorChatMessage, SavedMentorChat } from './types';
import { EXERCISES } from './data/exercises';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState('Aprendiz');
  const [progress, setProgress] = useState<UserProgress>({
    currentDay: 1,
    completedDays: [],
    reflections: {},
    mentorChats: [],
    lastAccess: new Date().toISOString(),
    streak: 0,
    preferredVoiceName: undefined,
  });

  useEffect(() => {
    const saved = localStorage.getItem('adytum_v5_progress');
    const hasOnboarded = localStorage.getItem('adytum_onboarded');
    const savedName = localStorage.getItem('adytum_user_name');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (e) {
        console.error("Error al cargar progreso", e);
      }
    }
    if (savedName) setUserName(savedName);
    if (!hasOnboarded) setShowOnboarding(true);
  }, []);

  const handleStartCourse = (name?: string) => {
    if (name) {
      setUserName(name);
      localStorage.setItem('adytum_user_name', name);
    }
    setShowOnboarding(false);
    localStorage.setItem('adytum_onboarded', 'true');
  };

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('adytum_v5_progress', JSON.stringify(newProgress));
  };

  const currentExercise = EXERCISES.find(e => e.dayNumber === progress.currentDay) || EXERCISES[0];

  const handleCompleteDay = (reflection: string) => {
    const newProgress = {
      ...progress,
      completedDays: Array.from(new Set([...progress.completedDays, progress.currentDay])),
      reflections: { ...progress.reflections, [progress.currentDay]: reflection },
      streak: progress.streak + 1,
      currentDay: progress.currentDay + 1,
      lastAccess: new Date().toISOString()
    };
    saveProgress(newProgress);
  };

  const handleSaveMentorChat = (messages: MentorChatMessage[]) => {
    const newChat: SavedMentorChat = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      dayNumber: progress.currentDay,
      messages: messages
    };
    const newProgress = {
      ...progress,
      mentorChats: [newChat, ...progress.mentorChats]
    };
    saveProgress(newProgress);
  };

  const handleFinishRitual = () => {
    setView(AppView.DASHBOARD);
  };

  const handleConsultMentor = () => {
    setView(AppView.MENTOR);
  };

  const updateVoicePreference = (voiceName: string) => {
    const newProgress = { ...progress, preferredVoiceName: voiceName };
    saveProgress(newProgress);
  };

  const updateReflection = (day: number, text: string) => {
    const newProgress = {
      ...progress,
      reflections: { ...progress.reflections, [day]: text }
    };
    saveProgress(newProgress);
  };

  if (showOnboarding) return <Onboarding onStart={handleStartCourse} />;

  return (
    <Layout activeView={view} setView={setView}>
      {view === AppView.DASHBOARD && (
        <Dashboard 
          progress={progress} 
          userName={userName} 
          onContinue={() => setView(AppView.TODAY)} 
        />
      )}
      
      {view === AppView.TODAY && (
        <Today 
          content={currentExercise} 
          onComplete={handleCompleteDay} 
          onFinish={handleFinishRitual}
          onConsultMentor={handleConsultMentor}
          preferredVoiceName={progress.preferredVoiceName}
        />
      )}
      
      {view === AppView.MEDITATION && <Meditations content={currentExercise} preferredVoiceName={progress.preferredVoiceName} />}
      {view === AppView.WISDOM && <WisdomPortal content={currentExercise} preferredVoiceName={progress.preferredVoiceName} />}
      {view === AppView.MENTOR && (
        <MentorChat 
          userProgress={progress.currentDay.toString()} 
          preferredVoiceName={progress.preferredVoiceName} 
          onVoiceChange={updateVoicePreference}
          onSaveChat={handleSaveMentorChat}
        />
      )}
      {view === AppView.LIBRARY && <Library currentExercise={currentExercise} />}
      
      {view === AppView.JOURNAL && (
        <div className="space-y-16 animate-fadeIn max-w-5xl mx-auto pb-20">
          <header className="text-center space-y-4">
            <h2 className="text-6xl font-bold text-white cinzel tracking-[0.2em] uppercase gold-text">Libro de Sombras</h2>
            <p className="text-slate-400 serif italic text-xl">"El registro de tu transmutación hacia la luz."</p>
          </header>
          
          <div className="space-y-24">
            {/* Seccion de Reflexiones Diarias */}
            <section className="space-y-10">
              <h3 className="text-2xl cinzel text-amber-500/70 tracking-[0.3em] font-bold uppercase border-l-4 border-amber-500 pl-6">Registros de Estación</h3>
              <div className="grid grid-cols-1 gap-12">
                {progress.completedDays.length === 0 ? (
                  <div className="text-center p-16 glass rounded-[3rem] border-white/5 opacity-50">
                    <p className="text-slate-500 cinzel tracking-widest">Aún no hay sellos en este Libro.</p>
                  </div>
                ) : (
                  progress.completedDays.sort((a, b) => b - a).map((day) => (
                    <div key={day} className="mystic-card p-12 rounded-[4rem] relative overflow-hidden group transition-all hover:border-amber-500/30">
                      <div className="absolute -top-10 -right-10 p-12 opacity-5 text-9xl font-bold cinzel">#{day}</div>
                      <h4 className="text-white text-3xl cinzel font-bold mb-6">Día {day}: {EXERCISES.find(e => e.dayNumber === day)?.theme}</h4>
                      <textarea 
                        value={progress.reflections[day] || ''}
                        onChange={(e) => updateReflection(day, e.target.value)}
                        className="w-full h-48 bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5 text-slate-200 serif text-2xl leading-relaxed focus:outline-none focus:border-amber-500/20 transition-all resize-none"
                      />
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Seccion de Diálogos con el Mentor */}
            {progress.mentorChats.length > 0 && (
              <section className="space-y-10">
                <h3 className="text-2xl cinzel text-violet-400 tracking-[0.3em] font-bold uppercase border-l-4 border-violet-500 pl-6">Diálogos con el Archimago</h3>
                <div className="grid grid-cols-1 gap-8">
                  {progress.mentorChats.map((chat) => (
                    <div key={chat.id} className="glass p-10 rounded-[3rem] border-violet-500/10 space-y-6 group">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] cinzel text-violet-400 font-bold tracking-widest uppercase">
                          Sello: {new Date(chat.date).toLocaleDateString()} — Estación {chat.dayNumber}
                        </span>
                        <span className="text-2xl">📜</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
                        {chat.messages.slice(1).map((m, idx) => (
                          <div key={idx} className={`space-y-1 ${m.role === 'user' ? 'text-right opacity-60' : 'text-left'}`}>
                            <p className="text-[10px] cinzel text-slate-500 uppercase">{m.role === 'user' ? 'Iniciado' : 'Archimago'}</p>
                            <p className={`serif italic ${m.role === 'model' ? 'text-violet-100 text-lg' : 'text-slate-400 text-sm'}`}>{m.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
