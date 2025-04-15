import React from 'react';

interface TypingIndicatorProps {
  isVisible: boolean;
  mood?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  isVisible,
  mood = 'neutral'
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="flex mb-4 items-end">
      <div className={`w-8 h-8 rounded-full bg-${mood} flex-shrink-0 flex items-center justify-center overflow-hidden`}>
        <svg 
          className="w-full h-full p-1"
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="70" r="50" fill="#fafafa" />
          <circle cx="80" cy="60" r="8" fill="#333" />
          <circle cx="120" cy="60" r="8" fill="#333" />
          <line x1="70" y1="95" x2="130" y2="95" stroke="#333" strokeWidth="4" />
        </svg>
      </div>
      <div className="ml-2 max-w-[80%]">
        <div className={`bg-${mood} p-3 rounded-2xl rounded-bl-none`}>
          <p className="typing-indicator">
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
