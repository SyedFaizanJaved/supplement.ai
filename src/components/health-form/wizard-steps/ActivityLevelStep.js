import React from "react";
import { FormField, FormItem, FormLabel } from "../../ui/form";
import { BubbleOption } from "../BubbleOption";
import styles from "./ActivityLevelStep.module.css";

export const ActivityLevelStep = ({ form }) => {
  const activityLevels = [
    {
      value: "sedentary",
      label: "Sedentary",
      description: "Little to no regular exercise",
    },
    {
      value: "moderate",
      label: "Moderately Active",
      description: "Light exercise 1-3 times per week",
    },
    {
      value: "active",
      label: "Active",
      description: "Moderate exercise 3-5 times per week",
    },
    {
      value: "athlete",
      label: "Very Active",
      description: "Intense exercise 6-7 times per week",
    },
  ];

  return (
    <FormField
      control={form.control}
      name="activityLevel"
      render={({ field }) => (
        <FormItem className={styles.formItem}>
          <FormLabel>What is your activity level?</FormLabel>
          <div className={styles.gridContainer}>
            {activityLevels.map((level) => (
              <BubbleOption
                key={level.value}
                label={level.label}
                description={level.description}
                isSelected={field.value === level.value}
                onClick={() => field.onChange(level.value)}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};