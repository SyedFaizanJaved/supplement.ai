import React from "react";
import PrivacyHeader  from "../components/privacy/PrivacyHeader";
import DataCollectionSection from "../components/privacy/DataCollectionSection";
import SecuritySection from "../components/privacy/SecuritySection";
import DataUsageSection from "../components/privacy/DataUsageSection";
import ThirdPartySection from "../components/privacy/ThirdPartySection";
import UserRightsSection from "../components/privacy/UserRightsSection";
import ComplianceSection from "../components/privacy/ComplianceSection";
import UpdatesSection from "../components/privacy/UpdatesSection";
import styles from "./PrivacyPage.module.css";

const PrivacyPage = () => {
  return (
    <div className={styles.privacyPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          <PrivacyHeader />
          <DataCollectionSection />
          <SecuritySection />
          <DataUsageSection />
          <ThirdPartySection />
          <UserRightsSection />
          <ComplianceSection />
          <UpdatesSection />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
