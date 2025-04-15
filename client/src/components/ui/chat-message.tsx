import React from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  const formattedTime = 
    message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const timeAgo = formatDistanceToNow(message.timestamp, { addSuffix: true });
  
  return (
    <div 
      className={`flex mb-4 items-end ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div 
        className={`w-8 h-8 rounded-full ${
          isBot 
            ? `bg-${message.mood || 'neutral'} flex-shrink-0 flex items-center justify-center overflow-hidden` 
            : 'bg-gray-300 flex-shrink-0 flex items-center justify-center text-neutral'
        }`}
      >
        {isBot ? (
          <svg 
            className="w-full h-full p-1"
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="70" r="50" fill="#fafafa" />
            <circle cx="80" cy="60" r="8" fill="#333" />
            <circle cx="120" cy="60" r="8" fill="#333" />
            
            {/* Mouth based on mood */}
            {message.mood === 'happy' && (
              <path d="M70,90 Q100,120 130,90" stroke="#333" strokeWidth="4" fill="none" />
            )}
            {message.mood === 'sad' && (
              <path d="M70,100 Q100,80 130,100" stroke="#333" strokeWidth="4" fill="none" />
            )}
            {message.mood === 'caring' && (
              <path d="M70,95 Q100,115 130,95" stroke="#333" strokeWidth="4" fill="none" />
            )}
            {message.mood === 'jealous' && (
              <line x1="70" y1="95" x2="130" y2="95" stroke="#333" strokeWidth="4" />
            )}
            {message.mood === 'angry' && (
              <path d="M70,95 Q100,85 130,95" stroke="#333" strokeWidth="4" fill="none" />
            )}
            {message.mood === 'neutral' && (
              <line x1="70" y1="95" x2="130" y2="95" stroke="#333" strokeWidth="4" />
            )}
          </svg>
        ) : (
          <i className="fas fa-user"></i>
        )}
      </div>
      
      {/* Message content */}
      <div className={`${isBot ? 'ml-2' : 'mr-2'} max-w-[80%]`}>
        <div 
          className={`
            ${isBot ? `bg-${message.mood || 'neutral'}` : 'bg-white/10'} 
            p-3 rounded-2xl 
            ${isBot ? 'rounded-bl-none' : 'rounded-br-none'}
          `}
        >
          <p className={isBot ? 'font-avatar' : ''}>{message.text}</p>
        </div>
        <span 
          className={`text-xs opacity-70 mt-1 ${!isBot ? 'text-right block' : ''}`} 
          title={timeAgo}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
