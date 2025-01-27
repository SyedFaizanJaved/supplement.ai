import React, { useState } from 'react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../hooks/use-toast";
import { PersonalInfoSection } from "./metrics/PersonalInfoSection";
import { HealthStatusSection } from "./metrics/HealthStatusSection";
import { VitaminMetricsSection } from "./metrics/VitaminMetricsSection";
import { LabTestsSection } from "./metrics/LabTestsSection";
import { Share2 } from "lucide-react";
import styles from './HealthMetrics.module.css';

export const HealthMetrics = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    age: "32",
    gender: "male",
    height: "5'10\" (178 cm)",
    weight: "165 lbs (75 kg)",
    exerciseLevel: "medium",
    medications: "- Vitamin D3 (1000 IU)\n- Fish Oil (1000mg)",
    conditions: "- Seasonal allergies\n- Mild hypertension"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved successfully",
      description: "Your health information has been updated.",
    });
  };

  const handleReferFriend = () => {
    toast({
      title: "Coming Soon",
      description: "The referral system will be available soon!",
    });
  };

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Welcome back, John!</h2>
            <p className={styles.subtitle}>
              Here's an overview of your health metrics and goals.
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              variant="outline"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={styles.referButton}
            >
              {isEditing ? "Save Changes" : "Edit Information"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReferFriend}
              className={styles.referButton}
            >
              <Share2 className={styles.referIcon} />
              Refer a Friend
            </Button>
          </div>
        </div>

        <div className={styles.gridContainer}>
          <PersonalInfoSection
            isEditing={isEditing}
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
          <HealthStatusSection
            isEditing={isEditing}
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
        </div>

        <VitaminMetricsSection />
        <LabTestsSection />
      </div>
    </Card>
  );
};