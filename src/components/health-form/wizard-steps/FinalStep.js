import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from './FinalStep.module.css';

export const FinalStep = (props) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const navigate = useNavigate();

    const handleCheckboxChange = (event) => {
        setAcceptedTerms(event.target.checked);
    };

    const handleFamilyPlanNavigation = () => {
        navigate('/family-plan');
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

            <Button 
                onClick={handleFamilyPlanNavigation}
                disabled={!acceptedTerms}
                className={styles.familyButton}
            >
                <Users className={styles.buttonIcon} />
                Want to help your family too?
            </Button>
        </div>
    );
};