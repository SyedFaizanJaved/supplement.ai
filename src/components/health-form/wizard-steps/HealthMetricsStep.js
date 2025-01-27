import React from "react";
import { BasicMetricsInputs } from "../../health-form/metrics/BasicMetricsInputs";
import styles from "./HealthMetricsStep.module.css";

export const HealthMetricsStep = ({ form }) => {
  return (
    <div className={styles.container}>
      <BasicMetricsInputs form={form} />
    </div>
  );
};