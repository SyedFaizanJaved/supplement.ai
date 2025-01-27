import React from 'react';
import SupplementCard from "./SupplementCard";
import styles from './SupplementsGrid.module.css';

const SupplementsGrid = ({ recommendations }) => {
  if (!recommendations?.length) {
    return (
      <div className={styles.emptyState}>
        <p>No supplement recommendations available yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {recommendations.map((supplement) => (
        <SupplementCard
          key={supplement.id}
          id={supplement.id}
          supplement_name={supplement.supplement_name}
          dosage={supplement.dosage}
          timing={supplement.timing}
          recommended_time={supplement.recommended_time}
          recommended_date={supplement.recommended_date}
          reason={supplement.reason}
          company_name={supplement.company_name}
          product_url={supplement.product_url}
          image_url={supplement.image_url}
          benefits={supplement.benefits}
          precautions={supplement.precautions}
          category={supplement.category}
          priority={supplement.priority}
        />
      ))}
    </div>
  );
};

export default SupplementsGrid;