import React from "react";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import styles from "./PrivacyHeader.module.css";

const PrivacyHeader = () => {
  const navigate = useNavigate();
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className={styles.headerContainer}>
      <div className={styles.navigationContainer}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowLeft /> Back
        </button>
      </div>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last Updated: {lastUpdated}</p>
    </div>
  );
};

export default PrivacyHeader;
