// Interface for voice recognition callback
interface VoiceRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (text: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

class VoiceRecognition {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private callbacks: VoiceRecognitionCallbacks = {};

  constructor() {
    // Check if browser supports speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks.onStart) this.callbacks.onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (this.callbacks.onResult) this.callbacks.onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      if (this.callbacks.onError) this.callbacks.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };
  }

  public start(callbacks: VoiceRecognitionCallbacks) {
    if (!this.recognition) {
      if (callbacks.onError) {
        callbacks.onError('Speech recognition not supported in this browser');
      }
      return;
    }

    // Stop any existing recognition session
    if (this.isListening) {
      this.stop();
    }

    // Set callbacks
    this.callbacks = callbacks;

    // Start recognition
    try {
      this.recognition.start();
    } catch (error) {
      if (callbacks.onError) {
        callbacks.onError('Failed to start speech recognition');
      }
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }
}

// Create and export a singleton instance
const voiceRecognition = new VoiceRecognition();
export default voiceRecognition;

// Speech synthesis for AI voice
export function speak(text: string, voicePreference: string = 'female_warm') {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on preference
    const voices = window.speechSynthesis.getVoices();
    
    // Wait for voices to load if they're not available yet
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        configureVoice(utterance, voicePreference);
        window.speechSynthesis.speak(utterance);
      };
    } else {
      configureVoice(utterance, voicePreference);
      window.speechSynthesis.speak(utterance);
    }
  }
}

// Helper function to configure voice based on preference
function configureVoice(utterance: SpeechSynthesisUtterance, voicePreference: string) {
  const voices = window.speechSynthesis.getVoices();
  
  // Set default values
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to find a suitable voice based on preference
  let selectedVoice = null;
  
  if (voicePreference.includes('female')) {
    // Look for female voice
    selectedVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
    
    // If no explicit female voice, try to find one by common female voice names
    if (!selectedVoice) {
      const femaleNames = ['Samantha', 'Victoria', 'Karen', 'Tessa', 'Monica', 'Alice'];
      for (const name of femaleNames) {
        selectedVoice = voices.find(voice => voice.name.includes(name));
        if (selectedVoice) break;
      }
    }
  } else {
    // Look for male voice
    selectedVoice = voices.find(voice => voice.name.includes('male') || voice.name.includes('Male'));
    
    // If no explicit male voice, try to find one by common male voice names
    if (!selectedVoice) {
      const maleNames = ['Daniel', 'Tom', 'Alex', 'Matthew', 'James', 'David'];
      for (const name of maleNames) {
        selectedVoice = voices.find(voice => voice.name.includes(name));
        if (selectedVoice) break;
      }
    }
  }
  
  // Apply the selected voice or fallback to default
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Adjust tone based on warm/professional preference
  if (voicePreference.includes('warm')) {
    utterance.rate = 0.95; // Slightly slower for warmer feel
    utterance.pitch = 1.1; // Slightly higher pitch for warmth
  } else {
    utterance.rate = 1.05; // Slightly faster for professional tone
    utterance.pitch = 0.95; // Slightly lower pitch for professional sound
  }
}
