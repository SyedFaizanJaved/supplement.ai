import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useToast } from "../hooks/use-toast";
import { healthFormSchema } from "../schemas/healthFormSchema";
import { submitHealthFormData } from "../utils/healthFormSubmission";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PersonalInfoStep } from "./wizard-steps/PersonalInfoStep";
import { HealthMetricsStep } from "./wizard-steps/HealthMetricsStep";
import { ActivityLevelStep } from "./wizard-steps/ActivityLevelStep";
import { HealthGoalsStep } from "./wizard-steps/HealthGoalsStep";
import { AllergiesStep } from "./wizard-steps/AllergiesStep";
import { MedicalConditionsStep } from "./wizard-steps/MedicalConditionsStep";
import { MedicationsStep } from "./wizard-steps/MedicationsStep";
import { DietStep } from "./wizard-steps/DietStep";
import { LifestyleStep } from "./wizard-steps/LifestyleStep";
import { TestResultsStep } from "./wizard-steps/TestResultsStep";
import { BudgetStep } from "./wizard-steps/BudgetStep";
import { FinalStep } from "./wizard-steps/FinalStep";
import styles from './StepWizard.module.css';

const steps = [
  "Personal Information",
  "Health Metrics", 
  "Activity Level",
  "Health Goals",
  "Allergies",
  "Medical Conditions",
  "Medications",
  "Diet",
  "Lifestyle",
  "Test Results",
  "Monthly Budget",
  "Review & Submit",
];

export const StepWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(healthFormSchema),
    mode: "onChange",
    defaultValues: {
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
    },
  });

  const handleSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await submitHealthFormData(data);

      toast({
        title: "Success!",
        description: "Please complete the payment to create your account.",
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      const encodedEmail = encodeURIComponent(data.email);
      navigate(`/payment?email=${encodedEmail}`, { replace: true });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ["firstName", "lastName", "email", "phoneNumber", "password"];
      case 1:
        return ["age", "gender", "height", "weight"];
      case 2:
        return ["activityLevel"];
      case 3:
        return ["healthGoals", "otherHealthGoals"];
      case 4:
        return ["allergies"];
      case 5:
        return ["medicalConditions"];
      case 6:
        return ["currentMedications"];
      case 7:
        return ["dietType"];
      case 8:
        return ["sleepHours", "smokingStatus", "alcoholConsumption"];
      case 9:
        return ["hasBloodwork", "hasGeneticTesting"];
      case 10:
        return ["monthlyBudget"];
      default:
        return [];
    }
  };

  const validateCurrentStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      return true;
    }
    
    return false;
  };

  const handleNextOrSubmit = async () => {
    if (currentStep === steps.length - 1) {
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please check all fields are filled correctly.",
          variant: "destructive",
        });
      }
    } else {
      await validateCurrentStep();
    }
  };

  const renderStep = () => {
    const formData = form.getValues();
    
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep form={form} />;
      case 1:
        return <HealthMetricsStep form={form} />;
      case 2:
        return <ActivityLevelStep form={form} />;
      case 3:
        return <HealthGoalsStep form={form} />;
      case 4:
        return <AllergiesStep form={form} />;
      case 5:
        return <MedicalConditionsStep form={form} />;
      case 6:
        return <MedicationsStep form={form} />;
      case 7:
        return <DietStep form={form} />;
      case 8:
        return <LifestyleStep form={form} />;
      case 9:
        return <TestResultsStep form={form} />;
      case 10:
        return <BudgetStep form={form} />;
      case 11:
        return (
          <FinalStep 
            form={form} 
            formData={formData} 
            isSubmitting={isSubmitting} 
            onSubmit={() => form.handleSubmit(handleSubmit)()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.headerContainer}>
        <h2 className={styles.stepTitle}>
          {steps[currentStep]}
        </h2>
        <div className={styles.progressBar}>
          {steps.map((_, index) => (
            <div
              key={index}
              className={`${styles.progressStep} ${
                index <= currentStep ? styles.activeStep : styles.inactiveStep
              }`}
            />
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className={styles.formContainer}>
          {renderStep()}

          <div className={styles.navigationContainer}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
              disabled={currentStep === 0}
              className={styles.previousButton}
            >
              <ArrowLeft className={styles.buttonIcon} />
              Previous
            </Button>

            {currentStep < steps.length - 1 && (
              <Button
                type="button"
                onClick={handleNextOrSubmit}
                className={styles.nextButton}
              >
                Next
                <ArrowRight className={styles.buttonIcon} />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
};