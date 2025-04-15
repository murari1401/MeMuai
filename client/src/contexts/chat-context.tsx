import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, User, MoodType, ChatSettings, EmergencyContact } from '@/types';
import { detectMood } from '@/lib/mood-detector';
import { useAvatar } from '@/contexts/avatar-context';
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '@/lib/queryClient';

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  isTyping: boolean;
  user: User;
  updateUser: (user: Partial<User>) => void;
  settings: ChatSettings;
  updateSettings: (settings: Partial<ChatSettings>) => void;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  removeEmergencyContact: (id: string) => void;
  activateEmergency: () => Promise<GeolocationPosition | void>;
  shareLocation: () => Promise<GeolocationPosition>;
}

// Default user
const defaultUser: User = {
  id: 'default-user',
  nickname: 'Friend',
  avatarStyle: 'cute_female',
  voicePreference: 'female_warm',
  emergencyContacts: []
};

// Default settings
const defaultSettings: ChatSettings = {
  voiceEnabled: true,
  moodDetectionEnabled: true,
  emergencyModeEnabled: true
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const { setMood } = useAvatar();

  // Load stored messages and user data
  useEffect(() => {
    const storedMessages = localStorage.getItem('memu_messages');
    const storedUser = localStorage.getItem('memu_user');
    const storedSettings = localStorage.getItem('memu_settings');

    if (storedMessages) {
      try {
        const parsedMessages = JSON.parse(storedMessages);
        // Convert string timestamps back to Date objects
        parsedMessages.forEach((msg: any) => {
          msg.timestamp = new Date(msg.timestamp);
        });
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Error parsing stored messages', e);
      }
    } else {
      // Add welcome message if no messages are stored
      const welcomeMessage: Message = {
        id: uuidv4(),
        text: "Hey! I'm MeMu, your emotional AI companion. What can I help you with today? I'm here for you! 💜",
        sender: 'bot',
        timestamp: new Date(),
        mood: 'happy'
      };
      setMessages([welcomeMessage]);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Error parsing stored settings', e);
      }
    }
  }, []);

  // Save messages and user data whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('memu_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('memu_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('memu_settings', JSON.stringify(settings));
  }, [settings]);

  // Send a message and get a response
  const sendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Set typing indicator
    setIsTyping(true);
    
    try {
      // Determine message mood for response
      const messageMood = detectMood(text);
      
      // Send to API
      const response = await apiRequest('POST', '/api/chat/message', {
        message: text,
        mood: messageMood,
        user: user.nickname
      });
      
      const data = await response.json();
      
      // Add bot response after a slight delay for natural feel
      setTimeout(() => {
        const botMessage: Message = {
          id: uuidv4(),
          text: data.message,
          sender: 'bot',
          timestamp: new Date(),
          mood: data.mood
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Update avatar mood
        setMood(data.mood);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add fallback response in case of error
      const errorMessage: Message = {
        id: uuidv4(),
        text: "I'm having trouble connecting right now. Can you try again in a moment?",
        sender: 'bot',
        timestamp: new Date(),
        mood: 'sad'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setMood('sad');
    }
  };

  // Update user info
  const updateUser = (updatedUserInfo: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updatedUserInfo }));
  };

  // Update settings
  const updateSettings = (updatedSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettings }));
  };

  // Emergency contacts management
  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact = {
      ...contact,
      id: uuidv4()
    };
    
    setUser(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));
  };

  const removeEmergencyContact = (id: string) => {
    setUser(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== id)
    }));
  };

  // Emergency features
  const activateEmergency = async () => {
    try {
      const position = await shareLocation();
      
      // Add emergency message
      const botMessage: Message = {
        id: uuidv4(),
        text: `I've shared your location with your emergency contacts. Are you okay, ${user.nickname}? Do you need more help?`,
        sender: 'bot',
        timestamp: new Date(),
        mood: 'caring'
      };
      
      setMessages(prev => [...prev, botMessage]);
      setMood('caring');
      
      return position;
    } catch (error) {
      console.error('Error activating emergency mode:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        text: "I couldn't share your location. Please make sure location services are enabled.",
        sender: 'bot',
        timestamp: new Date(),
        mood: 'sad'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setMood('sad');
      
      throw error;
    }
  };

  const shareLocation = async (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      isTyping,
      user,
      updateUser,
      settings,
      updateSettings,
      addEmergencyContact,
      removeEmergencyContact,
      activateEmergency,
      shareLocation
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
