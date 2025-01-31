import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import styles from './ChatInput.module.css';

export const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const getSubmitButtonClasses = () => {
    const baseClasses = [styles.submitButton];
    if (message.trim() && !isLoading) {
      baseClasses.push(styles.activeSubmitButton);
    } else {
      baseClasses.push(styles.inactiveSubmitButton);
    }
    return baseClasses.join(' ');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <Button
          type="button"
          className={styles.attachButton}
        >
          <PaperclipIcon className={styles.attachIcon} />
        </Button>
        
        <Input
          type="text"
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
        />
        
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={getSubmitButtonClasses()}
        >
          <SendIcon className={styles.sendIcon} />       
        </Button>
      </div>
    </form>
  );
};