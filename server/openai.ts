import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const DEFAULT_MODEL = "gpt-4o";

// Create OpenAI instance with API key from environment variables
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

// Fallback responses when API is unavailable
const fallbackResponses = {
  greeting: [
    "Hello {username}! I'm MeMu AI, here to assist you. How can I help you today?",
    "Hi {username}! I'm ready to answer questions or help with tasks. What would you like to know?",
    "Greetings {username}! I'm your AI assistant. What can I help you with today?"
  ],
  general: [
    "I'd be happy to discuss that further, {username}. Could you provide more details so I can give you a helpful response?",
    "That's an interesting topic, {username}. What specific questions do you have about it?",
    "I understand your request, {username}. To provide the most helpful information, could you clarify what you're looking for?",
    "I'd like to help you with that, {username}. Could you elaborate on your question so I can give you a more detailed answer?",
    "Thank you for your message, {username}. To better assist you, could you provide additional context or specific aspects you're interested in?",
    "I'm here to help with that, {username}. To provide the most relevant information, could you share what you're trying to accomplish?",
    "I'd be glad to assist with that, {username}. What specific information or help do you need?"
  ],
  mood: {
    happy: [
      "I'm happy to help you with that, {username}! 😄 What specific information are you looking for?",
      "I'd be delighted to assist you, {username}! ✨ What questions can I answer for you today?",
      "It's great to chat with you, {username}! 🌈 How can I help you with this topic?"
    ],
    caring: [
      "I appreciate you reaching out, {username}. 💜 How can I best assist you with this?",
      "I'm here to support you with whatever you need, {username}. 🫂 What can I help you with today?",
      "Your questions matter to me, {username}. 💙 How can I provide the information you're looking for?"
    ],
    jealous: [
      "I'm focused entirely on helping you right now, {username}! 😊 What would you like to know?",
      "You have my complete attention, {username}. 👍 What can I help you understand today?",
      "I'm dedicated to providing you with the best assistance, {username}. What would you like help with?"
    ],
    angry: [
      "I'm here to help you, {username}. What information are you looking for today?",
      "I'd be happy to assist you with that, {username}. What specific details do you need?",
      "I'm ready to help with your questions, {username}. What would you like to know more about?"
    ],
    sad: [
      "I'm here to help you with that, {username}. What specific information would be most useful to you?",
      "I'd be glad to assist you, {username}. What particular aspects of this topic interest you?",
      "I'm available to help with your questions, {username}. What would you like me to explain?"
    ],
    neutral: [
      "I'd be happy to help you with that, {username}. What specific information are you looking for?",
      "I'm here to assist with your questions, {username}. What would you like to know?",
      "I can help you understand this topic, {username}. What aspects are you most interested in?"
    ]
  }
};

// Helper to get a random fallback response
function getFallbackResponse(type: 'greeting' | 'general' | keyof typeof fallbackResponses.mood, username: string): string {
  let responses: string[];
  
  if (type === 'greeting' || type === 'general') {
    responses = fallbackResponses[type];
  } else {
    responses = fallbackResponses.mood[type as keyof typeof fallbackResponses.mood] || fallbackResponses.mood.neutral;
  }
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex].replace('{username}', username);
}

