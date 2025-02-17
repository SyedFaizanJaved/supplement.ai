import React, { useState } from "react";
import { FormField, FormItem, FormLabel } from "../../ui/form";
import { BubbleOption } from "../BubbleOption";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { X } from "lucide-react";
import styles from "./HealthGoalsStep.module.css";

const healthGoalOptions = [
  {
    value: "weight_management",
    label: "Weight Management",
    description: "Support healthy weight goals",
  },
  {
    value: "energy_focus",
    label: "Energy & Focus",
    description: "Improve daily energy levels and mental clarity",
  },
  {
    value: "immune_support",
    label: "Immune Support",
    description: "Strengthen immune system function",
  },
  {
    value: "sleep_stress",
    label: "Sleep & Stress",
    description: "Better sleep quality and stress management",
  },
  {
    value: "fitness_performance",
    label: "Fitness Performance",
    description: "Enhance workout results and recovery",
  },
  {
    value: "mental_health",
    label: "Mental Health",
    description: "Support cognitive function and emotional well-being",
  },
  {
    value: "hormone_balance",
    label: "Hormone Balance",
    description: "Optimize hormone levels naturally",
  },
  {
    value: "longevity",
    label: "Longevity",
    description: "Support healthy aging and cellular health",
  },
  {
    value: "chronic_conditions",
    label: "Manage Chronic Conditions",
    description: "Support overall health with existing conditions",
  },
  {
    value: "beauty",
    label: "Beauty & Aesthetics",
    description: "Support skin health and natural beauty from within",
  },
];
export const HealthGoalsStep = ({ form }) => {
  const [newGoal, setNewGoal] = useState("");
  const otherHealthGoals = form.watch("otherHealthGoals") || [];

  const handleAddCustomGoal = () => {
    if (newGoal.trim()) {
      const currentGoals = form.getValues("otherHealthGoals") || [];
      form.setValue("otherHealthGoals", [...currentGoals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  React.useEffect(() => {
    console.log("FORM_STATE", form.getValues("otherHealthGoals"));
  }, [newGoal]);

  const handleRemoveCustomGoal = (index) => {
    const currentGoals = form.getValues("otherHealthGoals") || [];
    const updatedGoals = currentGoals.filter((_, i) => i !== index);
    form.setValue("otherHealthGoals", updatedGoals);
  };

  return (
    <div className={styles.container}>
      <FormField
        control={form.control}
        name="healthGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What are your health goals? (atleast one option required)
            </FormLabel>
            <div className={styles.goalsGrid}>
              {healthGoalOptions.map((option) => (
                <BubbleOption
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  isSelected={(field.value || []).includes(option.value)}
                  onClick={() => {
                    const current = field.value || [];
                    const updated = current.includes(option.value)
                      ? current.filter((value) => value !== option.value)
                      : [...current, option.value];
                    field.onChange(updated);
                  }}
                />
              ))}
            </div>
          </FormItem>
        )}
      />

      <div className={styles.customGoalsSection}>
        <FormLabel>Other Health Goals</FormLabel>
        <div className={styles.customGoalInput}>
          <Input
            placeholder="Enter a custom health goal"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustomGoal();
              }
            }}
          />
          <button
            className={styles.addbutton}
            type="button"
            onClick={handleAddCustomGoal}
          >
            Add
          </button>
        </div>
        <div className={styles.customGoalsList}>
          {otherHealthGoals.map((goal, index) => (
            <div key={index} className={styles.customGoalItem}>
              <span>{goal}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCustomGoal(index)}
              >
                <X className={styles.removeIcon} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {form.getValues("otherHealthGoals").length <= 0 &&
        form.getValues("healthGoals").length <= 0 && (
          <p className={styles.errorMessage}>
            Please select at least one health goal
          </p>
        )}
    </div>
  );
};
