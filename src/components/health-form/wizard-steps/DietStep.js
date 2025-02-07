import React from 'react';
import { FormField, FormItem, FormLabel } from "../../ui/form";
import { BubbleOption } from "../BubbleOption";
import styles from './DietStep.module.css';

export const DietStep = ({ form }) => {
  const dietOptions = [
    { value: "vegan_vegetarian", label: "Vegan/Vegetarian" },
    { value: "animal_based", label: "Animal Based" },
    { value: "keto", label: "Keto" },
    { value: "processed_food", label: "Fast/Processed Food Often" },
    { value: "balanced", label: "A fair average diet" },
    {
      value: "healthy_balanced",
      label: "Healthy, minimally processed with protein and fruits and vegetables often",
    },
  ];

  return (
    <FormField
      control={form.control}
      name="dietType"
      render={({ field }) => (
        <FormItem className={styles.formItem}>
          <FormLabel>What is your current diet?</FormLabel>
          <div className={styles.dietGrid}>
            {dietOptions.map((diet) => (
              <BubbleOption
                key={diet.value}
                label={diet.label}
                isSelected={field.value === diet.value}
                onClick={() => field.onChange(diet.value)}
              />
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};