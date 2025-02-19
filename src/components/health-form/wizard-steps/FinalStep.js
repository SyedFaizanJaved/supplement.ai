import React, { useState } from "react";
import { Button } from "../../ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import styles from "./FinalStep.module.css";

export const FinalStep = ({ isSubmitting, onSubmit }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleCheckboxChange = (event) => {
    setAcceptedTerms(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (acceptedTerms && !isSubmitting) {
      try {
        await onSubmit();
      } catch (error) {}
    }
  };

  return (
    <div className={styles.finalStepContainer}>
      <div className={styles.termsCheckbox}>
        <input
          type="checkbox"
          id="terms-checkbox"
          checked={acceptedTerms}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
        <label htmlFor="terms-checkbox" className={styles.checkboxLabel}>
          I accept the terms and conditions
        </label>
      </div>

      <div className={styles.buttonContainer}>
        <Button
          type="submit"
          // onClick={handleSubmit}
          disabled={!acceptedTerms || isSubmitting}
          className={`${styles.submitButton} ${styles.mainButton}`}
        >
          {isSubmitting ? (
            <>
              <Loader2
                className={`${styles.buttonIcon} ${styles.spinningIcon}`}
              />
              Processing...
            </>
          ) : (
            <>
              Continue to Payment
              <ArrowRight className={styles.buttonIcon} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