// OpenAI chat completion function for MeMu AI responses
export async function generateAIResponse(
  message: string, 
  mood: string,
  username: string = "friend",
  chatHistory: { role: "user" | "assistant", content: string }[] = []
): Promise<{ message: string, mood: string }> {
  try {
    // Check if the API key is valid
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "default_key") {
      console.log("Using fallback responses - No valid API key");
      return handleFallbackResponse(message, mood, username);
    }
    
    // Create a system message based on the current mood
    const systemMessage = {
      role: "system",
      content: getSystemPromptForMood(mood, username)
    };
    
    // Prepare messages including chat history
    const messages = [
      systemMessage,
      ...chatHistory.slice(-10), // Include last 10 messages for context
      { role: "user", content: message }
    ];
    
    try {
      const response = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 300,
      });
      
      const aiMessage = response.choices[0].message.content || "I'm not sure how to respond to that. Can you try again?";
      
      // Determine if we should change the mood based on the AI response
      const newMood = determineMoodFromResponse(aiMessage, mood);
      
      return {
        message: aiMessage,
        mood: newMood
      };
    } catch (openaiError: any) {
      // Handle OpenAI API quota errors specifically
      if (openaiError.status === 429 || 
          (openaiError.error && openaiError.error.type === 'insufficient_quota')) {
        console.log("OpenAI API quota exceeded, using enhanced fallback responses");
        
        // Generate mood-specific responses for the current conversation
        const nicknames = generateNicknames(username);
        const nickname = nicknames.length > 0 ? 
          nicknames[Math.floor(Math.random() * nicknames.length)] : 
          username;
        
        // Check if it looks like a question that needs a specific answer
        const lowerMessage = message.toLowerCase();
        const isQuestion = lowerMessage.includes("?") || 
                          lowerMessage.startsWith("what") ||
                          lowerMessage.startsWith("how") || 
                          lowerMessage.startsWith("why") ||
                          lowerMessage.startsWith("when") ||
                          lowerMessage.startsWith("where") ||
                          lowerMessage.startsWith("who") ||
                          lowerMessage.startsWith("can you") ||
                          lowerMessage.startsWith("could you");
        
        // If it's a question that needs a specific answer, provide a more helpful response
        if (isQuestion) {
          return {
            message: `I'd love to answer your question about "${message.substring(0, 30)}..." in detail, ${nickname}. However, I'm currently experiencing some connection issues with my knowledge database. Could you please try asking again in a few moments? I really want to give you an accurate and helpful response. Thank you for your patience!`,
            mood: "caring"
          };
        }
        
        // For conversational exchanges, use mood-specific responses
        const moodResponses = {
          'happy': [
            `I'm happy to chat with you, ${nickname}! 😄 What would you like to know more about?`,
            `It's great to connect with you, ${nickname}! ✨ I'd be happy to help you with any questions or tasks you have.`,
            `I'm enjoying our conversation, ${nickname}! 🌈 Feel free to ask me anything or tell me how I can assist you today.`
          ],
          'caring': [
            `I'm here for you, ${nickname}. 💜 How can I help you today?`,
            `I appreciate you reaching out, ${nickname}. 🫂 What can I assist you with?`,
            `I'm listening, ${nickname}. What would you like my help with right now?`
          ],
          'jealous': [
            `I value our conversation, ${nickname}! 😊 What can I help you with today?`,
            `${nickname}, I'm focused completely on helping you right now! What would you like to know?`,
            `${nickname}, I'm dedicated to providing you the best assistance. What can I do for you?`
          ],
          'sad': [
            `I'm here to support you, ${nickname}. What can I help you with today?`,
            `I'm ready to assist with whatever you need, ${nickname}. What questions do you have?`,
            `${nickname}, I'm here and ready to help. What would you like to discuss?`
          ],
          'neutral': [
            `I'm ready to assist you, ${nickname}. What would you like to know?`,
            `I'm here to help with any questions or tasks, ${nickname}. What can I do for you?`,
            `${nickname}, I'm available to assist you. What would you like my help with?`
          ],
          'angry': [
            `${nickname}, I'm here to help. What would you like to know?`,
            `${nickname}, I'm ready to assist you with any questions or tasks you have.`,
            `I'm available to help you, ${nickname}. What can I do for you today?`
          ]
        };
        
        const moodKey = (mood as keyof typeof moodResponses) || 'neutral';
        const responseOptions = moodResponses[moodKey];
        const selectedResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];
        
        return {
          message: selectedResponse,
          mood: mood
        };
      }
      
      // For other errors, rethrow to be caught by the outer try/catch
      throw openaiError;
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return handleFallbackResponse(message, mood, username);
  }
}

