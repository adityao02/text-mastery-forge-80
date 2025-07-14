
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  subscriptionTier: 'basic' | 'pro';
  createdAt: Date;
}

interface PerformanceData {
  time: number;
  wpm: number;
  errors: number;
}

interface TypingStats {
  wpm: number;
  accuracy: number;
  wordsTyped: number;
  timeElapsed: number;
  totalCharacters: number;
  correctCharacters: number;
  leftHandPercentage: number;
  rightHandPercentage: number;
  performanceHistory: PerformanceData[];
}

interface TypingSession {
  id: string;
  date: Date;
  mode: string;
  topic: string;
  stats: TypingStats;
}

interface AppState {
  user: User | null;
  currentSession: TypingSession | null;
  typingHistory: TypingSession[];
  isTyping: boolean;
  practiceText: string;
  userInput: string;
  currentIndex: number;
  errors: number[];
  startTime: Date | null;
  theme: 'dark' | 'light';
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'START_TYPING'; payload: { text: string; mode: string; topic: string } }
  | { type: 'UPDATE_INPUT'; payload: string }
  | { type: 'FINISH_TYPING'; payload: TypingSession }
  | { type: 'RESET_TYPING' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ADD_ERROR'; payload: number }
  | { type: 'REMOVE_ERROR'; payload: number };

const initialState: AppState = {
  user: null,
  currentSession: null,
  typingHistory: [],
  isTyping: false,
  practiceText: '',
  userInput: '',
  currentIndex: 0,
  errors: [],
  startTime: null,
  theme: 'dark',
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'START_TYPING':
      return {
        ...state,
        isTyping: true,
        practiceText: action.payload.text,
        userInput: '',
        currentIndex: 0,
        errors: [],
        startTime: new Date(),
      };
    case 'UPDATE_INPUT':
      return { ...state, userInput: action.payload, currentIndex: action.payload.length };
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(index => index !== action.payload),
      };
    case 'FINISH_TYPING':
      return {
        ...state,
        isTyping: false,
        currentSession: action.payload,
        typingHistory: [action.payload, ...state.typingHistory],
      };
    case 'RESET_TYPING':
      return {
        ...state,
        isTyping: false,
        practiceText: '',
        userInput: '',
        currentIndex: 0,
        errors: [],
        startTime: null,
      };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
