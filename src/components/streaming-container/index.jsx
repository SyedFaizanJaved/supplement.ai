"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

const cleanMarkdown = (text) => {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "")
    .replace(/\[\d+(?:,\s*\d+)*\]/g, "")
    .trim();
};

const createClickableLinks = (text) => {
  const markdownLinkPattern = /\[(.*?)\]\((.*?)\)/g;
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  let processedText = text.replace(
    markdownLinkPattern,
    (match, linkText, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${
        styles.link
      }">${linkText.trim()}</a>`;
    }
  );

  processedText = processedText.replace(urlPattern, (url) => {
    if (!url.includes("</a>")) {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${styles.link}">${url}</a>`;
    }
    return url;
  });

  return processedText;
};

const formatContent = (text) => {
  const lines = text.split("\n");
  return lines.map((line, index) => {
    const trimmedLine = cleanMarkdown(line);
    if (trimmedLine.startsWith("•") || trimmedLine.startsWith("-")) {
      return (
        <li
          key={index}
          className={styles.listItem}
          dangerouslySetInnerHTML={{
            __html: createClickableLinks(trimmedLine.substring(1).trim()),
          }}
        />
      );
    }
    return (
      <p
        key={index}
        className={trimmedLine ? styles.paragraph : styles.emptyParagraph}
        dangerouslySetInnerHTML={{
          __html: createClickableLinks(trimmedLine),
        }}
      />
    );
  });
};

export default function StreamingResponse({
  content,
  speed = 30,
  className = "",
  handleStreamingStatus,
}) {
  const [displayedContent, setDisplayedContent] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    handleStreamingStatus(!isComplete);
  }, [isComplete]);

  useEffect(() => {
    setDisplayedContent([]);
    setIsComplete(false);

    const formattedContent = formatContent(content);

    let currentIndex = -1;

    const interval = setInterval(() => {
      if (currentIndex < formattedContent.length) {
        setDisplayedContent((prev) => [
          ...prev,
          formattedContent[currentIndex],
        ]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed]);

  return (
    <div className={`${styles.container} ${className}`}>
      {displayedContent.map((element, index) => (
        <div
          key={index}
          className={`${styles.line} ${
            index === displayedContent.length - 1 && !isComplete
              ? styles.animatePulse
              : ""
          }`}
        >
          {element}
        </div>
      ))}
    </div>
  );
}
