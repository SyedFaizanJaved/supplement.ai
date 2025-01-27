import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import styles from './ChatMessage.module.css';

export const ChatMessage = ({ role, content, timestamp }) => {
  const cleanMarkdown = (text) => {
    return text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[\d+(?:,\s*\d+)*\]/g, '')
      .trim();
  };

  const createClickableLinks = (text) => {
    const markdownLinkPattern = /\[(.*?)\]\((.*?)\)/g;
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    let processedText = text.replace(markdownLinkPattern, (match, linkText, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${styles.link}">${linkText.trim()}</a>`;
    });
    
    processedText = processedText.replace(urlPattern, (url) => {
      if (!url.includes('</a>')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${styles.link}">${url}</a>`;
      }
      return url;
    });
    
    return processedText;
  };

  const formatContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = cleanMarkdown(line);
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
        return (
          <li 
            key={index} 
            className={styles.listItem}
            dangerouslySetInnerHTML={{
              __html: createClickableLinks(trimmedLine.substring(1).trim())
            }}
          />
        );
      }
      return (
        <p 
          key={index} 
          className={trimmedLine ? styles.paragraph : styles.emptyParagraph}
          dangerouslySetInnerHTML={{
            __html: createClickableLinks(trimmedLine)
          }}
        />
      );
    });
  };

  return (
    <div className={`${styles.chatMessage} ${role === "user" ? styles.userMessage : styles.assistantMessage}`}>
      <div className={`${styles.messageContainer} ${role === "user" ? styles.userContainer : styles.assistantContainer}`}>
        <Avatar className={styles.avatar}>
          {role === "user" ? (
            <>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/lovable-uploads/1.png" />
              <AvatarFallback>AI</AvatarFallback>
            </>
          )}
        </Avatar>
        <div>
          <div className={`${styles.messageContent} ${role === "user" ? styles.userContent : styles.assistantContent} ${content === "Hi! I'm your personal health assistant. How can I help!" ? styles.introMessage : ''}`}>
            <div className={styles.prose}>
              {formatContent(content)}
            </div>
          </div>
          <div className={styles.timestampContainer}>
            <span className={styles.timestamp}>
              {format(new Date(timestamp), "h:mm a")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};