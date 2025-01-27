import React from 'react';
import { HealthDataForm } from "../components/HealthDataForm";
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from './InputPage.module.css';
import { StepWizard } from '../components/health-form/StepWizard';

const InputPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="outline"
            size="sm"
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft />
            Back
          </Button>
        </div>
        <StepWizard />
      </div>
    </div>
  );
};

export default InputPage;