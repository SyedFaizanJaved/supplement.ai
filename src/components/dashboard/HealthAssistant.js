import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./chat/ChatInput";
import { useHealthChat } from "../hooks/useHealthChat";
import { Loader2, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../hooks/use-toast";
import styles from "./HealthAssistant.module.css";
import API_URL from "../../config";
import streamingContainer from "../streaming-container";
import { useNavigate } from "react-router";

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

const greeting = [
  {
    role: "ai",
    content: "Hi! I'm your personal health assistant. How can I help!",
    timestamp: new Date().toISOString(),
  },
];
const HealthAssistant = () => {
  const {
    chatHistory,
    isLoading,
    chatError,
    chatLoading,
    isTyping,
    handleSendMessage,
    clearHistory,
    setChatHistory,
  } = useHealthChat();
  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef(null); // This ref will always be attached to the very last element
  const { toast } = useToast();
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [firstName, setFirstName] = useState("");

  // Fetch the user profile on component mount and extract first_name
  useEffect(() => {
    const fetchProfile = async () => {
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
  }, []);



  // Scroll to the last element (message or typing indicator) whenever chatHistory updates or assistant is typing
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatHistory, isTyping, chatLoading]);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 50);

    return () => clearInterval(interval); // Cleanup on unmount or when isStreaming changes
  }, [isStreaming]); // Depend on isStreaming

  const handleClearChat = async () => {
    try {
      await clearHistory();
      toast({
        title: "History cleared",
        // description: "History cleared",
      });
    } catch (error) {
      toast({
        title: "Unable to clear the history",
        // description: "Unable to clear the history",
        variant: "destructive",
      });
    }
  };

  const handleStreamingStatus = (state) => setIsStreaming(state);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.backgroundOverlay}>
          <div
            className={`${styles.backgroundGradient} ${styles.animationOne}`}
          ></div>
          <div
            className={`${styles.backgroundGradient} ${styles.animationTwo}`}
          ></div>
          <div
            className={`${styles.backgroundGradient} ${styles.animationThree}`}
          ></div>
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

        {/* {chatHistory.length === 0 && (
          <div className={styles.quickRepliesGrid}>
            {quickReplies.map((reply, index) => (
              <Card
                key={index}
                className={styles.quickReplyCard}
                onClick={() => handleSendMessage(reply.text)}
              >
                <div className={styles.quickReplyCardBackground} />
                <h3 className={styles.quickReplyTitle}>{reply.text}</h3>
                <p className={styles.quickReplyDescription}>
                  {reply.description}
                </p>
              </Card>
            ))}
          </div>
        )} */}

        <ScrollArea className={styles.scrollArea} ref={scrollAreaRef}>
          <div className={styles.chatMessages}>
            <section>
              {/* Default greetings */}
              {greeting.map((msg, index) => {
                return (
                  <div key={index}>
                    <ChatMessage
                      role={msg.role}
                      content={msg.content}
                      timestamp={msg.timestamp || new Date().toISOString()}
                    />
                  </div>
                );
              })}

              {/* Chat History listing */}
              {chatHistory.map((msg, index) => {
                return (
                  <div
                    key={index}
                    ref={
                      chatHistory.length - 1 === index ? lastMessageRef : null
                    }
                  >
                    {msg && (
                      <ChatMessage
                        handleStreamingStatus={handleStreamingStatus}
                        isLastMessage={chatHistory.length - 1 === index}
                        isChatLoading={chatLoading}
                        isTyping={isTyping}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp || new Date().toISOString()}
                      />
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div ref={lastMessageRef} className={styles.typingIndicator}>
                  <Loader2 className={styles.loaderIcon} />
                  <span className={styles.typingText}>
                    <Loader2 className="animate-spin loader" />
                  </span>
                </div>
              )}
            </section>
          </div>
        </ScrollArea>

        <div className={styles.chatInputContainer}>
          <div className={styles.chatInputWrapper}>
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              isTyping={isTyping}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HealthAssistant;
