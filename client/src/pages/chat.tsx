import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/chat-context';
import Header from '@/components/header';
import NavigationDrawer from '@/components/navigation-drawer';
import ProfileDrawer from '@/components/profile-drawer';
import ChatInput from '@/components/chat-input';
import ChatMessage from '@/components/ui/chat-message';
import TypingIndicator from '@/components/ui/typing-indicator';
import AvatarOverlay from '@/components/ui/avatar-overlay';
import EmergencyModal from '@/components/emergency-modal';
import VoiceModal from '@/components/voice-modal';
import WelcomeModal from '@/components/welcome-modal';
import { useAvatar } from '@/contexts/avatar-context';
import { MoodType } from '@/types';
import { apiRequest } from '@/lib/queryClient';
import { v4 as uuidv4 } from 'uuid';

const Chat: React.FC = () => {
  const { messages, isTyping, user, sendMessage } = useChat();
  const { avatarState, setMood } = useAvatar();
  const [isSettingMood, setIsSettingMood] = useState(false);
  
  // UI state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(true);
  
  // Ref for chat area to auto-scroll
  const chatAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);
  
  // Show welcome modal on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('memu_visited');
    if (hasVisited) {
      setIsWelcomeOpen(false);
    }
  }, []);
  
  const handleWelcomeClose = () => {
    localStorage.setItem('memu_visited', 'true');
    setIsWelcomeOpen(false);
  };
  
  // Handle mood selection
  const handleMoodSelect = async (mood: MoodType) => {
    if (isSettingMood) return; // Prevent multiple clicks
    
    setIsSettingMood(true);
    setMood(mood);
    
    try {
      // Send a system message to API to change mood
      const moodChangeMessages: Record<MoodType, string> = {
        'happy': "I want you to be happy and cheerful now! 😄",
        'caring': "I need some care and support right now. Be kind and nurturing. 🫂",
        'jealous': "Act a bit jealous and possessive, but in a cute way. 😒",
        'sad': "I need some empathy, please show a bit of sadness. 😔",
        'neutral': "Let's just talk normally now. 😐",
        'angry': "I'm feeling a bit frustrated. Can you reflect that mood? 😠"
      };
      
      // Add a direct API call to change the mood instead of using the chat context
      await sendMessage(moodChangeMessages[mood]);
      
    } catch (error) {
      console.error('Error changing mood:', error);
    } finally {
      setIsSettingMood(false);
    }
  };
  
  // Background mood blobs
  const renderMoodBlobs = () => (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-caring/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-happy/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-jealous/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>
  );
  
  return (
    <div id="app" className="flex flex-col h-screen relative overflow-hidden">
      {/* Background mood blobs */}
      {renderMoodBlobs()}
      
      {/* Header */}
      <Header 
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsProfileOpen(true)}
      />
      
      {/* Navigation Drawer */}
      <NavigationDrawer 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      
      {/* Profile Drawer */}
      <ProfileDrawer 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Greeting header with mood buttons */}
        <div className="p-4 text-center">
          <h2 className="text-lg">Good {getTimeOfDay()}, {user.nickname}! 👋</h2>
          <p className="text-sm opacity-70 mb-2">How would you like MeMu to respond to you?</p>
          
          {/* Mood reaction buttons */}
          <div className="flex justify-center space-x-2 mt-2 flex-wrap gap-1">
            <button
              className={`px-3 py-1 rounded-full text-sm transition-all flex items-center ${avatarState.mood === 'caring' ? 'bg-caring text-white' : 'bg-caring/20 hover:bg-caring/30'}`}
              onClick={() => handleMoodSelect('caring' as MoodType)}
              disabled={isSettingMood}
            >
              <span className="mr-1">🫂</span> Caring
            </button>
            
            <button
              className={`px-3 py-1 rounded-full text-sm transition-all flex items-center ${avatarState.mood === 'happy' ? 'bg-happy text-white' : 'bg-happy/20 hover:bg-happy/30'}`}
              onClick={() => handleMoodSelect('happy' as MoodType)}
              disabled={isSettingMood}
            >
              <span className="mr-1">😄</span> Happy
            </button>
            
            <button
              className={`px-3 py-1 rounded-full text-sm transition-all flex items-center ${avatarState.mood === 'jealous' ? 'bg-jealous text-white' : 'bg-jealous/20 hover:bg-jealous/30'}`}
              onClick={() => handleMoodSelect('jealous' as MoodType)}
              disabled={isSettingMood}
            >
              <span className="mr-1">😒</span> Jealous
            </button>
            
            <button
              className={`px-3 py-1 rounded-full text-sm transition-all flex items-center ${avatarState.mood === 'neutral' ? 'bg-neutral text-white' : 'bg-neutral/20 hover:bg-neutral/30'}`}
              onClick={() => handleMoodSelect('neutral' as MoodType)}
              disabled={isSettingMood}
            >
              <span className="mr-1">😐</span> Neutral
            </button>
            
            <button
              className={`px-3 py-1 rounded-full text-sm transition-all flex items-center ${avatarState.mood === 'sad' ? 'bg-primary text-white' : 'bg-primary/20 hover:bg-primary/30'}`}
              onClick={() => handleMoodSelect('sad' as MoodType)}
              disabled={isSettingMood}
            >
              <span className="mr-1">😔</span> Sad
            </button>
          </div>
          
          {/* Loading indicator for mood changes */}
          {isSettingMood && (
            <div className="text-xs text-center mt-2 text-muted-foreground animate-pulse">
              Changing mood...
            </div>
          )}
        </div>
        
        {/* Chat Area */}
        <div 
          id="chat-area" 
          className="flex-1 p-4 overflow-y-auto"
          ref={chatAreaRef}
        >
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Typing indicator */}
          <TypingIndicator 
            isVisible={isTyping} 
            mood={avatarState.mood}
          />
        </div>
        
        {/* Avatar Overlay */}
        <AvatarOverlay position="bottom-right" size="lg" />
        
        {/* Input Area */}
        <ChatInput 
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onVoiceInputStart={() => setIsVoiceOpen(true)}
        />
      </main>
      
      {/* Modals */}
      <EmergencyModal 
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
      
      <VoiceModal 
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
      
      <WelcomeModal 
        isOpen={isWelcomeOpen}
        onClose={handleWelcomeClose}
      />
    </div>
  );
};

// Helper function to get time of day
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default Chat;