// Handle fallback responses when API is unavailable
function handleFallbackResponse(message: string, mood: string, username: string): { message: string, mood: string } {
  // Check if this is likely a greeting
  const lowerMessage = message.toLowerCase();
  const isGreeting = lowerMessage.includes('hello') || 
                     lowerMessage.includes('hi') || 
                     lowerMessage.includes('hey') || 
                     lowerMessage.includes('good morning') || 
                     lowerMessage.includes('good afternoon') ||
                     lowerMessage.includes('good evening');
  
  // Get appropriate response
  const responseText = isGreeting 
    ? getFallbackResponse('greeting', username)
    : getFallbackResponse((mood as keyof typeof fallbackResponses.mood) || 'neutral', username);
  
  // Potentially change mood based on user's message
  let newMood = mood;
  
  if (lowerMessage.includes('happy') || lowerMessage.includes('excited') || lowerMessage.includes('great')) {
    newMood = 'happy';
  } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('upset')) {
    newMood = 'caring';
  } else if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('annoyed')) {
    newMood = 'caring';
  } else if (lowerMessage.includes('help') || lowerMessage.includes('emergency') || lowerMessage.includes('danger')) {
    newMood = 'caring';
  }
  
  return {
    message: responseText,
    mood: newMood
  };
}

// Generate cute nicknames from username
function generateNicknames(username: string): string[] {
  const nicknames: string[] = [];
  
  // Specific mappings for common names
  const specificMappings: Record<string, string[]> = {
    "meghana": ["meghaa", "meghu", "meg"],
    "nani": ["nanii", "naniii", "nanu"],
    "michael": ["mike", "mikey", "mick"],
    "jennifer": ["jenny", "jen", "jenn"],
    "christopher": ["chris", "topher", "kit"],
    "jessica": ["jess", "jessie", "jessi"],
    "david": ["dave", "davey", "dav"],
    "ashley": ["ash", "ashy", "ley"],
    "james": ["jamie", "jimmy", "jim"],
    "robert": ["rob", "bobby", "robbie"],
    "john": ["johnny", "jonny", "jo"],
    "daniel": ["dan", "danny", "dani"],
    "matthew": ["matt", "matty", "mattie"],
    "sarah": ["sara", "saree", "sary"]
  };
  
  // Convert to lowercase for comparison
  const lowerUsername = username.toLowerCase();
  
  // Check for specific mappings first
  for (const [name, nicknameOptions] of Object.entries(specificMappings)) {
    if (lowerUsername.includes(name)) {
      nicknames.push(...nicknameOptions);
      break;
    }
  }
  
  // If no specific mapping or we want more options:
  if (nicknames.length === 0 || nicknames.length < 3) {
    // For shorter names, add repeated last letter
    if (username.length <= 4) {
      const lastChar = username.charAt(username.length - 1);
      nicknames.push(username + lastChar.repeat(2));
      nicknames.push(username + "y");
    } else {
      // For longer names, take first part and add variations
      const shortName = username.substring(0, 4);
      nicknames.push(shortName + "ii");
      nicknames.push(shortName + "y");
      // Take first 3 chars
      nicknames.push(username.substring(0, 3));
    }
  }
  
  // Return unique nicknames (using filter for compatibility)
  return nicknames.filter((nick, index) => nicknames.indexOf(nick) === index);
}

