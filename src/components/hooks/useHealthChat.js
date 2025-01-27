import { useState, useEffect } from "react";
import { useToast } from "./use-toast";
import { useAIChat } from "./useAIChat";
import { fetchChatHistory, persistMessage } from "../../api/chatApi";
import { supabase } from "../integrations/supabase/client";

export const useHealthChat = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([{
    role: "assistant",
    content: "Hi! I'm your personal health assistant. How can I help!",
    timestamp: new Date().toISOString()
  }]);

  const { processAIResponse } = useAIChat();

  const clearHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setChatHistory([{
        role: "assistant",
        content: "Hi! I'm your personal health assistant. How can I help!",
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('Failed to clear chat history:', error);
      throw error;
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const userMessage = { 
      role: "user", 
      content: message,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please sign in to use the chat feature');
      }
      
      persistMessage(userMessage).catch(console.error);
      
      setIsTyping(true);
      
      const response = await processAIResponse(message, user.id);
      
      const assistantMessage = { 
        role: "assistant", 
        content: response,
        timestamp: new Date().toISOString()
      };
      
      persistMessage(assistantMessage).catch(console.error);
      
      setChatHistory(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      toast({
        title: "Error",
        description: error.message || "I'm having trouble processing your request. Please try again.",
        variant: "destructive"
      });
      
      const errorMessage = { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble accessing the information right now. Please try asking your question again in a moment.",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  return {
    chatHistory,
    isLoading,
    isTyping,
    handleSendMessage,
    clearHistory
  };
};