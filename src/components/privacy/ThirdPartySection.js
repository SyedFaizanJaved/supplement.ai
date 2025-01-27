import React from "react";
import styles from "./ThirdPartySection.module.css";

const ThirdPartySection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>4. Third-Party Services</h2>
      <p className={styles.paragraph}>To provide and enhance our Service, we work with trusted third-party providers:</p>
      
      <div className={styles.content}>
        <div>
          <h3 className={styles.subHeading}>Data Storage & Authentication</h3>
          <p className={styles.paragraph}>We use secure, industry-standard platforms for storing and managing user data with enterprise-grade security measures.</p>
        </div>

        <div>
          <h3 className={styles.subHeading}>Payment Processing</h3>
          <p className={styles.paragraph}>
            For payment processing, we partner with Stripe, a leading payment service provider. Stripe's privacy policy can be found at{" "}
            <a href="https://stripe.com/privacy" className={styles.link} target="_blank" rel="noopener noreferrer">stripe.com/privacy</a>
          </p>
        </div>

        <div>
          <h3 className={styles.subHeading}>Health Recommendations</h3>
          <p className={styles.paragraph}>
            Our proprietary health recommendation system uses advanced technology to analyze your health data and create personalized recommendations. We maintain strict data privacy and security standards throughout this process.
          </p>
        </div>

        <div>
          <h3 className={styles.subHeading}>Cloud Infrastructure</h3>
          <p className={styles.paragraph}>We utilize enterprise-grade cloud infrastructure for secure data processing and storage, ensuring high availability and compliance with industry standards.</p>
        </div>
      </div>
    </section>
  );
};

export default ThirdPartySection;
