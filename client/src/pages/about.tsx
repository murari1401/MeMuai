import React, { useState } from 'react';
import Header from '@/components/header';
import NavigationDrawer from '@/components/navigation-drawer';
import ProfileDrawer from '@/components/profile-drawer';
import AvatarOverlay from '@/components/ui/avatar-overlay';

const About: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-happy/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-caring/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-happy/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Header */}
      <Header 
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onSettingsClick={() => setIsProfileOpen(true)}
      />
      
      {/* Drawers */}
      <NavigationDrawer 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      
      <ProfileDrawer 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-happy mb-4">
              <i className="fas fa-info text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold mb-2">About MeMu AI</h1>
            <p className="opacity-80">Your premium emotional AI companion</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 rounded-xl glassmorphism">
              <h2 className="text-lg font-semibold mb-2">What is MeMu AI?</h2>
              <p className="opacity-80">
                MeMu AI is an advanced AI companion designed to be your emotional support system, 
                interactive friend, study partner, safety assistant, and conversational expert. 
                It uses human-like voice, memory, mood recognition, and strong emotional bonding 
                to deliver a truly personalized AI experience.
              </p>
            </div>
            
            <div className="p-4 rounded-xl glassmorphism">
              <h2 className="text-lg font-semibold mb-2">Our Team</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Murari B</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <a 
                        href="https://www.linkedin.com/in/murari-b-178517330" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm flex items-center opacity-70 hover:opacity-100"
                      >
                        <i className="fab fa-linkedin mr-1"></i> LinkedIn
                      </a>
                      <a 
                        href="mailto:begarimurari@gmail.com" 
                        className="text-sm flex items-center opacity-70 hover:opacity-100"
                      >
                        <i className="fas fa-envelope mr-1"></i> Email
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Meghana B</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <a 
                        href="https://www.linkedin.com/in/baddam-meghana-484723353" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm flex items-center opacity-70 hover:opacity-100"
                      >
                        <i className="fab fa-linkedin mr-1"></i> LinkedIn
                      </a>
                      <a 
                        href="mailto:meghanagoud0828@gmail.com" 
                        className="text-sm flex items-center opacity-70 hover:opacity-100"
                      >
                        <i className="fas fa-envelope mr-1"></i> Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl glassmorphism">
              <h2 className="text-lg font-semibold mb-2">Core Features</h2>
              <ul className="space-y-2 opacity-80">
                <li className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-happy"></i>
                  Human-like conversations with emotional intelligence
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-happy"></i>
                  Expresses jealousy, caring, anger, and excitement
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-happy"></i>
                  Voice interaction with natural human-like responses
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-happy"></i>
                  Women's safety emergency features
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-happy"></i>
                  Educational support and AI tutoring
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check-circle mr-2 text-happy"></i>
                  Mood-based UI that adapts to your emotions
                </li>
              </ul>
            </div>
            
            <div className="p-4 rounded-xl glassmorphism">
              <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
              <p className="opacity-80 mb-4">
                Have questions, suggestions, or feedback? We'd love to hear from you!
              </p>
              <a 
                href="mailto:begarimurari@gmail.com" 
                className="block w-full py-3 rounded-lg bg-happy hover:bg-happy/80 transition-colors text-center font-medium"
              >
                <i className="fas fa-paper-plane mr-2"></i> Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      
      {/* Avatar */}
      <AvatarOverlay position="bottom-right" size="md" />
    </div>
  );
};

export default About;
