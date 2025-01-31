import React from 'react';
import { LandingHero } from "../components/LandingHero";
import { GridBackground } from "../components/backgrounds/GridBackground";
import styles from './Index.module.css';

const Index = () => {
  return (
    <div className={styles.container}>
      <GridBackground />
      <LandingHero />
    </div>
  );
};

export default Index;