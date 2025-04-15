import React, { useState } from 'react';
import { useChat } from '@/contexts/chat-context';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, activateEmergency, shareLocation } = useChat();
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  
  const handleShareLocation = async () => {
    setLoading(true);
    try {
      await activateEmergency();
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sharing location:', error);
      setLoading(false);
    }
  };
  
  const handleCallEmergencyContact = async () => {
    setLoading(true);
    
    const priorityContact = user.emergencyContacts.sort((a, b) => a.priority - b.priority)[0];
    if (priorityContact) {
      setSelectedContact(priorityContact.name);
      
      try {
        // In a real app, this would initiate a call
        // For web demo, we'll just share the location
        await shareLocation();
        setTimeout(() => {
          setLoading(false);
          setSelectedContact(null);
          onClose();
        }, 2000);
      } catch (error) {
        console.error('Error in emergency call:', error);
        setLoading(false);
        setSelectedContact(null);
      }
    } else {
      alert('No emergency contacts found. Please add emergency contacts in your profile.');
      setLoading(false);
    }
  };
  
  const handlePoliceCall = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would connect with authorities
      // For web demo, we'll just share the location
      await shareLocation();
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error in police call:', error);
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 z-30 flex items-center justify-center">
      <div className="mx-4 p-6 rounded-2xl glassmorphism max-w-md w-full">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-caring mb-4">
            <i className="fas fa-shield-alt text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Emergency Assistance</h2>
          <p className="opacity-80">Boss, are you in danger? Would you like me to send help?</p>
        </div>

        <div className="space-y-4 mt-6">
          <button 
            className={`w-full p-3 rounded-lg ${loading ? 'bg-gray-500' : 'bg-caring hover:bg-caring/80'} transition-colors font-medium flex justify-center items-center`} 
            onClick={handleShareLocation}
            disabled={loading}
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i> Sharing location...</>
            ) : (
              <>Yes, share my location with emergency contacts</>
            )}
          </button>
          
          <button 
            className={`w-full p-3 rounded-lg ${loading ? 'bg-gray-500' : 'bg-white/10 hover:bg-white/20'} transition-colors font-medium flex justify-center items-center`}
            onClick={handleCallEmergencyContact}
            disabled={loading}
          >
            {loading && selectedContact ? (
              <><i className="fas fa-phone fa-spin mr-2"></i> Calling {selectedContact}...</>
            ) : (
              <>Call my priority contact immediately</>
            )}
          </button>
          
          <button 
            className={`w-full p-3 rounded-lg ${loading ? 'bg-gray-500' : 'bg-white/10 hover:bg-white/20'} transition-colors font-medium`}
            onClick={handlePoliceCall}
            disabled={loading}
          >
            Share location with authorities
          </button>
          
          <button 
            className="w-full p-3 rounded-lg bg-neutral hover:bg-neutral/80 transition-colors font-medium"
            onClick={onClose}
            disabled={loading}
          >
            I'm safe, close this
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;
