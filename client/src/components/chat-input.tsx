import React, { useState, FormEvent } from 'react';
import { useChat } from '@/contexts/chat-context';
import { useAvatar } from '@/contexts/avatar-context';
import voiceRecognition from '@/lib/voice-recognition';

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  action: () => void;
}

interface ChatInputProps {
  onOpenEmergency: () => void;
  onVoiceInputStart: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onOpenEmergency,
  onVoiceInputStart
}) => {
  const [messageText, setMessageText] = useState('');
  const { sendMessage } = useChat();
  const { setListening } = useAvatar();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim()) {
      await sendMessage(messageText);
      setMessageText('');
    }
  };
  
  const quickActions: QuickAction[] = [
    {
      id: 'fun-facts',
      icon: 'fas fa-lightbulb',
      label: 'Fun facts',
      action: () => sendMessage('Tell me a fun fact')
    },
    {
      id: 'study-help',
      icon: 'fas fa-book',
      label: 'Study help',
      action: () => sendMessage('Help me study for my test')
    },
    {
      id: 'cheer-up',
      icon: 'fas fa-smile-beam',
      label: 'Cheer me up',
      action: () => sendMessage('I need cheering up')
    }
  ];
  
  const startVoiceInput = () => {
    if (voiceRecognition.isSupported()) {
      setListening(true);
      onVoiceInputStart();
      
      voiceRecognition.start({
        onStart: () => {
          console.log('Voice recognition started');
        },
        onResult: (text) => {
          setMessageText(text);
        },
        onEnd: () => {
          setListening(false);
        },
        onError: (error) => {
          console.error('Voice recognition error:', error);
          setListening(false);
        }
      });
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };
  
  return (
    <div className="p-4 glassmorphism">
      <div className="flex items-center">
        <button 
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" 
          aria-label="Emoji"
        >
          <i className="far fa-smile"></i>
        </button>
        <div className="flex-1 mx-2 rounded-full glassmorphism">
          <form className="flex items-center" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full p-3 bg-transparent border-none focus:outline-none focus:ring-0" 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button 
              type="button" 
              className="p-3 text-white/70 hover:text-white transition-colors" 
              aria-label="Attach file"
            >
              <i className="fas fa-paperclip"></i>
            </button>
          </form>
        </div>
        <button 
          className="p-3 rounded-full bg-happy hover:bg-happy/80 transition-colors shadow-lg text-white" 
          aria-label="Voice input"
          onClick={startVoiceInput}
        >
          <i className="fas fa-microphone"></i>
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex mt-3 pb-1 overflow-x-auto hide-scrollbar">
        {quickActions.map((action) => (
          <button 
            key={action.id}
            className="flex-shrink-0 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors mr-2 text-sm"
            onClick={action.action}
          >
            <i className={`${action.icon} mr-1`}></i> {action.label}
          </button>
        ))}
        <button 
          className="flex-shrink-0 px-4 py-2 rounded-full bg-caring hover:bg-caring/80 transition-colors mr-2 text-sm shadow-lg"
          onClick={onOpenEmergency}
        >
          <i className="fas fa-shield-alt mr-1"></i> Emergency
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
