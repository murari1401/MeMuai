import React, { createContext, useContext, useState, useEffect } from 'react';
import { AvatarState, MoodType } from '@/types';

interface AvatarContextType {
  avatarState: AvatarState;
  setMood: (mood: MoodType) => void;
  setSpeaking: (speaking: boolean) => void;
  setListening: (listening: boolean) => void;
  getEmojiForMood: (mood: MoodType) => string;
}

const defaultState: AvatarState = {
  mood: 'happy',
  speaking: false,
  listening: false,
  emoji: '😄'
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarState, setAvatarState] = useState<AvatarState>(defaultState);

  const getEmojiForMood = (mood: MoodType): string => {
    switch (mood) {
      case 'happy': return '😄';
      case 'caring': return '🥰';
      case 'jealous': return '😒';
      case 'angry': return '😠';
      case 'sad': return '😢';
      default: return '😊';
    }
  };

  const setMood = (mood: MoodType) => {
    setAvatarState(prev => ({
      ...prev,
      mood,
      emoji: getEmojiForMood(mood)
    }));
  };

  const setSpeaking = (speaking: boolean) => {
    setAvatarState(prev => ({ ...prev, speaking }));
  };

  const setListening = (listening: boolean) => {
    setAvatarState(prev => ({ ...prev, listening }));
  };

  // Initialize with happy mood
  useEffect(() => {
    setMood('happy');
  }, []);

  return (
    <AvatarContext.Provider value={{ 
      avatarState, 
      setMood, 
      setSpeaking, 
      setListening,
      getEmojiForMood
    }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
}
