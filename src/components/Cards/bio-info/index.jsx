import { Activity } from "lucide-react";
import styles from "./styles.module.css";

const TSHCard = ({ bioName, currentValue, normalValue }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Activity className={styles.icon} />
        <h3 className={styles.title}>{bioName}</h3>
      </div>
      <div className={styles.content}>
        <div className={styles.valueWrapper}>
          <span className={styles.label}>Current Value</span>
          <span className={styles.value}>{currentValue}</span>
        </div>
        <div className={styles.normalWrapper}>
          <span className={styles.label}>Normal Range</span>
          <span className={styles.normal}>{normalValue}</span>
        </div>
      </div>
    </div>
  );
};

export default TSHCard;
