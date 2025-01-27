// HealthGoalsInput.js
import React from 'react';
import { Textarea } from "../ui/textarea";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useFormContext } from "react-hook-form";
import styles from './HealthGoalsInput.module.css';

export const HealthGoalsInput = ({ formData, onChange }) => {
  const form = useFormContext();
  
  return (
    <FormField
      name="healthGoals"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Health Goals</FormLabel>
          <Textarea
            placeholder="Enter your health goals..."
            className={styles.textarea}
            {...field}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
};