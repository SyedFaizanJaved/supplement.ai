import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../hooks/use-toast";
import { PersonalInfoSection } from "./metrics/PersonalInfoSection";
import { HealthStatusSection } from "./metrics/HealthStatusSection";
import { VitaminMetricsSection } from "./metrics/VitaminMetricsSection";
import { LabTestsSection } from "./metrics/LabTestsSection";
import { Share2 } from "lucide-react";
import styles from "./HealthMetrics.module.css";
import { useAuth } from "../../context/AuthContext"; // Import the auth hook

export const HealthMetrics = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Get the user and token from AuthContext
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    exerciseLevel: "",
    medications: "",
    conditions: "",
  });

  const transformProfileData = useCallback(
    (data) => ({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      age: data.age?.toString() || "",
      gender: data.gender === "F" ? "female" : "male",
      height:
        data.height_in_feet && data.height_in_inches
          ? `${data.height_in_feet}'${data.height_in_inches}" (${Math.round(
              (data.height_in_feet * 12 + data.height_in_inches) * 2.54
            )} cm)`
          : "",
      weight: data.weight
        ? `${Math.round(data.weight * 2.20462)} lbs (${data.weight} kg)`
        : "",
      exerciseLevel: data.activity_level?.toLowerCase() || "",
      medications:
        data.current_medications?.map((med) => `- ${med}`).join("\n") || "",
      conditions:
        [...(data.medical_conditions || [])]
          .map((cond) => `- ${cond}`)
          .join("\n") || "",
    }),
    []
  );

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/users/profile/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setPersonalInfo(transformProfileData(response.data));
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, transformProfileData, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);


  const handleSave = async () => {
    console.log("check" , personalInfo.medications );
    console.log("check" , personalInfo.conditions );
    try {
      const payload = {
        age: personalInfo.age ,
        gender: personalInfo.gender === "female" ? "F" : "M",
        activity_level: personalInfo.exerciseLevel
          ? personalInfo.exerciseLevel.charAt(0).toUpperCase() +
            personalInfo.exerciseLevel.slice(1)
          : "",
        current_medications: personalInfo.medications
          .split("\n")
          .filter(Boolean)
          .map((med) => med.replace(/^- /, "")),
        medical_conditions: personalInfo.conditions
          .split("\n")
          .filter(Boolean)
          .map((cond) => cond.replace(/^- /, "")),
      };

      console.log("Payload to update:", payload);

      const response = await axios.patch(
        `${BASE_URL}/api/v1/users/profile/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      console.log("Patch response:", response.data);

      await fetchProfile();
      setIsEditing(false);
      toast({
        title: "Changes saved",
        description: "Your profile has been updated",
      });
      setPersonalInfo(transformProfileData(response.data));
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              Welcome back, {personalInfo.first_name || "User"}!
            </h2>
            <p className={styles.subtitle}>
              Here's an overview of your health metrics and goals.
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <Button
              variant="outline"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={styles.referButton}
            >
              {isEditing ? "Save Changes" : "Edit Information"}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: "Coming Soon",
                  description: "The referral system will be available soon!",
                })
              }
              className={styles.referButton}
            >
              <Share2 className={styles.referIcon} /> Refer a Friend
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
