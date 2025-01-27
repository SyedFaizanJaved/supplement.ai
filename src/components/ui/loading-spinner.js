import React from "react";
import { Loader2 } from "lucide-react";
import styles from './loading-spinner.module.css';

export const LoadingSpinner = ({ className = "" }) => {
  return (
    <div className={styles['spinner-wrapper']}>
      <Loader2 className={`${styles.spinner} ${className}`} />
    </div>
  );
};