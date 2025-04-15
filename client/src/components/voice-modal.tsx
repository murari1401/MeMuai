import React, { useState } from 'react';
import voiceRecognition from '@/lib/voice-recognition';
import { useAvatar } from '@/contexts/avatar-context';
import { useChat } from '@/contexts/chat-context';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose
}) => {
  const { setListening } = useAvatar();
  const { sendMessage } = useChat();
  const [transcript, setTranscript] = useState('');
  const [progress, setProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  // Handle component mounting/unmounting
  React.useEffect(() => {
    let progressInterval: ReturnType<typeof setInterval>;
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const startRecording = () => {
      if (isOpen && !isRecording) {
        setIsRecording(true);
        setTranscript('');
        setProgress(0);
        setListening(true);
        
        // Start voice recognition
        voiceRecognition.start({
          onStart: () => {
            console.log('Voice recognition started');
          },
          onResult: (text) => {
            setTranscript(text);
          },
          onEnd: () => {
            console.log('Voice recognition ended');
          },
          onError: (error) => {
            console.error('Voice recognition error:', error);
          }
        });
        
        // Set up progress bar that increases over time
        const startTime = Date.now();
        const maxDuration = 7000; // 7 seconds
        
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / maxDuration) * 100, 100);
          setProgress(newProgress);
          
          if (newProgress >= 100) {
            completeRecording();
          }
        }, 100);
        
        // Auto-complete after maxDuration
        timeoutId = setTimeout(completeRecording, maxDuration);
      }
    };
    
    const completeRecording = () => {
      if (isRecording) {
        // Clear timers
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
        
        // Stop recognition
        voiceRecognition.stop();
        setListening(false);
        setIsRecording(false);
        
        // If we have text, send the message
        if (transcript.trim()) {
          const message = transcript;
          setTimeout(() => {
            onClose();
            setTimeout(() => {
              sendMessage(message);
            }, 300);
          }, 100);
        } else {
          onClose();
        }
      }
    };
    
    const cleanup = () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
      
      if (isRecording) {
        voiceRecognition.stop();
        setListening(false);
        setIsRecording(false);
      }
    };
    
    // Start recording when modal opens
    if (isOpen && !isRecording) {
      startRecording();
    }
    
    // Clean up when component unmounts or modal closes
    return cleanup;
  }, [isOpen, isRecording]); // Intentionally omitting other dependencies
  
  const handleCancel = () => {
    voiceRecognition.stop();
    setListening(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center">
      <div className="mx-4 p-6 rounded-2xl glassmorphism max-w-md w-full text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50"></div>
            <i className="fas fa-microphone text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Listening...</h2>
          <p className="opacity-80 mb-6">
            {transcript ? transcript : "Speak clearly and I'll respond right away!"}
          </p>
          
          <div className="w-full h-12 bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <button 
            className="px-6 py-3 rounded-full bg-neutral hover:bg-neutral/80 transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceModal;
