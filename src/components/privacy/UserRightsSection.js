import React from "react";
import styles from "./UserRightsSection.module.css";

const UserRightsSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>5. User Rights</h2>
      <p className={styles.paragraph}>We respect your rights regarding the personal data we hold about you:</p>
      
      <ul className={styles.list}>
        <li><strong>Access Your Personal Data</strong> - Request a copy of your personal data and health information stored in our systems.</li>
        <li><strong>Delete Your Account and Data</strong> - Request deletion of your account and associated personal information at any time.</li>
        <li><strong>Update Your Information</strong> - Correct or update any personal information if it is inaccurate or incomplete.</li>
        <li><strong>Data Portability</strong> - Receive your personal data in a structured, commonly used, and machine-readable format where applicable.</li>
      </ul>
    </section>
  );
};

export default UserRightsSection;
