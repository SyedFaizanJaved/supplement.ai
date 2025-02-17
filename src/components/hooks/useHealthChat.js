import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./use-toast";
import { persistMessage } from "../../api/chatApi";
import API_URL from "../../config";
import { refreshToken as refreshTokenAPI } from "../../pages/Login";

// Updated helper function to convert escape sequences and remove unwanted characters
const unescapeText = (text) => {
  let result = text;
  // Convert known escape sequences to their actual characters
  result = result
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'");
  // Remove any remaining backslashes
  result = result.replace(/\\/g, "");
  return result;
};

export const useHealthChat = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your personal health assistant. How can I help!",
      timestamp: new Date().toISOString(),
    },
  ]);

  // Fetch the chat history when the hook is mounted.
  useEffect(() => {
    const fetchChatHistory = async () => {
      let token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${API_URL}/api/v1/assistant/chat-history/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.data.history &&
          response.data.history.history &&
          Array.isArray(response.data.history.history)
        ) {
          setChatHistory(response.data.history.history);
        }
      } catch (error) {
        // Refresh token logic if token is invalid.
        if (error.response?.data?.code === "token_not_valid") {
          const refresh = localStorage.getItem("refreshToken");
          if (refresh) {
            const refreshResult = await refreshTokenAPI(refresh);
            if (refreshResult.access) {
              localStorage.setItem("accessToken", refreshResult.access);
              token = refreshResult.access;
              const response = await axios.get(
                `${API_URL}/api/v1/assistant/chat-history/`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (
                response.data.history &&
                response.data.history.history &&
                Array.isArray(response.data.history.history)
              ) {
                setChatHistory(response.data.history.history);
              }
            } else {
              toast({
                title: "Error",
                description: "Failed to refresh access token.",
                variant: "destructive",
              });
            }
          }
        } else {
          console.error("Failed to fetch chat history:", error);
          toast({
            title: "Error",
            description: "Unable to load history",
            variant: "destructive",
          });
        }
      }
    };

    fetchChatHistory();
  }, [toast]);

  // Clear chat history from server and local state.
  const clearHistory = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${API_URL}/api/v1/assistant/clear-chat-history/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        const refresh = localStorage.getItem("refreshToken");
        if (refresh) {
          const refreshResult = await refreshTokenAPI(refresh);
          if (refreshResult.access) {
            localStorage.setItem("accessToken", refreshResult.access);
            token = refreshResult.access;
            await axios.delete(
              `${API_URL}/api/v1/assistant/clear-chat-history/`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            throw new Error("Failed to refresh access token.");
          }
        } else {
          throw new Error("No refresh token available.");
        }
      } else {
        throw error;
      }
    }
    // After successfully clearing history on the server, reset local state.
    setChatHistory([
      {
        role: "assistant",
        content: "Hi! I'm your personal health assistant. How can I help!",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      // Optionally, persist the user's message.
      persistMessage(userMessage).catch(console.error);
      setIsTyping(true);

      let token = localStorage.getItem("accessToken");

      // Helper function to make the API call.
      const makeRequest = async (authToken) => {
        return await axios.post(
          `${API_URL}/api/v1/assistant/chat/`,
          { user_query: message },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      };

      let response;
      try {
        response = await makeRequest(token);
      } catch (error) {
        if (error.response?.data?.code === "token_not_valid") {
          const refresh = localStorage.getItem("refreshToken");
          if (refresh) {
            const refreshResult = await refreshTokenAPI(refresh);
            if (refreshResult.access) {
              localStorage.setItem("accessToken", refreshResult.access);
              token = refreshResult.access;
              response = await makeRequest(token);
            } else {
              throw new Error("Failed to refresh access token.");
            }
          } else {
            throw new Error("No refresh token available.");
          }
        } else {
          throw error;
        }
      }

      // Unescape the text from the response.
      const rawReply = response.data.msg || "Sorry, no response was returned.";
      const assistantReply = unescapeText(rawReply);

      const assistantMessage = {
        role: "assistant",
        content: assistantReply,
        timestamp: new Date().toISOString(),
      };

      persistMessage(assistantMessage).catch(console.error);
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "I'm having trouble processing your request. Please try again.",
        variant: "destructive",
      });
      const errorMessage = {
        role: "assistant",
        content:
          "I apologize, but I'm having trouble accessing the information right now. Please try asking your question again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
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
    clearHistory,
  };
};
