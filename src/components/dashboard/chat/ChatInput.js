import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { useState, useRef } from "react";
import styles from "./ChatInput.module.css";

export const ChatInput = ({ onSendMessage, onFileUpload, isLoading }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

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
    return baseClasses.join(" ");
  };

  // Trigger the hidden file input when the attach button is clicked
  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // Handle the file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset the input so the same file can be re-selected if needed
    e.target.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        {/* <Button
          type="button"
          className={styles.attachButton}
          onClick={handleAttachClick}
        >
          <PaperclipIcon className={styles.attachIcon} />
        </Button> */}
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <input
          type="text"
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
        />

        <Button
          type="submit"
          variant="ghost"
          disabled={!message.trim() || isLoading}
          className={getSubmitButtonClasses()}
        >
          <SendIcon />
        </Button>
      </div>
    </form>
  );
};
