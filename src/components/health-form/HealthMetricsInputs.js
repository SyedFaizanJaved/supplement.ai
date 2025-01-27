import React from 'react';
import { BasicMetricsInputs } from "./metrics/BasicMetricsInputs";
import { ActivityLevelSelect } from "./metrics/ActivityLevelSelect";
import { MedicalInfoInputs } from "./metrics/MedicalInfoInputs";
import styles from './HealthMetricsInputs.module.css';

export const HealthMetricsInputs = ({ form }) => {
  return (
    <div className={styles.container}>
      <BasicMetricsInputs form={form} />
      <ActivityLevelSelect 
        value={form.getValues("activityLevel")} 
        onValueChange={(value) => form.setValue("activityLevel", value)} 
      />
      <MedicalInfoInputs form={form} />
    </div>
  );
};