import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useToast } from "./use-toast";

import API_URL from "../../config";
import { refreshToken as refreshTokenAPI } from "../../pages/Login";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    // {
    //   role: "ai",
    //   content: "Hi! I'm your personal health assistant. How can I help!",
    //   timestamp: new Date().toISOString(),
    // },
  ]);

  // Fetch the chat history when the hook is mounted.
  const fetchChatHistory = async () => {
    let token = localStorage.getItem("accessToken");
    try {
      setChatLoading(true);
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
        response.data.chat_history &&
        response.data.chat_history &&
        Array.isArray(response.data.chat_history)
      ) {
        if (response.data.chat_history.length != chatHistory.length) {
          setChatHistory(response.data.chat_history);
        }
        setChatError(false);
        setChatLoading(false);
      }
    } catch (error) {
      setChatError(true);
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const usePolling = (callback, delay, shouldPoll) => {
    const intervalRef = useRef(null);

    useEffect(() => {
      if (!shouldPoll) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      intervalRef.current = setInterval(() => {
        setIsTyping(true);
        callback();
      }, delay);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [callback, delay, shouldPoll]);
  };

  const shouldPoll =
    chatHistory.length > 0 &&
    chatHistory[chatHistory.length - 1]?.role !== "ai";

  useEffect(() => {
    if (chatHistory.length <= 0) return;

    if (chatHistory[chatHistory.length - 1]?.role !== "ai") {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [shouldPoll]);

  usePolling(fetchChatHistory, 5000, shouldPoll);

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
      setChatHistory([]);
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
            localStorage.clear();
            navigate("/login");
          }
        } else {
          localStorage.clear();
          navigate("/login");
        }
      } else {
        throw error;
      }
    }
    // After successfully clearing history on the server, reset local state.
    // setChatHistory([
    //   {
    //     role: "ai",
    //     content: "Hi! I'm your personal health assistant. How can I help!",
    //     timestamp: new Date().toISOString(),
    //   },
    // ]);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = {
      role: "human",
      content: message,
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      // Optionally, persist the user's message.
      // persistMessage(userMessage).catch(console.error);
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

      let response = await makeRequest(token);

      // Unescape the text from the response.
      const rawReply =
        response.data.response || "Sorry, no response was returned.";
      // const assistantReply = unescapeText(rawReply);
      const assistantReply = rawReply;

      const assistantMessage = {
        role: "ai",
        content: assistantReply,
        timestamp: new Date().toISOString(),
      };

      // persistMessage(assistantMessage).catch(console.error);
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "ai",
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
    setChatHistory,
    isLoading,
    chatError,
    chatLoading,
    isTyping,
    handleSendMessage,
    clearHistory,
  };
};
