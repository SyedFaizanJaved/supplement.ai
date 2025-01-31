import React from 'react';
import styles from './GridBackground.module.css';

export const GridBackground = () => {
  return (
    <div className={styles.container}>
      {/* Background color gradient */}
      <div className={styles.backgroundGradient} />
      
      {/* Base grid container with perspective */}
      <div className={styles.perspectiveContainer}>
        {/* Horizontal grid lines with intersection highlights */}
        <div className={styles.horizontalGrid} />
        
        {/* Vertical grid lines with intersection highlights */}
        <div className={styles.verticalGrid} />
        
        {/* Grid intersections glow effect */}
        <div className={styles.gridIntersections} />
      </div>
      
      {/* Top ambient glow */}
      <div className={styles.topGlow} />
      
      {/* Bottom ambient glow */}
      <div className={styles.bottomGlow} />
      
      {/* Dynamic perspective effects */}
      <div className={styles.upperPerspective} />
      <div className={styles.lowerPerspective} />
      
      {/* Subtle scan lines */}
      <div className={styles.scanLines} />
    </div>
  );
};