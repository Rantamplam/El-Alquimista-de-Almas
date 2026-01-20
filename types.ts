
// Define the structure for library content sections
export interface TheorySection {
  id: string;
  title: string;
  content: string;
}

// Define the structure for library content chapters
export interface TheoryChapter {
  id: string;
  title: string;
  sections: TheorySection[];
}

export interface MentorChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

export interface SavedMentorChat {
  id: string;
  date: string;
  dayNumber: number;
  messages: MentorChatMessage[];
}

export interface DailyContent {
  id: string;
  dayNumber: number;
  theme: string;
  quote: string;
  commentary: string;
  koan: string; 
  formalPractice: {
    title: string;
    duration: string;
    instructions: string[];
  };
  meditation: {
    title: string;
    guidance: string;
  };
  wisdom: {
    advice: string;
    fableTitle?: string;
    fable?: string;
  };
  reminderPractice: string;
  bridge: {
    chapter: string;
    topics: string[];
  };
}

export interface UserProgress {
  currentDay: number;
  completedDays: number[];
  reflections: Record<number, string>;
  mentorChats: SavedMentorChat[];
  streak: number;
  lastAccess: string;
  preferredVoiceName?: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TODAY = 'TODAY',
  MEDITATION = 'MEDITATION',
  WISDOM = 'WISDOM',
  MENTOR = 'MENTOR',
  LIBRARY = 'LIBRARY',
  JOURNAL = 'JOURNAL'
}
