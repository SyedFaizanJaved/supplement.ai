// FormSection.js
import React from 'react';
import styles from './FormSection.module.css';

export const FormSection = ({ title, description, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};