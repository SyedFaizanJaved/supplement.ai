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
  {
    label: "Seasonal",
  },
  {
    label: "Insect Stings",
  },
  {
    label: "Dairy",
  },
  {
    label: "Gluten",
  },
  {
    label: "Shellfish",
  },
  {
    label: "Nuts",
  },
  {
    label: "Latex",
  }
];

export const AllergiesStep = ({ form }) => {
  const [otherAllergies, setOtherAllergies] = useState("");
  const allergies = form.watch("allergies") || [];
  const hasNoAllergies = form.watch("hasNoAllergies") || false;

  const handleAllergyChange = (allergyLabel, checked) => {
    if (allergyLabel === "No Allergies") {
      const newHasNoAllergies = !hasNoAllergies;
      form.setValue("hasNoAllergies", newHasNoAllergies);
      if (newHasNoAllergies) {
        form.setValue("allergies", []);
      }
      return;
    }

    const currentAllergies = form.getValues("allergies") || [];
    if (checked) {
      form.setValue("hasNoAllergies", false);
      form.setValue("allergies", [...currentAllergies, allergyLabel]);
    } else {
      form.setValue(
        "allergies",
        currentAllergies.filter((a) => a !== allergyLabel)
      );
    }
  };

  const handleOtherAllergyAdd = () => {
    if (otherAllergies.trim() && !hasNoAllergies) {
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

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.heading}>Do you have any allergies?</h2>
        
        <div className={styles.allergyMainGrid}>
          <BubbleOption
            label="I don't have any allergies"
            isSelected={hasNoAllergies}
            onClick={() => handleAllergyChange("No Allergies", !hasNoAllergies)}
            className={styles.noAllergiesOption}
          />
          
          <div className={styles.allergyOptionsGrid}>
            {!hasNoAllergies && ALLERGY_OPTIONS.map(({ label, description }) => (
              <BubbleOption
                key={label}
                label={label}
                description={description}
                isSelected={allergies.includes(label)}
                onClick={() => handleAllergyChange(label, !allergies.includes(label))}
                disabled={hasNoAllergies}
                className={styles.allergyOption}
              />
            ))}
          </div>
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

export default AllergiesStep;