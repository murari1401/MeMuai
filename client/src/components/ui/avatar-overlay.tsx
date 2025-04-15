import React from 'react';
import { useAvatar } from '@/contexts/avatar-context';
import { MoodType } from '@/types';

interface AvatarOverlayProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';
  size?: 'sm' | 'md' | 'lg';
}

const AvatarOverlay: React.FC<AvatarOverlayProps> = ({ 
  position = 'bottom-right',
  size = 'lg'
}) => {
  const { avatarState } = useAvatar();
  
  // Position classes
  const positionClasses = {
    'bottom-right': 'fixed bottom-24 right-6',
    'bottom-left': 'fixed bottom-24 left-6',
    'top-right': 'fixed top-24 right-6',
    'top-left': 'fixed top-24 left-6',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };
  
  // Size classes
  const sizeClasses = {
    'sm': 'w-16 h-16',
    'md': 'w-20 h-20',
    'lg': 'w-24 h-24'
  };
  
  // Indicator sizes
  const indicatorSizes = {
    'sm': 'w-6 h-6 -top-1 -right-1',
    'md': 'w-7 h-7 -top-1 -right-1',
    'lg': 'w-8 h-8 -top-2 -right-2'
  };
  
  // Voice indicator sizes
  const voiceIndicatorSizes = {
    'sm': 'w-4 h-4 -bottom-1 -left-1',
    'md': 'w-5 h-5 -bottom-1 -left-1',
    'lg': 'w-6 h-6 -bottom-1 -left-1'
  };
  
  // Get avatar image based on mood
  const getAvatarImage = () => {
    // Create a cute anime-style avatar with different expressions based on mood
    const moodColors = {
      'happy': '#FFD700',
      'sad': '#87CEEB',
      'caring': '#FF9999',
      'jealous': '#9370DB',
      'angry': '#FF6347',
      'neutral': '#F5F5F5'
    };
    
    // Background gradient based on mood
    const bgColor = moodColors[avatarState.mood as keyof typeof moodColors] || '#F5F5F5';
    
    return (
      <div className={`w-full h-full bg-gradient-to-b from-${avatarState.mood}/70 to-${avatarState.mood === 'happy' ? 'caring' : avatarState.mood}/90 flex items-center justify-center`}>
        <svg 
          className="w-full h-full"
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Face shape - rounder and cuter */}
          <circle cx="100" cy="90" r="60" fill="#FFF5E6" />
          
          {/* Hair - cute round style */}
          <path d="M45,90 Q45,20 100,20 Q155,20 155,90" fill={bgColor} stroke="#6D4C41" strokeWidth="2" />
          <path d="M45,90 Q45,20 100,20 Q155,20 155,90" fill="none" stroke="#6D4C41" strokeWidth="2" />
          
          {/* Hair strands */}
          <path d="M60,40 Q65,20 80,30" fill="none" stroke="#6D4C41" strokeWidth="2" />
          <path d="M140,40 Q135,20 120,30" fill="none" stroke="#6D4C41" strokeWidth="2" />
          
          {/* Eyes - large cute anime eyes */}
          <ellipse cx="80" cy="80" rx="10" ry={avatarState.mood === 'sad' ? "8" : "12"} fill="#FFFFFF" stroke="#333333" strokeWidth="1.5" />
          <ellipse cx="120" cy="80" rx="10" ry={avatarState.mood === 'sad' ? "8" : "12"} fill="#FFFFFF" stroke="#333333" strokeWidth="1.5" />
          
          {/* Pupils - move based on mood */}
          <circle 
            cx={avatarState.mood === 'jealous' ? "83" : (avatarState.mood === 'neutral' ? "80" : "77")} 
            cy={avatarState.mood === 'sad' ? "83" : "80"} 
            r="5" 
            fill="#333333" 
          />
          <circle 
            cx={avatarState.mood === 'jealous' ? "123" : (avatarState.mood === 'neutral' ? "120" : "117")} 
            cy={avatarState.mood === 'sad' ? "83" : "80"} 
            r="5" 
            fill="#333333" 
          />
          
          {/* Eye sparkles for cuteness */}
          <circle cx="75" cy="77" r="2" fill="#FFFFFF" />
          <circle cx="115" cy="77" r="2" fill="#FFFFFF" />
          
          {/* Blush always present for cuteness, more intense when caring */}
          <circle cx="75" cy="95" r="10" fill="#FF9999" opacity={avatarState.mood === 'caring' ? "0.7" : "0.3"} />
          <circle cx="125" cy="95" r="10" fill="#FF9999" opacity={avatarState.mood === 'caring' ? "0.7" : "0.3"} />
          
          {/* Different mouth based on mood - cuter versions */}
          {avatarState.mood === 'happy' && (
            <path d="M85,110 Q100,125 115,110" stroke="#333" strokeWidth="3" fill="none" />
          )}
          {avatarState.mood === 'sad' && (
            <path d="M85,115 Q100,105 115,115" stroke="#333" strokeWidth="3" fill="none" />
          )}
          {avatarState.mood === 'caring' && (
            <>
              <path d="M85,110 Q100,120 115,110" stroke="#333" strokeWidth="3" fill="none" />
              {/* Small heart near mouth for caring mood */}
              <path d="M100,105 L103,102 L106,105 L103,108 Z" fill="#FF5252" />
            </>
          )}
          {avatarState.mood === 'jealous' && (
            <>
              <line x1="85" y1="110" x2="115" y2="110" stroke="#333" strokeWidth="3" />
              {/* Small pout */}
              <path d="M95,110 L95,113" stroke="#333" strokeWidth="2" />
            </>
          )}
          {avatarState.mood === 'angry' && (
            <path d="M85,110 Q100,105 115,110" stroke="#333" strokeWidth="3" fill="none" />
          )}
          {avatarState.mood === 'neutral' && (
            <path d="M85,110 Q100,112 115,110" stroke="#333" strokeWidth="3" fill="none" />
          )}
          
          {/* Eyebrows - more expressive */}
          {avatarState.mood === 'angry' && (
            <>
              <path d="M70,65 L90,72" stroke="#333" strokeWidth="3" />
              <path d="M110,72 L130,65" stroke="#333" strokeWidth="3" />
            </>
          )}
          {avatarState.mood === 'jealous' && (
            <>
              <path d="M70,68 L90,72" stroke="#333" strokeWidth="2" />
              <path d="M110,72 L130,68" stroke="#333" strokeWidth="2" />
            </>
          )}
          {avatarState.mood === 'sad' && (
            <>
              <path d="M70,72 L90,67" stroke="#333" strokeWidth="2" />
              <path d="M110,67 L130,72" stroke="#333" strokeWidth="2" />
            </>
          )}
          {(avatarState.mood === 'happy' || avatarState.mood === 'caring') && (
            <>
              <path d="M70,67 L90,64" stroke="#333" strokeWidth="2" />
              <path d="M110,64 L130,67" stroke="#333" strokeWidth="2" />
            </>
          )}
          {avatarState.mood === 'neutral' && (
            <>
              <path d="M70,65 L90,65" stroke="#333" strokeWidth="2" />
              <path d="M110,65 L130,65" stroke="#333" strokeWidth="2" />
            </>
          )}
          
          {/* Extras for specific moods */}
          {avatarState.mood === 'happy' && (
            <>
              {/* Closed eyes when very happy */}
              <path d="M70,80 Q80,75 90,80" stroke="#333" strokeWidth="2" />
              <path d="M110,80 Q120,75 130,80" stroke="#333" strokeWidth="2" />
            </>
          )}
          
          {/* Optional cat ears for extra cuteness */}
          <path d="M65,40 L50,15 L65,30" fill="#FFF5E6" stroke="#6D4C41" strokeWidth="2" />
          <path d="M135,40 L150,15 L135,30" fill="#FFF5E6" stroke="#6D4C41" strokeWidth="2" />
        </svg>
      </div>
    );
  };

  return (
    <div className={`${positionClasses[position]} z-10`}>
      <div className="relative">
        {/* Main avatar image */}
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg ring-4 ring-${avatarState.mood}`}>
          {getAvatarImage()}
        </div>
        
        {/* Emotional state indicator */}
        <div className={`absolute ${indicatorSizes[size]} rounded-full bg-${avatarState.mood} flex items-center justify-center text-xl`}>
          {avatarState.emoji}
        </div>

        {/* Voice active indicator */}
        <div className={`absolute ${voiceIndicatorSizes[size]} rounded-full bg-white flex items-center justify-center`}>
          <div className={`w-1/2 h-1/2 rounded-full ${avatarState.listening || avatarState.speaking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default AvatarOverlay;
