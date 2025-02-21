import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../hooks/use-toast";
import { PersonalInfoSection } from "./metrics/PersonalInfoSection";
import { HealthStatusSection } from "./metrics/HealthStatusSection";
// import { VitaminMetricsSection } from "./metrics/VitaminMetricsSection";
import { Share2 } from "lucide-react";
import styles from "./HealthMetrics.module.css";
import { useAuth } from "../../context/AuthContext";
import LabTestsSection from "./metrics/LabTestsSection";
import Popup from "../ui/pop-up";
// Helper functions.
const processMultilineList = (text) =>
  text
    .split("\n")
    .filter(Boolean)
    .map((item) => item.replace(/^- /, ""));

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const HealthMetrics = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    referral_code: "",
  });

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Store file objects (or null) for lab tests.
  const [labTests, setLabTests] = useState({
    blood_work_test: [],
    genetic_test: [],
  });

  const transformProfileData = useCallback((data) => {
    return {
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      age: data.age?.toString() || "",
      gender: data.gender === "F" ? "female" : "male",
      height:
        data.height_in_feet && data.height_in_inches
          ? `${data.height_in_feet}' ${data.height_in_inches}''`
          : "",
      weight: data.weight ? `${data.weight} lbs` : "",
      exerciseLevel: data.activity_level || "",
      medications: data.current_medications
        ? data.current_medications.map((med) => `- ${med}`).join("\n")
        : "",
      conditions: data.medical_conditions
        ? data.medical_conditions.map((cond) => `- ${cond}`).join("\n")
        : "",
      referral_code: data.referral_code,
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!user?.token) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${BASE_URL}/api/v1/users/profile/`, {
        headers: { Authorization: `Bearer ${user.token}` },
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
  }, []);

  const handleSave = async () => {
    if (!user?.token) return;
    try {
      const heightRegex = /^(\d+)' ?(\d+)''$/;
      const heightMatch = personalInfo.height.match(heightRegex);
      let height_in_feet = 0;
      let height_in_inches = 0;
      if (heightMatch) {
        height_in_feet = parseInt(heightMatch[1], 10);
        height_in_inches = parseInt(heightMatch[2], 10);
      }
      const weightMatch = personalInfo.weight.match(/(\d+(\.\d+)?)/);
      const weightNumber = weightMatch ? parseFloat(weightMatch[0]) : 0;

      const ageNumber = parseInt(personalInfo.age, 10);
      if (ageNumber > 110) {
        toast({
          title: "Invalid Age",
          description: "Age cannot exceed 110 years",
          variant: "destructive",
        });
        return;
      }
      if (
        heightMatch &&
        (height_in_feet > 8 || (height_in_feet === 8 && height_in_inches > 0))
      ) {
        toast({
          title: "Invalid Height",
          description: "Height cannot exceed 8'0''",
          variant: "destructive",
        });
        return;
      }
      if (weightNumber > 600) {
        toast({
          title: "Invalid Weight",
          description: "Weight cannot exceed 600 lbs",
          variant: "destructive",
        });
        return;
      } else if (weightNumber < 40) {
        toast({
          title: "Invalid Weight",
          description: "Weight cannot be less than 40 lbs",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("age", personalInfo.age);
      formData.append("gender", personalInfo.gender === "female" ? "F" : "M");
      formData.append(
        "activity_level",
        personalInfo.exerciseLevel ? capitalize(personalInfo.exerciseLevel) : ""
      );
      formData.append(
        "current_medications",
        JSON.stringify(processMultilineList(personalInfo.medications))
      );
      formData.append(
        "medical_conditions",
        JSON.stringify(processMultilineList(personalInfo.conditions))
      );
      formData.append("height_in_feet", height_in_feet);
      formData.append("height_in_inches", height_in_inches);
      formData.append("weight", weightNumber);

      if (labTests.blood_work_test.length > 0) {
        formData.append("blood_work_test", labTests.blood_work_test[0]);
      }
      if (labTests.genetic_test.length > 0) {
        formData.append("genetic_test", labTests.genetic_test[0]);
      }

      const { data } = await axios.patch(
        `${BASE_URL}/api/v1/users/profile/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPersonalInfo(transformProfileData(data));
      setIsEditing(false);
      toast({
        title: "Changes saved",
        description: "Your health information has been updated",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleReferFriend = () => {
    openPopup();
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
              onClick={handleReferFriend}
              className={styles.referButton}
            >
              <Share2 className={styles.referIcon} /> Refer a Friend
            </Button>
            <Popup
              isOpen={isPopupOpen}
              onClose={() => closePopup()}
              referralCode={personalInfo?.referral_code}
            />
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

        {/* <VitaminMetricsSection /> */}

        <LabTestsSection
          isEditing={isEditing}
          bloodTestFile={labTests.blood_work_test[0] || null}
          geneticTestFile={labTests.genetic_test[0] || null}
          onBloodTestUpload={(file) =>
            setLabTests((prev) => ({
              ...prev,
              blood_work_test: file ? [file] : [],
            }))
          }
          onGeneticTestUpload={(file) =>
            setLabTests((prev) => ({
              ...prev,
              genetic_test: file ? [file] : [],
            }))
          }
        />
      </div>
    </Card>
  );
};
