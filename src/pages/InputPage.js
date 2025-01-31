import React from "react";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StepWizard } from "../components/health-form/StepWizard";
import styles from './InputPage.module.css';

const InputPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className={styles.backIcon} />
          Back
        </Button>
        <StepWizard />
      </div>
    </div>
  );
};

export default InputPage;