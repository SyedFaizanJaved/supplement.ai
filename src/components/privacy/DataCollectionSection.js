import React from "react";
import styles from "./DataCollectionSection.module.css";

const DataCollectionSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>1. Data Collection</h2>
      <p className={styles.paragraph}>
        We collect the following types of personal and health-related information to provide and improve our Service:
      </p>

      <h3 className={styles.subHeading}>Personal Information</h3>
      <ul className={styles.list}>
        <li>Name</li>
        <li>Email address</li>
        <li>Age</li>
        <li>Gender</li>
      </ul>

      <h3 className={styles.subHeading}>Health Data</h3>
      <ul className={styles.list}>
        <li>Medical conditions</li>
        <li>Current medications</li>
        <li>Allergies</li>
        <li>Health goals</li>
      </ul>

      <h3 className={styles.subHeading}>Lab Test Results</h3>
      <ul className={styles.list}>
        <li>Blood test data</li>
        <li>Other relevant health metrics as provided by the user</li>
      </ul>

      <h3 className={styles.subHeading}>Payment Information</h3>
      <ul className={styles.list}>
        <li>Payment details (handled by Stripe)</li>
        <li>Billing address (if applicable)</li>
      </ul>

      <h3 className={styles.subHeading}>Usage Data and Analytics</h3>
      <ul className={styles.list}>
        <li>Website usage patterns (pages visited, time spent on pages)</li>
        <li>Device information (IP address, browser type)</li>
        <li>Cookies and similar tracking technologies for analytics</li>
      </ul>
    </section>
  );
};

export default DataCollectionSection;
