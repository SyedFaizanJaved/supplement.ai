import React from 'react';
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import styles from './QuickReplies.module.css';

export const QuickReplies = ({ replies, onSelect, disabled }) => {
  return (
    <ScrollArea className={styles.scrollArea} type="scroll">
      <div className={styles.buttonContainer}>
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(reply)}
            disabled={disabled}
            className={styles.replyButton}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {reply}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};