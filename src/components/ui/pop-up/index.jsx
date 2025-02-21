"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { Copy } from "lucide-react";
const ReferralPopup = ({ isOpen, onClose, referralCode, children }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
      setTimeout(() => onClose(), 600);
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Referral Code</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={styles.codeContainer}>
          <span className={styles.code}>{referralCode}</span>
          <button className={styles.copyButton} onClick={copyToClipboard}>
            <Copy />
          </button>
        </div>
        {copied && (
          <p className={styles.successMessage}>Copied to clipboard!</p>
        )}
      </div>
    </div>
  );
};

export default ReferralPopup;
