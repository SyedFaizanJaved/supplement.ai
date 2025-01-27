import React from "react";
import { useNavigate } from "react-router-dom";

import { ArrowLeft } from "lucide-react";
import styles from "./TermsandConditions.module.css";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <ArrowLeft />
        Back
      </button>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Terms and Conditions</h1>
            <p className={styles.lastUpdated}>Last Updated: January 21, 2025</p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.text}>
              By accessing and using this website, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Use License</h2>
            <p className={styles.text}>
              Permission is granted to temporarily download one copy of the
              materials (information or software) on our website for personal,
              non-commercial transitory viewing only.
            </p>
            <p className={styles.text}>
              This license shall automatically terminate if you violate any of
              these restrictions and may be terminated by us at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Account</h2>
            <p className={styles.text}>
              To access certain features of the website, you may be required to
              create an account. You are responsible for maintaining the
              confidentiality of your account information.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                You must be at least 18 years old to create an account
              </li>
              <li className={styles.listItem}>
                You are responsible for all activities that occur under your
                account
              </li>
              <li className={styles.listItem}>
                You must notify us immediately of any unauthorized use of your
                account
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Privacy Policy</h2>
            <p className={styles.text}>
              Your use of our website is also governed by our Privacy Policy.
              Please review our Privacy Policy, which also governs the site and
              informs users of our data collection practices.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Disclaimer</h2>
            <p className={styles.text}>
              The materials on our website are provided on an 'as is' basis. We
              make no warranties, expressed or implied, and hereby disclaim and
              negate all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property
              or other violation of rights.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Limitations</h2>
            <p className={styles.text}>
              In no event shall we or our suppliers be liable for any damages
              (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use the materials on our website.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Governing Law</h2>
            <p className={styles.text}>
              These terms and conditions are governed by and construed in
              accordance with the laws of [Your Jurisdiction] and you
              irrevocably submit to the exclusive jurisdiction of the courts in
              that location.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Changes to Terms</h2>
            <p className={styles.text}>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. By continuing to access or use our
              website after those revisions become effective, you agree to be
              bound by the revised terms.
            </p>
          </section>

          <section className={`${styles.section} ${styles.contactSection}`}>
            <h2 className={styles.sectionTitle}>9. Contact Information</h2>
            <p className={styles.text}>
              If you have any questions about these Terms, please contact us at:
              <a href="mailto:support@yourwebsite.com" className={styles.email}>
                support@yourwebsite.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
