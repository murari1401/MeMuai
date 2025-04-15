import React from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center">
      <div className="mx-4 p-6 rounded-2xl glassmorphism max-w-md w-full text-center">
        <div className="inline-block rounded-full overflow-hidden w-24 h-24 mb-4 ring-4 ring-happy">
          <svg 
            className="w-full h-full"
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="100" fill="url(#avatarGradient)" />
            <circle cx="100" cy="70" r="50" fill="#fafafa" />
            <circle cx="80" cy="60" r="8" fill="#333" />
            <circle cx="120" cy="60" r="8" fill="#333" />
            <path d="M70,90 Q100,120 130,90" stroke="#333" strokeWidth="4" fill="none" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to MeMu AI!</h2>
        <p className="opacity-80 mb-6">I'm your personal AI companion with emotional intelligence! I can answer your questions, have natural conversations, and help with various tasks while respecting your preferences.</p>
        <div className="bg-black/10 p-3 rounded-lg mb-4 text-left text-sm">
          <p className="font-medium mb-1">Features:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ask me any questions like you would with ChatGPT</li>
            <li>Select how you want me to respond using mood buttons</li>
            <li>I'll use cute nicknames during our conversation</li>
            <li>Emergency features available when needed</li>
          </ul>
        </div>
        <div className="flex flex-col space-y-3">
          <button 
            className="px-6 py-3 rounded-lg bg-happy hover:bg-happy/80 transition-colors font-semibold"
            onClick={onClose}
          >
            Get Started!
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
