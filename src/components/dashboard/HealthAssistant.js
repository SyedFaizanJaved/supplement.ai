import React, { useEffect, useRef } from "react";
import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { QuickReplies } from "./QuickReplies";
import ChatInput from "./chat/ChatInput";
import { useHealthChat } from "../hooks/useHealthChat";
import { Bot, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../integrations/supabase/client";
import styles from './HealthAssistant.module.css';

const quickReplies = [
  {
    text: "Analyze my health data",
    category: "analysis",
    description: "Get insights from your health metrics and lab results"
  },
  {
    text: "View my supplement plan",
    category: "supplements",
    description: "Check your personalized supplement recommendations"
  },
  {
    text: "Tell me about Vitamin D",
    category: "education",
    description: "Learn about important nutrients and supplements"
  },
  {
    text: "Search for magnesium benefits",
    category: "search",
    description: "Discover health benefits of specific nutrients"
  }
];

export const HealthAssistant = () => {
  const { chatHistory, isLoading, isTyping, handleSendMessage, clearHistory } = useHealthChat();
  const scrollAreaRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleClearChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      await clearHistory();
      toast({
        title: "Chat history cleared",
        description: "Your conversation has been reset.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear chat history. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <div className={styles.botIconWrapper}>
              <Bot className={styles.botIcon} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>
                Hello, how can I help?
              </h2>
              <p className={styles.subtitle}>
                I'm your personal health assistant
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className={styles.clearButton}
          >
            <Trash2 className={styles.clearIcon} />
            Clear
          </Button>
        </div>
      </div>

      {chatHistory.length === 0 && (
        <div className={styles.quickRepliesGrid}>
          {quickReplies.map((reply, index) => (
            <Card
              key={index}
              className={styles.quickReplyCard}
              onClick={() => handleSendMessage(reply.text)}
            >
              <h3 className={styles.quickReplyTitle}>
                {reply.text}
              </h3>
              <p className={styles.quickReplyDescription}>
                {reply.description}
              </p>
            </Card>
          ))}
        </div>
      )}

      <ScrollArea 
        className={styles.scrollArea} 
        ref={scrollAreaRef}
      >
        <div className={styles.chatContainer}>
          {chatHistory.map((msg, index) => (
            <ChatMessage 
              key={index} 
              role={msg.role} 
              content={msg.content} 
              timestamp={msg.timestamp || new Date().toISOString()}
            />
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              <Loader2 className={styles.loadingIcon} />
              <span>Assistant is typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </Card>
  );
};