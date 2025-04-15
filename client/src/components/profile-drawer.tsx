import React, { useState } from 'react';
import { useChat } from '@/contexts/chat-context';
import { EmergencyContact } from '@/types';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const { user, updateUser, addEmergencyContact, removeEmergencyContact } = useChat();
  
  // Form state
  const [nickname, setNickname] = useState(user.nickname);
  const [avatarStyle, setAvatarStyle] = useState(user.avatarStyle);
  const [voicePreference, setVoicePreference] = useState(user.voicePreference);
  
  // New contact form
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    priority: 1
  });
  
  const handleSaveChanges = () => {
    updateUser({
      nickname,
      avatarStyle,
      voicePreference
    });
    onClose();
  };
  
  const handleAddContact = () => {
    addEmergencyContact(newContact);
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      priority: 1
    });
    setShowContactForm(false);
  };
  
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 glassmorphism transform transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <button 
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-3 overflow-hidden flex items-center justify-center">
            <i className="fas fa-user text-4xl"></i>
          </div>
          <h3 className="text-xl font-semibold">{user.nickname}</h3>
          <p className="text-sm opacity-70">MeMu AI User</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium opacity-70 block mb-1">Your Nickname</label>
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-3 rounded-lg glassmorphism border border-white/20 focus:border-happy focus:outline-none"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium opacity-70 block mb-1">Preferred Avatar Style</label>
            <select 
              className="w-full p-3 rounded-lg glassmorphism border border-white/20 focus:border-happy focus:outline-none bg-transparent"
              value={avatarStyle}
              onChange={(e) => setAvatarStyle(e.target.value as any)}
            >
              <option value="cute_female">Cute Female</option>
              <option value="professional_female">Professional Female</option>
              <option value="cute_male">Cute Male</option>
              <option value="professional_male">Professional Male</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium opacity-70 block mb-1">AI Voice</label>
            <select 
              className="w-full p-3 rounded-lg glassmorphism border border-white/20 focus:border-happy focus:outline-none bg-transparent"
              value={voicePreference}
              onChange={(e) => setVoicePreference(e.target.value as any)}
            >
              <option value="female_warm">Female - Warm</option>
              <option value="female_professional">Female - Professional</option>
              <option value="male_warm">Male - Warm</option>
              <option value="male_professional">Male - Professional</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium opacity-70 block mb-1">Emergency Contacts</label>
            <div className="p-3 rounded-lg glassmorphism border border-white/20">
              {user.emergencyContacts.length > 0 ? (
                user.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex justify-between items-center mb-2">
                    <span>{contact.name} ({contact.relationship})</span>
                    <button 
                      className="text-xs p-1 opacity-70 hover:opacity-100"
                      onClick={() => removeEmergencyContact(contact.id)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm opacity-70">No emergency contacts added yet.</p>
              )}
              
              {showContactForm ? (
                <div className="mt-3 space-y-2">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full p-2 rounded-lg glassmorphism border border-white/20 focus:border-happy focus:outline-none"
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Relationship (e.g. Sister)" 
                    className="w-full p-2 rounded-lg glassmorphism border border-white/20 focus:border-happy focus:outline-none"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    className="w-full p-2 rounded-lg glassmorphism border border-white/20 focus:border-happy focus:outline-none"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 p-2 rounded-lg bg-happy hover:bg-happy/80 transition-colors text-sm"
                      onClick={handleAddContact}
                    >
                      Add
                    </button>
                    <button 
                      className="flex-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                      onClick={() => setShowContactForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="w-full mt-2 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
                  onClick={() => setShowContactForm(true)}
                >
                  <i className="fas fa-plus mr-1"></i> Add Emergency Contact
                </button>
              )}
            </div>
          </div>
          
          <button 
            className="w-full p-3 rounded-lg bg-happy hover:bg-happy/80 transition-colors font-medium"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
