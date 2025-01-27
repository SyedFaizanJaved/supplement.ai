import React from 'react';
import { Progress } from "../../ui/progress";
import styles from './VitaminMetricsSection.module.css';

export const VitaminMetricsSection = () => {
  return (
    <div className={styles.gridContainer}>
      <div className={styles.vitaminDCard}>
        <h3 className={styles.vitaminDTitle}>Vitamin D Status</h3>
        <p className={styles.statusText}>
          Current level: 45 ng/mL
          <br />
          Target range: 30-50 ng/mL
        </p>
        <Progress value={75} className={styles.progressBar} />
      </div>
      <div className={styles.b12Card}>
        <h3 className={styles.b12Title}>B12 Status</h3>
        <p className={styles.statusText}>
          Current level: 550 pg/mL
          <br />
          Target range: 400-1000 pg/mL
        </p>
        <Progress value={65} className={styles.progressBar} />
      </div>
      <div className={styles.ironCard}>
        <h3 className={styles.ironTitle}>Iron Status</h3>
        <p className={styles.statusText}>
          Current level: 95 μg/dL
          <br />
          Target range: 60-170 μg/dL
        </p>
        <Progress value={85} className={styles.progressBar} />
      </div>
    </div>
  );
};