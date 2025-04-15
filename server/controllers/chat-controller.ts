import { Request, Response } from 'express';
import { generateAIResponse } from '../openai';
import { MoodType } from '@shared/schema';

// Simple in-memory chat history for context
// In a production app, this would be stored in a database
const chatHistories: Record<string, { role: "user" | "assistant", content: string }[]> = {};

export async function handleChatMessage(req: Request, res: Response) {
  try {
    const { message, mood, user = 'Friend', sessionId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get or initialize chat history for this session
    if (!chatHistories[sessionId]) {
      chatHistories[sessionId] = [];
    }
    
    // Add user message to history
    chatHistories[sessionId].push({ 
      role: "user", 
      content: message 
    });
    
    // Generate AI response
    const response = await generateAIResponse(
      message, 
      mood || 'neutral', 
      user,
      chatHistories[sessionId]
    );
    
    // Add AI response to history
    chatHistories[sessionId].push({ 
      role: "assistant", 
      content: response.message 
    });
    
    // Trim history if it gets too long
    if (chatHistories[sessionId].length > 50) {
      chatHistories[sessionId] = chatHistories[sessionId].slice(-50);
    }
    
    return res.json(response);
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response',
      message: "I'm having trouble connecting. Can you try again?",
      mood: "sad"
    });
  }
}

export async function clearChatHistory(req: Request, res: Response) {
  try {
    const { sessionId = 'default' } = req.body;
    
    if (chatHistories[sessionId]) {
      chatHistories[sessionId] = [];
    }
    
    return res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return res.status(500).json({ error: 'Failed to clear chat history' });
  }
}

export async function detectEmergency(req: Request, res: Response) {
  try {
    const { message, location } = req.body;
    
    // In a real implementation, this would analyze the message for emergency phrases
    // and potentially trigger alerts or notifications
    
    const isEmergency = 
      message.toLowerCase().includes('emergency') || 
      message.toLowerCase().includes('help me') ||
      message.toLowerCase().includes('in danger');
    
    if (isEmergency && location) {
      // In a real app, this would send the location to emergency contacts
      return res.json({ 
        isEmergency: true,
        message: "I've alerted your emergency contacts and shared your location. Help is on the way. Are you okay?",
        mood: "caring"
      });
    } else if (isEmergency) {
      return res.json({
        isEmergency: true,
        message: "This seems like an emergency. Would you like me to share your location with your emergency contacts?",
        mood: "caring",
        requiresLocationConfirmation: true
      });
    }
    
    return res.json({ isEmergency: false });
  } catch (error) {
    console.error('Error detecting emergency:', error);
    return res.status(500).json({ error: 'Failed to process emergency detection' });
  }
}
