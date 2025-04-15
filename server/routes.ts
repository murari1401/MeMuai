import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { handleChatMessage, clearChatHistory, detectEmergency } from "./controllers/chat-controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API routes
  app.post('/api/chat/message', handleChatMessage);
  app.post('/api/chat/clear', clearChatHistory);
  app.post('/api/chat/emergency', detectEmergency);
  
  // User routes
  app.get('/api/user', async (req, res) => {
    // This would normally check for authentication
    // For demo, we'll return a default user
    res.json({
      nickname: 'Boss',
      avatarStyle: 'cute_female',
      voicePreference: 'female_warm',
      emergencyContacts: []
    });
  });
  
  // Update user preferences
  app.post('/api/user/preferences', async (req, res) => {
    // This would normally update user data in the database
    // For demo, we'll just return success
    res.json({
      success: true,
      user: {
        ...req.body
      }
    });
  });
  
  // Emergency contacts routes
  app.post('/api/user/emergency-contacts', async (req, res) => {
    // This would normally add an emergency contact to the database
    // For demo, we'll just return success
    res.json({
      success: true,
      contact: {
        id: Date.now().toString(),
        ...req.body
      }
    });
  });
  
  app.delete('/api/user/emergency-contacts/:id', async (req, res) => {
    // This would normally delete the contact from the database
    // For demo, we'll just return success
    res.json({
      success: true,
      id: req.params.id
    });
  });
  
  // Emergency location sharing
  app.post('/api/emergency/share-location', async (req, res) => {
    // This would normally share location with emergency contacts
    // For demo, we'll just return success
    res.json({
      success: true,
      message: "Location shared successfully"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
