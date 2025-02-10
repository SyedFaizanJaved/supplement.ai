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
import { useAuth } from "../../context/AuthContext";

// Returns headers with authentication token.
const getAuthHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Converts a multiline text block (with each line optionally starting with "- ") into a list.
const processMultilineList = (text) =>
  text.split("\n").filter(Boolean).map((item) => item.replace(/^- /, ""));

// Capitalizes the first letter of a string.
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const HealthMetrics = () => {
  const { toast } = useToast();
  const { user } = useAuth();
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

  // Transform fetched profile data into display-friendly values.
  const transformProfileData = useCallback((data) => {
    return {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      age: data.age?.toString() || "",
      gender: data.gender === "F" ? "female" : "male",
      // Format height as "X' Y''" if both values exist.
      height:
        data.height_in_feet && data.height_in_inches
          ? `${data.height_in_feet}' ${data.height_in_inches}''`
          : "",
      // Format weight as "### lbs"
      weight: data.weight ? `${data.weight} lbs` : "",
      exerciseLevel: data.activity_level
        ? data.activity_level.toLowerCase()
        : "",
      medications: data.current_medications
        ? data.current_medications.map((med) => `- ${med}`).join("\n")
        : "",
      conditions: data.medical_conditions
        ? data.medical_conditions.map((cond) => `- ${cond}`).join("\n")
        : "",
    };
  }, []);

  // Fetch the user's profile data.
  const fetchProfile = useCallback(async () => {
    if (!user?.token) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/users/profile/`, {
        headers: getAuthHeaders(user.token),
      });
      setPersonalInfo(transformProfileData(data));
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast, transformProfileData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Save updated profile data.
  const handleSave = async () => {
    if (!user?.token) return;
    try {
      // Parse height: expected format "X' Y''"
      const heightRegex = /^(\d+)' ?(\d+)''$/;
      const heightMatch = personalInfo.height.match(heightRegex);
      let height_in_feet = 0;
      let height_in_inches = 0;
      if (heightMatch) {
        height_in_feet = parseInt(heightMatch[1], 10);
        height_in_inches = parseInt(heightMatch[2], 10);
      }
      // Extract a number from the weight field.
      const weightMatch = personalInfo.weight.match(/(\d+(\.\d+)?)/);
      const weightNumber = weightMatch ? parseFloat(weightMatch[0]) : 0;

      const payload = {
        age: personalInfo.age,
        gender: personalInfo.gender === "female" ? "F" : "M",
        activity_level: personalInfo.exerciseLevel
          ? capitalize(personalInfo.exerciseLevel)
          : "",
        current_medications: processMultilineList(personalInfo.medications),
        medical_conditions: processMultilineList(personalInfo.conditions),
        height_in_feet,
        height_in_inches,
        weight: weightNumber,
      };

      const { data } = await axios.patch(
        `${BASE_URL}/api/v1/users/profile/`,
        payload,
        {
          headers: getAuthHeaders(user.token),
        }
      );

      setPersonalInfo(transformProfileData(data));
      setIsEditing(false);
      toast({
        title: "Changes saved",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to save changes",
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
                  description:
                    "The referral system will be available soon!",
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
