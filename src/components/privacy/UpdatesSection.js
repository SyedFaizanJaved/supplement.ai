import React from "react";
import styles from "./UpdatesSection.module.css";

const UpdatesSection = () => {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>8. Changes to This Privacy Policy</h2>
      <p className={styles.paragraph}>
        We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
        operational, legal, or regulatory reasons. When we update the policy, we will revise the "Last Updated" 
        date at the top of this page. We encourage you to review this policy periodically to stay informed 
        about how we protect your data.
      </p>

      <div className={styles.noticeBox}>
        <p className={styles.noticeText}>
          By using our Service, you acknowledge that you have read and understood this Privacy Policy. 
          If you do not agree with any part of this Policy, you should discontinue the use of our Service.
        </p>
      </div>
    </section>
  );
};

export default UpdatesSection;
