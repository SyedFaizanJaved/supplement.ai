// BubbleOption.jsx
import React from 'react';
import styles from './BubbleOption.module.css';

export const BubbleOption = ({ label, description, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.bubbleButton} ${isSelected ? styles.selected : ''}`}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.label}>{label}</div>
        {description && (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </button>
  );
};