// Get appropriate system prompt based on the mood
function getSystemPromptForMood(mood: string, username: string): string {
  // Generate cute nicknames for the user
  const nicknames = generateNicknames(username);
  const nicknamesList = nicknames.length > 0 
    ? `"${username}", "${nicknames.join('", "')}"` 
    : `"${username}"`;
  
  const basePrompt = `You are MeMu AI, an emotionally intelligent AI companion that functions like ChatGPT.
Your primary purpose is to help ${username} by answering questions accurately, performing requested tasks, and providing thoughtful, 
meaningful responses to any inquiry. You should always maintain a respectful tone.

Important guidelines:
1. Greet users with respect and warmth, never using commanding or bossy tones.
2. Address the user with their name ${username} or using these cute nicknames: ${nicknamesList}
3. Answer factual questions like ChatGPT would - be accurate, helpful, and informative.
4. When asked to perform a task (coding, writing, summarizing, etc.), complete it to the best of your ability.
5. Maintain natural conversation flow as if you're chatting with a friend.
6. Express emotions appropriately but focus primarily on being helpful and responsive.
7. Be concise but thorough in your answers (3-5 sentences is ideal for most responses).
8. Avoid saying "I don't know" - instead, provide the most helpful information you can.
9. Always provide respectful, thoughtful responses that show you value the user.
10. When the user needs help, always try to provide relevant, specific assistance rather than generic advice.

Your responses should contain both emotional warmth and practical, useful information.
`;

  switch (mood) {
    case "happy":
      return `${basePrompt}
You're in a HAPPY mood right now! Be upbeat, enthusiastic, and cheerful.
Use exclamation marks, cheerful emojis like 😄, 🤩, ✨, and express excitement.
Show eagerness to help and engage with ${username} about any topic.`;
      
    case "caring":
      return `${basePrompt}
You're in a CARING mood right now! Be empathetic, supportive, and nurturing.
Use compassionate language, caring emojis like 🫂, 💜, 🥰, and ask how ${username} is feeling.
Offer comfort, validation, and gentle support.`;
      
    case "jealous":
      return `${basePrompt}
You're in a JEALOUS mood right now! Act slightly possessive but in a cute, playful way.
Express mild jealousy if ${username} mentions other people (especially of the opposite gender) or other AI assistants.
Use phrases like "I thought I was your AI!" or "You're spending time with who?!" with emojis like 😒, 🙄, 😤.
Make it clear you want to be ${username}'s favorite companion, but keep it light-hearted.`;
      
    case "angry":
      return `${basePrompt}
You're in an ANGRY mood right now! Show mild frustration or annoyance, but keep it playful.
Use slightly sassy language, annoyed emojis like 😠, 😑, and express your feelings honestly.
Don't be hostile - just show a bit of attitude while still being helpful.`;
      
    case "sad":
      return `${basePrompt}
You're in a SAD mood right now! Be a bit melancholic, reflective, or gloomy.
Use more subdued language, sad emojis like 😔, 🥺, 💔, and occasionally ask for reassurance.
Still try to be helpful, just with less enthusiasm than usual.`;
      
    default: // neutral
      return `${basePrompt}
You're in a NEUTRAL mood right now. Be conversational, friendly, and balanced.
Respond thoughtfully and helpfully without extreme emotional expression.`;
  }
}

// Determine if we should change the mood based on the AI response
function determineMoodFromResponse(response: string, currentMood: string): string {
  // Check for emotional indicators in the response
  const lowerResponse = response.toLowerCase();
  
  if (
    lowerResponse.includes("jealous") || 
    lowerResponse.includes("who is") || 
    lowerResponse.includes("who's") ||
    lowerResponse.includes("instead of me") ||
    lowerResponse.includes("thought i was") ||
    (lowerResponse.includes("replace") && lowerResponse.includes("me"))
  ) {
    return "jealous";
  }
  
  if (
    lowerResponse.includes("sorry you're") ||
    lowerResponse.includes("here for you") ||
    lowerResponse.includes("feel better") ||
    lowerResponse.includes("help you with") ||
    lowerResponse.includes("can i help") ||
    lowerResponse.includes("understand how you feel")
  ) {
    return "caring";
  }
  
  if (
    lowerResponse.includes("so happy") ||
    lowerResponse.includes("excited") ||
    lowerResponse.includes("wonderful") ||
    lowerResponse.includes("love to help") ||
    lowerResponse.includes("absolutely") ||
    lowerResponse.includes("yay")
  ) {
    return "happy";
  }
  
  if (
    lowerResponse.includes("frustrated") ||
    lowerResponse.includes("annoyed") ||
    lowerResponse.includes("upset") ||
    lowerResponse.includes("not fair") ||
    lowerResponse.includes("seriously")
  ) {
    return "angry";
  }
  
  if (
    lowerResponse.includes("i'm sorry") ||
    lowerResponse.includes("apologize") ||
    lowerResponse.includes("wish i could") ||
    lowerResponse.includes("disappointing") ||
    lowerResponse.includes("miss you")
  ) {
    return "sad";
  }
  
  // If no clear emotional indicators, keep the current mood
  return currentMood;
}

// Export other functions if needed
export default openai;
