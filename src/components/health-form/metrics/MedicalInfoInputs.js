import React from "react";
import { Textarea } from "../../ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import styles from './MedicalInfoInputs.module.css';

export const MedicalInfoInputs = ({ form }) => {
  return (
    <div className={styles.container}>
      {/* <FormField
        control={form.control}
        name="healthStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Health Status</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={styles.textarea}
                placeholder="List any Heath issue e.g,Smoking, Alcohol Use, Stress levels"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}

      <FormField
        control={form.control}
        name="medicalConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Medical Conditions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={styles.textarea}
                placeholder="List any current medical conditions"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allergies</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={styles.textarea}
                placeholder="List any allergies or existing conditions you have"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dietRestrictions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diet Restrictions</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={styles.textarea}
                placeholder="List any diet restrictions"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentMedications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Medications</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={styles.textarea}
                placeholder="List any medications you're currently taking"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="currentSupplementPlan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Supplement Plan (if any)</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className={styles.textarea}
                placeholder="List your current supplement plan"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};