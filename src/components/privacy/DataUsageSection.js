import React from "react";
import styles from "./DataUsageSection.module.css";

const DataUsageSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>3. Data Usage</h2>

      <h3 className={styles.subHeading}>Recommendations</h3>
      <ul className={styles.list}>
        <li>Your health data is processed to generate personalized supplement recommendations.</li>
      </ul>

      <h3 className={styles.subHeading}>AI Processing</h3>
      <ul className={styles.list}>
        <li>We may use OpenAI services to process health information and other data to improve or generate personalized recommendations.</li>
      </ul>

      <h3 className={styles.subHeading}>Payment Processing</h3>
      <ul className={styles.list}>
        <li>We use Stripe to handle all payment transactions. Your payment information is transmitted securely to Stripe and is not stored on our servers.</li>
      </ul>

      <h3 className={styles.subHeading}>Analytics and Service Improvement</h3>
      <ul className={styles.list}>
        <li>We use usage data (e.g., page visits, device data) to analyze user behavior, improve the user experience, and develop new features.</li>
      </ul>
    </section>
  );
};

export default DataUsageSection;
