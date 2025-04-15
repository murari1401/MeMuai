import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useChat } from '@/contexts/chat-context';
import Logo from '@/components/ui/logo';

const LoginPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarStyle, setAvatarStyle] = useState<'cute_female' | 'professional_female' | 'cute_male' | 'professional_male'>('cute_female');
  const [, setLocation] = useLocation();
  const { updateUser } = useChat();
  
  // Auto-generate nickname based on full name
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    
    // Generate cute nickname from full name
    if (value.length > 2) {
      if (value.toLowerCase().includes('meghana')) {
        setNickname('Meghaa');
      } else {
        // Create a cute nickname by using first 4 chars + 'ii'
        // or repeating the last letter for names shorter than 4 chars
        const firstName = value.split(' ')[0];
        
        if (firstName.length <= 3) {
          // For short names, repeat the last letter
          const lastChar = firstName.charAt(firstName.length - 1);
          setNickname(firstName + lastChar.repeat(2));
        } else {
          // For longer names, take first part and add 'ii'
          setNickname(firstName.substring(0, 4) + 'ii');
        }
      }
    } else {
      setNickname('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create user ID
    const userId = 'user_' + Date.now().toString();
    
    // Update user info in context
    updateUser({
      id: userId,
      nickname: nickname || fullName,
      avatarStyle,
      voicePreference: avatarStyle.includes('female') ? 'female_warm' : 'male_warm',
      emergencyContacts: []
    });
    
    // Navigate to chat
    setLocation('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/90">
      {/* Background blobs for visual interest */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 z-10">
        <div className="max-w-md w-full bg-card/30 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Logo size="lg" />
            <h1 className="text-2xl font-bold mt-4">Welcome to MeMu AI</h1>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Your personal emotional companion
            </p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="fullName">
                Your Name
              </label>
              <input
                id="fullName"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Enter your name"
                value={fullName}
                onChange={handleFullNameChange}
                required
              />
            </div>
            
            {/* Nickname */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="nickname">
                Your Nickname
              </label>
              <div className="flex items-center space-x-2">
                <input
                  id="nickname"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="How should I call you?"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                {nickname && (
                  <div className="bg-primary/20 px-3 py-1 rounded-md text-sm">
                    <span role="img" aria-label="heart">❤️</span> {nickname}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                This is how MeMu will address you in conversations
              </p>
            </div>
            
            {/* Avatar Style */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Choose Your AI Companion Style
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${avatarStyle === 'cute_female' ? 'border-primary bg-primary/10' : 'border-input'}`}
                  onClick={() => setAvatarStyle('cute_female')}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="text-2xl">👧</span>
                  </div>
                  <span className="text-sm font-medium">Friendly Female</span>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${avatarStyle === 'professional_female' ? 'border-primary bg-primary/10' : 'border-input'}`}
                  onClick={() => setAvatarStyle('professional_female')}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="text-2xl">👩‍💼</span>
                  </div>
                  <span className="text-sm font-medium">Professional Female</span>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${avatarStyle === 'cute_male' ? 'border-primary bg-primary/10' : 'border-input'}`}
                  onClick={() => setAvatarStyle('cute_male')}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="text-2xl">👦</span>
                  </div>
                  <span className="text-sm font-medium">Friendly Male</span>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center ${avatarStyle === 'professional_male' ? 'border-primary bg-primary/10' : 'border-input'}`}
                  onClick={() => setAvatarStyle('professional_male')}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                    <span className="text-2xl">👨‍💼</span>
                  </div>
                  <span className="text-sm font-medium">Professional Male</span>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              disabled={!fullName}
            >
              Start Chatting
            </button>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} MeMu AI - Your Emotional Companion</p>
      </div>
    </div>
  );
};

export default LoginPage;