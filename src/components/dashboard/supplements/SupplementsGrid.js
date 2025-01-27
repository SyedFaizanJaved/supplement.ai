import { SupplementCard } from "./SupplementCard";
import styles from './SupplementsGrid.module.css';

export const SupplementsGrid = ({ recommendations }) => {
  if (recommendations.length === 0) {
    return (
      <div className={styles.emptyState}>
        No supplement recommendations available yet.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {recommendations.map((supplement) => (
        <SupplementCard
          key={supplement.id}
          id={supplement.id}
          name={supplement.supplement_name}
          dosage={supplement.dosage}
          reason={supplement.reason}
          cost={supplement.estimated_cost}
          companyName={supplement.company_name}
          productUrl={supplement.product_url}
          imageUrl={supplement.image_url}
        />
      ))}
    </div>
  );
};