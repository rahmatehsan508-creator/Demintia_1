export type NavigationTab = 'dashboard' | 'games' | 'routine' | 'memory-book' | 'companion' | 'auth';

export type GameId = 'memory-cards' | 'ball-sort' | 'gentle-snake' | 'color-shape';

export type TextSize = 'large' | 'extra-large';

export type ContrastTheme = 'daylight' | 'high-contrast';

export type Language = 'en' | 'hi' | 'bn' | 'as';

export type GameDifficulty = 'easy' | 'hard' | 'intermediate';

export interface RoutineItem {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  title: string;
  description: string;
  pillColor?: string;
  category: 'medication' | 'meal' | 'hydration' | 'exercise' | 'rest';
  completed: boolean;
}

export interface MemoryPerson {
  id: string;
  name: string;
  relation: string;
  location: string;
  story: string;
  imageUrl: string;
  phone?: string;
  phoneNumber?: string;
  keyMemory: string;
}

export interface CognitiveGame {
  id: GameId;
  title: string;
  subtitle: string;
  benefits: string;
  description?: string;
  cognitiveBenefit?: string;
  iconName: string;
  difficulty: 'Very Gentle' | 'Gentle';
  tagline?: string;
  logoBadge?: string;
  accentColor?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  timestamp: string;
  isAudioPlaying?: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  phoneNumber?: string;
  role?: string;
  isPrimary: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  preferredLanguage?: Language;
  createdAt?: string;
}
