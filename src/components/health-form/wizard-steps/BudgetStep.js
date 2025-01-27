import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "../../ui/form";
import styles from './BudgetStep.module.css';

export const BudgetStep = ({ form }) => {
  const budgetOptions = [
    { value: "50", label: "Less than $50/month" },
    { value: "100", label: "Less than $100/month" },
    { value: "150", label: "Less than $150/month" },
    { value: "200", label: "Less than $200/month" },
    { value: "999999", label: "Unlimited" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div>
          <h3 className={styles.heading}>Monthly Supplement Budget</h3>
          <p className={styles.description}>
            Select your preferred monthly budget for supplements. This helps us provide recommendations within your budget.
          </p>
        </div>

        <FormField
          control={form.control}
          name="monthlyBudget"
          render={({ field }) => (
            <FormItem className={styles.formItem}>
              <FormLabel>Monthly Budget</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className={styles.selectTrigger}>
                    <SelectValue placeholder="Select your monthly budget" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={styles.selectContent}>
                  {budgetOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a budget that works for you. You can always adjust this later.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};