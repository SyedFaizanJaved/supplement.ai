import { Dna } from "lucide-react";
import styles from "./styles.module.css";

const GCGeneCard = ({ name, impact, risk_allele, snp }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Dna className={styles.icon} />
        <h3 className={styles.title}>{name}</h3>
      </div>
      <div className={styles.content}>
        <p className={styles.impact}>
          <span className={styles.label}>Impact</span>
          {impact}
        </p>
        <div className={styles.infoWrapper}>
          <p className={styles.info}>
            <span className={styles.label}>Risk Allele</span>
            {risk_allele}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>SNP</span>
            {snp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GCGeneCard;
