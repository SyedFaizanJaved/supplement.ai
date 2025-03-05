import React from "react";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StepWizard from "../components/health-form/StepWizard";
import styles from "./InputPage.module.css";

const InputPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className={styles.backButton}
          >
            <ChevronLeft className={styles.backIcon} />
            Back
          </Button>
          <img
            src="/lovable-uploads/logo.png"
            alt="SupplementScribe Logo"
            className={styles.logo}
          />
        </div>
        <div className={styles.content}>
          <StepWizard />
        </div>
      </div>
    </div>
  );
};

export default InputPage;
