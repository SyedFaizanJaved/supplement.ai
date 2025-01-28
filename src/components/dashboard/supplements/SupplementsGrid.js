import React from "react"
import SupplementCard from "./SupplementCard"
import styles from "./SupplementsGrid.module.css"

const SupplementsGrid = ({ supplements }) => {
  const isEmpty = !supplements || Object.keys(supplements).length === 0

  return (
    <div className={styles.container}>
      {isEmpty ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>No supplement recommendations available yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {Object.entries(supplements).map(([supplementName, supplementData]) => (
            <SupplementCard key={supplementName} supplementName={supplementName} supplementData={supplementData} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SupplementsGrid