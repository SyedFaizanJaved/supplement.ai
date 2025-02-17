import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { BubbleOption } from "../BubbleOption";
import styles from "./LifestyleStep.module.css";

export const LifestyleStep = ({ form }) => {
  const smokingOptions = [
    { value: "non_smoker", label: "Non-smoker" },
    { value: "former_smoker", label: "Former smoker" },
    { value: "current_smoker", label: "Current smoker" },
    { value: "vaper", label: "Vaper" },
  ];

  const alcoholOptions = [
    { value: "none", label: "None" },
    { value: "occasional", label: "Occasional (1-2 drinks/week)" },
    { value: "moderate", label: "Moderate (3-7 drinks/week)" },
    { value: "frequent", label: "Frequent (8+ drinks/week)" },
  ];

  return (
    <div className={styles.container}>
      <FormField
        control={form.control}
        name="sleepHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Average Sleep (hours per night)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="Enter average sleep hours"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="smokingStatus"
        render={({ field }) => (
          <FormItem className={styles.bubbleContainer}>
            <FormLabel>Smoking/Vaping Status</FormLabel>
            <div className={styles.optionsGrid}>
              {smokingOptions.map((option) => (
                <BubbleOption
                  key={option.value}
                  label={option.label}
                  isSelected={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                />
              ))}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="alcoholConsumption"
        render={({ field }) => (
          <FormItem className={styles.bubbleContainer}>
            <FormLabel>Alcohol Consumption</FormLabel>
            <div className={styles.optionsGrid}>
              {alcoholOptions.map((option) => (
                <BubbleOption
                  key={option.value}
                  label={option.label}
                  isSelected={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
