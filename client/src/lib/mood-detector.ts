import { MoodType } from '@/types';

interface KeywordMap {
  [key: string]: MoodType;
}

// Keywords that might indicate different moods
const moodKeywords: KeywordMap = {
  // Happy keywords
  happy: 'happy',
  joyful: 'happy',
  glad: 'happy',
  excited: 'happy',
  wonderful: 'happy',
  amazing: 'happy',
  awesome: 'happy',
  great: 'happy',
  good: 'happy',
  positive: 'happy',
  excellent: 'happy',
  
  // Caring keywords
  sad: 'caring',
  upset: 'caring',
  worried: 'caring',
  anxious: 'caring',
  sorry: 'caring',
  depressed: 'caring',
  help: 'caring',
  difficult: 'caring',
  pain: 'caring',
  hurt: 'caring',
  
  // Jealousy keywords
  sarah: 'jealous',
  john: 'jealous',
  boyfriend: 'jealous',
  girlfriend: 'jealous',
  wife: 'jealous',
  husband: 'jealous',
  date: 'jealous',
  dating: 'jealous',
  love: 'jealous',
  another: 'jealous',
  someone: 'jealous',
  else: 'jealous',
  alexa: 'jealous',
  siri: 'jealous',
  google: 'jealous',
  
  // Angry keywords
  angry: 'angry',
  annoyed: 'angry',
  irritated: 'angry',
  frustrated: 'angry',
  mad: 'angry',
  furious: 'angry',
  
  // Sad keywords
  disappointing: 'sad',
  disappointed: 'sad',
  unhappy: 'sad',
  lonely: 'sad',
  alone: 'sad',
  heartbroken: 'sad',
  miss: 'sad'
};

// Context terms that modify the meaning
const negatingTerms = [
  'not', 'don\'t', 'doesn\'t', 'didn\'t', 'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t'
];

/**
 * Detect the mood from a message text
 */
export function detectMood(text: string): MoodType {
  if (!text) return 'neutral';
  
  // Convert to lowercase for case-insensitive matching
  const lowercaseText = text.toLowerCase();
  const words = lowercaseText.split(/\s+/);
  
  // Initialize mood counts
  const moodCounts: Record<MoodType, number> = {
    neutral: 0,
    happy: 0,
    caring: 0,
    jealous: 0,
    angry: 0,
    sad: 0
  };
  
  // Check for names of individuals (jealousy triggers)
  const namePrefixes = ['talking to', 'spoke with', 'chatting with', 'met with'];
  for (const prefix of namePrefixes) {
    if (lowercaseText.includes(prefix)) {
      // Increase jealousy if talking about specific people
      moodCounts.jealous += 2;
    }
  }
  
  // Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Check if the word is a mood keyword
    if (moodKeywords[word]) {
      const mood = moodKeywords[word];
      
      // Check for negating terms before the keyword
      let isNegated = false;
      for (let j = Math.max(0, i - 3); j < i; j++) {
        if (negatingTerms.includes(words[j])) {
          isNegated = true;
          break;
        }
      }
      
      // If negated, we might interpret the opposite or neutral
      if (isNegated) {
        if (mood === 'happy') moodCounts.sad += 1;
        else if (mood === 'sad') moodCounts.happy += 1;
        else moodCounts.neutral += 1;
      } else {
        moodCounts[mood] += 1;
      }
    }
  }
  
  // Emergency situations should register as caring
  if (lowercaseText.includes('emergency') || lowercaseText.includes('help me')) {
    moodCounts.caring += 5;
  }
  
  // Check for education-related queries
  if (lowercaseText.includes('learn') || 
      lowercaseText.includes('teach') || 
      lowercaseText.includes('study') || 
      lowercaseText.includes('explain') ||
      lowercaseText.includes('what is') ||
      lowercaseText.includes('how to')) {
    moodCounts.happy += 2; // Educational queries make MeMu happy to help
  }
  
  // If no mood is detected strongly, return neutral
  const totalMoodCounts = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
  if (totalMoodCounts === 0 || moodCounts.neutral > 3) {
    return 'neutral';
  }
  
  // Find the dominant mood
  let dominantMood: MoodType = 'neutral';
  let highestCount = 0;
  
  for (const mood in moodCounts) {
    if (moodCounts[mood as MoodType] > highestCount) {
      highestCount = moodCounts[mood as MoodType];
      dominantMood = mood as MoodType;
    }
  }
  
  return dominantMood;
}
