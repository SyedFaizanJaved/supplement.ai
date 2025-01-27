import React, { useState } from "react";
import styles from "./HealthDataForm.module.css";
import { Button } from "./ui/button";
// import { Card } from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";
import { PersonalInfoInputs } from "./health-form/PersonalInfoInputs";
import { HealthMetricsInputs } from "./health-form/HealthMetricsInputs";
import TestInformationInputs from "./health-form/TestInformationInputs";
import { BiomarkerInputs } from "./health-form/BiomarkerInputs";
import { HealthGoalsInput } from "./health-form/HealthGoalsInput";
import { useToast } from "./hooks/use-toast";
import { submitHealthFormData } from "./utils/healthFormSubmission";
import { Loader2, CheckCircle2, Users } from "lucide-react";
import { Input } from "./ui/input";

export const HealthDataForm = ({ isFamilyPlan = false }) => {
  const { toast } = useToast();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "sedentary",
    medicalConditions: [],
    allergies: [],
    currentMedications: [],
    hasBloodwork: false,
    hasGeneticTesting: false,
    healthGoals: [],
    otherHealthGoals: [],
    monthlyBudget: "",
    dietType: "healthy_balanced",
    sleepHours: "",
    smokingStatus: "non_smoker",
    alcoholConsumption: "none",
  });

  const handleFormChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive"
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await submitHealthFormData(formData);

      toast({
        title: "Success!",
        description: "Please complete the payment to create your account."
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      const encodedEmail = encodeURIComponent(formData.email);
      window.location.href = `/payment?email=${encodedEmail}`;
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting the form. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isFamilyPlan ? "Create Family Account" : "Create Your Account"}
        </h2>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        <div className={styles.section}>
          <h3>Personal Information</h3>
          <PersonalInfoInputs 
            formData={formData} 
            onChange={handleFormChange} 
          />
        </div>

        <div className={styles.section}>
          <h3>Health Metrics</h3>
          <HealthMetricsInputs 
            formData={formData} 
            onChange={handleFormChange} 
          />
        </div>

        <div className={styles.section}>
          <h3>Test Results</h3>
          <TestInformationInputs 
            formData={formData}
            onTestChange={(field, value) => handleFormChange(field, value)}
          />
          <BiomarkerInputs 
            onChange={(biomarkers) => {
              console.log("Biomarkers updated:", biomarkers);
            }}
          />
        </div>

        <div className={styles.section}>
          <h3>Health Goals</h3>
          <HealthGoalsInput 
            formData={formData}
            onChange={(goals) => handleFormChange("healthGoals", goals)}
          />
        </div>

        <div className={styles.section}>
          <h3>Monthly Budget</h3>
          <div>
            <label>Monthly Budget (USD)</label>
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Enter your monthly budget"
              value={formData.monthlyBudget}
              onChange={(e) => handleFormChange("monthlyBudget", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.termsSection}>
          <div className={styles.checkboxContainer}>
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked)}
            />
            <label htmlFor="terms">
              I accept the{" "}
              <a href="/terms">terms and conditions</a>
            </label>
          </div>

          {!isFamilyPlan && (
            <Button
              type="button"
              onClick={() => window.location.href = '/family-plan'}
            >
              <Users />
              Want to help your family too?
            </Button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !acceptedTerms}
        >
          {isSubmitting ? (
            <div>
              <Loader2 />
              Processing...
            </div>
          ) : (
            <div>
              <CheckCircle2 />
              Continue to Payment
            </div>
          )}
        </Button>
      </form>
    </div>
  );
};