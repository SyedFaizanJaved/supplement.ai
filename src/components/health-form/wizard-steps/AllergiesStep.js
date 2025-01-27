import React, { useState } from 'react';
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { BubbleOption } from "../BubbleOption";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../../ui/form";
import { Badge } from "../../ui/badge";
import { X } from "lucide-react";
import styles from './AllergiesStep.module.css';

const ALLERGY_OPTIONS = [
  "No Allergies",
  "Seasonal",
  "Dairy",
  "Gluten",
  "Shellfish",
  "Nuts",
  "Latex"
];

export const AllergiesStep = ({ form }) => {
  const [otherAllergies, setOtherAllergies] = useState("");
  const allergies = form.watch("allergies") || [];

  const handleAllergyChange = (allergy, checked) => {
    if (allergy === "No Allergies") {
      if (checked) {
        form.setValue("allergies", []);
      }
      return;
    }

    const currentAllergies = form.getValues("allergies") || [];
    if (checked) {
      form.setValue("allergies", [...currentAllergies, allergy]);
    } else {
      form.setValue(
        "allergies",
        currentAllergies.filter((a) => a !== allergy)
      );
    }
  };

  const handleOtherAllergyAdd = () => {
    if (otherAllergies.trim()) {
      const currentAllergies = form.getValues("allergies") || [];
      form.setValue("allergies", [...currentAllergies, otherAllergies.trim()]);
      setOtherAllergies("");
    }
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    const currentAllergies = form.getValues("allergies") || [];
    form.setValue(
      "allergies",
      currentAllergies.filter((allergy) => allergy !== allergyToRemove)
    );
  };

  const hasNoAllergies = allergies.length === 0;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.heading}>Do you have any allergies?</h2>
        
        <div className={styles.allergyGrid}>
          <BubbleOption
            label="I don't have any allergies"
            isSelected={hasNoAllergies}
            onClick={() => handleAllergyChange("No Allergies", !hasNoAllergies)}
          />
          
          {!hasNoAllergies && ALLERGY_OPTIONS.slice(1).map((allergy) => (
            <BubbleOption
              key={allergy}
              label={allergy}
              isSelected={allergies.includes(allergy)}
              onClick={() => handleAllergyChange(allergy, !allergies.includes(allergy))}
            />
          ))}
        </div>

        {!hasNoAllergies && (
          <>
            <div className={styles.otherAllergiesSection}>
              <Label>Other Allergies</Label>
              <div className={styles.otherAllergiesInput}>
                <Input
                  value={otherAllergies}
                  onChange={(e) => setOtherAllergies(e.target.value)}
                  placeholder="Enter other allergy"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleOtherAllergyAdd();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleOtherAllergyAdd}
                  className={styles.addButton}
                >
                  Add
                </button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="allergies"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className={styles.allergiesBadgeContainer}>
                      {allergies.map((allergy, index) => (
                        <Badge
                          key={index}
                          className={styles.allergyBadge}
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergy(allergy)}
                            className={styles.removeBadgeButton}
                          >
                            <X className={styles.removeIcon} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
};