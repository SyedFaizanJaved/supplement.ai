import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { useHealthChat } from "../hooks/useHealthChat";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import styles from "./HealthAssistant.module.css";
import API_URL from "../../config";

const quickReplies = [
  {
    text: "Review my supplement plan",
    category: "supplements",
    description: "Check your personalized supplement recommendations",
  },
  {
    text: "Log my daily journal",
    category: "journal",
    description: "Track your daily health and wellness activities",
  },
  {
    text: "Check my health metrics",
    category: "metrics",
    description: "View your latest health data and progress",
  },
  {
    text: "Set new health goals",
    category: "goals",
    description: "Create or update your wellness objectives",
  },
];

export const HealthAssistant = () => {
  const { chatHistory, isLoading, isTyping, handleSendMessage, clearHistory } = useHealthChat();
  const scrollAreaRef = useRef(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // State to hold the user's first name from the profile API
  const [firstName, setFirstName] = useState("");

  // Fetch the user profile on component mount and extract first_name,
  // including the Bearer token in the header.
  useEffect(() => {
    const fetchProfile = async () => {
      // Only attempt fetching if the token is available.
      if (!user?.token) {
        console.warn("No authentication token available");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/v1/users/profile/`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setFirstName(data.first_name);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, [user?.token]);

  // Scroll to the bottom whenever chat history updates or assistant is typing
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleClearChat = async () => {
    try {
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
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.backgroundOverlay}>
          <div className={`${styles.backgroundGradient} ${styles.animationOne}`}></div>
          <div className={`${styles.backgroundGradient} ${styles.animationTwo}`}></div>
          <div className={`${styles.backgroundGradient} ${styles.animationThree}`}></div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              <h2 className={styles.title}>
                {firstName
                  ? `Welcome ${firstName} to Your Health Journey`
                  : "Welcome to Your Health Journey"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className={styles.clearButton}
            >
              <Trash2 className={styles.trashIcon} />
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
                <div className={styles.quickReplyCardBackground} />
                <h3 className={styles.quickReplyTitle}>{reply.text}</h3>
                <p className={styles.quickReplyDescription}>{reply.description}</p>
              </Card>
            ))}
          </div>
        )}

        <ScrollArea className={styles.scrollArea} ref={scrollAreaRef}>
          <div className={styles.chatMessages}>
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
                <Loader2 className={styles.loaderIcon} />
                <span className={styles.typingText}>Assistant is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className={styles.chatInputContainer}>
          <div className={styles.chatInputWrapper}>
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </Card>
    </div>
  );
};
