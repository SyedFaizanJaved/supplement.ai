import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { QuickReplies } from "./QuickReplies";
import ChatInput  from "./chat/ChatInput";
import { useHealthChat } from "../hooks/useHealthChat";
import { Bot, Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../integrations/supabase/client";
import styles from './HealthAssistant.module.css';

const quickReplies = [
  {
    text: "Review my supplement plan",
    category: "supplements",
    description: "Check your personalized supplement recommendations"
  },
  {
    text: "Log my daily journal",
    category: "journal",
    description: "Track your daily health and wellness activities"
  },
  {
    text: "Check my health metrics",
    category: "metrics",
    description: "View your latest health data and progress"
  },
  {
    text: "Set new health goals",
    category: "goals",
    description: "Create or update your wellness objectives"
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
    <Card className={styles.mainCard}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.botIconContainer}>
            <div className={styles.botIcon}>
              <Bot className={styles.botSvg} />
            </div>
            <div className={styles.titleContainer}>
              <h2 className={styles.title}>
                Welcome to Your Health Journey
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className={styles.clearButton}
          >
            <Trash2 className={styles.trashIcon} />
            <span className={styles.srOnly}>Clear chat</span>
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
        <div className={styles.messagesContainer}>
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
              <Loader2 className={styles.loadingSpinner} />
              <span className={styles.typingText}>Assistant is thinking...</span>
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