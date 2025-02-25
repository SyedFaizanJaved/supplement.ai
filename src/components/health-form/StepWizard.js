import { checkEmailPhone } from "../../services/auth/index";
import { registerUser } from "../../services/registrationService";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { useToast } from "../hooks/use-toast";
import { healthFormSchema } from "../schemas/healthFormSchema";
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
import FamilyPlanPage from "../../pages/FamilyPlanPage";
import { useAuth } from "../../context/AuthContext";
import styles from "./StepWizard.module.css";

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
  "Family Plan (Optional)",
  "Review & Submit",
];

const stepFieldMapping = [
  ["firstName", "lastName", "email", "phoneNumber", "password"],
  ["age", "gender", "height", "weight"],
  ["activityLevel"],
  ["healthGoals"],
  ["allergies"],
  ["medicalConditions"],
  ["currentMedications"],
  ["dietType"],
  ["sleepHours"],
  ["bloodWorkFiles", "geneticTestFiles"],
  ["monthlyBudget"],
  [],
  [],
];

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  age: "",
  gender: "male",
  height: "",
  family: [],
  weight: "",
  concerns: "",
  activityLevel: "sedentary",
  medicalConditions: [],
  allergies: [],
  currentMedications: [],
  bloodWorkFiles: [],
  geneticTestFiles: [],
  healthGoals: [],
  otherHealthGoals: [],
  monthlyBudget: "",
  dietType: "healthy_balanced",
  sleepHours: "",
  smokingStatus: "non_smoker",
  alcoholConsumption: "none",
};

const StepWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [familyMembers, setFamilyMembers] = useState([]);
  const { login: authLogin } = useAuth();

  const form = useForm({
    resolver: zodResolver(healthFormSchema),
    defaultValues,
  });

  useEffect(() => {
    form.setValue("family", familyMembers);
  }, [familyMembers, form]);

  const handleAddFamilyMember = (member) => {
    setFamilyMembers([...familyMembers, member]);
  };

  const handleUpdateFamilyMember = (updatedMember) => {
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  const handleRemoveFamilyMember = (id) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  const handleNext = async () => {
    // Explicit email and password validation
    const fieldsToValidate = stepFieldMapping[currentStep] || [];
    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) {
      return;
    }

    if (currentStep === 0) {
      const formData = form.getValues();
      try {
        await checkEmailPhone(formData.email, formData.phoneNumber);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } catch (error) {
        const errorData = error.response?.data;
        let errorMsg = "Error validating email/phone.";
        if (errorData) {
          if (errorData.email && errorData.phone_number) {
            errorMsg = "Email and phone number already exist";
          } else {
            const emailError = errorData.email
              ? errorData.email.join(", ")
              : "";
            const phoneError = errorData.phone_number
              ? errorData.phone_number.join(", ")
              : "";
            errorMsg =
              [emailError, phoneError].filter(Boolean).join(" | ") || errorMsg;
          }
        }
        toast({
          title: errorMsg,
          variant: "destructive",
        });
        return;
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleSubmit = async () => {
    const data = form.getValues();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const validFamilyMembers = familyMembers.filter(
        (member) =>
          member.first_name.trim() !== "" &&
          member.last_name.trim() !== "" &&
          member.email.trim() !== "" &&
          member.status === "Unregistered" &&
          member.joined_at === null
      );
      const formattedData = {
        ...data,
        family: validFamilyMembers.map(({ first_name, last_name, email }) => ({
          first_name,
          last_name,
          email,
          status: "Unregistered",
          joined_at: null,
        })),
      };

      await registerUser(formattedData);

      // authLogin(userDataWithFirstName);

      toast({
        title: "Registration successful",
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/login");
    } catch (error) {
      console.log("error:", error);
      toast({
        title: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
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
          <FamilyPlanPage
            familyMembers={familyMembers}
            onAddFamilyMember={handleAddFamilyMember}
            onUpdateFamilyMember={handleUpdateFamilyMember}
            onRemoveFamilyMember={handleRemoveFamilyMember}
          />
        );
      case 12:
        return <FinalStep isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.headerContainer}>
          <h2 className={styles.title}>{steps[currentStep]}</h2>
          <div className={styles.progressBar}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.progressStep} ${
                  index <= currentStep ? styles.progressStepActive : ""
                }`}
              />
            ))}
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className={styles.form}
          >
            <div className={styles.stepContent}>{renderStep()}</div>

            <div className={styles.buttonContainer}>
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
                  onClick={handleNext}
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
    </div>
  );
};

export default StepWizard;
