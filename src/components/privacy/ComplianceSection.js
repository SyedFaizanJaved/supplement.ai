import React from "react";
import styles from "./ComplianceSection.module.css";

const ComplianceSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>6. Compliance</h2>

      <h3 className={styles.subheading}>HIPAA</h3>
      <p className={styles.paragraph}>
        We strive to meet or exceed Health Insurance Portability and Accountability Act (HIPAA) standards if and where applicable, particularly regarding the safeguarding of Protected Health Information (PHI).
      </p>

      <h3 className={styles.subheading}>GDPR</h3>
      <p className={styles.paragraph}>
        If you are located in the European Union (EU), we comply with the General Data Protection Regulation (GDPR) regarding your rights to access, rectify, erase, or restrict processing of your data.
      </p>

      <h3 className={styles.subheading}>CCPA</h3>
      <p className={styles.paragraph}>
        If you are a California resident, we comply with the California Consumer Privacy Act (CCPA). You have the right to know what personal information we collect and to request deletion of your data.
      </p>

      <h3 className={styles.subheading}>Medical Information Privacy Standards</h3>
      <p className={styles.paragraph}>
        We follow industry best practices and guidelines to ensure the privacy of medical information is protected.
      </p>
    </section>
  );
};

export default ComplianceSection;
