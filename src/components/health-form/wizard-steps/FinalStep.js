import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Users, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from './FinalStep.module.css';

export const FinalStep = ({ formData, isSubmitting, onSubmit }) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    const handleCheckboxChange = (event) => {
        setAcceptedTerms(event.target.checked);
    };

    const handleFamilyPlanNavigation = () => {
        navigate('/family-plan');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (acceptedTerms) {
            onSubmit();
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
                    type="button"
                    onClick={handleFamilyPlanNavigation}
                    disabled={!acceptedTerms}
                    variant="secondary"
                    className={styles.familyButton}
                >
                    <Users className={styles.buttonIcon} />
                    Want to help your family too?
                </Button>
                
                <Button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={!acceptedTerms || isSubmitting}
                    className={`${styles.submitButton} ${styles.mainButton}`}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className={`${styles.buttonIcon} ${styles.spinningIcon}`} />
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