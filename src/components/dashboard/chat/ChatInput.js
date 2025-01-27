import React, { useState, useRef } from "react";
import { Send, Paperclip, Loader2, X } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { useToast } from "../../hooks/use-toast";
import styles from './ChatInput.module.css';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('health_files')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('health_files')
        .insert({
          user_id: user.id,
          filename: selectedFile.name,
          file_path: filePath,
          file_type: selectedFile.type,
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and will be processed shortly.",
      });

      onSendMessage(`I've uploaded a file: ${selectedFile.name}`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      {selectedFile && (
        <div className={styles.selectedFile}>
          <span className={styles.fileName}>{selectedFile.name}</span>
          <button
            className={styles.ghostButton}
            onClick={() => {
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          >
            <X className={styles.icon} />
          </button>
          <button
            className={styles.uploadButton}
            onClick={handleFileUpload}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className={`${styles.icon} ${styles.spin}`} />
            ) : (
              "Upload"
            )}
          </button>
        </div>
      )}
      <div className={styles.inputContainer}>
        <div className={styles.fileInputWrapper}>
          <input
            type="file"
            className={styles.hiddenInput}
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.txt,.csv"
          />
          <button
            className={styles.attachButton}
            disabled={isLoading || uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className={styles.icon} />
          </button>
        </div>
        <input
          className={styles.messageInput}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isLoading) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isLoading || uploading}
        />
        <button
          className={styles.sendButton}
          onClick={handleSubmit}
          disabled={isLoading || uploading}
        >
          {isLoading ? (
            <Loader2 className={`${styles.icon} ${styles.spin}`} />
          ) : (
            <Send className={styles.icon} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;